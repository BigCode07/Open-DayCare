"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Role = "staff" | "family";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("staff");
  const [email, setEmail] = useState("caro@opendaycare.com");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setEmail(
      newRole === "staff"
        ? "caro@opendaycare.com"
        : "lucia.fernandez@gmail.com"
    );
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "El email es obligatorio";
    } else if (!validateEmail(email)) {
      newErrors.email = "Ingresá un email válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[1.05fr_1fr] bg-page-bg">
      <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-[#F6A98E] via-[#F2937A] to-coral-end flex-col justify-between px-15 py-14 text-white">
        <div className="absolute w-105 h-105 rounded-full bg-white/12 -top-35 -right-30" />
        <div className="absolute w-75 h-75 rounded-full bg-white/10 -bottom-28 -left-20" />

        <div className="flex items-center gap-3 relative">
          <div className="w-11 h-11 rounded-2xl bg-white/22 flex items-center justify-center">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </div>
          <span className="font-display font-semibold text-xl tracking-wide">
            OpenDayCare
          </span>
        </div>

        <div className="relative">
          <h1 className="font-display font-semibold text-4xl leading-tight mb-4">
            El día de cada niño,
            <br />
            compartido con su familia.
          </h1>
          <p className="text-base leading-relaxed max-w-md text-white/92">
            Publicá momentos, gestioná las salas y mantené a las familias
            cerca, desde un solo lugar.
          </p>
        </div>

        <div className="relative text-sm text-white/90">
          🌿 Guardería Sala Soles
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <h2 className="font-display font-semibold text-3xl mb-1.5 text-ink">
            Iniciar sesión
          </h2>
          <p className="mb-7 text-muted-2 text-sm">
            Ingresá para ver el día de hoy.
          </p>

          <div className="text-xs font-bold tracking-wide text-muted-2 mb-2">
            INGRESO COMO
          </div>
          <div className="flex gap-2.5 mb-5">
            <button
              type="button"
              onClick={() => handleRoleChange("staff")}
              className={`flex-1 flex items-center gap-2 py-3 px-3.5 rounded-xl border-[1.5px] font-bold text-sm transition-all ${
                role === "staff"
                  ? "bg-coral-tint border-coral-border text-coral-strong"
                  : "bg-white border-input-border text-muted-3"
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Personal
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("family")}
              className={`flex-1 flex items-center gap-2 py-3 px-3.5 rounded-xl border-[1.5px] font-bold text-sm transition-all ${
                role === "family"
                  ? "bg-coral-tint border-coral-border text-coral-strong"
                  : "bg-white border-input-border text-muted-3"
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Familia
            </button>
          </div>

          <div className="text-xs font-bold tracking-wide text-muted-2 mb-2">
            EMAIL
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3.5 px-4 rounded-xl border-[1.5px] border-input-border bg-white text-base text-ink mb-4"
          />
          {errors.email && (
            <div className="text-coral-dark text-sm mb-3">{errors.email}</div>
          )}

          <div className="text-xs font-bold tracking-wide text-muted-2 mb-2">
            CONTRASEÑA
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full py-3.5 px-4 rounded-xl border-[1.5px] border-input-border bg-white text-base text-ink mb-2.5"
          />
          {errors.password && (
            <div className="text-coral-dark text-sm mb-3">
              {errors.password}
            </div>
          )}

          <div className="text-right mb-5">
            <Link
              href="/forgot-password"
              className="text-coral-dark text-sm font-bold"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-coral to-coral-deep text-white font-extrabold text-base shadow-lg shadow-coral-deep/30"
          >
            Iniciar sesión
          </button>

          <p className="text-center mt-6 text-muted-2 text-sm">
            ¿Te invitó la guardería?{" "}
            <Link href="/activate" className="text-coral-dark font-extrabold">
              Activá tu cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
