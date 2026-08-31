import { createClient } from "@/utils/supabase/server";
import { toKid, type ChildRow } from "@/lib/kids";
import KidsView from "@/app/components/kids-view";

type ChildWithRoom = ChildRow & {
  rooms: { id: string; name: string } | null;
};

export default async function KidsPage() {
  const supabase = await createClient();

  const { data: children } = await supabase
    .from("children")
    .select("*, rooms(id, name)")
    .order("full_name", { ascending: true });

  const childIds = (children ?? []).map((c) => c.id);

  const { data: links } = childIds.length
    ? await supabase
        .from("parent_children")
        .select("child_id")
        .in("child_id", childIds)
    : { data: [] };

  const parentCount: Record<string, number> = {};
  (links ?? []).forEach((link) => {
    parentCount[link.child_id] = (parentCount[link.child_id] ?? 0) + 1;
  });

  const kids = ((children ?? []) as ChildWithRoom[]).map((row) =>
    toKid(row, parentCount[row.id] ?? 0, row.rooms?.name ?? "")
  );

  return <KidsView kids={kids} />;
}
