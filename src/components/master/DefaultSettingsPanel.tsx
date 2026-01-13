import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const BACKEND_URL = 'https://functions.poehali.dev/2163d682-19a2-462b-b577-7f04219cc3c8';
const TEST_EMAIL_URL = 'https://functions.poehali.dev/5e89e2e7-e90d-4b6f-930f-7a283f326cf5';

interface SettingValue {
  value: string;
  description: string;
  updated_at: string | null;
}

interface Settings {
  [key: string]: SettingValue;
}

const DefaultSettingsPanel = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [editedSettings, setEditedSettings] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}?action=default_settings`);
      const data = await response.json();
      setSettings(data.settings || {});
      
      const edited: { [key: string]: string } = {};
      Object.keys(data.settings || {}).forEach(key => {
        edited[key] = data.settings[key].value;
      });
      setEditedSettings(edited);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({ title: 'Ошибка', description: 'Не удалось загрузить настройки', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (settingKey: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}?action=default_settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setting_key: settingKey,
          setting_value: editedSettings[settingKey]
        })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Настройка сохранена' });
        loadSettings();
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const settingLabels: { [key: string]: string } = {
    'default_system_prompt': 'Дефолтный системный промпт',
    'email_template_welcome': 'Шаблон письма приветствия',
    'email_template_order_customer': 'Письмо клиенту после оплаты',
    'email_template_order_admin': 'Письмо администратору о новом заказе',
    'smtp_host': 'SMTP сервер',
    'smtp_port': 'SMTP порт',
    'smtp_user': 'SMTP пользователь (email)',
    'smtp_password': 'SMTP пароль приложения',
    'yookassa_shop_id': 'ЮKassa Shop ID',
    'yookassa_secret_key': 'ЮKassa Secret Key'
  };

  const settingCategories: { [key: string]: string } = {
    'default_system_prompt': 'prompts',
    'email_template_welcome': 'email_templates',
    'email_template_order_customer': 'email_templates',
    'email_template_order_admin': 'email_templates',
    'smtp_host': 'smtp',
    'smtp_port': 'smtp',
    'smtp_user': 'smtp',
    'smtp_password': 'smtp',
    'yookassa_shop_id': 'yookassa',
    'yookassa_secret_key': 'yookassa'
  };

  const isSmallInput = (key: string) => ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'yookassa_shop_id', 'yookassa_secret_key'].includes(key);

  const handleTestEmail = async (settingKey: string) => {
    if (!testEmail) {
      toast({ title: 'Ошибка', description: 'Укажите email для тестовой отправки', variant: 'destructive' });
      return;
    }

    setIsSendingTest(settingKey);
    try {
      const templateTypeMap: { [key: string]: string } = {
        'email_template_order_customer': 'order_customer',
        'email_template_order_admin': 'order_admin',
        'email_template_welcome': 'welcome'
      };

      const response = await fetch(TEST_EMAIL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_email: testEmail,
          template_html: editedSettings[settingKey] || settings[settingKey]?.value || '',
          template_type: templateTypeMap[settingKey] || 'test'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({ title: 'Успешно', description: `Тестовое письмо отправлено на ${testEmail}` });
      } else {
        throw new Error(data.error || 'Не удалось отправить');
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setIsSendingTest(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icon name="Loader2" className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Дефолтные настройки</h2>
        <p className="text-muted-foreground">
          Эти настройки будут использоваться для всех новых тенантов
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">📝 Системные промпты</h3>
        <div className="space-y-6">
          {Object.keys(settings).filter(key => settingCategories[key] === 'prompts').map(key => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{settingLabels[key] || key}</CardTitle>
                <CardDescription>{settings[key].description}</CardDescription>
                {settings[key].updated_at && (
                  <p className="text-xs text-muted-foreground">
                    Обновлено: {new Date(settings[key].updated_at).toLocaleString('ru-RU')}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={key}>Значение</Label>
                  <Textarea
                    id={key}
                    value={editedSettings[key] || ''}
                    onChange={(e) => setEditedSettings({ ...editedSettings, [key]: e.target.value })}
                    rows={key === 'default_system_prompt' ? 15 : 8}
                    className="font-mono text-sm"
                  />
                </div>
                <Button
                  onClick={() => handleSave(key)}
                  disabled={isSaving || editedSettings[key] === settings[key].value}
                >
                  {isSaving ? (
                    <>
                      <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" className="mr-2" size={16} />
                      Сохранить
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">✉️ Email шаблоны</h3>
        
        <Card className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="TestTube2" size={20} />
              Тестовая отправка
            </CardTitle>
            <CardDescription>
              Укажите email для тестовой отправки шаблонов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {Object.keys(settings).filter(key => settingCategories[key] === 'email_templates').map(key => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{settingLabels[key] || key}</CardTitle>
                <CardDescription>
                  {key === 'email_template_order_customer' && 'HTML шаблон письма, которое получает клиент после успешной оплаты. Переменные: {name}, {email}, {tariff}, {amount}, {tenant_slug}, {username}, {password}, {login_url}'}
                  {key === 'email_template_order_admin' && 'HTML шаблон письма для администратора о новом заказе. Переменные: {name}, {email}, {phone}, {tariff}, {amount}, {payment_id}, {tenant_slug}'}
                  {key === 'email_template_welcome' && settings[key].description}
                </CardDescription>
                {settings[key].updated_at && (
                  <p className="text-xs text-muted-foreground">
                    Обновлено: {new Date(settings[key].updated_at).toLocaleString('ru-RU')}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={key}>HTML шаблон</Label>
                  <Textarea
                    id={key}
                    value={editedSettings[key] || ''}
                    onChange={(e) => setEditedSettings({ ...editedSettings, [key]: e.target.value })}
                    rows={12}
                    className="font-mono text-sm"
                    placeholder="<html>...</html>"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSave(key)}
                    disabled={isSaving || editedSettings[key] === settings[key].value}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <>
                        <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Icon name="Save" className="mr-2" size={16} />
                        Сохранить
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleTestEmail(key)}
                    disabled={isSendingTest === key || !testEmail}
                    variant="outline"
                    className="flex-1"
                  >
                    {isSendingTest === key ? (
                      <>
                        <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Icon name="Send" className="mr-2" size={16} />
                        Отправить тест
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">📧 SMTP настройки</h3>
        <Card>
          <CardHeader>
            <CardTitle>Email для отправки писем</CardTitle>
            <CardDescription>
              Настройте SMTP для автоматической отправки паролей новым пользователям
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(settings).filter(key => settingCategories[key] === 'smtp').map(key => (
              <div key={key}>
                <Label htmlFor={key}>{settingLabels[key] || key}</Label>
                <Input
                  id={key}
                  type={key === 'smtp_password' ? 'password' : key === 'smtp_port' ? 'number' : 'text'}
                  value={editedSettings[key] || ''}
                  onChange={(e) => setEditedSettings({ ...editedSettings, [key]: e.target.value })}
                  placeholder={key === 'smtp_host' ? 'smtp.yandex.ru' : key === 'smtp_port' ? '465' : ''}
                  className="font-mono"
                />
              </div>
            ))}
            <Button
              onClick={() => {
                ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_password'].forEach(key => handleSave(key));
              }}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" className="mr-2" size={16} />
                  Сохранить SMTP настройки
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">💳 ЮKassa настройки</h3>
        <Card>
          <CardHeader>
            <CardTitle>Интеграция с платежной системой</CardTitle>
            <CardDescription>
              Настройте ЮKassa для приема платежей за подписку
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(settings).filter(key => settingCategories[key] === 'yookassa').map(key => (
              <div key={key}>
                <Label htmlFor={key}>{settingLabels[key] || key}</Label>
                <Input
                  id={key}
                  type={key === 'yookassa_secret_key' ? 'password' : 'text'}
                  value={editedSettings[key] || ''}
                  onChange={(e) => setEditedSettings({ ...editedSettings, [key]: e.target.value })}
                  placeholder={key === 'yookassa_shop_id' ? '123456' : 'live_xxxxx или test_xxxxx'}
                  className="font-mono"
                />
              </div>
            ))}
            <Button
              onClick={() => {
                ['yookassa_shop_id', 'yookassa_secret_key'].forEach(key => handleSave(key));
              }}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" className="mr-2" size={16} />
                  Сохранить ЮKassa настройки
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DefaultSettingsPanel;