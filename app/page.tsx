"use client";

import type { SVGProps } from "react";
import { Sidebar, MobileTopBar } from "@/app/components/sidebar";

function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="#E0654A"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function CommentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
    </svg>
  );
}

function AnuncioAvatarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function PhotoPlaceholderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  );
}

function Avatar({
  letter,
  bg,
  color,
  size = 44,
}: {
  letter: string;
  bg: string;
  color: string;
  size?: number;
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
        fontSize: 17,
      }}
    >
      {letter}
    </div>
  );
}

function PostBadge({
  label,
  bgColor,
  dotColor,
  textColor,
}: {
  label: string;
  bgColor: string;
  dotColor: string;
  textColor: string;
}) {
  return (
    <div
      className="flex items-center gap-[7px] px-3 py-[6px] rounded-full"
      style={{ background: bgColor }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: dotColor,
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: ".5px",
          color: textColor,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function PostCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-[22px] py-5 rounded-[20px]"
      style={{
        background: "#FFFDF9",
        border: "1px solid #ECE0D0",
        boxShadow: "0 4px 16px -12px rgba(120,90,60,.5)",
      }}
    >
      {children}
    </div>
  );
}

function PostHeader({
  avatarLetter,
  avatarBg,
  avatarColor,
  avatarOverride,
  title,
  subtitle,
  badge,
}: {
  avatarLetter: string;
  avatarBg: string;
  avatarColor: string;
  avatarOverride?: React.ReactNode;
  title: string;
  subtitle: string;
  badge: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-[14px]">
      {avatarOverride ?? (
        <Avatar letter={avatarLetter} bg={avatarBg} color={avatarColor} />
      )}
      <div className="flex-1">
        <div
          className="text-[16.5px] text-ink"
          style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600 }}
        >
          {title}
        </div>
        <div className="text-[12.5px] text-muted">{subtitle}</div>
      </div>
      {badge}
    </div>
  );
}

function PostFooter({ likes, comments }: { likes: number; comments: number }) {
  return (
    <div
      className="flex items-center gap-[18px] mt-4 pt-[14px]"
      style={{ borderTop: "1px solid #F0E6D8" }}
    >
      <span className="flex items-center gap-[7px] text-coral-accent font-bold text-[14px]">
        <HeartIcon />
        {likes}
      </span>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex items-center gap-[7px] text-muted-2 font-bold text-[14px]"
      >
        <CommentIcon />
        {comments}
      </a>
      <span className="flex-1" />
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="text-coral-dark font-extrabold text-[14px]"
      >
        Edit
      </a>
    </div>
  );
}

function ComposeCard() {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="flex items-center gap-[14px] mb-6 px-[18px] py-[14px] rounded-[18px]"
      style={{
        background: "#FFFDF9",
        border: "1px solid #ECE0D0",
        boxShadow: "0 4px 14px -10px rgba(120,90,60,.4)",
      }}
    >
      <Avatar letter="C" bg="#F2937A" color="#fff" size={40} />
      <span className="flex-1 text-muted text-[15px]">Share a moment…</span>
      <span
        className="flex items-center justify-center"
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: "#FBE3D8",
          color: "#E0654A",
        }}
      >
        <CameraIcon />
      </span>
    </a>
  );
}

function FeedColumn() {
  return (
    <div className="w-full max-w-[760px] mx-auto py-[34px] px-6 sm:px-10 pb-20">
      <div className="mb-6">
        <div
          className="text-[12.5px] font-extrabold text-coral-strong"
          style={{ letterSpacing: ".8px", marginBottom: 4 }}
        >
          DAYCARE · SOLES ROOM
        </div>
        <h1
          className="m-0 text-ink"
          style={{
            fontFamily: "var(--font-fredoka)",
            fontWeight: 600,
            fontSize: 30,
          }}
        >
          Hi, Caro
        </h1>
        <p className="mt-[5px] mb-0 text-muted-2 text-[14.5px]">
          12 kids · Tuesday, Jun 17
        </p>
      </div>

      <ComposeCard />

      <div className="flex items-center gap-[14px] mb-[14px]">
        <span
          className="text-[12.5px] font-extrabold"
          style={{ letterSpacing: ".8px", color: "#8A7C6D" }}
        >
          POSTED TODAY
        </span>
        <span className="flex-1 h-px" style={{ background: "#E7DAC8" }} />
      </div>

      <div className="flex flex-col gap-4">
        <PostCard>
          <PostHeader
            avatarLetter="M"
            avatarBg="#A9D9E8"
            avatarColor="#1F7A93"
            title="Mateo"
            subtitle="14:20 · posted by you"
            badge={
              <PostBadge
                label="MILESTONE"
                bgColor="#CFEBD8"
                dotColor="#3E9B6C"
                textColor="#3E9B6C"
              />
            }
          />
          <div className="text-[12.5px] text-muted mb-[10px]">
            For: Mateo&apos;s family
          </div>
          <p
            className="m-0"
            style={{
              fontSize: 15.5,
              lineHeight: 1.55,
              color: "#4A4038",
            }}
          >
            He used the potty by himself for the first time! He was so happy to
            tell everyone. A big step.
          </p>
          <PostFooter likes={3} comments={1} />
        </PostCard>

        <PostCard>
          <PostHeader
            avatarLetter="M"
            avatarBg="#A9D9E8"
            avatarColor="#1F7A93"
            title="Mateo"
            subtitle="09:40 · posted by you"
            badge={
              <PostBadge
                label="ACTIVITY"
                bgColor="#C7E7F1"
                dotColor="#2E89A6"
                textColor="#2E89A6"
              />
            }
          />
          <div className="text-[12.5px] text-muted mb-[10px]">
            For: Mateo&apos;s family
          </div>
          <p
            className="m-0"
            style={{
              fontSize: 15.5,
              lineHeight: 1.55,
              color: "#4A4038",
            }}
          >
            We painted with tempera this morning. Mateo chose blue for
            everything and was very focused mixing colors.
          </p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center gap-2 mt-[14px] rounded-[16px] text-dashed-text"
            style={{
              border: "1.5px dashed #DBCDBA",
              background: "#F4ECE1",
              height: 200,
            }}
          >
            <PhotoPlaceholderIcon />
            <span className="text-[13.5px]">Photo · painting with tempera</span>
          </a>
          <PostFooter likes={5} comments={2} />
        </PostCard>

        <PostCard>
          <PostHeader
            avatarLetter=""
            avatarBg="#CCD8F4"
            avatarColor="#4E72C8"
            title="General notice"
            subtitle="07:50 · posted by you"
            badge={
              <PostBadge
                label="NOTICE"
                bgColor="#CCD8F4"
                dotColor="#4E72C8"
                textColor="#4E72C8"
              />
            }
            avatarOverride={
              <div
                className="flex items-center justify-center flex-none"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#CCD8F4",
                  color: "#4E72C8",
                }}
              >
                <AnuncioAvatarIcon />
              </div>
            }
          />
          <div className="text-[12.5px] text-muted mb-[10px]">
            For: the whole room
          </div>
          <p
            className="m-0"
            style={{
              fontSize: 15.5,
              lineHeight: 1.55,
              color: "#4A4038",
            }}
          >
            On Friday we&apos;re going to the park in the morning. Remember to
            send a hat and a water bottle.
          </p>
          <PostFooter likes={8} comments={0} />
        </PostCard>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen" style={{ background: "#F6ECDF" }}>
      <Sidebar activeItem="feed" />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <MobileTopBar activeItem="feed" />
        <FeedColumn />
      </main>
    </div>
  );
}
