const dotenv = require('dotenv');
const { Pool } = require('pg');

// Cargar variables de entorno
dotenv.config();

console.log('🔍 Verificando configuración de variables de entorno...\n');

// Lista de variables requeridas
const requiredVars = [
  'DB_USER',
  'DB_HOST', 
  'DB_NAME',
  'DB_PASSWORD',
  'DB_PORT',
  'JWT_SECRET',
  'PORT'
];

// Verificar variables de entorno
console.log('📋 Variables de entorno requeridas:');
let missingVars = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName === 'DB_PASSWORD') {
      console.log(`✅ ${varName}: ****** (oculto por seguridad)`);
    } else if (varName === 'JWT_SECRET') {
      console.log(`✅ ${varName}: ****** (oculto por seguridad)`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADO`);
    missingVars.push(varName);
  }
});

console.log('\n🔗 Variables opcionales:');
const optionalVars = ['DATABASE_URL', 'CORS_ORIGIN', 'NODE_ENV'];
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName === 'DATABASE_URL') {
      console.log(`✅ ${varName}: postgresql://****** (configurado)`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`⚠️  ${varName}: No configurado (opcional)`);
  }
});

// Probar conexión a la base de datos
async function testDatabaseConnection() {
  console.log('\n🗄️ Probando conexión a PostgreSQL...');
  
  try {
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });

    const client = await pool.connect();
    const result = await client.query('SELECT NOW(), version() as version');
    client.release();
    await pool.end();

    console.log('✅ Conexión a PostgreSQL exitosa!');
    console.log(`📅 Timestamp: ${result.rows[0].now}`);
    console.log(`🏷️  Versión: ${result.rows[0].version.split(' ')[0]}`);
    
  } catch (error) {
    console.log('❌ Error al conectar a PostgreSQL:');
    console.log(`   ${error.message}`);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Sugerencia: Verifica que DB_HOST sea correcto');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 Sugerencia: Verifica DB_USER y DB_PASSWORD');
    } else if (error.message.includes('does not exist')) {
      console.log('💡 Sugerencia: Verifica que DB_NAME sea correcto');
    }
  }
}

// Generar reporte final
console.log('\n' + '='.repeat(50));
if (missingVars.length > 0) {
  console.log('❌ CONFIGURACIÓN INCOMPLETA');
  console.log(`📝 Variables faltantes: ${missingVars.join(', ')}`);
  console.log('💡 Copia .env.example a .env y configura los valores');
  process.exit(1);
} else {
  console.log('✅ TODAS LAS VARIABLES REQUERIDAS ESTÁN CONFIGURADAS');
  
  // Solo probar la conexión si todas las variables están configuradas
  testDatabaseConnection().then(() => {
    console.log('\n🎉 ¡Configuración completa y funcional!');
    process.exit(0);
  }).catch(() => {
    console.log('\n⚠️  Variables configuradas pero hay problemas de conexión');
    process.exit(1);
  });
}
