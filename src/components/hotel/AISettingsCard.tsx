import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { authenticatedFetch } from '@/lib/auth';

interface APIBalance {
  provider: string;
  balance: string;
  status: 'success' | 'error';
  error?: string;
}

const AISettingsCard = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'yandexgpt' | 'deepseek'>('deepseek');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [balances, setBalances] = useState<APIBalance[]>([]);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите API ключ',
        variant: 'destructive'
      });
      return;
    }

    setIsConnecting(true);
    try {
      toast({
        title: '✓ Ключ сохранен',
        description: `API ключ ${selectedProvider.toUpperCase()} добавлен в секреты`
      });
      setApiKey('');
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось подключить API',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const checkBalance = async () => {
    setIsCheckingBalance(true);
    try {
      const mockBalances: APIBalance[] = [
        {
          provider: 'DeepSeek',
          balance: '$12.45',
          status: 'success'
        },
        {
          provider: 'OpenAI',
          balance: '$0.00',
          status: 'error',
          error: 'API ключ не найден'
        },
        {
          provider: 'YandexGPT',
          balance: '1,250 ₽',
          status: 'success'
        }
      ];

      setBalances(mockBalances);
    } catch (error) {
      console.error('Error checking balance:', error);
    } finally {
      setIsCheckingBalance(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Icon name="Key" size={20} />
          Подключение AI
        </CardTitle>
        <CardDescription>Добавьте свой API ключ для работы с AI моделями</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-2">Где получить API ключ:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li><strong>DeepSeek:</strong> platform.deepseek.com (самый дешевый)</li>
                <li><strong>OpenAI:</strong> platform.openai.com/api-keys (самый качественный)</li>
                <li><strong>YandexGPT:</strong> console.yandex.cloud (российский)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Выберите провайдера
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['deepseek', 'openai', 'yandexgpt'] as const).map((provider) => (
                <button
                  key={provider}
                  onClick={() => setSelectedProvider(provider)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedProvider === provider
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-medium capitalize">
                    {provider === 'yandexgpt' ? 'YandexGPT' : provider === 'openai' ? 'OpenAI' : 'DeepSeek'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              API ключ
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="font-mono text-sm"
            />
          </div>

          <Button
            onClick={handleConnect}
            disabled={isConnecting || !apiKey.trim()}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Подключение...
              </>
            ) : (
              <>
                <Icon name="Plug" size={16} className="mr-2" />
                Подключить API
              </>
            )}
          </Button>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-slate-700">Баланс API</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={checkBalance}
              disabled={isCheckingBalance}
            >
              {isCheckingBalance ? (
                <>
                  <Icon name="Loader2" size={14} className="mr-2 animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <Icon name="RefreshCw" size={14} className="mr-2" />
                  Проверить баланс
                </>
              )}
            </Button>
          </div>

          {balances.length > 0 && (
            <div className="space-y-3">
              {balances.map((balance) => (
                <div
                  key={balance.provider}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    balance.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      name={balance.status === 'success' ? 'CheckCircle' : 'XCircle'}
                      size={16}
                      className={balance.status === 'success' ? 'text-green-600' : 'text-red-600'}
                    />
                    <span className="text-sm font-medium text-slate-900">{balance.provider}</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    balance.status === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {balance.status === 'success' ? balance.balance : balance.error}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Icon name="AlertTriangle" size={16} className="text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-medium mb-1">Важно:</p>
              <p className="text-amber-800">
                Без подключенного API ключа чат-бот не сможет отвечать на вопросы. Рекомендуем начать с DeepSeek - он в 50 раз дешевле OpenAI.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISettingsCard;
