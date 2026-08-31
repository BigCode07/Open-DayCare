-- Seed: salas, los 8 niños del mockup y sus padres vinculados.
-- Los ids se resuelven por nombre dentro de la migración (no se hardcodea uuid).
-- Los padres viven en public.users y, como users.id -> auth.users(id),
-- se crea también su contraparte en auth.users (mismo patrón que el staff seed).

-- 1. Salas de la guardería "Guardería Sala Soles"
INSERT INTO rooms (daycare_id, name)
SELECT d.id, r.name
FROM (VALUES ('Soles'), ('Lunas'), ('Nubes')) AS r(name)
CROSS JOIN daycares d
WHERE d.name = 'Guardería Sala Soles';

-- 2. Padres (auth.users + fila de dominio). Emails deterministas.
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), 'authenticated', 'authenticated',
  p.email,
  crypt('Parent1234!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('full_name', p.full_name, 'role', 'parent'),
  now(), now(), '', '', '', ''
FROM (VALUES
  ('Lucía Fernández',   'lucia@opendaycare.test'),
  ('Diego Fernández',   'diego@opendaycare.test'),
  ('Ana Méndez',        'ana@opendaycare.test'),
  ('Carolina Ruiz',     'carolina@opendaycare.test'),
  ('Pablo Ruiz',        'pablo@opendaycare.test'),
  ('María Díaz',        'maria@opendaycare.test'),
  ('Laura Castro',      'laura@opendaycare.test'),
  ('Sofía Romero',      'sofia@opendaycare.test'),
  ('Carmen Vega',       'carmen@opendaycare.test')
) AS p(full_name, email);

INSERT INTO users (id, daycare_id, role, status, full_name)
SELECT au.id, d.id, 'parent', 'active', p.full_name
FROM (VALUES
  ('Lucía Fernández',   'lucia@opendaycare.test'),
  ('Diego Fernández',   'diego@opendaycare.test'),
  ('Ana Méndez',        'ana@opendaycare.test'),
  ('Carolina Ruiz',     'carolina@opendaycare.test'),
  ('Pablo Ruiz',        'pablo@opendaycare.test'),
  ('María Díaz',        'maria@opendaycare.test'),
  ('Laura Castro',      'laura@opendaycare.test'),
  ('Sofía Romero',      'sofia@opendaycare.test'),
  ('Carmen Vega',       'carmen@opendaycare.test')
) AS p(full_name, email)
JOIN auth.users au ON au.email = p.email
JOIN daycares d ON d.name = 'Guardería Sala Soles';

-- 3. Los 8 niños del mockup, todos en la sala "Soles"
INSERT INTO children (room_id, full_name, birth_date, enrolled_at, medical_notes, allergy_tags, photo_consent, status)
SELECT
  r.id, c.full_name, c.birth_date::date, c.enrolled_at::date,
  c.medical_notes, c.allergy_tags::text[], true, 'active'
FROM (VALUES
  ('Mateo Fernández',   '2022-03-12', '2025-02-01', 'Allergic to peanuts. Avoid nuts. Carries inhaler in backpack.', '{peanut}'),
  ('Sofía Méndez',      '2023-07-05', '2025-03-01', NULL,                                   '{}'),
  ('Benjamín Ruiz',     '2022-01-22', '2025-02-01', NULL,                                   '{}'),
  ('Valentina Soto',    '2023-09-18', '2025-04-01', NULL,                                   '{}'),
  ('Tomás Díaz',        '2021-11-30', '2025-01-01', 'Lactose intolerant. Avoid dairy products.', '{lactose}'),
  ('Emma Castro',       '2023-04-14', '2025-03-01', NULL,                                   '{}'),
  ('Lucas Romero',      '2022-02-08', '2025-02-01', NULL,                                   '{}'),
  ('Olivia Vega',       '2023-06-25', '2025-04-01', NULL,                                   '{}')
) AS c(full_name, birth_date, enrolled_at, medical_notes, allergy_tags)
JOIN rooms r ON r.name = 'Soles';

-- 4. Vínculos padre <-> niño (Valentina Soto queda huérfana: 0 vínculos).
INSERT INTO parent_children (parent_id, child_id, relationship)
SELECT pu.id, c.id, pc.relationship::relationship_type
FROM (VALUES
  ('Mateo Fernández', 'Lucía Fernández',   'mother'),
  ('Mateo Fernández', 'Diego Fernández',   'father'),
  ('Sofía Méndez',    'Ana Méndez',        'mother'),
  ('Benjamín Ruiz',   'Carolina Ruiz',     'mother'),
  ('Benjamín Ruiz',   'Pablo Ruiz',        'father'),
  ('Tomás Díaz',      'María Díaz',        'mother'),
  ('Emma Castro',     'Laura Castro',      'mother'),
  ('Lucas Romero',    'Sofía Romero',      'mother'),
  ('Olivia Vega',     'Carmen Vega',       'mother')
) AS pc(child_full_name, parent_full_name, relationship)
JOIN users pu ON pu.full_name = pc.parent_full_name
JOIN children c ON c.full_name = pc.child_full_name;
