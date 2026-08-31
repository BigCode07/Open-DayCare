"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/utils/supabase/admin";

export type ActivateParentState = {
  error?: string;
};

export async function activateParent(
  _prevState: ActivateParentState,
  formData: FormData
): Promise<ActivateParentState> {
  const admin = createAdminClient();

  const invitationCode = String(formData.get("invitation_code") ?? "").trim().toUpperCase();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const photoAuth = formData.get("photo_auth") === "on";

  if (!invitationCode || !email || !password) {
    return { error: "El código, el email y la contraseña son obligatorios" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Ingresá un email válido" };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres" };
  }
  if (!photoAuth) {
    return { error: "Debés autorizar el uso de fotos" };
  }

  const { data: invitation } = await admin
    .from("invitations")
    .select("id, child_id, full_name, email, relationship, status, expires_at")
    .eq("code", invitationCode)
    .eq("status", "pending")
    .maybeSingle();

  if (!invitation) {
    return { error: "El código de invitación es inválido o ya fue usado" };
  }
  if (new Date(invitation.expires_at).toISOString() <= new Date().toISOString()) {
    return { error: "El código de invitación expiró" };
  }
  if (invitation.email.toLowerCase() !== email) {
    return { error: "El email no coincide con la invitación" };
  }

  const { data: child } = await admin
    .from("children")
    .select("full_name, photo_consent, rooms(daycare_id)")
    .eq("id", invitation.child_id)
    .maybeSingle();

  if (!child) {
    return { error: "No se encontró el niño de la invitación" };
  }

  const rooms = child.rooms as unknown as
    | { daycare_id: string }
    | { daycare_id: string }[]
    | null;
  const daycareId = Array.isArray(rooms) ? rooms[0]?.daycare_id : rooms?.daycare_id;
  if (!daycareId) {
    return { error: "No se pudo resolver la guardería del niño" };
  }

  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      daycare_id: daycareId,
      role: "parent",
      full_name: invitation.full_name,
    },
  });

  if (createError) {
    const isDuplicate = createError.code === "user_already_exists";
    return {
      error: isDuplicate
        ? "Ya existe una cuenta con este email. Iniciá sesión desde el login"
        : "No se pudo crear tu cuenta. Intentá de nuevo.",
    };
  }
  if (!newUser?.user) {
    return { error: "No se pudo crear tu cuenta. Intentá de nuevo." };
  }

  const user = newUser.user;

  const { error: usersError } = await admin.from("users").insert({
    id: user.id,
    daycare_id: daycareId,
    role: "parent",
    status: "active",
    full_name: invitation.full_name,
  });

  if (usersError) {
    return { error: "No se pudo guardar tu perfil. Intentá de nuevo." };
  }

  const { error: linkError } = await admin.from("parent_children").insert({
    parent_id: user.id,
    child_id: invitation.child_id,
    relationship: invitation.relationship,
  });

  if (linkError) {
    return { error: "No se pudo vincular al niño. Intentá de nuevo." };
  }

  await admin
    .from("invitations")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", invitation.id);

  if (photoAuth && !child.photo_consent) {
    await admin.from("children").update({ photo_consent: true }).eq("id", invitation.child_id);
  }

  redirect("/login");
}
