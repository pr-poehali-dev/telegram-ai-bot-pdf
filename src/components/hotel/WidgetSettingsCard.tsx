import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import IconPicker from './IconPicker';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URLS } from './types';

const COLOR_SCHEMES = {
  blue: {
    name: 'Синяя',
    button_color: '#3b82f6',
    button_color_end: '#1d4ed8',
    header_color: '#3b82f6',
    header_color_end: '#1d4ed8'
  },
  purple: {
    name: 'Фиолетовая',
    button_color: '#667eea',
    button_color_end: '#764ba2',
    header_color: '#667eea',
    header_color_end: '#764ba2'
  },
  green: {
    name: 'Зелёная',
    button_color: '#10b981',
    button_color_end: '#059669',
    header_color: '#10b981',
    header_color_end: '#059669'
  },
  orange: {
    name: 'Оранжевая',
    button_color: '#f97316',
    button_color_end: '#ea580c',
    header_color: '#f97316',
    header_color_end: '#ea580c'
  },
  pink: {
    name: 'Розовая',
    button_color: '#ec4899',
    button_color_end: '#db2777',
    header_color: '#ec4899',
    header_color_end: '#db2777'
  },
  dark: {
    name: 'Тёмная',
    button_color: '#1f2937',
    button_color_end: '#111827',
    header_color: '#1f2937',
    header_color_end: '#111827'
  }
};

interface WidgetSettings {
  button_color: string;
  button_color_end: string;
  button_size: number;
  button_position: string;
  button_icon: string;
  window_width: number;
  window_height: number;
  header_title: string;
  header_color: string;
  header_color_end: string;
  border_radius: number;
  show_branding: boolean;
  custom_css: string | null;
  chat_url: string | null;
}

