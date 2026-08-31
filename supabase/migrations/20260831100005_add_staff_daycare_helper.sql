-- Helper SECURITY DEFINER: devuelve el daycare_id del staff autenticado,
-- o NULL si no hay usuario / no es staff. Evita recursión en RLS al evitar
-- que las políticas re-consulten la tabla `users` (que tiene FORCE RLS).
CREATE OR REPLACE FUNCTION get_staff_daycare_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.daycare_id
  FROM users u
  WHERE u.id = auth.uid() AND u.role = 'staff';
$$;

REVOKE ALL ON FUNCTION get_staff_daycare_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_staff_daycare_id() TO authenticated;

-- rooms: staff del mismo daycare
DROP POLICY IF EXISTS "rooms_select_staff" ON rooms;
CREATE POLICY "rooms_select_staff" ON rooms
  FOR SELECT
  USING (daycare_id = get_staff_daycare_id());

-- children: staff del mismo daycare (heredado del daycare de la sala)
DROP POLICY IF EXISTS "children_select_staff" ON children;
CREATE POLICY "children_select_staff" ON children
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = children.room_id AND r.daycare_id = get_staff_daycare_id()
    )
  );

DROP POLICY IF EXISTS "children_insert_staff" ON children;
CREATE POLICY "children_insert_staff" ON children
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_id AND r.daycare_id = get_staff_daycare_id()
    )
  );

-- parent_children
DROP POLICY IF EXISTS "parent_children_select_staff" ON parent_children;
CREATE POLICY "parent_children_select_staff" ON parent_children
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children c
      JOIN rooms r ON r.id = c.room_id
      WHERE c.id = parent_children.child_id AND r.daycare_id = get_staff_daycare_id()
    )
  );

DROP POLICY IF EXISTS "parent_children_insert_staff" ON parent_children;
CREATE POLICY "parent_children_insert_staff" ON parent_children
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children c
      JOIN rooms r ON r.id = c.room_id
      WHERE c.id = child_id AND r.daycare_id = get_staff_daycare_id()
    )
  );

-- users: el staff puede ver los usuarios de su mismo daycare (nombres de padres)
DROP POLICY IF EXISTS "users_select_staff_daycare" ON users;
CREATE POLICY "users_select_staff_daycare" ON users
  FOR SELECT
  USING (daycare_id = get_staff_daycare_id());
