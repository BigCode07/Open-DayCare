import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { toKid, type ChildRow } from "@/lib/kids";
import KidProfileView from "@/app/components/kid-profile-view";

type ChildWithRoom = ChildRow & {
  rooms: { id: string; name: string } | null;
};

type LinkedParent = {
  name: string;
  role: string;
  status: "Active" | "Pending";
};

const ROLE_LABELS: Record<string, string> = {
  father: "Dad",
  mother: "Mom",
  guardian: "Guardian",
};

export default async function KidProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: child } = await supabase
    .from("children")
    .select("*, rooms(id, name)")
    .eq("id", id)
    .maybeSingle();

  if (!child) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#F6ECDF" }}>
        <div className="text-center">
          <h1
            className="text-2xl text-ink mb-2"
            style={{ fontFamily: "var(--font-fredoka)", fontWeight: 600 }}
          >
            Child not found
          </h1>
          <Link href="/kids" className="text-coral-strong font-bold">
            Back to Kids
          </Link>
        </div>
      </div>
    );
  }

  const { data: parentLinks } = await supabase
    .from("parent_children")
    .select("relationship, users(id, full_name)")
    .eq("child_id", id);

  const parents: LinkedParent[] = (parentLinks ?? []).map((link) => {
    const embedded = link.users as
      | { id: string; full_name: string }
      | { id: string; full_name: string }[]
      | null;
    const parent = Array.isArray(embedded) ? embedded[0] : embedded;
    return {
      name: parent?.full_name ?? "",
      role: ROLE_LABELS[link.relationship] ?? "",
      status: "Active",
    };
  });

  const kid = toKid(child as ChildWithRoom, parents.length, (child as ChildWithRoom).rooms?.name ?? "");
  kid.parentStatus = parents;

  return <KidProfileView kid={kid} />;
}
