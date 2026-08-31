"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { toAllergyTags } from "@/lib/kids";

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
