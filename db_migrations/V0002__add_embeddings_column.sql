-- Добавляем колонку для векторных эмбеддингов как текст в JSON формате
-- Это обходной путь без pgvector extension
ALTER TABLE t_p56134400_telegram_ai_bot_pdf.document_chunks 
ADD COLUMN IF NOT EXISTS embedding_text TEXT;

-- Добавляем индекс на document_id для быстрого удаления по документу
CREATE INDEX IF NOT EXISTS document_chunks_document_id_idx 
ON t_p56134400_telegram_ai_bot_pdf.document_chunks(document_id);
