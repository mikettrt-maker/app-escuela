-- CREA 6 PROFESORES + 2 PADRES DE PRUEBA
-- Pega y ejecuta en Supabase Dashboard → SQL Editor
-- Contraseña para todos: test123

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  uid UUID;
BEGIN
  -- Profesor 1
  uid := gen_random_uuid();
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'profesor1@ced.com', crypt('test123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
  INSERT INTO profiles (id, nombre, email, role) VALUES (uid, 'Profesor 1', 'profesor1@ced.com', 'teacher');

  -- Profesor 2
  uid := gen_random_uuid();
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'profesor2@ced.com', crypt('test123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
  INSERT INTO profiles (id, nombre, email, role) VALUES (uid, 'Profesor 2', 'profesor2@ced.com', 'teacher');

  -- Profesor 3
  uid := gen_random_uuid();
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'profesor3@ced.com', crypt('test123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
  INSERT INTO profiles (id, nombre, email, role) VALUES (uid, 'Profesor 3', 'profesor3@ced.com', 'teacher');

  -- Profesor 4
  uid := gen_random_uuid();
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'profesor4@ced.com', crypt('test123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
  INSERT INTO profiles (id, nombre, email, role) VALUES (uid, 'Profesor 4', 'profesor4@ced.com', 'teacher');

  -- Profesor 5
  uid := gen_random_uuid();
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'profesor5@ced.com', crypt('test123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
  INSERT INTO profiles (id, nombre, email, role) VALUES (uid, 'Profesor 5', 'profesor5@ced.com', 'teacher');

  -- Profesor 6
  uid := gen_random_uuid();
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'profesor6@ced.com', crypt('test123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
  INSERT INTO profiles (id, nombre, email, role) VALUES (uid, 'Profesor 6', 'profesor6@ced.com', 'teacher');

  -- Padre 1
  uid := gen_random_uuid();
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'padre1@ced.com', crypt('test123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
  INSERT INTO profiles (id, nombre, email, role) VALUES (uid, 'Carlos Mendoza', 'padre1@ced.com', 'parent');

  -- Padre 2
  uid := gen_random_uuid();
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'padre2@ced.com', crypt('test123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
  INSERT INTO profiles (id, nombre, email, role) VALUES (uid, 'María López', 'padre2@ced.com', 'parent');
END $$;
