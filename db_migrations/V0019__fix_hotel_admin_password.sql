-- Исправляем хеш пароля для hotel_admin (правильный SHA256 для "hotel123")
UPDATE t_p56134400_telegram_ai_bot_pdf.admin_users
SET password_hash = '123d4918b48b3aea5ded851fadc8043b9c3e29a586d28d2b9275d4aa47d9e72b'
WHERE username = 'hotel_admin';