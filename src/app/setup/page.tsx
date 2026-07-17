'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createAdminClient } from '@/lib/supabase/admin'

export default function SetupPage() {
  const [checks, setChecks] = useState<{ table: string; exists: boolean | null }[]>([
    { table: 'grupos', exists: null },
    { table: 'campos_formativos', exists: null },
    { table: 'asignaciones_profesores', exists: null },
  ])
  const [sqlCopied, setSqlCopied] = useState(false)

  useEffect(() => {
    const admin = createAdminClient()
    checks.forEach(async (c, i) => {
      try {
        await admin.from(c.table).select('id').limit(1)
        setChecks(prev => { const n = [...prev]; n[i].exists = true; return n })
      } catch {
        setChecks(prev => { const n = [...prev]; n[i].exists = false; return n })
      }
    })
  }, [])

  const sql = `-- Copia y pega esto en el SQL Editor de Supabase:
-- https://supabase.com/dashboard/project/fcizzfdqgqyshxlltyze/sql/new

CREATE TABLE IF NOT EXISTS grupos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

INSERT INTO grupos (id, nombre) VALUES
  (1, '1°'), (2, '2°'), (3, '3°'), (4, '4°'), (5, '5°'), (6, '6°')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;

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

CREATE TABLE IF NOT EXISTS asignaciones_profesores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  grupo_id INT NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
  campo_id INT NOT NULL REFERENCES campos_formativos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(teacher_id, grupo_id, campo_id)
);

ALTER TABLE asignaciones_profesores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_grupos" ON grupos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_read_campos" ON campos_formativos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "director_manage_asignaciones" ON asignaciones_profesores
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'director'));

CREATE POLICY "teachers_view_own_asignaciones" ON asignaciones_profesores
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "teachers_view_estudiantes" ON estudiantes
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher'));

CREATE POLICY "teachers_insert_notas" ON notas_diarias
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher'));

CREATE POLICY "teachers_update_notas" ON notas_diarias
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher'));

CREATE POLICY "teachers_insert_asistencias" ON asistencias
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher'));

CREATE POLICY "teachers_update_asistencias" ON asistencias
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher'));`

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Configuración de la Base de Datos</h1>

        <Card>
          <CardHeader>
            <CardTitle>Verificación de tablas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {checks.map(c => (
              <div key={c.table} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2">
                <span className="text-sm text-[var(--text-primary)]">{c.table}</span>
                <span className={`text-sm ${c.exists === null ? 'text-yellow-400' : c.exists ? 'text-green-400' : 'text-red-400'}`}>
                  {c.exists === null ? 'Verificando...' : c.exists ? '✓ Listo' : '✗ Falta'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              1. Abre el SQL Editor de Supabase:{' '}
              <a href="https://supabase.com/dashboard/project/fcizzfdqgqyshxlltyze/sql/new" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] underline">
                Ir al SQL Editor
              </a>
            </p>
            <p className="text-sm text-[var(--text-secondary)]">2. Copia el SQL de abajo y pégalo en el editor</p>
            <p className="text-sm text-[var(--text-secondary)]">3. Haz clic en "Run" o Ctrl+Enter</p>
            <p className="text-sm text-[var(--text-secondary)]">4. Vuelve a esta página y recarga para verificar</p>

            <textarea
              readOnly
              value={sql}
              rows={20}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-xs font-mono text-[var(--text-primary)]"
            />

            <button
              onClick={() => { navigator.clipboard.writeText(sql); setSqlCopied(true); setTimeout(() => setSqlCopied(false), 2000) }}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--gradient)' }}
            >
              {sqlCopied ? '✓ Copiado' : 'Copiar SQL'}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
