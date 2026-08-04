"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SVGProps } from "react";
import { clearSession, useSession, type Session } from "@/app/lib/session";

type NavItem = "feed" | "kids" | "avisos" | "cuenta";

function SunLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function HomeIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function KidsIcon(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 20a5 5 0 0 1 5.5-4.9" />
    </svg>
  );
}

function BellIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

function SidebarLogo() {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        background: "linear-gradient(155deg,#F8C3A8,#F2937A)",
      }}
      className="flex items-center justify-center flex-none"
    >
      <SunLogo />
    </div>
  );
}

function SidebarBrand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-[11px] px-2 pb-[22px] pt-1"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <SidebarLogo />
      <div>
        <div
          className="leading-none text-[17px] text-ink"
          style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600 }}
        >
          OpenDayCare
        </div>
        <div className="text-[11.5px] text-muted mt-[2px]">Sala Soles</div>
      </div>
    </Link>
  );
}

function SidebarNewPost() {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="flex items-center justify-center gap-2 w-full py-3 rounded-[14px] text-white mb-[18px]"
      style={{
        background: "linear-gradient(180deg,#F4977E,#EE8164)",
        fontWeight: 800,
        fontSize: 14.5,
        boxShadow: "0 8px 18px -8px rgba(238,129,100,.75)",
      }}
    >
      <PlusIcon />
      New post
    </a>
  );
}

function NavItemLink({
  icon,
  label,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-[11px] rounded-[12px] text-[14.5px]"
      style={{
        background: active ? "#FBE3D8" : "transparent",
        color: active ? "#D9583C" : "#6E6359",
        fontWeight: active ? 800 : 600,
        textDecoration: "none",
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

function NavItemPlaceholder({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="flex items-center gap-3 px-3 py-[11px] rounded-[12px] text-[14.5px]"
      style={{
        background: active ? "#FBE3D8" : "transparent",
        color: active ? "#D9583C" : "#6E6359",
        fontWeight: active ? 800 : 600,
        textDecoration: "none",
      }}
    >
      {icon}
      {label}
    </a>
  );
}

function SidebarNav({ activeItem }: { activeItem: NavItem }) {
  return (
    <nav className="flex flex-col gap-1 flex-1">
      <NavItemLink
        icon={<HomeIcon />}
        label="Feed"
        href="/"
        active={activeItem === "feed"}
      />
      <NavItemLink
        icon={<KidsIcon />}
        label="Kids"
        href="/kids"
        active={activeItem === "kids"}
      />
      <NavItemPlaceholder
        icon={<BellIcon />}
        label="Notices"
        active={activeItem === "avisos"}
      />
      <NavItemPlaceholder
        icon={<UserIcon />}
        label="My account"
        active={activeItem === "cuenta"}
      />
    </nav>
  );
}

function SidebarUser({
  session,
  onLogout,
}: {
  session: Session | null;
  onLogout: () => void;
}) {
  return (
    <div
      className="border-t pt-[14px] mt-[10px]"
      style={{ borderColor: "#ECE0D0" }}
    >
      <div className="flex items-center gap-[11px] py-[6px] px-2">
        <div
          className="flex items-center justify-center flex-none"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "#F2937A",
            color: "#fff",
            fontFamily: "var(--font-fredoka)",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          {session?.initial ?? "C"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-extrabold text-ink">
            {session?.name ?? "Caro Giménez"}
          </div>
          <div className="text-[12px] text-muted">
            {session?.roleLabel ?? "Teacher · Soles"}
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Log out"
          className="flex items-center justify-center flex-none cursor-pointer border-none"
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "#F6ECDF",
            color: "#94887B",
          }}
        >
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ activeItem }: { activeItem: NavItem }) {
  const router = useRouter();
  const session = useSession();

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <aside
      className="hidden md:flex flex-col px-4 py-6 sticky top-0 h-screen flex-none"
      style={{
        width: 248,
        background: "#FFFDF9",
        borderRight: "1px solid #ECE0D0",
      }}
    >
      <SidebarBrand />
      <SidebarNewPost />
      <SidebarNav activeItem={activeItem} />
      <SidebarUser session={session} onLogout={handleLogout} />
    </aside>
  );
}

export function MobileTopBar({
  activeItem,
  actionLabel,
  onAction,
}: {
  activeItem: NavItem;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const router = useRouter();
  const isKids = activeItem === "kids";

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <div
      className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-10"
      style={{
        background: "#FFFDF9",
        borderBottom: "1px solid #ECE0D0",
      }}
    >
      <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none", color: "inherit" }}>
        <SidebarLogo />
        <div
          className="leading-none text-[16px] text-ink"
          style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600 }}
        >
          OpenDayCare
        </div>
      </Link>
      <div className="flex items-center gap-2.5">
        {isKids && onAction ? (
          <button
            onClick={onAction}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-[14px] text-white border-none cursor-pointer"
            style={{
              background: "linear-gradient(180deg,#F4977E,#EE8164)",
              fontWeight: 800,
              fontSize: 13.5,
              boxShadow: "0 8px 18px -8px rgba(238,129,100,.75)",
              fontFamily: "inherit",
            }}
          >
            <PlusIcon />
            {actionLabel || "Add child"}
          </button>
        ) : (
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-[14px] text-white"
            style={{
              background: "linear-gradient(180deg,#F4977E,#EE8164)",
              fontWeight: 800,
              fontSize: 13.5,
              boxShadow: "0 8px 18px -8px rgba(238,129,100,.75)",
              textDecoration: "none",
            }}
          >
            <PlusIcon />
            {actionLabel || "New post"}
          </a>
        )}
        <button
          onClick={handleLogout}
          title="Log out"
          className="flex items-center justify-center flex-none cursor-pointer border-none"
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: "#F6ECDF",
            color: "#94887B",
          }}
        >
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
}
