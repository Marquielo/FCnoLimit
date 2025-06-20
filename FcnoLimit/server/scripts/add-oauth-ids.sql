-- Script para agregar google_id a tabla usuarios
-- Esto permitirá multiple OAuth providers (Google, Apple, Facebook)

-- 1. Agregar columna google_id
ALTER TABLE "fcnolimit".usuarios 
ADD COLUMN google_id VARCHAR(255);

-- 2. Agregar índice para búsquedas rápidas
CREATE INDEX idx_usuarios_google_id ON "fcnolimit".usuarios(google_id);

-- 3. Preparar para futuros OAuth providers
ALTER TABLE "fcnolimit".usuarios 
ADD COLUMN apple_id VARCHAR(255),
ADD COLUMN facebook_id VARCHAR(255);

-- 4. Índices para los nuevos providers
CREATE INDEX idx_usuarios_apple_id ON "fcnolimit".usuarios(apple_id);
CREATE INDEX idx_usuarios_facebook_id ON "fcnolimit".usuarios(facebook_id);

-- 5. Verificar cambios
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'fcnolimit' 
  AND table_name = 'usuarios' 
  AND column_name IN ('google_id', 'apple_id', 'facebook_id');
