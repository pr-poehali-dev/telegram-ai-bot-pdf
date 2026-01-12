import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URLS, AI_MODELS, DEFAULT_AI_SETTINGS, AiModelSettings } from './types';
import Icon from '@/components/ui/icon';
import { AI_PRESETS } from './AiSettingsPresets';
import AiSettingsSliders from './AiSettingsSliders';

const AiSettingsCard = () => {
  const [selectedModel, setSelectedModel] = useState<string>('yandexgpt');
  const [settings, setSettings] = useState<AiModelSettings>(DEFAULT_AI_SETTINGS.yandexgpt);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(BACKEND_URLS.getAiSettings);
      const data = await response.json();
      if (data.settings) {
        setSelectedModel(data.settings.model);
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSettings(DEFAULT_AI_SETTINGS[model as keyof typeof DEFAULT_AI_SETTINGS]);
    setSelectedPreset('');
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = AI_PRESETS[selectedModel]?.find(p => p.id === presetId);
    if (preset) {
      setSettings(preset.settings);
      toast({
        title: 'Пресет применён',
        description: preset.name
      });
    }
  };

  const handleResetToDefaults = () => {
    setSettings(DEFAULT_AI_SETTINGS[selectedModel as keyof typeof DEFAULT_AI_SETTINGS]);
    setSelectedPreset('');
    toast({
      title: 'Сброшено',
      description: 'Настройки восстановлены по умолчанию'
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(BACKEND_URLS.updateAiSettings, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Сохранено!',
          description: 'Настройки AI обновлены'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить настройки',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentDefaults = DEFAULT_AI_SETTINGS[selectedModel as keyof typeof DEFAULT_AI_SETTINGS];
  const isDefaultSettings = JSON.stringify(settings) === JSON.stringify(currentDefaults);
  const currentPresets = AI_PRESETS[selectedModel] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Brain" size={24} />
          Настройки AI
        </CardTitle>
        <CardDescription>
          Параметры языковой модели для генерации ответов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Модель</Label>
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentPresets.length > 0 && (
          <div className="space-y-2">
            <Label>Пресеты настроек</Label>
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите пресет или настройте вручную" />
              </SelectTrigger>
              <SelectContent>
                {currentPresets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{preset.name}</span>
                      <span className="text-xs text-slate-500">{preset.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPreset && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <Icon name="Info" size={16} className="inline mr-1" />
                  {currentPresets.find(p => p.id === selectedPreset)?.description}
                </p>
              </div>
            )}
          </div>
        )}

        <AiSettingsSliders
          settings={settings}
          selectedModel={selectedModel}
          onSettingsChange={(newSettings) => {
            setSettings(newSettings);
            setSelectedPreset('');
          }}
        />

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
          <Button
            onClick={handleResetToDefaults}
            variant="outline"
            disabled={isDefaultSettings}
          >
            Сбросить
          </Button>
        </div>

        {!isDefaultSettings && !selectedPreset && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <Icon name="AlertTriangle" size={16} className="inline mr-1" />
              Настройки отличаются от рекомендованных
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiSettingsCard;
