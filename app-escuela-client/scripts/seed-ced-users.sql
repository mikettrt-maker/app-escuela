-- CREA 6 PROFESORES + 2 PADRES DE PRUEBA
-- Contraseña para todos: test123

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DELETE FROM profiles WHERE email IN (
  'profesor1@ced.com','profesor2@ced.com','profesor3@ced.com',
  'profesor4@ced.com','profesor5@ced.com','profesor6@ced.com',
  'padre1@ced.com','padre2@ced.com'
);
DELETE FROM auth.users WHERE email IN (
  'profesor1@ced.com','profesor2@ced.com','profesor3@ced.com',
  'profesor4@ced.com','profesor5@ced.com','profesor6@ced.com',
  'padre1@ced.com','padre2@ced.com'
);

DO $$
DECLARE
  uid UUID;
  emails TEXT[] := ARRAY[
    'profesor1@ced.com','profesor2@ced.com','profesor3@ced.com',
    'profesor4@ced.com','profesor5@ced.com','profesor6@ced.com',
    'padre1@ced.com','padre2@ced.com'
  ];
  nombres TEXT[] := ARRAY[
    'Profesor 1','Profesor 2','Profesor 3',
    'Profesor 4','Profesor 5','Profesor 6',
    'Carlos Mendoza','María López'
  ];
  roles TEXT[] := ARRAY[
    'teacher','teacher','teacher',
    'teacher','teacher','teacher',
    'parent','parent'
  ];
BEGIN
  FOR i IN 1..8 LOOP
    uid := gen_random_uuid();
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', emails[i], crypt('test123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
    INSERT INTO profiles (id, nombre, email, role) VALUES (uid, nombres[i], emails[i], roles[i])
    ON CONFLICT (id) DO UPDATE SET nombre = nombres[i], email = emails[i], role = roles[i];
  END LOOP;
END $$;
