CREATE TYPE relationship_type AS ENUM ('father', 'mother', 'guardian');

CREATE TABLE parent_children (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id     uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  relationship relationship_type NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (parent_id, child_id)
);

ALTER TABLE parent_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_children FORCE ROW LEVEL SECURITY;

-- El staff solo ve los vínculos de los niños de su propio daycare.
-- El daycare se hereda de children.room_id -> rooms.daycare_id.
-- get_staff_daycare_id() (SECURITY DEFINER) evita recursión en RLS.
CREATE POLICY "parent_children_select_staff" ON parent_children
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children c
      JOIN rooms r ON r.id = c.room_id
      WHERE c.id = parent_children.child_id AND r.daycare_id = get_staff_daycare_id()
    )
  );

CREATE POLICY "parent_children_insert_staff" ON parent_children
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children c
      JOIN rooms r ON r.id = c.room_id
      WHERE c.id = child_id AND r.daycare_id = get_staff_daycare_id()
    )
  );

-- El staff de un daycare puede leer los usuarios del mismo daycare.
-- Necesario para mostrar el nombre/rol de los padres vinculados en /kids/[id].
CREATE POLICY "users_select_staff_daycare" ON users
  FOR SELECT
  USING (daycare_id = get_staff_daycare_id());
