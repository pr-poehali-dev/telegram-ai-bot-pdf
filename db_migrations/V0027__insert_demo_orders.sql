-- Создаем 3 демо-заказа с полными данными клиентов

-- Демо-заказ 1: Тариф Старт (оплачен)
INSERT INTO t_p56134400_telegram_ai_bot_pdf.tenants 
  (slug, name, description, owner_email, owner_phone, template_version, auto_update, status, subscription_status, subscription_end_date, tariff_id, created_at, updated_at)
VALUES 
  ('demo-hotel-aurora', 'Отель Аврора', 'Бутик-отель в центре Москвы на 25 номеров', 'maria.ivanova@aurora-hotel.ru', '+79151234567', 'v1.0', true, 'active', 'active', '2026-02-13 00:00:00', 'basic', '2026-01-10 14:23:15', '2026-01-10 14:23:15');

-- Платеж для заказа 1
INSERT INTO t_p56134400_telegram_ai_bot_pdf.subscription_payments
  (tenant_id, payment_id, amount, status, tariff_id, payment_type, created_at, updated_at)
VALUES
  ((SELECT id FROM t_p56134400_telegram_ai_bot_pdf.tenants WHERE slug = 'demo-hotel-aurora'), '2e71c4a1-000f-5000-8000-0c9e2f84a7f1', 9975.00, 'succeeded', 'basic', 'initial', '2026-01-10 14:25:30', '2026-01-10 14:25:30');

-- Демо-заказ 2: Тариф Бизнес (оплачен)
INSERT INTO t_p56134400_telegram_ai_bot_pdf.tenants 
  (slug, name, description, owner_email, owner_phone, template_version, auto_update, status, subscription_status, subscription_end_date, tariff_id, created_at, updated_at)
VALUES 
  ('demo-resort-zavidovo', 'Завидово Резорт', 'Загородный комплекс с 120 номерами, спа и рестораном', 'alexey.petrov@zavidovo-resort.ru', '+79267891234', 'v1.0', true, 'active', 'active', '2026-02-11 00:00:00', 'professional', '2026-01-08 10:45:22', '2026-01-08 10:45:22');

-- Платеж для заказа 2
INSERT INTO t_p56134400_telegram_ai_bot_pdf.subscription_payments
  (tenant_id, payment_id, amount, status, tariff_id, payment_type, created_at, updated_at)
VALUES
  ((SELECT id FROM t_p56134400_telegram_ai_bot_pdf.tenants WHERE slug = 'demo-resort-zavidovo'), '2e71c4a1-000f-5000-8000-1d8b3e95b8g2', 19990.00, 'succeeded', 'professional', 'initial', '2026-01-08 10:48:45', '2026-01-08 10:48:45');

-- Демо-заказ 3: Тариф Премиум (оплачен)
INSERT INTO t_p56134400_telegram_ai_bot_pdf.tenants 
  (slug, name, description, owner_email, owner_phone, template_version, auto_update, status, subscription_status, subscription_end_date, tariff_id, created_at, updated_at)
VALUES 
  ('demo-hyatt-regency', 'Hyatt Regency Moscow', 'Пятизвездочный отель сети Hyatt на 400+ номеров', 'ekaterina.sokolova@hyatt.com', '+74951234567', 'v1.0', true, 'active', 'active', '2026-02-05 00:00:00', 'enterprise', '2026-01-05 16:12:08', '2026-01-05 16:12:08');

-- Платеж для заказа 3
INSERT INTO t_p56134400_telegram_ai_bot_pdf.subscription_payments
  (tenant_id, payment_id, amount, status, tariff_id, payment_type, created_at, updated_at)
VALUES
  ((SELECT id FROM t_p56134400_telegram_ai_bot_pdf.tenants WHERE slug = 'demo-hyatt-regency'), '2e71c4a1-000f-5000-8000-2f9c4fa6c9h3', 49990.00, 'succeeded', 'enterprise', 'initial', '2026-01-05 16:15:20', '2026-01-05 16:15:20');
