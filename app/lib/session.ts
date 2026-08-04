"use client";

import { useSyncExternalStore } from "react";

export type Role = "staff" | "family";

export type Session = {
  email: string;
  role: Role;
  name: string;
  firstName: string;
  initial: string;
  roleLabel: string;
};

const SESSION_KEY = "opendaycare.session";

const DEMO_ACCOUNTS: Record<string, Omit<Session, "email">> = {
  "caro@opendaycare.com": {
    role: "staff",
    name: "Caro Giménez",
    firstName: "Caro",
    initial: "C",
    roleLabel: "Teacher · Soles",
  },
  "lucia.fernandez@gmail.com": {
    role: "family",
    name: "Lucía Fernández",
    firstName: "Lucía",
    initial: "L",
    roleLabel: "Family · Soles",
  },
};

let cachedSession: Session | null | undefined;

function readStoredSession(): Session | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as Session;
  if (
    !parsed ||
    typeof parsed.email !== "string" ||
    (parsed.role !== "staff" && parsed.role !== "family") ||
    typeof parsed.name !== "string"
  ) {
    return null;
  }
  return parsed;
}

export function getSession(): Session | null {
  if (cachedSession !== undefined) return cachedSession;
  try {
    cachedSession = readStoredSession();
  } catch {
    cachedSession = null;
  }
  return cachedSession;
}

export function createSession(email: string): Session | null {
  const normalizedEmail = email.trim().toLowerCase();
  const demo = DEMO_ACCOUNTS[normalizedEmail];
  if (!demo) return null;
  const session: Session = { email: normalizedEmail, ...demo };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  cachedSession = session;
  return session;
}

export function clearSession(): void {
  cachedSession = null;
  window.localStorage.removeItem(SESSION_KEY);
}

const subscribe = () => () => {};

export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, getSession, () => null);
}
