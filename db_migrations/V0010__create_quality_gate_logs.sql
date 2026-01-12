CREATE TABLE IF NOT EXISTS t_p56134400_telegram_ai_bot_pdf.quality_gate_logs (
    id SERIAL PRIMARY KEY,
    user_message TEXT NOT NULL,
    context_ok BOOLEAN NOT NULL,
    gate_reason VARCHAR(100) NOT NULL,
    query_type VARCHAR(50),
    lang VARCHAR(10),
    best_similarity DECIMAL(5,4),
    context_len INTEGER,
    overlap DECIMAL(5,4),
    key_tokens INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quality_gate_logs_created_at 
ON t_p56134400_telegram_ai_bot_pdf.quality_gate_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quality_gate_logs_context_ok 
ON t_p56134400_telegram_ai_bot_pdf.quality_gate_logs(context_ok);
