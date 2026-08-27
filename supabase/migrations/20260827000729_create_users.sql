CREATE TYPE user_role AS ENUM ('staff', 'parent', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'active');

CREATE TABLE users (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid() REFERENCES auth.users(id) ON DELETE CASCADE,
  daycare_id            uuid NOT NULL REFERENCES daycares(id),
  role                  user_role NOT NULL,
  status                user_status NOT NULL DEFAULT 'active',
  full_name             text NOT NULL,
  avatar_url            text,
  notify_on_post        boolean NOT NULL DEFAULT true,
  daily_summary_enabled boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

-- Seed: usuario staff de prueba (auth.users + fila de dominio)
-- El daycare_id se resuelve por nombre dentro de la migración, no se hardcodea.
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), 'authenticated', 'authenticated',
  'staff@opendaycare.test',
  crypt('Staff1234!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('daycare_id', d.id::text, 'role', 'staff', 'full_name', 'Staff Demo'),
  now(), now(), '', '', '', ''
FROM daycares d
WHERE d.name = 'Guardería Sala Soles';

INSERT INTO users (id, daycare_id, role, status, full_name, avatar_url)
SELECT au.id, d.id, 'staff', 'active', 'Staff Demo', NULL
FROM auth.users au
JOIN daycares d ON d.name = 'Guardería Sala Soles'
WHERE au.email = 'staff@opendaycare.test';