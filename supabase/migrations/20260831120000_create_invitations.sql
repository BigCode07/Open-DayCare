-- Invitations: enum + tabla + RLS scope por daycare del staff
-- Depende de: relationship_type (SPEC 11), children, users

CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

CREATE TABLE invitations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id     uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  invited_by   uuid NOT NULL REFERENCES users(id),
  full_name    text NOT NULL,
  email        text NOT NULL,
  relationship relationship_type NOT NULL,
  code         text NOT NULL UNIQUE,
  status       invitation_status NOT NULL DEFAULT 'pending',
  expires_at   timestamptz NOT NULL,
  accepted_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations FORCE ROW LEVEL SECURITY;

CREATE POLICY "invitations_staff_select"
  ON invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children c
      JOIN rooms r ON c.room_id = r.id
      WHERE c.id = invitations.child_id
        AND r.daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid())
    )
  );

CREATE POLICY "invitations_staff_insert"
  ON invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children c
      JOIN rooms r ON c.room_id = r.id
      WHERE c.id = invitations.child_id
        AND r.daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid())
    )
  );
