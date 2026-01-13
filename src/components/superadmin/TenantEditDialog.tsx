import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tenant, Tariff } from './types';

interface TenantEditDialogProps {
  tenant: Tenant | null;
  tariffs: Tariff[];
  onClose: () => void;
  onSave: () => void;
  onUpdate: (tenant: Tenant) => void;
}

export const TenantEditDialog = ({ tenant, tariffs, onClose, onSave, onUpdate }: TenantEditDialogProps) => {
  if (!tenant) return null;

  return (
    <Dialog open={!!tenant} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Управление клиентом</DialogTitle>
          <DialogDescription>
            Редактирование настроек для {tenant.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Название</Label>
            <Input value={tenant.name} disabled className="bg-slate-50" />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={tenant.slug} disabled className="bg-slate-50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tariff">Тариф</Label>
            <Select 
              value={tenant.tariff_id} 
              onValueChange={(value) => onUpdate({...tenant, tariff_id: value})}
            >
              <SelectTrigger id="tariff">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tariffs.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subscription">Подписка до</Label>
            <Input 
              id="subscription"
              type="date" 
              value={tenant.subscription_end_date?.split('T')[0] || ''}
              onChange={(e) => onUpdate({...tenant, subscription_end_date: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Документов</div>
              <div className="text-2xl font-semibold">{tenant.documents_count}</div>
            </Card>
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Админов</div>
              <div className="text-2xl font-semibold">{tenant.admins_count}</div>
            </Card>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={onSave}>
            Сохранить изменения
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
