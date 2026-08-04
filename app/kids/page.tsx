"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar, MobileTopBar } from "@/app/components/sidebar";
import AddKidModal from "@/app/components/add-kid-modal";

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

export const KIDS_SEED: Kid[] = [
  {
    id: "mateo-fernandez",
    firstName: "Mateo",
    lastName: "Fernández",
    age: 3,
    room: "Soles",
    birthDate: "12 Mar 2022",
    enrollmentDate: "Feb 2025",
    linkedParents: 2,
    allergies: ["Peanuts"],
    notes: "Allergic to peanuts. Avoid nuts. Carries inhaler in backpack.",
    avatarColor: "#A9D9E8",
    avatarTextColor: "#1F7A93",
    initial: "M",
    parentStatus: [
      { name: "Lucía Fernández", role: "Mom", status: "Active" },
      { name: "Diego Fernández", role: "Dad", status: "Pending" },
    ],
  },
  {
    id: "sofia-mendez",
    firstName: "Sofía",
    lastName: "Méndez",
    age: 2,
    room: "Soles",
    birthDate: "05 Jul 2023",
    enrollmentDate: "Mar 2025",
    linkedParents: 1,
    allergies: [],
    notes: "",
    avatarColor: "#F4B8CC",
    avatarTextColor: "#C44A7A",
    initial: "S",
    parentStatus: [{ name: "Ana Méndez", role: "Mom", status: "Active" }],
  },
  {
    id: "benjamin-ruiz",
    firstName: "Benjamín",
    lastName: "Ruiz",
    age: 3,
    room: "Soles",
    birthDate: "22 Jan 2022",
    enrollmentDate: "Feb 2025",
    linkedParents: 2,
    allergies: [],
    notes: "",
    avatarColor: "#B9DEC4",
    avatarTextColor: "#3E8B62",
    initial: "B",
    parentStatus: [
      { name: "Carolina Ruiz", role: "Mom", status: "Active" },
      { name: "Pablo Ruiz", role: "Dad", status: "Active" },
    ],
  },
  {
    id: "valentina-soto",
    firstName: "Valentina",
    lastName: "Soto",
    age: 2,
    room: "Soles",
    birthDate: "18 Sep 2023",
    enrollmentDate: "Apr 2025",
    linkedParents: 0,
    allergies: [],
    notes: "",
    avatarColor: "#F4DC8E",
    avatarTextColor: "#9A7B1E",
    initial: "V",
  },
  {
    id: "tomas-diaz",
    firstName: "Tomás",
    lastName: "Díaz",
    age: 3,
    room: "Soles",
    birthDate: "30 Nov 2021",
    enrollmentDate: "Jan 2025",
    linkedParents: 1,
    allergies: ["Lactose"],
    notes: "Lactose intolerant. Avoid dairy products.",
    avatarColor: "#C9B6E8",
    avatarTextColor: "#7B5FC0",
    initial: "T",
    parentStatus: [{ name: "María Díaz", role: "Mom", status: "Active" }],
  },
  {
    id: "emma-castro",
    firstName: "Emma",
    lastName: "Castro",
    age: 2,
    room: "Soles",
    birthDate: "14 Apr 2023",
    enrollmentDate: "Mar 2025",
    linkedParents: 1,
    allergies: [],
    notes: "",
    avatarColor: "#F4B8CC",
    avatarTextColor: "#C44A7A",
    initial: "E",
    parentStatus: [{ name: "Laura Castro", role: "Mom", status: "Active" }],
  },
  {
    id: "lucas-romero",
    firstName: "Lucas",
    lastName: "Romero",
    age: 3,
    room: "Soles",
    birthDate: "08 Feb 2022",
    enrollmentDate: "Feb 2025",
    linkedParents: 1,
    allergies: [],
    notes: "",
    avatarColor: "#A9D9E8",
    avatarTextColor: "#1F7A93",
    initial: "L",
    parentStatus: [{ name: "Sofía Romero", role: "Mom", status: "Active" }],
  },
  {
    id: "olivia-vega",
    firstName: "Olivia",
    lastName: "Vega",
    age: 2,
    room: "Soles",
    birthDate: "25 Jun 2023",
    enrollmentDate: "Apr 2025",
    linkedParents: 1,
    allergies: [],
    notes: "",
    avatarColor: "#B9DEC4",
    avatarTextColor: "#3E8B62",
    initial: "O",
    parentStatus: [{ name: "Carmen Vega", role: "Mom", status: "Active" }],
  },
];

