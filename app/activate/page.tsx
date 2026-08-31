"use client";

import { useActionState } from "react";
import Link from "next/link";
import { activateParent, type ActivateParentState } from "./actions";

const initialState: ActivateParentState = {};

export default function ActivatePage() {
  const [state, formAction, isPending] = useActionState(activateParent, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg p-6 md:p-10">
      <form
        action={formAction}
        className="w-full max-w-md"
      >
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
          Te invitaron a seguir el día de tu hijo. Ingresá el código que te
          enviaron y creá tu contraseña para activar la cuenta.
        </p>

        {state.error && (
          <div className="bg-[#FBDAD6] text-[#C5413A] text-sm font-bold rounded-xl py-3 px-4 mb-5">
            {state.error}
          </div>
        )}

        <div className="text-xs font-bold tracking-wide text-muted-2 mb-2">
          CÓDIGO DE INVITACIÓN
        </div>
        <input
          type="text"
          name="invitation_code"
          className="w-full py-3.5 px-4 rounded-xl border-[1.5px] border-input-border bg-white text-lg tracking-widest font-bold text-ink mb-4 font-display"
        />

        <div className="text-xs font-bold tracking-wide text-muted-2 mb-2">
          EMAIL
        </div>
        <input
          type="email"
          name="email"
          className="w-full py-3.5 px-4 rounded-xl border-[1.5px] border-input-border bg-white text-base text-ink mb-4"
        />

        <div className="text-xs font-bold tracking-wide text-muted-2 mb-2">
          CREAR CONTRASEÑA
        </div>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          className="w-full py-3.5 px-4 rounded-xl border-[1.5px] border-input-border bg-white text-base text-ink mb-4"
        />

        <label className="flex items-start gap-3 bg-auth-box-bg rounded-xl py-3.5 px-4 mb-6 cursor-pointer">
          <input type="checkbox" name="photo_auth" className="sr-only" />
          <span className="flex-none w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 transition-colors bg-white border-[1.5px] border-input-border [&:has(input:checked)]:bg-check-green [&:has(input:checked)]:border-transparent">
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
          </span>
          <span className="text-sm text-auth-box-text leading-relaxed">
            Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro
            de la app.
          </span>
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-coral to-coral-deep text-white font-extrabold text-base shadow-lg shadow-coral-deep/30 disabled:opacity-60"
        >
          {isPending ? "Activando..." : "Activar mi cuenta"}
        </button>

        <p className="text-center mt-5 text-muted-2 text-sm">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-coral-dark font-extrabold">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
