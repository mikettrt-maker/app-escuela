// ALTERNATIVA: script Node.js (usa service_role key)
// 1. Obtén tu service_role key: Supabase Dashboard → Settings → API → service_role key
// 2. Crea un archivo .env.local con: SUPABASE_URL=... SUPABASE_SERVICE_KEY=...
// 3. Corre: node scripts/seed-test-users.mjs

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = process.env.SUPABASE_URL || 'https://fcizzfdqgqyshxlltyze.supabase.co'
const serviceKey = process.env.SUPABASE_SERVICE_KEY // pégala aquí o en .env.local

if (!serviceKey) {
  console.error('Error: Define SUPABASE_SERVICE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

const profes = [
  'Laura Méndez', 'Carlos Rivera', 'Ana Patricia Soto',
  'José Luis Hernández', 'María Fernanda Gil',
  'Roberto Jiménez', 'Diana Laura Cruz',
  'Fernando Medina', 'Gabriela Torres', 'Héctor Ríos',
]

const padres = [
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
  'Florencia Sotelo', 'Gabino Noriega', 'Hilda Saldaña', 'Iván Mosqueda',
]

for (const [i, nombre] of profes.entries()) {
  const email = `profe${i + 1}@test.com`
  const { data, error } = await supabase.auth.admin.createUser({
    email, password: 'test123', email_confirm: true,
    user_metadata: { nombre, role: 'teacher' },
  })
  if (error) {
    console.error(`Error profe ${email}:`, error.message)
  } else if (data?.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id, nombre, email, role: 'teacher',
    })
    console.log(`✓ Profe: ${email} -> ${nombre}`)
  }
}

for (const [i, nombre] of padres.entries()) {
  const email = `padre${i + 1}@test.com`
  const { data, error } = await supabase.auth.admin.createUser({
    email, password: 'test123', email_confirm: true,
    user_metadata: { nombre, role: 'parent' },
  })
  if (error) {
    console.error(`Error padre ${email}:`, error.message)
  } else if (data?.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id, nombre, email, role: 'parent',
    })
    console.log(`✓ Padre: ${email} -> ${nombre}`)
  }
}

console.log('\n✅ Listo! Credenciales: test123 / test123')
console.log('Profesores: profe1@test.com ... profe10@test.com')
console.log('Padres: padre1@test.com ... padre80@test.com')
