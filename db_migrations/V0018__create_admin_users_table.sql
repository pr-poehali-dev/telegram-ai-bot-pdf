-- Таблица администраторов с ролями и привязкой к парам
CREATE TABLE IF NOT EXISTS t_p56134400_telegram_ai_bot_pdf.admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'tenant_admin')),
    tenant_id INTEGER REFERENCES t_p56134400_telegram_ai_bot_pdf.tenants(id),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    
    -- Супер-админ не привязан к tenant_id, мини-админ обязательно привязан
    CONSTRAINT check_tenant_role CHECK (
        (role = 'super_admin' AND tenant_id IS NULL) OR 
        (role = 'tenant_admin' AND tenant_id IS NOT NULL)
    )
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON t_p56134400_telegram_ai_bot_pdf.admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_tenant_id ON t_p56134400_telegram_ai_bot_pdf.admin_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON t_p56134400_telegram_ai_bot_pdf.admin_users(role);

-- Создаём супер-админа (пароль: admin123, будет использован хеш из ADMIN_PASSWORD)
INSERT INTO t_p56134400_telegram_ai_bot_pdf.admin_users 
(username, password_hash, role, email) 
VALUES 
('superadmin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'super_admin', 'admin@system.local')
ON CONFLICT (username) DO NOTHING;

-- Создаём мини-админа для default tenant (пароль: hotel123)
INSERT INTO t_p56134400_telegram_ai_bot_pdf.admin_users 
(username, password_hash, role, tenant_id, email) 
VALUES 
('hotel_admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'tenant_admin', 1, 'admin@hotel.local')
ON CONFLICT (username) DO NOTHING;

COMMENT ON TABLE t_p56134400_telegram_ai_bot_pdf.admin_users IS 'Администраторы системы: супер-админы (доступ ко всем парам) и мини-админы (доступ к своей паре)';
COMMENT ON COLUMN t_p56134400_telegram_ai_bot_pdf.admin_users.role IS 'super_admin - полный доступ, tenant_admin - доступ только к своей паре';
COMMENT ON COLUMN t_p56134400_telegram_ai_bot_pdf.admin_users.tenant_id IS 'NULL для супер-админа, обязателен для tenant_admin';