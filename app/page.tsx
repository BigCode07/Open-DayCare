"use client";

import type { SVGProps } from "react";

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
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
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
    </a>
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
      Nueva publicación
    </a>
  );
}

function NavItem({
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
      }}
    >
      {icon}
      {label}
    </a>
  );
}

function SidebarNav() {
  return (
    <nav className="flex flex-col gap-1 flex-1">
      <NavItem icon={<HomeIcon />} label="Feed" active />
      <NavItem icon={<KidsIcon />} label="Niños" />
      <NavItem icon={<BellIcon />} label="Avisos" />
      <NavItem icon={<UserIcon />} label="Mi cuenta" />
    </nav>
  );
}

function SidebarUser() {
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
          C
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-extrabold text-ink">Caro Giménez</div>
          <div className="text-[12px] text-muted">Maestra · Soles</div>
        </div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          title="Cerrar sesión"
          className="flex items-center justify-center flex-none"
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "#F6ECDF",
            color: "#94887B",
          }}
        >
          <LogoutIcon />
        </a>
      </div>
    </div>
  );
}

function Sidebar() {
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
      <SidebarNav />
      <SidebarUser />
    </aside>
  );
}

function MobileTopBar() {
  return (
    <div
      className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-10"
      style={{
        background: "#FFFDF9",
        borderBottom: "1px solid #ECE0D0",
      }}
    >
      <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2">
        <SidebarLogo />
        <div
          className="leading-none text-[16px] text-ink"
          style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600 }}
        >
          OpenDayCare
        </div>
      </a>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-[14px] text-white"
        style={{
          background: "linear-gradient(180deg,#F4977E,#EE8164)",
          fontWeight: 800,
          fontSize: 13.5,
          boxShadow: "0 8px 18px -8px rgba(238,129,100,.75)",
        }}
      >
        <PlusIcon />
        Nueva publicación
      </a>
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

function PostCard({
  children,
}: {
  children: React.ReactNode;
}) {
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

function PostFooter({
  likes,
  comments,
}: {
  likes: number;
  comments: number;
}) {
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
        Editar
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
      <span className="flex-1 text-muted text-[15px]">
        Compartí un momento…
      </span>
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
          GUARDERÍA · SALA SOLES
        </div>
        <h1
          className="m-0 text-ink"
          style={{
            fontFamily: "var(--font-fredoka)",
            fontWeight: 600,
            fontSize: 30,
          }}
        >
          Buenas, Caro
        </h1>
        <p className="mt-[5px] mb-0 text-muted-2 text-[14.5px]">
          12 niños · martes 17 jun
        </p>
      </div>

      <ComposeCard />

      <div className="flex items-center gap-[14px] mb-[14px]">
        <span
          className="text-[12.5px] font-extrabold"
          style={{ letterSpacing: ".8px", color: "#8A7C6D" }}
        >
          PUBLICADO HOY
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
            subtitle="14:20 · publicado por vos"
            badge={
              <PostBadge
                label="LOGRO"
                bgColor="#CFEBD8"
                dotColor="#3E9B6C"
                textColor="#3E9B6C"
              />
            }
          />
          <div className="text-[12.5px] text-muted mb-[10px]">
            Para: familia de Mateo
          </div>
          <p
            className="m-0"
            style={{
              fontSize: 15.5,
              lineHeight: 1.55,
              color: "#4A4038",
            }}
          >
            ¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a
            todos. Un gran paso.
          </p>
          <PostFooter likes={3} comments={1} />
        </PostCard>

        <PostCard>
          <PostHeader
            avatarLetter="M"
            avatarBg="#A9D9E8"
            avatarColor="#1F7A93"
            title="Mateo"
            subtitle="09:40 · publicado por vos"
            badge={
              <PostBadge
                label="ACTIVIDAD"
                bgColor="#C7E7F1"
                dotColor="#2E89A6"
                textColor="#2E89A6"
              />
            }
          />
          <div className="text-[12.5px] text-muted mb-[10px]">
            Para: familia de Mateo
          </div>
          <p
            className="m-0"
            style={{
              fontSize: 15.5,
              lineHeight: 1.55,
              color: "#4A4038",
            }}
          >
            Pintamos con témperas esta mañana. Mateo eligió el azul para todo y
            se concentró un montón mezclando colores.
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
            <span className="text-[13.5px]">
              Foto · pintando con témperas
            </span>
          </a>
          <PostFooter likes={5} comments={2} />
        </PostCard>

        <PostCard>
          <PostHeader
            avatarLetter=""
            avatarBg="#CCD8F4"
            avatarColor="#4E72C8"
            title="Anuncio general"
            subtitle="07:50 · publicado por vos"
            badge={
              <PostBadge
                label="ANUNCIO"
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
            Para: toda la sala
          </div>
          <p
            className="m-0"
            style={{
              fontSize: 15.5,
              lineHeight: 1.55,
              color: "#4A4038",
            }}
          >
            El viernes salimos al parque por la mañana. Recuerden mandar gorra
            y una botellita de agua.
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
      <Sidebar />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <MobileTopBar />
        <FeedColumn />
      </main>
    </div>
  );
}