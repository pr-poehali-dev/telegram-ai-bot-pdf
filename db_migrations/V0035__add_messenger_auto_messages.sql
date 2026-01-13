-- Создаём таблицу для настроек автосообщений по мессенджерам
CREATE TABLE IF NOT EXISTS t_p56134400_telegram_ai_bot_pdf.messenger_auto_messages (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    messenger_type VARCHAR(50) NOT NULL, -- telegram, whatsapp, vk, max, widget
    enabled BOOLEAN DEFAULT FALSE,
    delay_seconds INTEGER DEFAULT 30,
    message_text TEXT DEFAULT 'Могу помочь с выбором? 😊',
    repeat_enabled BOOLEAN DEFAULT TRUE,
    repeat_delay_seconds INTEGER DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, messenger_type)
);

COMMENT ON TABLE t_p56134400_telegram_ai_bot_pdf.messenger_auto_messages IS 'Настройки автосообщений для каждого мессенджера отдельно';
COMMENT ON COLUMN t_p56134400_telegram_ai_bot_pdf.messenger_auto_messages.messenger_type IS 'Тип мессенджера: telegram, whatsapp, vk, max, widget';
COMMENT ON COLUMN t_p56134400_telegram_ai_bot_pdf.messenger_auto_messages.enabled IS 'Включены ли автосообщения для этого мессенджера';
COMMENT ON COLUMN t_p56134400_telegram_ai_bot_pdf.messenger_auto_messages.delay_seconds IS 'Задержка первого автосообщения (секунды)';
COMMENT ON COLUMN t_p56134400_telegram_ai_bot_pdf.messenger_auto_messages.message_text IS 'Текст автосообщения для этого мессенджера';
COMMENT ON COLUMN t_p56134400_telegram_ai_bot_pdf.messenger_auto_messages.repeat_enabled IS 'Повторять ли автосообщения';
COMMENT ON COLUMN t_p56134400_telegram_ai_bot_pdf.messenger_auto_messages.repeat_delay_seconds IS 'Интервал повторных автосообщений (секунды)';

-- Мигрируем существующие глобальные настройки в messenger_auto_messages для виджета
INSERT INTO t_p56134400_telegram_ai_bot_pdf.messenger_auto_messages 
    (tenant_id, messenger_type, enabled, delay_seconds, message_text, repeat_enabled, repeat_delay_seconds)
SELECT 
    tenant_id,
    'widget' as messenger_type,
    COALESCE(auto_message_enabled, FALSE),
    COALESCE(auto_message_delay_seconds, 30),
    COALESCE(auto_message_text, 'Могу помочь с выбором? 😊'),
    COALESCE(auto_message_repeat, TRUE),
    COALESCE(auto_message_repeat_delay_seconds, 60)
FROM t_p56134400_telegram_ai_bot_pdf.tenant_settings
WHERE auto_message_enabled IS NOT NULL
ON CONFLICT (tenant_id, messenger_type) DO NOTHING;