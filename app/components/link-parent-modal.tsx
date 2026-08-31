"use client";

import { useActionState, useState } from "react";
import { inviteParent, type InviteParentState } from "@/app/kids/actions";

export type Relationship = "Mom" | "Dad" | "Guardian";

const initialState: InviteParentState = {};

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center py-10 px-6 overflow-y-auto"
      style={{ background: "rgba(0,0,0,.35)" }}
    >
      {children}
    </div>
  );
}

function SuccessView({
  code,
  email,
  onClose,
}: {
  code: string;
  email: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="w-full max-w-[480px] rounded-[24px] overflow-hidden"
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
        <div
          className="text-ink"
          style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600, fontSize: 18 }}
        >
          Invitation sent
        </div>
        <button
          onClick={onClose}
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
            We emailed a code to <strong>{email}</strong>. Share it so they can activate
            their account.
          </span>
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
            {code}
          </div>
          <div className="text-[13px] mt-[6px]" style={{ color: "#A88526" }}>
            Expires in 7 days
          </div>
        </div>

        <button
          onClick={copyCode}
          className="flex items-center justify-center gap-[9px] w-full py-[14px] rounded-[14px] font-extrabold text-[15.5px] cursor-pointer mb-[10px]"
          style={{
            background: "#FFFDF9",
            border: "1.5px solid #EADFD0",
            color: "#6E6359",
            fontFamily: "inherit",
          }}
        >
          {copied ? "Copied!" : "Copy code"}
        </button>

        <button
          onClick={onClose}
          className="flex items-center justify-center gap-[9px] w-full py-[14px] rounded-[14px] text-white font-extrabold text-[15.5px] cursor-pointer"
          style={{
            background: "linear-gradient(180deg,#F4977E,#EE8164)",
            boxShadow: "0 10px 22px -8px rgba(238,129,100,.7)",
            border: "none",
            fontFamily: "inherit",
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default function LinkParentModal({
  open,
  onClose,
  kidName,
  childId,
}: {
  open: boolean;
  onClose: () => void;
  kidName: string;
  childId: string;
}) {
  if (!open) return null;
  return (
    <Overlay>
      <InviteForm onClose={onClose} kidName={kidName} childId={childId} />
    </Overlay>
  );
}

function InviteForm({
  onClose,
  kidName,
  childId,
}: {
  onClose: () => void;
  kidName: string;
  childId: string;
}) {
  const [state, formAction, isPending] = useActionState(inviteParent, initialState);
  const [relationship, setRelationship] = useState<Relationship>("Mom");

  const firstName = kidName.split(" ")[0];

  if (state.code) {
    return <SuccessView code={state.code} email={state.email ?? ""} onClose={onClose} />;
  }

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
    <form
      id="link-parent-form"
      action={formAction}
      className="w-full max-w-[480px] rounded-[24px] overflow-hidden"
      style={{
        background: "#FBF4EC",
        border: "1px solid #ECE0D0",
        boxShadow: "0 20px 50px -24px rgba(63,54,46,.35)",
      }}
    >
      <input type="hidden" name="child_id" value={childId} />

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
          type="button"
          onClick={onClose}
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
            PARENT&apos;S NAME
          </span>
          <input
            type="text"
            name="name"
            placeholder="e.g. Diego Fernández"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="mb-[20px]">
          <span className={labelClass} style={labelStyle}>
            EMAIL
          </span>
          <input
            type="email"
            name="email"
            placeholder="email@example.com"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="mb-[20px]">
          <span className={labelClass} style={{ ...labelStyle, marginBottom: 10 }}>
            RELATIONSHIP
          </span>
          <input type="hidden" name="relationship" value={relationship} />
          <div className="flex gap-[9px]">
            {(["Mom", "Dad", "Guardian"] as Relationship[]).map((r) => {
              const active = relationship === r;
              return (
                <button
                  key={r}
                  type="button"
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

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-[9px] w-full py-[14px] rounded-[14px] text-white font-extrabold text-[15.5px] cursor-pointer disabled:opacity-60"
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
          {isPending ? "Sending..." : "Send invitation"}
        </button>
      </div>
    </form>
  );
}
