-- Обновляем тарифы согласно новым условиям

UPDATE t_p56134400_telegram_ai_bot_pdf.tariff_plans
SET 
  name = 'Старт',
  price = 9975.00,
  renewal_price = 2000.00,
  setup_fee = 0,
  features = jsonb_build_array(
    'Web-чат для сайта',
    'До 10 PDF документов',
    'Без интеграции мессенджеров',
    'Свой API ключ YandexGPT/OpenAI',
    'Базовые настройки AI (по умолчанию)',
    'Email поддержка'
  )
WHERE id = 'basic';

UPDATE t_p56134400_telegram_ai_bot_pdf.tariff_plans
SET 
  name = 'Бизнес',
  price = 19990.00,
  renewal_price = 5000.00,
  setup_fee = 0,
  features = jsonb_build_array(
    'Всё из тарифа Старт',
    'Интеграция с Telegram',
    'До 25 PDF документов',
    'Полные настройки AI моделей',
    'Статистика и аналитика',
    'Приоритетная поддержка'
  )
WHERE id = 'professional';

UPDATE t_p56134400_telegram_ai_bot_pdf.tariff_plans
SET 
  name = 'Премиум',
  price = 49990.00,
  renewal_price = 15000.00,
  setup_fee = 0,
  features = jsonb_build_array(
    'Всё из тарифа Бизнес',
    'Интеграция WhatsApp, VK, MAX (опционально)',
    'Безлимитное количество PDF',
    'Настройка и доработка нашими специалистами',
    'Личный менеджер проекта',
    'Кастомизация под ваши задачи',
    'SLA 99.9% uptime'
  ),
  is_popular = true
WHERE id = 'enterprise';