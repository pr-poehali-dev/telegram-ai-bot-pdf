import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppSettingsCardProps {
  webhookUrl: string;
  chatFunctionUrl: string;
}

const WhatsAppSettingsCard = ({ webhookUrl, chatFunctionUrl }: WhatsAppSettingsCardProps) => {
  const [accessToken, setAccessToken] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'not_set' | 'active' | 'error'>('not_set');
  const { toast } = useToast();

  const handleSetupBot = async () => {
    if (!accessToken.trim() || !verifyToken.trim() || !phoneNumberId.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        setWebhookStatus('active');
        toast({
          title: 'Успешно!',
          description: 'WhatsApp-бот подключен и готов к работе'
        });
      } else {
        throw new Error('Ошибка проверки токена');
      }
    } catch (error: any) {
      setWebhookStatus('error');
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось настроить WhatsApp',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-green-50">
        <CardTitle className="flex items-center gap-2">
          <Icon name="MessageSquare" size={20} />
          WhatsApp-бот
        </CardTitle>
        <CardDescription>Подключите бота для работы через WhatsApp Business</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Access Token
          </label>
          <Input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="EAAxxxxxxx..."
            className="font-mono text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Verify Token
          </label>
          <Input
            type="text"
            value={verifyToken}
            onChange={(e) => setVerifyToken(e.target.value)}
            placeholder="my_verify_token_123"
            className="font-mono text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">
            Придумайте любую случайную строку для верификации webhook
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Phone Number ID
          </label>
          <Input
            type="text"
            value={phoneNumberId}
            onChange={(e) => setPhoneNumberId(e.target.value)}
            placeholder="123456789012345"
            className="font-mono text-sm"
          />
        </div>

        <Button
          onClick={handleSetupBot}
          disabled={isLoading || !accessToken.trim() || !verifyToken.trim() || !phoneNumberId.trim()}
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
                    : 'Проверьте токены и попробуйте снова'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-slate-700 mb-1">Webhook URL:</p>
            <code className="text-xs text-slate-600 break-all">{webhookUrl}</code>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg text-sm space-y-2">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Как подключить:</p>
              <ol className="text-green-800 mt-2 space-y-1 list-decimal list-inside">
                <li>Зарегистрируйтесь в WhatsApp Business Platform</li>
                <li>Получите Access Token и Phone Number ID</li>
                <li>Придумайте Verify Token</li>
                <li>Укажите Webhook URL в настройках Meta App</li>
                <li>Нажмите "Подключить бота"</li>
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSettingsCard;
