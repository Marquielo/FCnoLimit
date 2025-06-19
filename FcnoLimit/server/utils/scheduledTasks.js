const { cleanExpiredTokens } = require('../utils/refreshTokens');

// ==========================================
// TAREAS PROGRAMADAS PARA MANTENIMIENTO
// ==========================================

/**
 * Configura y ejecuta tareas de mantenimiento automático
 * @param {Object} pool - Pool de conexiones PostgreSQL
 */
function setupScheduledTasks(pool) {
  console.log('⏰ Configurando tareas programadas...');

  // ==========================================
  // LIMPIEZA DE TOKENS EXPIRADOS
  // ==========================================
  
  // Ejecutar limpieza cada 6 horas
  const CLEANUP_INTERVAL = 6 * 60 * 60 * 1000; // 6 horas en ms
  
  const cleanupTask = setInterval(async () => {
    try {
      console.log('🧹 Iniciando limpieza automática de tokens expirados...');
      const cleaned = await cleanExpiredTokens(pool);
      
      if (cleaned > 0) {
        console.log(`✅ Limpieza completada: ${cleaned} tokens eliminados`);
      } else {
        console.log('✅ Limpieza completada: no hay tokens para eliminar');
      }
      
    } catch (error) {
      console.error('❌ Error en limpieza automática:', error.message);
    }
  }, CLEANUP_INTERVAL);

  // ==========================================
  // ESTADÍSTICAS DE SISTEMA
  // ==========================================
  
  // Mostrar estadísticas cada 24 horas
  const STATS_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas
  
  const statsTask = setInterval(async () => {
    try {
      console.log('📊 Generando estadísticas del sistema...');
      
      // Estadísticas de tokens
      const tokenStats = await pool.query(`
        SELECT 
          COUNT(*) as total_tokens,
          COUNT(*) FILTER (WHERE is_revoked = FALSE AND expires_at > NOW()) as active_tokens,
          COUNT(*) FILTER (WHERE is_revoked = TRUE) as revoked_tokens,
          COUNT(DISTINCT user_id) as unique_users_with_tokens
        FROM "fcnolimit".refresh_tokens
      `);
      
      // Estadísticas de usuarios
      const userStats = await pool.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as new_users_this_week,
          COUNT(*) FILTER (WHERE rol = 'administrador') as admins,
          COUNT(*) FILTER (WHERE rol = 'entrenador') as coaches,
          COUNT(*) FILTER (WHERE rol = 'jugador') as players
        FROM "fcnolimit".usuarios
      `);
      
      const tokens = tokenStats.rows[0];
      const users = userStats.rows[0];
      
      console.log('📈 === ESTADÍSTICAS DEL SISTEMA ===');
      console.log(`👥 Usuarios: ${users.total_users} total, ${users.new_users_this_week} nuevos esta semana`);
      console.log(`🔑 Tokens: ${tokens.active_tokens} activos, ${tokens.revoked_tokens} revocados`);
      console.log(`👤 Roles: ${users.admins} admins, ${users.coaches} entrenadores, ${users.players} jugadores`);
      console.log('=======================================');
      
    } catch (error) {
      console.error('❌ Error generando estadísticas:', error.message);
    }
  }, STATS_INTERVAL);

  // ==========================================
  // VERIFICACIÓN DE SALUD DE LA BASE DE DATOS
  // ==========================================
  
  // Verificar salud cada 30 minutos
  const HEALTH_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutos
  
  const healthCheckTask = setInterval(async () => {
    try {
      const start = Date.now();
      await pool.query('SELECT NOW()');
      const duration = Date.now() - start;
      
      if (duration > 5000) { // Si tarda más de 5 segundos
        console.warn(`⚠️ Base de datos lenta: ${duration}ms para responder`);
      }
      
      // Verificar número de conexiones activas
      const connections = await pool.query(
        'SELECT count(*) as active_connections FROM pg_stat_activity WHERE datname = current_database()'
      );
      
      const activeConnections = parseInt(connections.rows[0].active_connections);
      const maxConnections = pool.options.max || 20;
      
      if (activeConnections > maxConnections * 0.8) { // Más del 80% del pool
        console.warn(`⚠️ Pool de conexiones alto: ${activeConnections}/${maxConnections}`);
      }
      
    } catch (error) {
      console.error('❌ Error en verificación de salud:', error.message);
    }
  }, HEALTH_CHECK_INTERVAL);

  // ==========================================
  // LIMPIEZA AL CERRAR LA APLICACIÓN
  // ==========================================
  
  const cleanup = () => {
    console.log('🛑 Deteniendo tareas programadas...');
    clearInterval(cleanupTask);
    clearInterval(statsTask);
    clearInterval(healthCheckTask);
    console.log('✅ Tareas programadas detenidas');
  };

  // Registrar cleanup para shutdown graceful
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
  
  console.log('✅ Tareas programadas configuradas exitosamente');
  console.log(`🧹 Limpieza de tokens: cada ${CLEANUP_INTERVAL / (60 * 60 * 1000)} horas`);
  console.log(`📊 Estadísticas: cada ${STATS_INTERVAL / (60 * 60 * 1000)} horas`);
  console.log(`💓 Health check: cada ${HEALTH_CHECK_INTERVAL / (60 * 1000)} minutos`);

  // Ejecutar limpieza inicial al arrancar
  setTimeout(async () => {
    try {
      console.log('🧹 Ejecutando limpieza inicial...');
      const cleaned = await cleanExpiredTokens(pool);
      console.log(`✅ Limpieza inicial: ${cleaned} tokens eliminados`);
    } catch (error) {
      console.error('❌ Error en limpieza inicial:', error.message);
    }
  }, 5000); // Esperar 5 segundos después del arranque

  return {
    cleanup,
    intervals: {
      cleanupTask,
      statsTask,
      healthCheckTask
    }
  };
}

module.exports = {
  setupScheduledTasks
};
