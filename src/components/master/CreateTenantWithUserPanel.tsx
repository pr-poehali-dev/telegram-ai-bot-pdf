import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const BACKEND_URL = 'https://functions.poehali.dev/2163d682-19a2-462b-b577-7f04219cc3c8';

interface NewTenant {
  slug: string;
  name: string;
  description: string;
  owner_email: string;
  owner_phone: string;
}

interface CreatedUser {
  user_id: number;
  username: string;
  password: string;
  email_sent: boolean;
}

const CreateTenantWithUserPanel = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<NewTenant>({
    slug: '',
    name: '',
    description: '',
    owner_email: '',
    owner_phone: ''
  });

  const handleCreate = async () => {
    if (!formData.slug || !formData.name || !formData.owner_email) {
      toast({ 
        title: 'Ошибка', 
        description: 'Заполните обязательные поля: slug, название и email',
        variant: 'destructive' 
      });
      return;
    }

    setIsCreating(true);
    try {
      // Шаг 1: Создаем тенант
      const tenantResponse = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!tenantResponse.ok) {
        const error = await tenantResponse.json();
        throw new Error(error.error || 'Не удалось создать тенант');
      }

      const tenantData = await tenantResponse.json();
      const tenantId = tenantData.tenant_id;

      // Шаг 2: Создаем пользователя с отправкой email
      const userResponse = await fetch(`${BACKEND_URL}?action=create_user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          email: formData.owner_email
        })
      });

      if (!userResponse.ok) {
        const error = await userResponse.json();
        throw new Error(error.error || 'Не удалось создать пользователя');
      }

      const userData = await userResponse.json();
      
      setCreatedUser({
        user_id: userData.user_id,
        username: userData.username,
        password: userData.password,
        email_sent: userData.email_sent
      });

      setShowSuccessDialog(true);
      
      // Очищаем форму
      setFormData({
        slug: '',
        name: '',
        description: '',
        owner_email: '',
        owner_phone: ''
      });

      toast({ 
        title: 'Успешно', 
        description: `Тенант и пользователь созданы. Email ${userData.email_sent ? 'отправлен' : 'не отправлен'}` 
      });

    } catch (error: any) {
      toast({ 
        title: 'Ошибка', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Скопировано', description: 'Данные скопированы в буфер обмена' });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Создать новую пару (тенант + пользователь)</CardTitle>
          <CardDescription>
            Создается тенант и пользователь-редактор контента. Email с доступами отправляется автоматически.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="hotel-pushkin"
              />
            </div>
            <div>
              <Label htmlFor="name">Название *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Отель Пушкин"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="AI-консьерж для отеля"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="owner_email">Email владельца *</Label>
              <Input
                id="owner_email"
                type="email"
                value={formData.owner_email}
                onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                placeholder="owner@example.com"
              />
            </div>
            <div>
              <Label htmlFor="owner_phone">Телефон</Label>
              <Input
                id="owner_phone"
                value={formData.owner_phone}
                onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>

          <Button onClick={handleCreate} disabled={isCreating} className="w-full">
            {isCreating ? (
              <>
                <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                Создание...
              </>
            ) : (
              <>
                <Icon name="Plus" className="mr-2" size={16} />
                Создать тенант + пользователя
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="CheckCircle" className="text-green-600" size={24} />
              Тенант и пользователь созданы
            </DialogTitle>
            <DialogDescription>
              {createdUser?.email_sent 
                ? 'Email с доступами отправлен на почту владельца'
                : 'SMTP не настроен — скопируйте данные и отправьте владельцу вручную'
              }
            </DialogDescription>
          </DialogHeader>
          {createdUser && (
            <div className="space-y-4">
              <div className="bg-slate-100 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Логин</p>
                    <p className="text-lg font-mono">{createdUser.username}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(createdUser.username)}
                  >
                    <Icon name="Copy" size={16} />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Пароль</p>
                    <p className="text-lg font-mono">{createdUser.password}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(createdUser.password)}
                  >
                    <Icon name="Copy" size={16} />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">User ID</p>
                    <p className="text-lg">{createdUser.user_id}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                ⚠️ Сохраните эти данные — пароль нигде не сохраняется и показывается только один раз
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTenantWithUserPanel;
