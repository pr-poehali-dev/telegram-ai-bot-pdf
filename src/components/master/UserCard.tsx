import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  tenant_id: number;
  tenant_name: string;
  tenant_slug: string;
  is_active: boolean;
  is_public: boolean;
  subscription_status: string;
  subscription_end_date: string | null;
  tariff_id: string | null;
  created_at: string;
}

interface UserCardProps {
  user: User;
  onToggleUserStatus: (userId: number, isActive: boolean) => void;
  onToggleTenantPublic: (tenantId: number, isPublic: boolean) => void;
  onExtendSubscription: (tenantId: number, tenantName: string) => void;
  onShowPaymentHistory: (tenantId: number, tenantName: string) => void;
  getStatusBadge: (status: string) => JSX.Element;
}

export const UserCard = ({
  user,
  onToggleUserStatus,
  onToggleTenantPublic,
  onExtendSubscription,
  onShowPaymentHistory,
  getStatusBadge
}: UserCardProps) => {
  const getDaysLeft = (endDate: string | null) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft(user.subscription_end_date);

  return (
    <Card key={user.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{user.tenant_name}</CardTitle>
            <CardDescription className="space-y-1 mt-2">
              <div className="flex items-center gap-2">
                <Icon name="Mail" size={14} />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="User" size={14} />
                <span>{user.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Link" size={14} />
                <span className="font-mono text-xs">{user.tenant_slug}</span>
              </div>
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            {getStatusBadge(user.subscription_status)}
            {user.is_active ? (
              <Badge className="bg-blue-500">Доступ открыт</Badge>
            ) : (
              <Badge variant="secondary">Доступ закрыт</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.subscription_end_date && (
          <div className="text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Calendar" size={14} />
              <span>Окончание: {new Date(user.subscription_end_date).toLocaleDateString('ru-RU')}</span>
              {daysLeft !== null && daysLeft >= 0 && (
                <Badge variant="outline" className="ml-2">
                  {daysLeft === 0 ? 'Истекает сегодня' : `${daysLeft} дн.`}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              checked={user.is_active}
              onCheckedChange={(checked) => onToggleUserStatus(user.id, checked)}
            />
            <Label>Активен</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={user.is_public}
              onCheckedChange={(checked) => onToggleTenantPublic(user.tenant_id, checked)}
            />
            <Label>Публичный</Label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onExtendSubscription(user.tenant_id, user.tenant_name)}
            className="flex-1"
          >
            <Icon name="Plus" className="mr-2" size={14} />
            Продлить подписку
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onShowPaymentHistory(user.tenant_id, user.tenant_name)}
          >
            <Icon name="History" size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
