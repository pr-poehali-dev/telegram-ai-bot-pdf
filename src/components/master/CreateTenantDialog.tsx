import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface CreateTenantDialogProps {
  open: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tenant: TenantFormData) => void;
}

export interface TenantFormData {
  slug: string;
  name: string;
  description: string;
  owner_email: string;
  owner_phone: string;
  auto_update: boolean;
}

export const CreateTenantDialog = ({
  open,
  isLoading,
  onOpenChange,
  onSubmit
}: CreateTenantDialogProps) => {
  const [formData, setFormData] = useState<TenantFormData>({
    slug: '',
    name: '',
    description: '',
    owner_email: '',
    owner_phone: '',
    auto_update: false
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      slug: '',
      name: '',
      description: '',
      owner_email: '',
      owner_phone: '',
      auto_update: false
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Создать новый тенант</DialogTitle>
          <DialogDescription>
            Добавить нового клиента в систему
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Slug (уникальный идентификатор)</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="hotel-paradise"
              />
            </div>
            <div>
              <Label>Название</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Отель Paradise"
              />
            </div>
          </div>
          <div>
            <Label>Описание</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Описание отеля..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email владельца</Label>
              <Input
                type="email"
                value={formData.owner_email}
                onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                placeholder="owner@hotel.com"
              />
            </div>
            <div>
              <Label>Телефон владельца</Label>
              <Input
                value={formData.owner_phone}
                onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.auto_update}
              onCheckedChange={(checked) => setFormData({ ...formData, auto_update: checked })}
            />
            <Label>Автоматическое обновление версии</Label>
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
                'Создать'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
