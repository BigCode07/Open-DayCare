"use client";

import { useCallback, useEffect, useState } from "react";
import type { Kid } from "@/app/kids/page";

const POST_TYPES = [
  { label: "Food", activeBg: "#9A7B1E", activeColor: "#fff", idleBg: "#F4E6C4", idleColor: "#9A7B1E" },
  { label: "Nap", activeBg: "#7B5FC0", activeColor: "#fff", idleBg: "#E7DCF6", idleColor: "#7B5FC0" },
  { label: "Activity", activeBg: "#2E89A6", activeColor: "#fff", idleBg: "#C7E7F1", idleColor: "#2E89A6" },
  { label: "Milestone", activeBg: "#3E9B6C", activeColor: "#fff", idleBg: "#CFEBD8", idleColor: "#3E9B6C" },
  { label: "Mood", activeBg: "#C56486", activeColor: "#fff", idleBg: "#F9D2DE", idleColor: "#C56486" },
  { label: "Photo", activeBg: "#D9684A", activeColor: "#fff", idleBg: "#FBD8CC", idleColor: "#D9684A" },
  { label: "Notice", activeBg: "#4E72C8", activeColor: "#fff", idleBg: "#CCD8F4", idleColor: "#4E72C8" },
];

export type NewPostDraft = {
  kidIds: string[];
  text: string;
};

export default function CreatePostModal({
  open,
  onClose,
  kids,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  kids: Kid[];
  onSubmitted: (draft: NewPostDraft) => void;
}) {
  const [kidIds, setKidIds] = useState<string[]>([]);
  const [postType, setPostType] = useState<string>("Activity");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>();

  const reset = useCallback(() => {
    setKidIds([]);
    setPostType("Activity");
    setText("");
    setError(undefined);
  }, []);

  const toggleKid = (id: string) => {
    setKidIds((prev) =>
      prev.includes(id) ? prev.filter((kidId) => kidId !== id) : [...prev, id],
    );
  };

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, handleClose]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!text.trim()) {
      setError("Description is required");
      return;
    }
    setError(undefined);
    onSubmitted({ kidIds, text: text.trim() });
    reset();
  };

  const labelClass = "text-[12px] font-extrabold mb-[10px]";
  const labelStyle = { letterSpacing: ".7px", color: "#94887B" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center py-10 px-6 overflow-y-auto"
      style={{ background: "rgba(0,0,0,.35)" }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[580px] rounded-[24px] overflow-hidden"
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
          <button
            onClick={handleClose}
            className="bg-transparent border-none cursor-pointer p-0"
            style={{ color: "#94887B", fontWeight: 700, fontSize: 15, fontFamily: "inherit" }}
          >
            Cancel
          </button>
          <span
            className="text-ink"
            style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600, fontSize: 18 }}
          >
            New post
          </span>
          <button
            onClick={handleSubmit}
            className="bg-transparent border-none cursor-pointer p-0"
            style={{ color: "#D9583C", fontWeight: 800, fontSize: 15, fontFamily: "inherit" }}
          >
            Publish
          </button>
        </div>

        <div className="px-[26px] py-[24px]">
          <span className={labelClass} style={labelStyle}>
            FOR
          </span>
          <div className="flex flex-wrap gap-[9px] mb-[22px]">
            {kids.map((kid) => {
              const active = kidIds.includes(kid.id);
              return (
                <button
                  key={kid.id}
                  onClick={() => toggleKid(kid.id)}
                  className="flex items-center gap-2 rounded-full font-bold text-[14px] cursor-pointer"
                  style={{
                    padding: "6px 14px 6px 6px",
                    border: active ? "1.5px solid #3F362E" : "1.5px solid #ECE0D0",
                    background: active ? "#3F362E" : "#FFFDF9",
                    color: active ? "#fff" : "#6E6359",
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: kid.avatarColor,
                      color: kid.avatarTextColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-fredoka)",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {kid.initial}
                  </span>
                  {kid.firstName}
                </button>
              );
            })}
            <button
              onClick={() => setKidIds([])}
              className="rounded-full font-bold text-[14px] cursor-pointer"
              style={{
                padding: "6px 16px",
                border: kidIds.length === 0 ? "1.5px solid #3F362E" : "1.5px solid #ECE0D0",
                background: kidIds.length === 0 ? "#3F362E" : "#FFFDF9",
                color: kidIds.length === 0 ? "#fff" : "#6E6359",
                fontFamily: "inherit",
              }}
            >
              Whole room
            </button>
          </div>

          <span className={labelClass} style={labelStyle}>
            TYPE
          </span>
          <div className="flex flex-wrap gap-[9px] mb-[22px]">
            {POST_TYPES.map((t) => {
              const active = postType === t.label;
              return (
                <button
                  key={t.label}
                  onClick={() => setPostType(t.label)}
                  className="rounded-full font-extrabold text-[13.5px] cursor-pointer border-none"
                  style={{
                    padding: "8px 16px",
                    background: active ? t.activeBg : t.idleBg,
                    color: active ? t.activeColor : t.idleColor,
                    fontFamily: "inherit",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <span className={labelClass} style={labelStyle}>
            DESCRIPTION
          </span>
          <textarea
            placeholder="Tell us how their day went…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-[14px] text-[15px] text-ink placeholder:text-[#B6A99B] focus:outline-none"
            style={{
              minHeight: 120,
              padding: "14px 16px",
              border: "1.5px solid #EADFD0",
              background: "#fff",
              fontSize: 15,
              lineHeight: 1.5,
              resize: "vertical",
              fontFamily: "inherit",
              marginBottom: 8,
            }}
          />
          {error && (
            <div className="text-[13px] font-bold mb-[14px]" style={{ color: "#C5413A" }}>
              {error}
            </div>
          )}
          {!error && <div className="mb-[14px]" />}

          <span className={labelClass} style={labelStyle}>
            PHOTOS
          </span>
          <div className="flex gap-[12px]">
            <div
              className="flex items-center justify-center rounded-[14px]"
              style={{
                width: 96,
                height: 96,
                background: "#F4ECE1",
                border: "1px solid #ECE0D0",
                color: "#CBB89F",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
              </svg>
            </div>
            <div
              className="flex flex-col items-center justify-center gap-[6px] rounded-[14px]"
              style={{
                width: 96,
                height: 96,
                border: "1.5px dashed #DBCDBA",
                background: "#F4ECE1",
                color: "#B0A290",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C5503A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[12px]">Add</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
