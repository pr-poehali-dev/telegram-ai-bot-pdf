import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { BACKEND_URLS } from './types';

interface GateLog {
  id: number;
  user_message: string;
  context_ok: boolean;
  gate_reason: string;
  query_type: string;
  lang: string;
  best_similarity: number | null;
  context_len: number;
  overlap: number | null;
  key_tokens: number | null;
  created_at: string;
}

interface GateStats {
  total: number;
  passed: number;
  failed: number;
  pass_rate: number;
  by_reason: Record<string, number>;
  by_query_type: Record<string, number>;
  by_lang: Record<string, number>;
}

const QualityGateStatsCard = () => {
  const [stats, setStats] = useState<GateStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<GateLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(BACKEND_URLS.getQualityGateStats);
      const data = await response.json();
      setStats(data.stats);
      setRecentLogs(data.recent_logs || []);
    } catch (error) {
      console.error('Error loading quality gate stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getReasonLabel = (reason: string) => {
    if (reason.startsWith('ok:')) return 'Успешно';
    if (reason.startsWith('too_short:')) return 'Контекст короткий';
    if (reason.startsWith('low_similarity:')) return 'Низкий similarity';
    if (reason.startsWith('low_overlap:')) return 'Низкий overlap';
    if (reason === 'empty_context') return 'Пустой контекст';
    if (reason === 'no_chunks') return 'Нет чанков';
    return reason;
  };

  const getQueryTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'tariffs': 'Тарифы',
      'rules': 'Правила',
      'services': 'Услуги',
      'default': 'Другое'
    };
    return labels[type] || type;
  };

  const getLangLabel = (lang: string) => {
    const labels: Record<string, string> = {
      'ru': 'Русский',
      'en': 'Английский',
      'other': 'Другой'
    };
    return labels[lang] || lang;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Icon name="Loader2" size={24} className="animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Icon name="Shield" size={20} />
          Quality Gate статистика
        </CardTitle>
        <CardDescription>
          Анализ качества контекста и причин отклонений
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Всего проверок</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700 mb-1">Успешно</p>
                <p className="text-2xl font-bold text-green-900">{stats.passed}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-red-700 mb-1">Отклонено</p>
                <p className="text-2xl font-bold text-red-900">{stats.failed}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-1">Pass Rate</p>
                <p className="text-2xl font-bold text-blue-900">{stats.pass_rate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} />
                  По причинам отклонения
                </h4>
                <div className="space-y-2">
                  {Object.entries(stats.by_reason).map(([reason, count]) => (
                    <div key={reason} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{getReasonLabel(reason)}</span>
                      <span className="font-medium text-slate-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Icon name="Tag" size={16} />
                  По типу вопроса
                </h4>
                <div className="space-y-2">
                  {Object.entries(stats.by_query_type).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{getQueryTypeLabel(type)}</span>
                      <span className="font-medium text-slate-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                  <Icon name="Globe" size={16} />
                  По языку
                </h4>
                <div className="space-y-2">
                  {Object.entries(stats.by_lang).map(([lang, count]) => (
                    <div key={lang} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{getLangLabel(lang)}</span>
                      <span className="font-medium text-slate-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
            <Icon name="Clock" size={16} />
            Последние проверки
          </h4>
          <ScrollArea className="h-[400px] border rounded-lg">
            <div className="divide-y">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {log.context_ok ? (
                        <Icon name="CheckCircle" size={16} className="text-green-600" />
                      ) : (
                        <Icon name="XCircle" size={16} className="text-red-600" />
                      )}
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(log.created_at).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                        {getQueryTypeLabel(log.query_type)}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                        {getLangLabel(log.lang)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-900 mb-2 line-clamp-2">
                    {log.user_message}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Icon name="BarChart" size={12} />
                      Sim: {log.best_similarity?.toFixed(2) || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="FileText" size={12} />
                      Len: {log.context_len}
                    </span>
                    {log.overlap !== null && (
                      <span className="flex items-center gap-1">
                        <Icon name="Target" size={12} />
                        Overlap: {(log.overlap * 100).toFixed(0)}%
                      </span>
                    )}
                    {log.key_tokens !== null && (
                      <span className="flex items-center gap-1">
                        <Icon name="Hash" size={12} />
                        Tokens: {log.key_tokens}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {getReasonLabel(log.gate_reason)}
                  </p>
                </div>
              ))}
              {recentLogs.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-30" />
                  <p>Нет данных о проверках</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityGateStatsCard;
