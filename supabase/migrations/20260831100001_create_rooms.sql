CREATE TYPE child_status AS ENUM ('active', 'archived');

CREATE TABLE rooms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daycare_id  uuid NOT NULL REFERENCES daycares(id),
  name        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms FORCE ROW LEVEL SECURITY;

-- El staff de una guardería puede leer las salas de su propio daycare
-- (necesario para el dropdown de /kids/new y el join de nombre en /kids).
-- get_staff_daycare_id() se crea en la migración add_staff_daycare_helper
-- (SECURITY DEFINER) para evitar recursión en RLS.
CREATE POLICY "rooms_select_staff" ON rooms
  FOR SELECT
  USING (daycare_id = get_staff_daycare_id());