function Avatar({
  letter,
  bg,
  color,
  size = 48,
  fontSize = 19,
}: {
  letter: string;
  bg: string;
  color: string;
  size?: number;
  fontSize?: number;
}) {
  return (
    <div
      className="flex items-center justify-center flex-none"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: color,
        fontFamily: "var(--font-fredoka)",
        fontWeight: 600,
        fontSize: fontSize,
      }}
    >
      {letter}
    </div>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#CBB89F"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function KidCard({ kid }: { kid: Kid }) {
  const hasAllergy = kid.allergies.length > 0;
  const noParents = kid.linkedParents === 0;

  return (
    <Link
      href={`/kids/${kid.id}`}
      className="flex items-center gap-[14px] min-w-0 px-4 py-4 rounded-[18px] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#F2A78E]"
      style={{
        background: "#FFFDF9",
        border: "1px solid #ECE0D0",
        boxShadow: "0 4px 14px -12px rgba(120,90,60,.5)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Avatar letter={kid.initial} bg={kid.avatarColor} color={kid.avatarTextColor} />
      <div className="flex-1 min-w-0">
        <div
          className="text-[16px] text-ink truncate"
          style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600 }}
        >
          {kid.firstName} {kid.lastName}
        </div>
        <div className="text-[13px] text-muted">
          {kid.age} {kid.age === 1 ? "year" : "years"} · {kid.linkedParents}{" "}
          {kid.linkedParents === 1 ? "parent" : "parents"} linked
        </div>
      </div>
      {hasAllergy && (
        <span
          className="flex-none text-[11px] font-extrabold px-[9px] py-[5px] rounded-full"
          style={{ background: "#FBD8CC", color: "#D9684A" }}
        >
          {kid.allergies[0].toUpperCase()}
        </span>
      )}
      {noParents && (
        <span
          className="flex-none text-[11px] font-extrabold px-[9px] py-[5px] rounded-full"
          style={{ background: "#F9D2DE", color: "#C56486" }}
        >
          LINK
        </span>
      )}
      {!hasAllergy && !noParents && <ChevronRight />}
    </Link>
  );
}

export default function KidsPage() {
  const [search, setSearch] = useState("");
  const [extraKids, setExtraKids] = useState<Kid[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const allKids = [...KIDS_SEED, ...extraKids];

  const filteredKids = allKids.filter((kid) => {
    const query = search.toLowerCase();
    return (
      kid.firstName.toLowerCase().includes(query) ||
      kid.lastName.toLowerCase().includes(query)
    );
  });

  const handleKidSaved = (kid: Kid) => {
    setExtraKids((prev) => [...prev, kid]);
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#F6ECDF" }}>
      <Sidebar activeItem="kids" />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <MobileTopBar activeItem="kids" actionLabel="Add child" onAction={() => setModalOpen(true)} />
        <div className="w-full max-w-[880px] mx-auto py-[34px] px-6 sm:px-10 pb-20">
          <div className="flex items-end justify-between gap-4 mb-[22px]">
            <div>
              <div
                className="text-[12.5px] font-extrabold text-coral-strong"
                style={{ letterSpacing: ".8px", marginBottom: 4 }}
              >
                MANAGEMENT
              </div>
              <h1
                className="m-0 text-ink"
                style={{
                  fontFamily: "var(--font-fredoka)",
                  fontWeight: 600,
                  fontSize: 30,
                }}
              >
                Kids
              </h1>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-[18px] py-[11px] rounded-[14px] text-white border-none cursor-pointer"
              style={{
                background: "linear-gradient(180deg,#F4977E,#EE8164)",
                fontWeight: 800,
                fontSize: 14.5,
                boxShadow: "0 8px 18px -8px rgba(238,129,100,.7)",
                fontFamily: "inherit",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add child
            </button>
          </div>

          <div
            className="flex items-center gap-[11px] px-4 py-3 rounded-[14px] mb-[22px]"
            style={{ background: "#FFFDF9", border: "1px solid #ECE0D0" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B0A290"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search child..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-none bg-transparent text-[15px] text-ink placeholder:text-[#B6A99B] focus:outline-none"
              style={{ fontFamily: "inherit" }}
            />
          </div>

          <div className="flex items-center gap-3 mb-[14px]">
            <span
              className="text-[12.5px] font-extrabold text-ink"
              style={{ letterSpacing: ".8px" }}
            >
              ROOM SOLES
            </span>
            <span className="text-[13px] text-muted">
              {filteredKids.length}{" "}
              {filteredKids.length === 1 ? "child" : "children"}
            </span>
            <span className="flex-1 h-px" style={{ background: "#E7DAC8" }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            {filteredKids.map((kid) => (
              <KidCard key={kid.id} kid={kid} />
            ))}
          </div>
        </div>
      </main>
      <AddKidModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={handleKidSaved} />
    </div>
  );
}
