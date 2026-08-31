"use client";

import { useActionState } from "react";
import Link from "next/link";
import { addChild, type AddChildState } from "../actions";
import type { RoomOption } from "@/lib/kids";

const initialState: AddChildState = {};

export default function AddKidForm({ rooms }: { rooms: RoomOption[] }) {
  const [state, formAction, isPending] = useActionState(addChild, initialState);

  const inputClass =
    "w-full px-4 py-[13px] rounded-[14px] text-[15px] text-ink placeholder:text-[#B6A99B] focus:outline-none";
  const inputStyle = {
    border: "1.5px solid #EADFD0",
    background: "#fff",
    fontFamily: "inherit",
  };
  const labelClass = "text-[12px] font-extrabold mb-2 block";
  const labelStyle = { letterSpacing: ".7px", color: "#94887B" };

  const roomsCount = rooms.length;

  return (
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
          type="submit"
          form="add-kid-form"
          disabled={isPending}
          className="font-extrabold text-[15px] bg-transparent border-none cursor-pointer disabled:opacity-60"
          style={{ color: "#D9583C", fontFamily: "inherit" }}
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>

      <form id="add-kid-form" action={formAction} className="px-[26px] py-6">
        {state.error && (
          <div
            className="mb-[18px] px-4 py-3 rounded-[12px] text-[13.5px] font-bold"
            style={{ background: "#FBD8CC", color: "#C5413A" }}
          >
            {state.error}
          </div>
        )}

        <div className="mb-[18px]">
          <span className={labelClass} style={labelStyle}>
            FULL NAME
          </span>
          <input
            type="text"
            name="full_name"
            placeholder="e.g. Martina López"
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
              type="date"
              name="birth_date"
              placeholder="dd/mm/yyyy"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div className="flex-1">
            <span className={labelClass} style={labelStyle}>
              ROOM
            </span>
            <select
              name="room"
              defaultValue=""
              className={`${inputClass} text-ink`}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="" disabled>
                {roomsCount > 0 ? "Select room" : "No rooms"}
              </option>
              {rooms.map((room) => (
                <option key={room.id} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-[18px]">
          <span className={labelClass} style={labelStyle}>
            ALLERGIES (TAGS)
          </span>
          <input
            type="text"
            name="allergy_tags"
            placeholder="e.g. Peanuts, Lactose"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div>
          <span className={labelClass} style={labelStyle}>
            MEDICAL NOTES
          </span>
          <textarea
            name="medical_notes"
            placeholder="Instructions, medication, contacts…"
            className={`${inputClass} leading-[1.5]`}
            style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
          />
        </div>
      </form>
    </div>
  );
}
