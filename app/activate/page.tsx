"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSession } from "@/app/lib/session";

export default function ActivatePage() {
  const router = useRouter();
  const [invitationCode, setInvitationCode] = useState("7K4P9");
  const [email, setEmail] = useState("lucia.fernandez@gmail.com");
  const [password, setPassword] = useState("");
  const [photoAuth, setPhotoAuth] = useState(false);
  const [errors, setErrors] = useState<{
    invitationCode?: string;
    email?: string;
    password?: string;
    photoAuth?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {
      invitationCode?: string;
      email?: string;
      password?: string;
      photoAuth?: string;
    } = {};

    if (!invitationCode) {
      newErrors.invitationCode = "El código de invitación es obligatorio";
    }

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

    if (!photoAuth) {
      newErrors.photoAuth = "Debés autorizar el uso de fotos";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      createSession("lucia.fernandez@gmail.com");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F8C3A8] to-[#F2937A] flex items-center justify-center mb-5 shadow-lg shadow-coral-deep/40">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </div>

        <h1 className="font-display font-semibold text-3xl leading-tight mb-2 text-ink">
          Bienvenida a OpenDayCare
        </h1>
        <p className="mb-6 text-muted-2 text-base leading-relaxed">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para
          activar la cuenta.
        </p>

        <div className="flex items-center gap-3.5 bg-white border-[1.5px] border-input-border rounded-2xl py-3.5 px-4 mb-5">
          <div className="w-11 h-11 rounded-full bg-kid-blue text-kid-blue-text font-display font-semibold text-lg flex items-center justify-center">
            M
          </div>
          <div>
            <div className="text-sm text-muted-2">
              Te invitaron a seguir a
            </div>
            <div className="font-display font-semibold text-base text-ink">
              Mateo · Sala Soles
            </div>
          </div>
        </div>

        <div className="text-xs font-bold tracking-wide text-muted-2 mb-2">
          CÓDIGO DE INVITACIÓN
        </div>
        <input
          type="text"
          value={invitationCode}
          onChange={(e) => setInvitationCode(e.target.value)}
          className="w-full py-3.5 px-4 rounded-xl border-[1.5px] border-input-border bg-white text-lg tracking-widest font-bold text-ink mb-4 font-display"
        />
        {errors.invitationCode && (
          <div className="text-coral-dark text-sm mb-3">
            {errors.invitationCode}
          </div>
        )}

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
          CREAR CONTRASEÑA
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full py-3.5 px-4 rounded-xl border-[1.5px] border-input-border bg-white text-base text-ink mb-4"
        />
        {errors.password && (
          <div className="text-coral-dark text-sm mb-3">{errors.password}</div>
        )}

        <label className="flex items-start gap-3 bg-auth-box-bg rounded-xl py-3.5 px-4 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={photoAuth}
            onChange={(e) => setPhotoAuth(e.target.checked)}
            className="sr-only"
          />
          <span
            className={`flex-none w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 transition-colors ${
              photoAuth ? "bg-check-green" : "bg-white border-[1.5px] border-input-border"
            }`}
          >
            {photoAuth && (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          <span className="text-sm text-auth-box-text leading-relaxed">
            Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro
            de la app.
          </span>
        </label>
        {errors.photoAuth && (
          <div className="text-coral-dark text-sm mb-3">
            {errors.photoAuth}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-coral to-coral-deep text-white font-extrabold text-base shadow-lg shadow-coral-deep/30"
        >
          Activar mi cuenta
        </button>

        <p className="text-center mt-5 text-muted-2 text-sm">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-coral-dark font-extrabold">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
