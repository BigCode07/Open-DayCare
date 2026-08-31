"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar, MobileTopBar } from "@/app/components/sidebar";
import type { Kid } from "@/lib/kids";

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

export default function KidsView({ kids }: { kids: Kid[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredKids = kids.filter((kid) => {
    const query = search.toLowerCase();
    return (
      kid.firstName.toLowerCase().includes(query) ||
      kid.lastName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-screen" style={{ background: "#F6ECDF" }}>
      <Sidebar activeItem="kids" />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <MobileTopBar
          activeItem="kids"
          actionLabel="Add child"
          onAction={() => router.push("/kids/new")}
        />
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
            <Link
              href="/kids/new"
              className="hidden md:flex items-center gap-2 px-[18px] py-[11px] rounded-[14px] text-white"
              style={{
                background: "linear-gradient(180deg,#F4977E,#EE8164)",
                fontWeight: 800,
                fontSize: 14.5,
                boxShadow: "0 8px 18px -8px rgba(238,129,100,.7)",
                fontFamily: "inherit",
                textDecoration: "none",
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
            </Link>
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

          {filteredKids.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              {filteredKids.map((kid) => (
                <KidCard key={kid.id} kid={kid} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted text-[15px] py-10">
              No children found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
