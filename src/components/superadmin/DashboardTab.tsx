import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tenant, Tariff } from './types';

interface DashboardTabProps {
  tenants: Tenant[];
  tariffs: Tariff[];
}

export const DashboardTab = ({ tenants, tariffs }: DashboardTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Всего клиентов</CardDescription>
            <CardTitle className="text-4xl">{tenants.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon name="TrendingUp" size={16} className="mr-1 text-green-600" />
              <span>Активные</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Тарифных планов</CardDescription>
            <CardTitle className="text-4xl">{tariffs.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon name="Package" size={16} className="mr-1" />
              <span>Доступно</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Документов в системе</CardDescription>
            <CardTitle className="text-4xl">
              {tenants.reduce((sum, t) => sum + t.documents_count, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon name="FileText" size={16} className="mr-1" />
              <span>Обработано</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние клиенты</CardTitle>
          <CardDescription>Недавно созданные боты</CardDescription>
        </CardHeader>
        <CardContent>
          {tenants.slice(0, 5).map(tenant => (
            <div key={tenant.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <div className="font-medium">{tenant.name}</div>
                <div className="text-sm text-muted-foreground">
                  {tenant.slug} • {tenant.documents_count} документов
                </div>
              </div>
              <Badge variant={tenant.tariff_id === 'enterprise' ? 'default' : 'secondary'}>
                {tenant.tariff_id}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
