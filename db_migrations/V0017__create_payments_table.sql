CREATE TABLE IF NOT EXISTS t_p56134400_telegram_ai_bot_pdf.payments (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2),
    description TEXT,
    event_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON t_p56134400_telegram_ai_bot_pdf.payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON t_p56134400_telegram_ai_bot_pdf.payments(status);
