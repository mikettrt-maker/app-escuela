-- Datos de prueba para desarrollo

-- Insertar un director manualmente (necesitas crear el usuario primero en Supabase Auth)
-- Luego actualiza el role:

-- UPDATE profiles SET role = 'director' WHERE email = 'director@escuela.com';
-- UPDATE profiles SET role = 'teacher' WHERE email = 'profe@escuela.com';
-- UPDATE profiles SET role = 'parent' WHERE email = 'papa@escuela.com';

-- Estudiantes de ejemplo
INSERT INTO estudiantes (nombre, grado, grupo) VALUES
  ('Ana García López', '1°', 'A'),
  ('Luis Pérez Martínez', '1°', 'A'),
  ('Sofía Ramírez Torres', '2°', 'B'),
  ('Diego Hernández Cruz', '2°', 'B'),
  ('María Flores Castillo', '3°', 'A'),
  ('Carlos Mendoza Ríos', '3°', 'A')
ON CONFLICT DO NOTHING;
