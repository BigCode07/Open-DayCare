CREATE TABLE children (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id       uuid REFERENCES rooms(id),
  full_name     text NOT NULL,
  birth_date    date NOT NULL,
  enrolled_at   date NOT NULL,
  medical_notes text,
  allergy_tags  text[] NOT NULL DEFAULT '{}',
  photo_consent boolean NOT NULL DEFAULT true,
  status        child_status NOT NULL DEFAULT 'active',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE children FORCE ROW LEVEL SECURITY;

-- El staff solo ve/inserta niños de su propio daycare.
-- El daycare del niño se hereda de su sala (rooms.daycare_id).
-- get_staff_daycare_id() (SECURITY DEFINER) evita recursión en RLS.
CREATE POLICY "children_select_staff" ON children
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = children.room_id AND r.daycare_id = get_staff_daycare_id()
    )
  );

CREATE POLICY "children_insert_staff" ON children
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_id AND r.daycare_id = get_staff_daycare_id()
    )
  );
