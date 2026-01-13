import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface Tenant {
  id: number;
  slug: string;
  name: string;
  description: string;
  owner_email: string;
  template_version: string;
  status: string;
  doc_count: number;
  message_count: number;
  auto_update: boolean;
}

interface TenantsListTableProps {
  tenants: Tenant[];
  onUpdate?: () => void;
}

const TenantsListTable = ({ tenants, onUpdate }: TenantsListTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [editedSlug, setEditedSlug] = useState('');
  const [editedName, setEditedName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setEditedSlug(tenant.slug);
    setEditedName(tenant.name);
  };

  const handleSaveEdit = async () => {
    if (!editingTenant) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/2163d682-19a2-462b-b577-7f04219cc3c8', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTenant.id,
          slug: editedSlug,
          name: editedName
        })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Тенант обновлен' });
        setEditingTenant(null);
        onUpdate?.();
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Список тенантов</CardTitle>
        <CardDescription>Все созданные пары админка+чат</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {(tenants || []).map((tenant) => (
              <div key={tenant.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-900">{tenant.name}</h4>
                    <p className="text-sm text-slate-600">/{tenant.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {tenant.status}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-mono">
                      {tenant.template_version}
                    </span>
                  </div>
                </div>
                {tenant.description && (
                  <p className="text-sm text-slate-600 mb-2">{tenant.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Icon name="FileText" size={12} />
                      {tenant.doc_count} документов
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MessageCircle" size={12} />
                      {tenant.message_count} сообщений
                    </span>
                    {tenant.owner_email && (
                      <span className="flex items-center gap-1">
                        <Icon name="Mail" size={12} />
                        {tenant.owner_email}
                      </span>
                    )}
                    {tenant.auto_update && (
                      <span className="flex items-center gap-1 text-orange-600">
                        <Icon name="Zap" size={12} />
                        Авто-обновление
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditClick(tenant)}
                    >
                      <Icon name="Edit" size={14} className="mr-1" />
                      Изменить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/${tenant.slug}/admin`)}
                    >
                      <Icon name="Settings" size={14} className="mr-1" />
                      Админка
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/${tenant.slug}`)}
                    >
                      <Icon name="MessageSquare" size={14} className="mr-1" />
                      Чат
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <Dialog open={!!editingTenant} onOpenChange={() => setEditingTenant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать тенант</DialogTitle>
            <DialogDescription>
              Изменение URL-адреса (slug) и названия
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Slug (URL-адрес)</label>
              <Input
                value={editedSlug}
                onChange={(e) => setEditedSlug(e.target.value)}
                placeholder="hotel-pushkin"
              />
              <p className="text-xs text-slate-500 mt-1">Будет доступен по адресу: /{editedSlug}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Название</label>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Отель Пушкин"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} disabled={isLoading || !editedSlug.trim()} className="flex-1">
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>Сохранить</>
                )}
              </Button>
              <Button variant="outline" onClick={() => setEditingTenant(null)} disabled={isLoading}>
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TenantsListTable;