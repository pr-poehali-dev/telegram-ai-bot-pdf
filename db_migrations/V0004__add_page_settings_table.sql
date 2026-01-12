CREATE TABLE IF NOT EXISTS t_p56134400_telegram_ai_bot_pdf.page_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p56134400_telegram_ai_bot_pdf.page_settings (setting_key, setting_value) VALUES
('page_title', 'Консьерж отеля'),
('page_subtitle', 'Спросите о номерах, услугах и инфраструктуре'),
('quick_questions_title', 'Быстрые вопросы'),
('contacts_title', 'Контакты'),
('contact_phone_label', 'Ресепшн'),
('contact_phone_value', '+7 (495) 123-45-67'),
('contact_email_label', 'Email'),
('contact_email_value', 'info@hotel.ru'),
('contact_address_label', 'Адрес'),
('contact_address_value', 'Москва, ул. Примерная, 1'),
('footer_text', 'Хочу такого бота!'),
('footer_link', 'https://max.im/+79787236035'),
('input_placeholder', 'Задайте вопрос...')
ON CONFLICT (setting_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS t_p56134400_telegram_ai_bot_pdf.quick_questions (
    id SERIAL PRIMARY KEY,
    text VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'HelpCircle',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p56134400_telegram_ai_bot_pdf.quick_questions (text, question, icon, sort_order) VALUES
('Номера', 'Какие номера доступны?', 'Hotel', 1),
('Услуги', 'Какие услуги предоставляет отель?', 'Sparkles', 2),
('Завтрак', 'Во сколько подают завтрак?', 'Coffee', 3),
('Бассейн', 'Есть ли бассейн?', 'Waves', 4)
ON CONFLICT DO NOTHING;