const WidgetSettingsCard = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<WidgetSettings>({
    button_color: '#3b82f6',
    button_color_end: '#1d4ed8',
    button_size: 60,
    button_position: 'bottom-right',
    button_icon: 'MessageCircle',
    window_width: 380,
    window_height: 600,
    header_title: 'AI Ассистент',
    header_color: '#3b82f6',
    header_color_end: '#1d4ed8',
    border_radius: 16,
    show_branding: true,
    custom_css: null,
    chat_url: null
  });
  const [selectedScheme, setSelectedScheme] = useState<string>('blue');
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(BACKEND_URLS.getWidgetSettings);
      const data = await response.json();
      if (!data.button_icon) {
        data.button_icon = 'MessageCircle';
      }
      setSettings(data);
    } catch (error) {
      console.error('Error loading widget settings:', error);
    }
  };

  const applyColorScheme = (scheme: string) => {
    const colors = COLOR_SCHEMES[scheme as keyof typeof COLOR_SCHEMES];
    if (colors) {
      setSettings({
        ...settings,
        button_color: colors.button_color,
        button_color_end: colors.button_color_end,
        header_color: colors.header_color,
        header_color_end: colors.header_color_end
      });
      setSelectedScheme(scheme);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(BACKEND_URLS.updateWidgetSettings, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast({
          title: 'Настройки сохранены',
          description: 'Настройки виджета успешно обновлены'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getIconSvgPath = (iconName: string) => {
    const iconPaths: Record<string, string> = {
      'MessageCircle': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
      'MessageSquare': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
      'Mail': '<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>',
      'Phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
      'Send': '<path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path>',
      'Headphones': '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>',
      'HelpCircle': '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path>',
      'Info': '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>',
      'Sparkles': '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path>',
      'Zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
      'Heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>',
      'Star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
      'Bot': '<path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path>',
      'User': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
      'Settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle>'
    };
    return iconPaths[iconName] || iconPaths['MessageCircle'];
  };

  const generateWidgetCode = () => {
    let chatUrl = settings.chat_url;
    
    if (!chatUrl) {
      const currentDomain = window.location.hostname;
      
      if (currentDomain.startsWith('admin.')) {
        chatUrl = `${window.location.protocol}//${currentDomain.replace('admin.', '')}`;
      } else {
        chatUrl = window.location.origin;
      }
    }
    
    return `<!-- AI Bot Widget - Вставьте этот код перед закрывающим тегом </body> -->
<script>
(function() {
    var widget = document.createElement('div');
    widget.id = 'ai-bot-widget-container';
    document.body.appendChild(widget);

    var style = document.createElement('style');
    style.textContent = \`
        #ai-bot-widget-container { position: fixed; ${settings.button_position === 'bottom-right' ? 'bottom: 20px; right: 20px;' : settings.button_position === 'bottom-left' ? 'bottom: 20px; left: 20px;' : 'bottom: 20px; right: 20px;'} z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        #ai-bot-button { width: ${settings.button_size}px; height: ${settings.button_size}px; border-radius: 50%; background: linear-gradient(135deg, ${settings.button_color} 0%, ${settings.button_color_end} 100%); border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
        #ai-bot-button:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
        #ai-bot-button svg { width: ${settings.button_size * 0.45}px; height: ${settings.button_size * 0.45}px; color: white; }
        #ai-bot-chat { position: absolute; bottom: ${settings.button_size + 20}px; ${settings.button_position.includes('right') ? 'right: 0;' : 'left: 0;'} width: ${settings.window_width}px; height: ${settings.window_height}px; max-height: calc(100vh - 120px); background: white; border-radius: ${settings.border_radius}px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); display: none; flex-direction: column; overflow: hidden; animation: slideUp 0.3s ease; }
        #ai-bot-chat.open { display: flex; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        #ai-bot-header { background: linear-gradient(135deg, ${settings.header_color} 0%, ${settings.header_color_end} 100%); color: white; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; }
        #ai-bot-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
        #ai-bot-close { background: none; border: none; color: white; cursor: pointer; padding: 4px; display: flex; }
        #ai-bot-close:hover { opacity: 0.8; }
        #ai-bot-iframe { flex: 1; border: none; width: 100%; height: 100%; }
        ${settings.custom_css || ''}
        @media (max-width: 480px) {
            #ai-bot-widget-container { bottom: 10px; right: 10px; }
            #ai-bot-chat { width: calc(100vw - 20px); height: calc(100vh - 100px); bottom: ${settings.button_size + 20}px; right: -5px; }
        }
    \`;
    document.head.appendChild(style);

    widget.innerHTML = \`
        <button id="ai-bot-button" aria-label="Открыть чат">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${getIconSvgPath(settings.button_icon)}
            </svg>
        </button>
        <div id="ai-bot-chat">
            <div id="ai-bot-header">
                <h3>${settings.header_title}</h3>
                <button id="ai-bot-close" aria-label="Закрыть чат">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <iframe id="ai-bot-iframe" src="" title="AI Bot Chat"></iframe>
        </div>
    \`;

    var CHAT_URL = '${chatUrl}';
    var button = document.getElementById('ai-bot-button');
    var chat = document.getElementById('ai-bot-chat');
    var closeBtn = document.getElementById('ai-bot-close');
    var iframe = document.getElementById('ai-bot-iframe');
    var isOpen = false;

    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            chat.classList.add('open');
            if (!iframe.src) iframe.src = CHAT_URL;
        } else {
            chat.classList.remove('open');
        }
    }

    button.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) toggleChat();
    });
})();
</script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateWidgetCode());
    toast({
      title: 'Скопировано!',
      description: 'Код виджета скопирован в буфер обмена'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Code" size={20} />
              Виджет для сайта
            </CardTitle>
            <CardDescription>
              Настройте внешний вид виджета и получите код для встраивания
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowCode(!showCode)}
            variant="outline"
            size="sm"
          >
            <Icon name={showCode ? 'EyeOff' : 'Code'} size={16} className="mr-2" />
            {showCode ? 'Скрыть код' : 'Показать код'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showCode ? (
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                value={generateWidgetCode()}
                readOnly
                className="font-mono text-xs h-96"
              />
              <Button
                onClick={copyToClipboard}
                size="sm"
                className="absolute top-2 right-2"
              >
                <Icon name="Copy" size={16} className="mr-2" />
                Копировать
              </Button>
            </div>
            <p className="text-sm text-slate-600">
              Вставьте этот код перед закрывающим тегом &lt;/body&gt; на вашем сайте
            </p>
          </div>
        ) : (
          <>
            {/* Цветовая схема */}
            <div className="space-y-4 pb-6 border-b">
              <h3 className="font-semibold text-sm">Цветовая схема</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                  <button
                    key={key}
                    onClick={() => applyColorScheme(key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedScheme === key ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ background: `linear-gradient(135deg, ${scheme.button_color}, ${scheme.button_color_end})` }}
                      />
                      <span className="text-sm font-medium">{scheme.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Кнопка чата */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Кнопка чата</h3>
                
                <div className="space-y-2">
                  <Label>Иконка</Label>
                  <IconPicker
                    value={settings.button_icon}
                    onChange={(value) => setSettings({ ...settings, button_icon: value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Размер кнопки (px)</Label>
                  <Input
                    type="number"
                    value={settings.button_size}
                    onChange={(e) => setSettings({ ...settings, button_size: parseInt(e.target.value) })}
                    min={40}
                    max={80}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Позиция</Label>
                  <Select
                    value={settings.button_position}
                    onValueChange={(value) => setSettings({ ...settings, button_position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Справа внизу</SelectItem>
                      <SelectItem value="bottom-left">Слева внизу</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Окно чата */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Окно чата</h3>

                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input
                    value={settings.header_title}
                    onChange={(e) => setSettings({ ...settings, header_title: e.target.value })}
                    placeholder="AI Ассистент"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Ширина (px)</Label>
                    <Input
                      type="number"
                      value={settings.window_width}
                      onChange={(e) => setSettings({ ...settings, window_width: parseInt(e.target.value) })}
                      min={300}
                      max={600}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Высота (px)</Label>
                    <Input
                      type="number"
                      value={settings.window_height}
                      onChange={(e) => setSettings({ ...settings, window_height: parseInt(e.target.value) })}
                      min={400}
                      max={800}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Скругление углов (px)</Label>
                  <Input
                    type="number"
                    value={settings.border_radius}
                    onChange={(e) => setSettings({ ...settings, border_radius: parseInt(e.target.value) })}
                    min={0}
                    max={32}
                  />
                </div>
              </div>
            </div>

            {/* Дополнительные настройки */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm">Дополнительно</h3>

              <div className="space-y-2">
                <Label>URL чата (опционально)</Label>
                <Input
                  value={settings.chat_url || ''}
                  onChange={(e) => setSettings({ ...settings, chat_url: e.target.value || null })}
                  placeholder="https://yourdomain.com"
                />
                <p className="text-xs text-slate-500">
                  Оставьте пустым для автоопределения на основе текущего домена. Если админка на admin.domain.com, виджет будет указывать на domain.com.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label>Показывать брендинг</Label>
                <Switch
                  checked={settings.show_branding}
                  onCheckedChange={(checked) => setSettings({ ...settings, show_branding: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Пользовательский CSS</Label>
                <Textarea
                  value={settings.custom_css || ''}
                  onChange={(e) => setSettings({ ...settings, custom_css: e.target.value })}
                  placeholder="Дополнительные стили CSS..."
                  rows={4}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="border rounded-lg p-4 bg-slate-50">
              <h3 className="font-semibold text-sm mb-3">Предпросмотр</h3>
              <div className="relative h-40 bg-white rounded-lg overflow-hidden border">
                <div
                  className="absolute"
                  style={{
                    [settings.button_position.includes('right') ? 'right' : 'left']: '20px',
                    bottom: '20px'
                  }}
                >
                  <button
                    className="flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                    style={{
                      width: `${settings.button_size}px`,
                      height: `${settings.button_size}px`,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${settings.button_color} 0%, ${settings.button_color_end} 100%)`,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon name={settings.button_icon} size={settings.button_size * 0.45} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить настройки
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WidgetSettingsCard;