-- Seed: usuario de autenticación (auth.users) para el login de prueba.
-- La fila de dominio public.users (id = 14847441-d11a-40d2-aadc-7d0ebefe9751)
-- ya existe; creamos su contraparte en auth.users con el mismo id para que
-- la FK users.id -> auth.users(id) quede vinculada y permita el login.
-- Credenciales de prueba: staff@opendaycare.test / Staff1234!

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '14847441-d11a-40d2-aadc-7d0ebefe9751',
  'authenticated', 'authenticated',
  'staff@opendaycare.test',
  crypt('Staff1234!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  now(), now(), '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;
