-- Crear tabla de perfiles (se sincroniza con auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('director', 'teacher', 'parent')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  grado TEXT NOT NULL,
  grupo TEXT NOT NULL,
  parent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;

-- Asistencias
CREATE TABLE IF NOT EXISTS asistencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  estado TEXT NOT NULL CHECK (estado IN ('presente', 'ausente', 'tardanza')),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, fecha)
);

ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;

-- Notas diarias
CREATE TABLE IF NOT EXISTS notas_diarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  materia TEXT NOT NULL,
  calificacion NUMERIC(5,2) NOT NULL,
  comentario TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notas_diarias ENABLE ROW LEVEL SECURITY;

-- Avisos
CREATE TABLE IF NOT EXISTS avisos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target TEXT NOT NULL CHECK (target IN ('parents', 'teachers', 'all')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;

-- Triggers: crear profile automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre, role)
  VALUES (NEW.id, NEW.email, '', 'parent');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Políticas RLS

-- Profiles: cada quien ve su perfil, director ve todos
CREATE POLICY "users_view_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "director_view_all_profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director')
  );

-- Estudiantes: padres ven sus hijos, director ve todos, profesores ven todos
CREATE POLICY "parents_view_own_children" ON estudiantes
  FOR SELECT USING (parent_id = auth.uid());

CREATE POLICY "director_manage_estudiantes" ON estudiantes
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director')
  );

CREATE POLICY "teachers_view_estudiantes" ON estudiantes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

-- Asistencias: director ve todo, profesores pueden insertar/ver, padres ven hijos
CREATE POLICY "director_all_asistencias" ON asistencias
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director')
  );

CREATE POLICY "teachers_manage_asistencias" ON asistencias
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

CREATE POLICY "parents_view_asistencias" ON asistencias
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM estudiantes
      WHERE estudiantes.id = asistencias.student_id
      AND estudiantes.parent_id = auth.uid()
    )
  );

-- Notas diarias: similar a asistencias
CREATE POLICY "director_all_notas" ON notas_diarias
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director')
  );

CREATE POLICY "teachers_view_notas" ON notas_diarias
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

CREATE POLICY "parents_view_notas" ON notas_diarias
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM estudiantes
      WHERE estudiantes.id = notas_diarias.student_id
      AND estudiantes.parent_id = auth.uid()
    )
  );

-- Avisos: director crea/edita/elimina, profesores y padres ven según target
CREATE POLICY "director_manage_avisos" ON avisos
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director')
  );

CREATE POLICY "teachers_view_avisos" ON avisos
  FOR SELECT USING (
    target IN ('teachers', 'all')
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

CREATE POLICY "parents_view_avisos" ON avisos
  FOR SELECT USING (
    target IN ('parents', 'all')
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'parent')
  );
