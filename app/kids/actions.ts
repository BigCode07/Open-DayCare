"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { toAllergyTags, relationshipToDb } from "@/lib/kids";
import { generateInviteCode } from "@/lib/invitations";
import { sendInvitationEmail } from "@/lib/resend";

export type AddChildState = {
  error?: string;
};

type CurrentUser = {
  id: string;
  role: string;
  daycare_id: string;
};

async function requireStaff(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("id, role, daycare_id")
    .eq("id", user.id)
    .single();

  if (!data || data.role !== "staff") return null;
  return data as CurrentUser;
}

export async function addChild(
  _prevState: AddChildState,
  formData: FormData
): Promise<AddChildState> {
  const staff = await requireStaff();
  if (!staff) {
    return { error: "No tenés permisos para agregar niños" };
  }

  const supabase = await createClient();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const birthDate = String(formData.get("birth_date") ?? "");
  const roomName = String(formData.get("room") ?? "").trim();
  const allergies = String(formData.get("allergy_tags") ?? "");
  const notes = String(formData.get("medical_notes") ?? "").trim();

  if (!fullName || !birthDate) {
    return { error: "El nombre y la fecha de nacimiento son obligatorios" };
  }

  const { data: room } = await supabase
    .from("rooms")
    .select("id")
    .eq("name", roomName)
    .eq("daycare_id", staff.daycare_id)
    .maybeSingle();

  if (!room) {
    return { error: "Seleccioná una sala válida" };
  }

  const { error } = await supabase.from("children").insert({
    room_id: room.id,
    full_name: fullName,
    birth_date: birthDate,
    enrolled_at: new Date().toISOString().slice(0, 10),
    medical_notes: notes || null,
    allergy_tags: toAllergyTags(allergies),
    photo_consent: true,
    status: "active",
  });

  if (error) {
    return { error: "No se pudo guardar el niño. Intentá de nuevo." };
  }

  redirect("/kids");
}

export type InviteParentState = {
  code?: string;
  email?: string;
  error?: string;
};

export async function inviteParent(
  _prevState: InviteParentState,
  formData: FormData
): Promise<InviteParentState> {
  const staff = await requireStaff();
  if (!staff) {
    return { error: "No tenés permisos para invitar padres" };
  }

  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const relationshipDisplay = String(formData.get("relationship") ?? "");
  const childId = String(formData.get("child_id") ?? "");

  if (!name || !email || !childId) {
    return { error: "Completá el nombre, el email y el niño" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Ingresá un email válido" };
  }

  const { data: child } = await supabase
    .from("children")
    .select("id, full_name")
    .eq("id", childId)
    .maybeSingle();

  if (!child) {
    return { error: "Seleccioná un niño válido" };
  }

  const { data: existing } = await supabase
    .from("invitations")
    .select("id")
    .eq("child_id", childId)
    .eq("email", email)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) {
    return {
      error: "Ya existe una invitación pendiente para este email en este niño",
    };
  }

  const relationship = relationshipToDb(relationshipDisplay);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  let lastError: string | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateInviteCode();
    const { data: inserted, error } = await supabase
      .from("invitations")
      .insert({
        child_id: child.id,
        invited_by: staff.id,
        full_name: name,
        email,
        relationship,
        code,
        status: "pending",
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (!error) {
      try {
        await sendInvitationEmail({
          to: email,
          parentName: name,
          childName: child.full_name,
          code,
        });
      } catch {
        await supabase.from("invitations").delete().eq("id", inserted.id);
        return {
          error: "No se pudo enviar el correo de invitación. Reintentá.",
        };
      }
      return { code, email };
    }

    lastError = error.message;
    const isUniqueViolation = error.code === "23505";
    if (!isUniqueViolation) break;
  }

  return {
    error: "No se pudo crear la invitación. Intentá de nuevo." + (lastError ? ` (${lastError})` : ""),
  };
}

export async function resendInvitation(
  invitationId: string
): Promise<{ ok: boolean; error?: string }> {
  const staff = await requireStaff();
  if (!staff) {
    return { ok: false, error: "No tenés permisos para reinvitar" };
  }

  const supabase = await createClient();

  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, child_id, full_name, email")
    .eq("id", invitationId)
    .maybeSingle();

  if (!invitation) {
    return { ok: false, error: "Invitación no encontrada" };
  }

  const { data: child } = await supabase
    .from("children")
    .select("full_name")
    .eq("id", invitation.child_id)
    .maybeSingle();

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateInviteCode();
    const { error } = await supabase
      .from("invitations")
      .update({
        code,
        status: "pending",
        expires_at: expiresAt,
        accepted_at: null,
      })
      .eq("id", invitation.id);

    if (!error) {
      try {
        await sendInvitationEmail({
          to: invitation.email,
          parentName: invitation.full_name,
          childName: child?.full_name ?? "",
          code,
        });
      } catch {
        return { ok: false, error: "No se pudo reenviar el correo. Reintentá." };
      }
      return { ok: true };
    }

    const isUniqueViolation = error.code === "23505";
    if (!isUniqueViolation) break;
  }

  return { ok: false, error: "No se pudo reinvitar. Intentá de nuevo." };
}
