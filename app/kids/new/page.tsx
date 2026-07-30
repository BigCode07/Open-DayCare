"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Kid } from "../page";

const AVATAR_COLORS = [
  { bg: "#A9D9E8", text: "#1F7A93" },
  { bg: "#F4B8CC", text: "#C44A7A" },
  { bg: "#B9DEC4", text: "#3E8B62" },
  { bg: "#F4DC8E", text: "#9A7B1E" },
  { bg: "#C9B6E8", text: "#7B5FC0" },
];

function generateId(firstName: string, lastName: string): string {
  const slug = `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Date.now().toString(36).slice(-4);
  return `${slug}-${suffix}`;
}

function getAvatarColors(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function AddKidPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;

    const parts = name.trim().split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || "";
    const colors = getAvatarColors(name);

    const newKid: Kid = {
      id: generateId(firstName, lastName),
      firstName,
      lastName,
      age: 0,
      room: "Soles",
      birthDate: birthDate || "—",
      enrollmentDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      linkedParents: 0,
      allergies: allergies
        ? allergies.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
      notes: notes.trim(),
      avatarColor: colors.bg,
      avatarTextColor: colors.text,
      initial: firstName[0]?.toUpperCase() || "?",
    };

    // Store in session storage for the kids list page to pick up
    const stored = sessionStorage.getItem("newKids");
    const newKids: Kid[] = stored ? JSON.parse(stored) : [];
    newKids.push(newKid);
    sessionStorage.setItem("newKids", JSON.stringify(newKids));

    router.push("/kids");
  };

  const inputClass =
    "w-full px-4 py-[13px] rounded-[14px] text-[15px] text-ink placeholder:text-[#B6A99B] focus:outline-none";
  const inputStyle = {
    border: "1.5px solid #EADFD0",
    background: "#fff",
    fontFamily: "inherit",
  };
  const labelClass =
    "text-[12px] font-extrabold mb-2 block" ;
  const labelStyle = { letterSpacing: ".7px", color: "#94887B" };

  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-6"
      style={{ background: "#F6ECDF" }}
    >
      <div
        className="w-full max-w-[520px] rounded-[24px] overflow-hidden"
        style={{
          background: "#FBF4EC",
          border: "1px solid #ECE0D0",
          boxShadow: "0 20px 50px -24px rgba(63,54,46,.35)",
        }}
      >
        <div
          className="flex items-center justify-between px-[26px] py-5"
          style={{ borderBottom: "1px solid #ECE0D0" }}
        >
          <Link
            href="/kids"
            className="text-muted-2 font-bold text-[15px]"
            style={{ textDecoration: "none" }}
          >
            Cancel
          </Link>
          <span
            className="text-[18px] text-ink"
            style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600 }}
          >
            Add child
          </span>
          <button
            onClick={handleSave}
            className="font-extrabold text-[15px] bg-transparent border-none cursor-pointer"
            style={{ color: "#D9583C", fontFamily: "inherit" }}
          >
            Save
          </button>
        </div>

        <div className="px-[26px] py-6">
          <div className="mb-[18px]">
            <span className={labelClass} style={labelStyle}>
              FULL NAME
            </span>
            <input
              type="text"
              placeholder="e.g. Martina López"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="flex gap-[14px] mb-[18px]">
            <div className="flex-1">
              <span className={labelClass} style={labelStyle}>
                DATE OF BIRTH
              </span>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div className="flex-1">
              <span className={labelClass} style={labelStyle}>
                ROOM
              </span>
              <div
                className="flex items-center gap-2 px-4 py-[13px] rounded-[14px] text-[15px] font-bold text-ink"
                style={{
                  border: "1.5px solid #EADFD0",
                  background: "#fff",
                  fontFamily: "inherit",
                }}
              >
                Soles
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B0A290"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-auto"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-[18px]">
            <span className={labelClass} style={labelStyle}>
              ALLERGIES (TAGS)
            </span>
            <input
              type="text"
              placeholder="e.g. Peanuts, Lactose"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <span className={labelClass} style={labelStyle}>
              MEDICAL NOTES
            </span>
            <textarea
              placeholder="Instructions, medication, contacts…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputClass} leading-[1.5]`}
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
