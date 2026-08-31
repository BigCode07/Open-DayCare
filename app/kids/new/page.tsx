import { createClient } from "@/utils/supabase/server";
import { getRoomsOptions } from "@/lib/kids";
import AddKidForm from "./add-kid-form";

export default async function AddKidPage() {
  const supabase = await createClient();
  const rooms = await getRoomsOptions(supabase);

  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-6"
      style={{ background: "#F6ECDF" }}
    >
      <AddKidForm rooms={rooms} />
    </div>
  );
}
