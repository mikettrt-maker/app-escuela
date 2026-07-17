-- Tabla de grupos (grados)
CREATE TABLE IF NOT EXISTS grupos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

INSERT INTO grupos (id, nombre) VALUES
  (1, '1°'),
  (2, '2°'),
  (3, '3°'),
  (4, '4°'),
  (5, '5°'),
  (6, '6°')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;

-- Tabla de campos formativos (materias)
CREATE TABLE IF NOT EXISTS campos_formativos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

INSERT INTO campos_formativos (id, nombre) VALUES
  (1, 'Saberes y pensamiento científico'),
  (2, 'Lenguajes Español'),
  (3, 'Lenguajes Inglés'),
  (4, 'Ética, naturaleza y sociedades'),
  (5, 'De lo humano y lo comunitario')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE campos_formativos ENABLE ROW LEVEL SECURITY;

-- Asignaciones: qué profesor da qué campo en qué grupo
CREATE TABLE IF NOT EXISTS asignaciones_profesores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  grupo_id INT NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
  campo_id INT NOT NULL REFERENCES campos_formativos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(teacher_id, grupo_id, campo_id)
);

ALTER TABLE asignaciones_profesores ENABLE ROW LEVEL SECURITY;

-- RLS: todos pueden leer grupos y campos
CREATE POLICY "authenticated_read_grupos" ON grupos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_read_campos" ON campos_formativos
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS: director gestiona asignaciones, profesor ve las suyas
CREATE POLICY "director_manage_asignaciones" ON asignaciones_profesores
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director')
  );

CREATE POLICY "teachers_view_own_asignaciones" ON asignaciones_profesores
  FOR SELECT USING (teacher_id = auth.uid());

-- RLS: profesores pueden leer estudiantes (ya existe, pero asegurar)
DROP POLICY IF EXISTS "teachers_view_estudiantes" ON estudiantes;
CREATE POLICY "teachers_view_estudiantes" ON estudiantes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

-- RLS: profesores pueden insertar/ver notas diarias
DROP POLICY IF EXISTS "teachers_insert_notas" ON notas_diarias;
CREATE POLICY "teachers_insert_notas" ON notas_diarias
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

DROP POLICY IF EXISTS "teachers_update_notas" ON notas_diarias;
CREATE POLICY "teachers_update_notas" ON notas_diarias
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

-- RLS: profesores pueden insertar/actualizar asistencias
DROP POLICY IF EXISTS "teachers_insert_asistencias" ON asistencias;
CREATE POLICY "teachers_insert_asistencias" ON asistencias
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

DROP POLICY IF EXISTS "teachers_update_asistencias" ON asistencias;
CREATE POLICY "teachers_update_asistencias" ON asistencias
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );
