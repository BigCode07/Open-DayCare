import type { SupabaseClient } from "@supabase/supabase-js";

export type ChildRow = {
  id: string;
  room_id: string | null;
  full_name: string;
  birth_date: string;
  enrolled_at: string;
  medical_notes: string | null;
  allergy_tags: string[];
  photo_consent: boolean;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
};

export type ParentRow = {
  id: string;
  full_name: string;
  role: "staff" | "parent" | "admin";
  status: "pending" | "active";
};

export type RoomOption = {
  id: string;
  name: string;
};

export type Kid = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  room: string;
  birthDate: string;
  enrollmentDate: string;
  linkedParents: number;
  allergies: string[];
  notes: string;
  avatarColor: string;
  avatarTextColor: string;
  initial: string;
  parentStatus?: { name: string; role: string; status: "Active" | "Pending" }[];
};

const AVATAR_COLORS = [
  { bg: "#A9D9E8", text: "#1F7A93" },
  { bg: "#F4B8CC", text: "#C44A7A" },
  { bg: "#B9DEC4", text: "#3E8B62" },
  { bg: "#F4DC8E", text: "#9A7B1E" },
  { bg: "#C9B6E8", text: "#7B5FC0" },
];

const ALLERGY_LABELS: Record<string, string> = {
  peanut: "Peanuts",
  lactose: "Lactose",
  gluten: "Gluten",
  egg: "Egg",
};

function getAvatarColors(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function allergyLabel(tag: string): string {
  return ALLERGY_LABELS[tag] ?? tag.charAt(0).toUpperCase() + tag.slice(1);
}

function allergyTagFromLabel(label: string): string {
  const key = label.trim().toLowerCase();
  return ALLERGY_TAGS[key] ?? key;
}

const ALLERGY_TAGS: Record<string, string> = {
  peanut: "peanut",
  peanuts: "peanut",
  lactose: "lactose",
  gluten: "gluten",
  egg: "egg",
};

function parseLocalDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function ageFromBirthDate(birthDate: string): number {
  const birth = parseLocalDate(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return Math.max(age, 0);
}

function formatBirthDate(date: string): string {
  const d = parseLocalDate(date);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function formatEnrollmentDate(date: string): string {
  const d = parseLocalDate(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function toAllergyTags(labels: string): string[] {
  return labels
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean)
    .map(allergyTagFromLabel);
}

export function toKid(
  row: ChildRow,
  parentCount: number,
  roomName: string
): Kid {
  const parts = row.full_name.trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") || "";
  const colors = getAvatarColors(row.full_name);

  return {
    id: row.id,
    firstName,
    lastName,
    age: ageFromBirthDate(row.birth_date),
    room: roomName,
    birthDate: formatBirthDate(row.birth_date),
    enrollmentDate: formatEnrollmentDate(row.enrolled_at),
    linkedParents: parentCount,
    allergies: row.allergy_tags.map(allergyLabel),
    notes: row.medical_notes ?? "",
    avatarColor: colors.bg,
    avatarTextColor: colors.text,
    initial: firstName[0]?.toUpperCase() ?? "?",
  };
}

export async function getRoomsOptions(
  supabase: SupabaseClient
): Promise<RoomOption[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) return [];
  return (data ?? []) as RoomOption[];
}
