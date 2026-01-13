-- Добавляем поля стоимости продления подписки в тарифы
ALTER TABLE t_p56134400_telegram_ai_bot_pdf.tariff_plans
ADD COLUMN IF NOT EXISTS renewal_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS setup_fee DECIMAL(10, 2) DEFAULT 0;

-- Обновляем существующие тарифы (renewal_price = 70% от начальной цены)
UPDATE t_p56134400_telegram_ai_bot_pdf.tariff_plans
SET renewal_price = price * 0.7,
    setup_fee = price * 0.3
WHERE renewal_price IS NULL;

-- Комментарии
COMMENT ON COLUMN t_p56134400_telegram_ai_bot_pdf.tariff_plans.renewal_price IS 'Цена продления подписки (без учета setup fee)';
COMMENT ON COLUMN t_p56134400_telegram_ai_bot_pdf.tariff_plans.setup_fee IS 'Единоразовая плата за создание бота (входит в первый платеж)';
