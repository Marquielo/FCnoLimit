// Script para limpiar usuarios y tokens de prueba
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function cleanupTestUsers() {
  console.log('🧹 === LIMPIEZA DE USUARIOS DE PRUEBA ===\n');

  try {
    // 1. Buscar usuarios de prueba
    console.log('1️⃣ Buscando usuarios de prueba...');
    const testUsers = await pool.query(
      'SELECT id, nombre_completo, correo, creado_en FROM "fcnolimit".usuarios WHERE correo LIKE $1',
      ['%@fcnolimit.test%']
    );

    console.log(`   📊 Encontrados: ${testUsers.rows.length} usuarios de prueba`);

    if (testUsers.rows.length === 0) {
      console.log('   ✅ No hay usuarios de prueba para limpiar');
      return;
    }

    // Mostrar usuarios encontrados
    testUsers.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ID: ${user.id}, Email: ${user.correo}, Creado: ${user.creado_en}`);
    });

    // 2. Limpiar tokens de refresh de usuarios de prueba
    console.log('\n2️⃣ Limpiando refresh tokens de usuarios de prueba...');
    const userIds = testUsers.rows.map(u => u.id);
    
    const deletedTokens = await pool.query(
      'DELETE FROM "fcnolimit".refresh_tokens WHERE user_id = ANY($1) RETURNING id',
      [userIds]
    );

    console.log(`   🗑️ Tokens eliminados: ${deletedTokens.rows.length}`);

    // 3. Eliminar usuarios de prueba
    console.log('\n3️⃣ Eliminando usuarios de prueba...');
    const deletedUsers = await pool.query(
      'DELETE FROM "fcnolimit".usuarios WHERE correo LIKE $1 RETURNING id, correo',
      ['%@fcnolimit.test%']
    );

    console.log(`   🗑️ Usuarios eliminados: ${deletedUsers.rows.length}`);

    deletedUsers.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ID: ${user.id}, Email: ${user.correo}`);
    });

    console.log('\n✅ Limpieza completada exitosamente');

  } catch (error) {
    console.error('\n❌ Error durante la limpieza:', error.message);
  } finally {
    await pool.end();
  }
}

async function showCurrentStats() {
  console.log('\n📊 === ESTADÍSTICAS ACTUALES ===');

  try {
    // Usuarios totales
    const totalUsers = await pool.query('SELECT COUNT(*) as total FROM "fcnolimit".usuarios');
    console.log(`👥 Total usuarios: ${totalUsers.rows[0].total}`);

    // Usuarios de prueba
    const testUsers = await pool.query('SELECT COUNT(*) as total FROM "fcnolimit".usuarios WHERE correo LIKE $1', ['%@fcnolimit.test%']);
    console.log(`🧪 Usuarios de prueba: ${testUsers.rows[0].total}`);

    // Refresh tokens totales
    const totalTokens = await pool.query('SELECT COUNT(*) as total FROM "fcnolimit".refresh_tokens');
    console.log(`🔑 Total refresh tokens: ${totalTokens.rows[0].total}`);

    // Refresh tokens activos
    const activeTokens = await pool.query('SELECT COUNT(*) as total FROM "fcnolimit".refresh_tokens WHERE is_revoked = false AND expires_at > NOW()');
    console.log(`✅ Tokens activos: ${activeTokens.rows[0].total}`);

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error.message);
  }
}

// Función principal
async function main() {
  await showCurrentStats();
  
  console.log('\n❓ ¿Quieres limpiar usuarios de prueba? (Ctrl+C para cancelar)');
  console.log('Esperando 5 segundos...');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await cleanupTestUsers();
  await showCurrentStats();
}

// Ejecutar
main().catch(console.error);
