"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Sidebar, MobileTopBar } from "@/app/components/sidebar";
import { KIDS_SEED } from "../page";
import RequireAuth from "@/app/components/require-auth";

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

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

function ParentRow({
  name,
  role,
  status,
}: {
  name: string;
  role: string;
  status: "Active" | "Pending";
}) {
  const isActive = status === "Active";
  return (
    <div className="flex items-center gap-3">
      <Avatar
        letter={name[0]}
        bg={isActive ? "#C9B6E8" : "#A9C7E8"}
        color="#fff"
        size={40}
        fontSize={16}
      />
      <div className="flex-1 min-w-0">
        <div className="font-extrabold text-[14.5px] text-ink">{name}</div>
        <div className="text-[12.5px] text-muted">
          {role} · {isActive ? "active" : "invitation sent"}
        </div>
      </div>
      <span
        className="flex-none text-[10.5px] font-extrabold px-[9px] py-1 rounded-full"
        style={{
          background: isActive ? "#CFEBD8" : "#F7E7A6",
          color: isActive ? "#3E9B6C" : "#9A7B1E",
        }}
      >
        {status.toUpperCase()}
      </span>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex justify-between px-[18px] py-[15px]"
      style={{ borderBottom: "1px solid #F0E6D8" }}
    >
      <span className="text-[14.5px] text-muted-2">{label}</span>
      <span className="font-extrabold text-[14.5px] text-ink">{value}</span>
    </div>
  );
}

export default function KidProfilePage() {
  const params = useParams();
  const kidId = params.id as string;
  const kid = KIDS_SEED.find((k) => k.id === kidId);

  if (!kid) {
    return (
      <RequireAuth>
        <div className="flex min-h-screen items-center justify-center" style={{ background: "#F6ECDF" }}>
          <div className="text-center">
            <h1
              className="text-2xl text-ink mb-2"
              style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600 }}
            >
              Child not found
            </h1>
            <Link href="/kids" className="text-coral-strong font-bold">
              Back to Kids
            </Link>
          </div>
        </div>
      </RequireAuth>
    );
  }

  const allergiesText =
    kid.allergies.length > 0
      ? `Allergic to ${kid.allergies.join(" and ").toLowerCase()}. ${kid.notes}`
      : kid.notes || "No allergies or medical notes.";

  return (
    <RequireAuth>
      <div className="flex min-h-screen" style={{ background: "#F6ECDF" }}>
        <Sidebar activeItem="kids" />
        <main className="flex-1 min-w-0 h-screen overflow-y-auto">
          <MobileTopBar activeItem="kids" />
          <div className="w-full max-w-[820px] mx-auto py-[34px] px-6 sm:px-10 pb-20">
          <Link
            href="/kids"
            className="flex items-center gap-[7px] text-muted-2 font-bold text-[14px] mb-5"
            style={{ textDecoration: "none" }}
          >
            <ChevronLeft />
            Back to Kids
          </Link>

          <div className="flex gap-[26px] items-start flex-wrap">
            <div className="flex-1 min-w-[300px] flex flex-col gap-[18px]">
              <div className="flex items-center gap-[18px]">
                <Avatar
                  letter={kid.initial}
                  bg={kid.avatarColor}
                  color={kid.avatarTextColor}
                  size={84}
                  fontSize={34}
                />
                <div className="flex-1">
                  <h1
                    className="m-0 text-ink"
                    style={{
                      fontFamily: "var(--font-fredoka)",
                      fontWeight: 600,
                      fontSize: 28,
                    }}
                  >
                    {kid.firstName} {kid.lastName}
                  </h1>
                  <p className="m-0 mt-[3px] text-muted-2 text-[15px]">
                    {kid.age} {kid.age === 1 ? "year" : "years"} · {kid.room} Room
                  </p>
                </div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-bold text-[14px] px-4 py-[9px] rounded-[12px]"
                  style={{
                    border: "1.5px solid #ECE0D0",
                    background: "#FFFDF9",
                    color: "#6E6359",
                    textDecoration: "none",
                  }}
                >
                  Edit
                </a>
              </div>

              <div
                className="flex gap-[14px] rounded-[16px] px-[18px] py-4"
                style={{ background: "#FBDAD6" }}
              >
                <div
                  className="flex items-center justify-center flex-none"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: "#F4A8A0",
                  }}
                >
                  <WarningIcon />
                </div>
                <div>
                  <div className="font-extrabold text-[15px] mb-[2px]" style={{ color: "#C5413A" }}>
                    Allergies & notes
                  </div>
                  <div className="text-[14.5px] leading-[1.5]" style={{ color: "#B25249" }}>
                    {allergiesText}
                  </div>
                </div>
              </div>

              <div
                className="rounded-[16px] overflow-hidden"
                style={{ background: "#FFFDF9", border: "1px solid #ECE0D0" }}
              >
                <DataRow label="Date of birth" value={kid.birthDate} />
                <DataRow label="Room" value={kid.room} />
                <div className="flex justify-between px-[18px] py-[15px]">
                  <span className="text-[14.5px] text-muted-2">Enrollment</span>
                  <span className="font-extrabold text-[14.5px] text-ink">
                    {kid.enrollmentDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-[300px] flex-none flex flex-col gap-[14px]">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-center gap-[9px] w-full py-[13px] rounded-[14px] text-white font-extrabold text-[15px]"
                style={{
                  background: "#3F362E",
                  textDecoration: "none",
                }}
              >
                <SunIcon />
                Day summary
              </a>

              <div
                className="rounded-[16px] px-[18px] py-4"
                style={{ background: "#FFFDF9", border: "1px solid #ECE0D0" }}
              >
                <div
                  className="text-[12.5px] font-extrabold mb-[14px]"
                  style={{ letterSpacing: ".8px", color: "#8A7C6D" }}
                >
                  LINKED PARENTS
                </div>
                <div className="flex flex-col gap-[14px]">
                  {kid.parentStatus && kid.parentStatus.length > 0 ? (
                    kid.parentStatus.map((parent) => (
                      <ParentRow
                        key={parent.name}
                        name={parent.name}
                        role={parent.role}
                        status={parent.status}
                      />
                    ))
                  ) : (
                    <div className="text-[13px] text-muted">No parents linked yet.</div>
                  )}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-3 pt-2"
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      className="flex items-center justify-center flex-none"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "1.5px dashed #D8CBBA",
                        color: "#B0A290",
                      }}
                    >
                      <PlusIcon />
                    </span>
                    <span className="font-extrabold text-[14.5px]" style={{ color: "#C5503A" }}>
                      Link another parent
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>
    </RequireAuth>
  );
}
