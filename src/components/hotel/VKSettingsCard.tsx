import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface VKSettingsCardProps {
  webhookUrl: string;
  chatFunctionUrl: string;
}

const VKSettingsCard = ({ webhookUrl, chatFunctionUrl }: VKSettingsCardProps) => {
  const [groupToken, setGroupToken] = useState('');
  const [groupId, setGroupId] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'not_set' | 'active' | 'error'>('not_set');
  const { toast } = useToast();

  const handleSetupBot = async () => {
    if (!groupToken.trim() || !groupId.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните токен и ID группы',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://api.vk.com/method/groups.getById?group_id=${groupId}&access_token=${groupToken}&v=5.131`);
      const data = await response.json();

      if (data.response && data.response.length > 0) {
        setWebhookStatus('active');
        toast({
          title: 'Успешно!',
          description: 'VK-бот подключен и готов к работе'
        });
      } else {
        throw new Error(data.error?.error_msg || 'Ошибка проверки токена');
      }
    } catch (error: any) {
      setWebhookStatus('error');
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось настроить VK бота',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Icon name="Send" size={20} />
          VK-бот
        </CardTitle>
        <CardDescription>Подключите бота для работы через ВКонтакте</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Токен группы
          </label>
          <Input
            type="password"
            value={groupToken}
            onChange={(e) => setGroupToken(e.target.value)}
            placeholder="vk1.a.xxxxxxxx..."
            className="font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">
            Получите токен в разделе "Настройки → Работа с API" вашей группы VK
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            ID группы
          </label>
          <Input
            type="text"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            placeholder="123456789"
            className="font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">
            Укажите без знака минус (только цифры)
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Секретный ключ (опционально)
          </label>
          <Input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="secret_key_123"
            className="font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">
            Секретный ключ из настроек Callback API группы
          </p>
        </div>

        <Button
          onClick={handleSetupBot}
          disabled={isLoading || !groupToken.trim() || !groupId.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              Подключение...
            </>
          ) : (
            <>
              <Icon name="Link" size={16} className="mr-2" />
              Подключить бота
            </>
          )}
        </Button>

        {webhookStatus !== 'not_set' && (
          <div className={`p-4 rounded-lg ${
            webhookStatus === 'active' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              <Icon 
                name={webhookStatus === 'active' ? 'CheckCircle' : 'XCircle'} 
                size={18} 
                className={webhookStatus === 'active' ? 'text-green-600' : 'text-red-600'} 
              />
              <div className="flex-1">
                <p className={`font-medium text-sm ${
                  webhookStatus === 'active' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {webhookStatus === 'active' ? 'Бот активен' : 'Ошибка подключения'}
                </p>
                <p className={`text-xs mt-1 ${
                  webhookStatus === 'active' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {webhookStatus === 'active' 
                    ? 'Бот готов принимать сообщения' 
                    : 'Проверьте токен и ID группы'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-slate-700 mb-1">Callback API URL:</p>
            <code className="text-xs text-slate-600 break-all">{webhookUrl}</code>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Как подключить:</p>
              <ol className="text-blue-800 mt-2 space-y-1 list-decimal list-inside">
                <li>Создайте группу ВКонтакте или используйте существующую</li>
                <li>Получите токен в разделе "Работа с API"</li>
                <li>Включите "Callback API" в настройках сообщений</li>
                <li>Укажите Callback API URL выше</li>
                <li>Нажмите "Подключить бота"</li>
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VKSettingsCard;
