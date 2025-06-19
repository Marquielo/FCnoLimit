const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function listUsers() {
  try {
    console.log('📋 === USUARIOS DISPONIBLES ===\n');
    
    const result = await pool.query('SELECT id, correo, nombre_completo, rol FROM "fcnolimit".usuarios ORDER BY id');
    
    if (result.rows.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }
    
    console.log(`✅ Encontrados ${result.rows.length} usuarios:\n`);
    
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Email: ${user.correo}`);
      console.log(`   Nombre: ${user.nombre_completo}`);
      console.log(`   Rol: ${user.rol}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error al listar usuarios:', error.message);
  } finally {
    await pool.end();
  }
}

listUsers();
