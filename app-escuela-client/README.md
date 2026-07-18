# CED Escuela - Cliente Web

Aplicación web estática (React + Vite) para gestión escolar con Supabase.

## Requisitos previos

1. Una cuenta en Supabase con el proyecto ya configurado
2. El proyecto de Next.js anterior ya tiene las tablas creadas

## Pasos para desplegar en GitHub Pages

### 1. Aplicar las políticas RLS

En el SQL Editor de Supabase, pega y ejecuta el contenido de:
`supabase/migration_v3_rls.sql`

### 2. Desplegar Edge Functions

En el Dashboard de Supabase:
- Ve a **Edge Functions** → **Create a new function**
- Crea 4 funciones con estos nombres:
  - `create-teacher`
  - `create-parent`
  - `delete-user`
  - `link-student`
- Cada función copia el contenido de `supabase/functions/[nombre]/index.ts`
- En **Settings** de cada función, asegúrate que las variables de entorno `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` estén configuradas (se heredan automáticamente)

### 3. Configurar GitHub Pages

**Opción A: GitHub Actions (automático)**
1. Sube este repositorio a GitHub
2. Ve a **Settings → Secrets and variables → Actions** y agrega:
   - `VITE_SUPABASE_URL` = `https://fcizzfdqgqyshxlltyze.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (el valor de tu `.env`)
   - `VITE_SUPABASE_EDGE_URL` = `https://fcizzfdqgqyshxlltyze.supabase.co/functions/v1`
3. Ve a **Settings → Pages** → Source: **GitHub Actions**
4. El workflow `.github/workflows/deploy.yml` se activará automáticamente al hacer push

**Opción B: Manual (más simple)**
```bash
npm install
npm run build
npm run deploy  # Despliega la carpeta dist/ a gh-pages
```
Luego en Settings → Pages, selecciona la rama `gh-pages` como source.

### 4. Acceder a la app

La URL será: `https://[tu-usuario].github.io/app-escuela-client/`

Inicia sesión con:
- **Director:** profra.rosy@emiliodurkheim.edu.mx / (tu contraseña)
