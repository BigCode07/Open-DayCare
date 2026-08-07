"use client";

import { useEffect, useState } from "react";

export type Relationship = "Mom" | "Dad" | "Guardian";

export type NewParent = {
  name: string;
  role: Relationship;
  status: "Pending";
};

export default function LinkParentModal({
  open,
  onClose,
  kidName,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  kidName: string;
  onSubmitted: (parent: NewParent) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("Mom");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const firstName = kidName.split(" ")[0];

  const validate = () => {
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email";
    }
    return next;
  };

  const reset = () => {
    setName("");
    setEmail("");
    setRelationship("Mom");
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmitted({ name: name.trim(), role: relationship, status: "Pending" });
  };

  const relationships: Relationship[] = ["Mom", "Dad", "Guardian"];

  const labelClass = "text-[12px] font-extrabold mb-2 block";
  const labelStyle = { letterSpacing: ".7px", color: "#94887B" };
  const inputClass =
    "w-full px-4 py-[13px] rounded-[14px] text-[15px] text-ink placeholder:text-[#B6A99B] focus:outline-none";
  const inputStyle = {
    border: "1.5px solid #EADFD0",
    background: "#fff",
    fontFamily: "inherit",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center py-10 px-6 overflow-y-auto"
      style={{ background: "rgba(0,0,0,.35)" }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[480px] rounded-[24px] overflow-hidden"
        style={{
          background: "#FBF4EC",
          border: "1px solid #ECE0D0",
          boxShadow: "0 20px 50px -24px rgba(63,54,46,.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-[26px] py-5"
          style={{ borderBottom: "1px solid #ECE0D0" }}
        >
          <div>
            <div
              className="text-ink"
              style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600, fontSize: 18 }}
            >
              Link parent
            </div>
            <div className="text-[13px] text-muted-2">to {kidName}</div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "#F0E6D8",
              color: "#94887B",
              border: "none",
            }}
          >
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
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-[26px] py-[22px]">
          <div
            className="flex gap-[11px] rounded-[14px] px-4 py-[13px] mb-[20px]"
            style={{ background: "#E3ECFB" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4E72C8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-none"
              style={{ marginTop: 1 }}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span className="text-[13.5px] leading-[1.45]" style={{ color: "#3F5694" }}>
              We&apos;ll send an email with a code so they can activate their account. They&apos;ll
              only see {firstName}&apos;s feed.
            </span>
          </div>

          <div className="mb-[18px]">
            <span className={labelClass} style={labelStyle}>
              PARENT&apos;S NAME
            </span>
            <input
              type="text"
              placeholder="e.g. Diego Fernández"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
            {errors.name && (
              <div className="text-[13px] font-bold mt-[6px]" style={{ color: "#C5413A" }}>
                {errors.name}
              </div>
            )}
          </div>

          <div className="mb-[20px]">
            <span className={labelClass} style={labelStyle}>
              EMAIL
            </span>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
            {errors.email && (
              <div className="text-[13px] font-bold mt-[6px]" style={{ color: "#C5413A" }}>
                {errors.email}
              </div>
            )}
          </div>

          <div className="mb-[20px]">
            <span className={labelClass} style={{ ...labelStyle, marginBottom: 10 }}>
              RELATIONSHIP
            </span>
            <div className="flex gap-[9px]">
              {relationships.map((r) => {
                const active = relationship === r;
                return (
                  <button
                    key={r}
                    onClick={() => setRelationship(r)}
                    className="flex-1 rounded-full font-extrabold text-[14px] cursor-pointer"
                    style={{
                      padding: "11px 0",
                      border: active ? "1.5px solid #9FB8EC" : "1.5px solid #ECE0D0",
                      background: active ? "#CCD8F4" : "#FFFDF9",
                      color: active ? "#4E72C8" : "#6E6359",
                      fontFamily: "inherit",
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="mb-[20px] rounded-[16px] py-[18px] text-center"
            style={{ background: "#FBF1D6", border: "1.5px dashed #E6D08A" }}
          >
            <div
              className="text-[12px] font-extrabold mb-2"
              style={{ letterSpacing: ".7px", color: "#A88526" }}
            >
              INVITATION CODE
            </div>
            <div
              className="text-[34px] tracking-[7px]"
              style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600, color: "#8A7234" }}
            >
              7K4P9
            </div>
            <div className="text-[13px] mt-[6px]" style={{ color: "#A88526" }}>
              Expires in 7 days
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-[9px] w-full py-[14px] rounded-[14px] text-white font-extrabold text-[15.5px] cursor-pointer"
            style={{
              background: "linear-gradient(180deg,#F4977E,#EE8164)",
              boxShadow: "0 10px 22px -8px rgba(238,129,100,.7)",
              border: "none",
              fontFamily: "inherit",
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4z" />
              <path d="M22 2 11 13" />
            </svg>
            Send invitation
          </button>
        </div>
      </div>
    </div>
  );
}
