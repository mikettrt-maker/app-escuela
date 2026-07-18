-- RLS policies for client-side (anon key) access
-- Run this in the Supabase SQL Editor

-- ============================================
-- PROFILES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
CREATE POLICY "users_read_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "director_read_all_profiles" ON profiles;
CREATE POLICY "director_read_all_profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director')
  );

-- ============================================
-- GRUPOS
-- ============================================
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_read_grupos" ON grupos;
CREATE POLICY "authenticated_read_grupos" ON grupos
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- CAMPOS FORMATIVOS
-- ============================================
ALTER TABLE campos_formativos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_read_campos" ON campos_formativos;
CREATE POLICY "authenticated_read_campos" ON campos_formativos
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- ASIGNACIONES PROFESORES
-- ============================================
ALTER TABLE asignaciones_profesores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "director_manage_asignaciones" ON asignaciones_profesores;
CREATE POLICY "director_manage_asignaciones" ON asignaciones_profesores
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director'));

DROP POLICY IF EXISTS "teachers_view_own_asignaciones" ON asignaciones_profesores;
CREATE POLICY "teachers_view_own_asignaciones" ON asignaciones_profesores
  FOR SELECT USING (teacher_id = auth.uid());

-- ============================================
-- ESTUDIANTES
-- ============================================
ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "director_manage_estudiantes" ON estudiantes;
CREATE POLICY "director_manage_estudiantes" ON estudiantes
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director'));

DROP POLICY IF EXISTS "teachers_view_estudiantes" ON estudiantes;
CREATE POLICY "teachers_view_estudiantes" ON estudiantes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

DROP POLICY IF EXISTS "parents_view_own_children" ON estudiantes;
CREATE POLICY "parents_view_own_children" ON estudiantes
  FOR SELECT USING (parent_id = auth.uid());

-- ============================================
-- NOTAS DIARIAS
-- ============================================
ALTER TABLE notas_diarias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "director_manage_notas" ON notas_diarias;
CREATE POLICY "director_manage_notas" ON notas_diarias
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director'));

DROP POLICY IF EXISTS "teachers_insert_notas" ON notas_diarias;
CREATE POLICY "teachers_insert_notas" ON notas_diarias
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

DROP POLICY IF EXISTS "teachers_select_notas" ON notas_diarias;
CREATE POLICY "teachers_select_notas" ON notas_diarias
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

DROP POLICY IF EXISTS "teachers_update_notas" ON notas_diarias;
CREATE POLICY "teachers_update_notas" ON notas_diarias
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

DROP POLICY IF EXISTS "parents_view_children_notas" ON notas_diarias;
CREATE POLICY "parents_view_children_notas" ON notas_diarias
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM estudiantes
      WHERE estudiantes.id = student_id AND estudiantes.parent_id = auth.uid()
    )
  );

-- ============================================
-- ASISTENCIAS
-- ============================================
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "director_manage_asistencias" ON asistencias;
CREATE POLICY "director_manage_asistencias" ON asistencias
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director'));

DROP POLICY IF EXISTS "teachers_insert_asistencias" ON asistencias;
CREATE POLICY "teachers_insert_asistencias" ON asistencias
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

DROP POLICY IF EXISTS "teachers_select_asistencias" ON asistencias;
CREATE POLICY "teachers_select_asistencias" ON asistencias
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

DROP POLICY IF EXISTS "teachers_update_asistencias" ON asistencias;
CREATE POLICY "teachers_update_asistencias" ON asistencias
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
  );

DROP POLICY IF EXISTS "parents_view_children_asistencias" ON asistencias;
CREATE POLICY "parents_view_children_asistencias" ON asistencias
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM estudiantes
      WHERE estudiantes.id = student_id AND estudiantes.parent_id = auth.uid()
    )
  );

-- ============================================
-- AVISOS
-- ============================================
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "director_manage_avisos" ON avisos;
CREATE POLICY "director_manage_avisos" ON avisos
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director'));

DROP POLICY IF EXISTS "read_avisos_authenticated" ON avisos;
CREATE POLICY "read_avisos_authenticated" ON avisos
  FOR SELECT USING (auth.role() = 'authenticated');
