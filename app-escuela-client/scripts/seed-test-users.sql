-- SEED DATOS DE PRUEBA
-- Pega y ejecuta esto en Supabase Dashboard → SQL Editor
-- Crea 10 profesores y 80 padres con contraseña: test123

-- Habilita pgcrypto si no está habilitado
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  uid UUID;
  i INT;
  nombres_profes TEXT[] := ARRAY[
    'Laura Méndez', 'Carlos Rivera', 'Ana Patricia Soto',
    'José Luis Hernández', 'María Fernanda Gil',
    'Roberto Jiménez', 'Diana Laura Cruz',
    'Fernando Medina', 'Gabriela Torres', 'Héctor Ríos'
  ];
  nombres_padres TEXT[] := ARRAY[
    'Alejandro García', 'Beatriz López', 'Carmen Martínez', 'Daniel Rodríguez',
    'Elena Fernández', 'Francisco Sánchez', 'Gloria Ramírez', 'Hugo Morales',
    'Isabel Cruz', 'Jorge Torres', 'Karen Reyes', 'Luis Castillo',
    'Martha Vargas', 'Nicolás Flores', 'Olga Medina', 'Pablo Ríos',
    'Raquel Guerrero', 'Sergio Delgado', 'Teresa Herrera', 'Ulises Paredes',
    'Verónica Nava', 'Wilson Campos', 'Ximena Peña', 'Yolanda Rivas',
    'Adrián Soto', 'Brenda Vega', 'César Luna', 'Dulce Rangel',
    'Emilio Chávez', 'Fabiola Padilla', 'Gerardo Jiménez', 'Helena Orozco',
    'Ignacio Fuentes', 'Julia Valenzuela', 'Karla Aguilar', 'Leonardo Quintero',
    'Liliana Bravo', 'Manuel Ponce', 'Nadia Esquivel', 'Octavio Arias',
    'Patricia Bautista', 'Ramiro Meza', 'Sandra Gálvez', 'Teodoro Navarro',
    'Úrsula Salazar', 'Vicente Trejo', 'Wendy Zavala', 'Xavier Barragán',
    'Yadira Montero', 'Zacarías Lira', 'Alicia Becerra', 'Benjamín Córdova',
    'Carolina Salinas', 'David Espinoza', 'Esther Miranda', 'Felipe Arce',
    'Guadalupe Casillas', 'Horacio Aguirre', 'Irene Vázquez', 'Joaquín Tovar',
    'Leonor Zamora', 'Manuel Delgado', 'Natalia Cuevas', 'Óscar Peña',
    'Paola Velázquez', 'Rubén Carrillo', 'Silvia Bermúdez', 'Tomás Galindo',
    'Valeria Escobar', 'William Mérida', 'Yesenia Buenrostro', 'Arnulfo Bahena',
    'Berenice Alanís', 'Cristóbal Patiño', 'Daniela Carvajal', 'Edmundo Alfaro',
    'Florencia Sotelo', 'Gabino Noriega', 'Hilda Saldaña', 'Iván Mosqueda'
  ];
BEGIN
  -- ============================================
  -- PROFESORES (10)
  -- ============================================
  FOR i IN 1..10 LOOP
    uid := gen_random_uuid();
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
            'profe' || i || '@test.com',
            crypt('test123', gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            now(), now(),
            '', '', '', '');
    INSERT INTO profiles (id, nombre, email, role)
    VALUES (uid, nombres_profes[i], 'profe' || i || '@test.com', 'teacher');
  END LOOP;

  -- ============================================
  -- PADRES (80)
  -- ============================================
  FOR i IN 1..80 LOOP
    uid := gen_random_uuid();
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
            'padre' || i || '@test.com',
            crypt('test123', gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            now(), now(),
            '', '', '', '');
    INSERT INTO profiles (id, nombre, email, role)
    VALUES (uid, nombres_padres[i], 'padre' || i || '@test.com', 'parent');
  END LOOP;
END $$;

-- Muestra los usuarios creados
SELECT '✅ Creados:' as mensaje;
SELECT '📧 profe1@test.com ... profe10@test.com (pass: test123)' as profesores;
SELECT '📧 padre1@test.com ... padre80@test.com (pass: test123)' as padres;
SELECT count(*) || ' profesores' FROM profiles WHERE role = 'teacher' as total_profes;
SELECT count(*) || ' padres' FROM profiles WHERE role = 'parent' as total_padres;
