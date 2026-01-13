-- Добавляем SMTP настройки в default_settings
INSERT INTO t_p56134400_telegram_ai_bot_pdf.default_settings (setting_key, setting_value, description)
VALUES 
  ('smtp_host', '', 'SMTP сервер для отправки email (например, smtp.yandex.ru)'),
  ('smtp_port', '465', 'SMTP порт (465 для SSL, 587 для TLS)'),
  ('smtp_user', '', 'Email адрес для SMTP авторизации (от кого будут письма)'),
  ('smtp_password', '', 'Пароль приложения для SMTP')
ON CONFLICT (setting_key) DO NOTHING;