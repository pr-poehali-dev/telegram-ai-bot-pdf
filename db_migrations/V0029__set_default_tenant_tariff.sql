-- Устанавливаем тариф basic для default тенанта
UPDATE t_p56134400_telegram_ai_bot_pdf.tenants
SET tariff_id = 'basic',
    subscription_end_date = NOW() + INTERVAL '365 days'
WHERE id = 1 AND tariff_id IS NULL;