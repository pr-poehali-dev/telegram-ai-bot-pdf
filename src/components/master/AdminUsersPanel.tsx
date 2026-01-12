import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { authenticatedFetch } from '@/lib/auth';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'super_admin' | 'tenant_admin';
  tenant_id: number | null;
  tenant_name?: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

const BACKEND_URL = 'https://functions.poehali.dev/c9e558c6-9e35-48fd-9948-69e7fc9ba377';

const AdminUsersPanel = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    role: 'tenant_admin' as 'super_admin' | 'tenant_admin',
    tenant_id: null as number | null
  });

  const [editPassword, setEditPassword] = useState({
    user_id: 0,
    new_password: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await authenticatedFetch(BACKEND_URL);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список администраторов',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.password) {
      toast({
        title: 'Ошибка',
        description: 'Заполните логин и пароль',
        variant: 'destructive'
      });
      return;
    }

    if (newUser.role === 'tenant_admin' && !newUser.tenant_id) {
      toast({
        title: 'Ошибка',
        description: 'Для мини-админа укажите ID пары',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authenticatedFetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Администратор создан'
        });
        setShowCreateDialog(false);
        setNewUser({
          username: '',
          password: '',
          email: '',
          role: 'tenant_admin',
          tenant_id: null
        });
        loadUsers();
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!editPassword.new_password) {
      toast({
        title: 'Ошибка',
        description: 'Введите новый пароль',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authenticatedFetch(BACKEND_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPassword)
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Пароль изменён'
        });
        setShowEditDialog(false);
        setEditPassword({ user_id: 0, new_password: '' });
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (userId: number, currentActive: boolean) => {
    setIsLoading(true);
    try {
      const response = await authenticatedFetch(BACKEND_URL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, is_active: !currentActive })
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: currentActive ? 'Доступ заблокирован' : 'Доступ разблокирован'
        });
        loadUsers();
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'super_admin' ? (
      <Badge className="bg-purple-100 text-purple-800 border-purple-200">Супер-админ</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Мини-админ</Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Users" size={20} />
              Администраторы
            </CardTitle>
            <CardDescription>
              Управление учётными записями администраторов системы
            </CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Создать администратора
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать администратора</DialogTitle>
                <DialogDescription>
                  Добавьте нового администратора в систему
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Логин</Label>
                  <Input
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="admin_hotel"
                  />
                </div>
                <div>
                  <Label>Пароль</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Введите пароль"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="admin@hotel.com"
                  />
                </div>
                <div>
                  <Label>Роль</Label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="tenant_admin">Мини-админ (доступ к своей паре)</option>
                    <option value="super_admin">Супер-админ (доступ ко всем парам)</option>
                  </select>
                </div>
                {newUser.role === 'tenant_admin' && (
                  <div>
                    <Label>ID пары (tenant_id)</Label>
                    <Input
                      type="number"
                      value={newUser.tenant_id || ''}
                      onChange={(e) => setNewUser({ ...newUser, tenant_id: parseInt(e.target.value) || null })}
                      placeholder="1"
                    />
                  </div>
                )}
                <Button onClick={handleCreateUser} disabled={isLoading} className="w-full">
                  Создать
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Логин</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Пара</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Последний вход</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email || '—'}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  {user.tenant_id ? (
                    <span>#{user.tenant_id} {user.tenant_name}</span>
                  ) : (
                    <span className="text-slate-400">Все пары</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.is_active ? (
                    <Badge className="bg-green-100 text-green-800">Активен</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Заблокирован</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {user.last_login_at ? new Date(user.last_login_at).toLocaleString('ru-RU') : 'Никогда'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditPassword({ user_id: user.id, new_password: '' });
                        setShowEditDialog(true);
                      }}
                    >
                      <Icon name="Key" size={14} className="mr-1" />
                      Пароль
                    </Button>
                    <Button
                      size="sm"
                      variant={user.is_active ? 'destructive' : 'default'}
                      onClick={() => handleToggleActive(user.id, user.is_active)}
                    >
                      {user.is_active ? 'Заблокировать' : 'Разблокировать'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Изменить пароль</DialogTitle>
              <DialogDescription>
                Введите новый пароль для администратора
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Новый пароль</Label>
                <Input
                  type="password"
                  value={editPassword.new_password}
                  onChange={(e) => setEditPassword({ ...editPassword, new_password: e.target.value })}
                  placeholder="Введите новый пароль"
                />
              </div>
              <Button onClick={handleChangePassword} disabled={isLoading} className="w-full">
                Изменить пароль
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminUsersPanel;