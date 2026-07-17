const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const sqlPath = path.join(__dirname, '..', 'supabase', 'migration_v2.sql')
const sql = fs.readFileSync(sqlPath, 'utf8')

const pool = new Pool({
  host: 'aws-0-us-west-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.fcizzfdqgqyshxlltyze',
  password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjaXp6ZmRxZ3F5c2h4bGx0eXplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE0MTgyNywiZXhwIjoyMDk5NzE3ODI3fQ.J4Nsjk2RfmuZA0OPMeURbICIinTBK6NTtJY4Vhy-h00',
  ssl: { rejectUnauthorized: false }
})

async function run() {
  try {
    await pool.query(sql)
    console.log('Migration OK')
  } catch (err) {
    console.error('Migration error:', err.message)
  } finally {
    await pool.end()
  }
}

run()
