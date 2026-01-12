import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

const RagDebugInfoCard = () => {
  return (
    <Card className="shadow-xl border-blue-200">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <Icon name="Bug" size={20} />
          RAG Debug Mode
        </CardTitle>
        <CardDescription>
          Режим отладки для анализа качества RAG-ответов
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <Icon name="Info" size={16} className="text-blue-600" />
          <AlertDescription className="text-sm text-blue-900 ml-6">
            Debug-режим логирует все проверки quality gate в JSON-формате для детального анализа работы RAG-системы
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-slate-900 flex items-center gap-2">
              <Icon name="Settings" size={16} />
              Как включить Debug Mode
            </h4>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
              <li>
                Откройте{' '}
                <a
                  href="https://console.yandex.cloud/folders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Yandex Cloud Console
                </a>
              </li>
              <li>Перейдите в Serverless → Cloud Functions</li>
              <li>Найдите функцию <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">chat</code></li>
              <li>Откройте вкладку "Параметры"</li>
              <li>
                В разделе "Переменные окружения" добавьте:
                <div className="bg-slate-800 text-slate-100 rounded mt-2 p-3 font-mono text-xs">
                  RAG_DEBUG=true
                </div>
              </li>
              <li>Нажмите "Сохранить"</li>
            </ol>
          </div>

          <div className="bg-green-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-green-900 flex items-center gap-2">
              <Icon name="CheckCircle" size={16} />
              Что логируется
            </h4>
            <ul className="space-y-1 text-sm text-green-800 list-disc list-inside">
              <li>Request ID и хеш запроса (без ПДн)</li>
              <li>Попытки retrieval (attempt 1 с top_k=3, attempt 2 с top_k=5)</li>
              <li>Результат quality gate (ok/failed + причина)</li>
              <li>Метрики: similarity, overlap, context_len, lang, query_type</li>
              <li>Адаптивная метрика overlap_rate (скользящее окно)</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-amber-900 flex items-center gap-2">
              <Icon name="Zap" size={16} />
              Авто-повышение top_k
            </h4>
            <p className="text-sm text-amber-800">
              Система автоматически повторяет retrieval с <strong>top_k=5</strong> при низком overlap,
              и переходит на старт с top_k=5 когда доля low_overlap превышает 25% за последние 50 запросов.
            </p>
          </div>

          <div className="border-t pt-4 space-y-2">
            <h4 className="font-medium text-slate-900 flex items-center gap-2">
              <Icon name="Terminal" size={16} />
              Дополнительные параметры (опционально)
            </h4>
            <div className="bg-slate-800 text-slate-100 rounded p-3 font-mono text-xs space-y-1">
              <div>RAG_TOPK_DEFAULT=3 <span className="text-slate-400"># Стартовый top_k</span></div>
              <div>RAG_TOPK_FALLBACK=5 <span className="text-slate-400"># Fallback при low_overlap</span></div>
              <div>RAG_LOW_OVERLAP_WINDOW=50 <span className="text-slate-400"># Размер окна метрики</span></div>
              <div>RAG_LOW_OVERLAP_THRESHOLD=0.25 <span className="text-slate-400"># Порог для top_k=5 (25%)</span></div>
              <div>RAG_LOW_OVERLAP_START_TOPK5=true <span className="text-slate-400"># Адаптивный старт</span></div>
            </div>
          </div>

          <Alert className="bg-slate-50 border-slate-200">
            <Icon name="Shield" size={16} className="text-slate-600" />
            <AlertDescription className="text-sm text-slate-700 ml-6">
              Debug-логи не попадают пользователю и не содержат персональных данных.
              Статистика доступна в разделе "Quality Gate статистика" выше.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default RagDebugInfoCard;
