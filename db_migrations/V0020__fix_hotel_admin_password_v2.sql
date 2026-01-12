-- Обновляем хеш пароля для hotel_admin (правильный SHA256 для "hotel123")
-- Хеш рассчитан через SHA256 от строки "hotel123"
UPDATE t_p56134400_telegram_ai_bot_pdf.admin_users
SET password_hash = '0aa6aa6a97fc2ccb4000f87bd9e93a2125582ff044a106c3418d95c04fbc7cae'
WHERE username = 'hotel_admin';