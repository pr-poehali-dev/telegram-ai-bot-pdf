import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface CreateVersionDialogProps {
  open: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (version: VersionFormData) => void;
}

export interface VersionFormData {
  version: string;
  description: string;
}

export const CreateVersionDialog = ({
  open,
  isLoading,
  onOpenChange,
  onSubmit
}: CreateVersionDialogProps) => {
  const [formData, setFormData] = useState<VersionFormData>({
    version: '',
    description: ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      version: '',
      description: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать версию мастер-шаблона</DialogTitle>
          <DialogDescription>
            Новая версия кода для обновления тенантов
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Версия (например, 1.1.0)</Label>
            <Input
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              placeholder="1.1.0"
            />
          </div>
          <div>
            <Label>Описание изменений</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Добавлены новые функции..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                  Создание...
                </>
              ) : (
                'Создать версию'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
