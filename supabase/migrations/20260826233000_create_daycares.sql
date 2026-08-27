CREATE TABLE daycares (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  address    text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE daycares ENABLE ROW LEVEL SECURITY;
ALTER TABLE daycares FORCE ROW LEVEL SECURITY;

INSERT INTO daycares (name, address) VALUES
  ('Guardería Sala Soles',   NULL),
  ('Pequeños Exploradores',  NULL),
  ('Estrellitas del Saber',  NULL),
  ('Caminitos Felices',      NULL);