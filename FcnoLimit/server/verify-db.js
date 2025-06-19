const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Verificando configuración de PostgreSQL en Render...\n');

// Configurar conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.NODE_ENV === 'production' ? { 
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false,
});

async function verifyDatabase() {
  try {
    console.log('🔌 Intentando conectar a la base de datos...');
    const client = await pool.connect();
    
    // Test básico de conexión
    console.log('✅ Conexión exitosa!');
    
    // Verificar versión de PostgreSQL
    const versionResult = await client.query('SELECT version()');
    console.log('📊 Versión PostgreSQL:', versionResult.rows[0].version.split(' ')[1]);
    
    // Verificar base de datos actual
    const dbResult = await client.query('SELECT current_database()');
    console.log('🗄️  Base de datos actual:', dbResult.rows[0].current_database);
    
    // Verificar usuario actual
    const userResult = await client.query('SELECT current_user');
    console.log('👤 Usuario actual:', userResult.rows[0].current_user);
    
    // Verificar tablas existentes
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tablas encontradas:');
    if (tablesResult.rows.length === 0) {
      console.log('⚠️  No se encontraron tablas en el esquema public');
    } else {
      tablesResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
    }
    
    // Verificar estadísticas de conexión
    const connectionsResult = await client.query(`
      SELECT count(*) as total_connections, 
             count(*) FILTER (WHERE state = 'active') as active_connections,
             count(*) FILTER (WHERE state = 'idle') as idle_connections
      FROM pg_stat_activity 
      WHERE datname = current_database()
    `);
    
    console.log('\n🔗 Estadísticas de conexión:');
    console.log(`   Total: ${connectionsResult.rows[0].total_connections}`);
    console.log(`   Activas: ${connectionsResult.rows[0].active_connections}`);
    console.log(`   Inactivas: ${connectionsResult.rows[0].idle_connections}`);
    
    client.release();
    console.log('\n🎉 ¡Verificación completada exitosamente!');
    
  } catch (error) {
    console.error('\n❌ Error durante la verificación:');
    console.error('Mensaje:', error.message);
    console.error('Código:', error.code);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Sugerencias:');
      console.error('   - Verifica que DB_HOST esté correctamente configurado');
      console.error('   - Asegúrate de que el servidor de base de datos esté en línea');
    } else if (error.code === '28P01') {
      console.error('\n💡 Sugerencias:');
      console.error('   - Verifica las credenciales (DB_USER y DB_PASSWORD)');
      console.error('   - Asegúrate de que el usuario tenga permisos de acceso');
    }
  } finally {
    await pool.end();
    console.log('\n🔚 Pool de conexiones cerrado');
  }
}

// Mostrar configuración (sin mostrar contraseñas)
console.log('⚙️  Configuración actual:');
console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`   Host: ${process.env.DB_HOST || 'desde DATABASE_URL'}`);
console.log(`   Puerto: ${process.env.DB_PORT || '5432'}`);
console.log(`   Base de datos: ${process.env.DB_NAME || 'desde DATABASE_URL'}`);
console.log(`   Usuario: ${process.env.DB_USER || 'desde DATABASE_URL'}`);
console.log(`   SSL: ${process.env.NODE_ENV === 'production' ? 'Habilitado' : 'Deshabilitado'}`);
console.log('');

verifyDatabase();
