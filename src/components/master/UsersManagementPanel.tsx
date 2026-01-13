import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { UsersManagementHeader } from './UsersManagementHeader';
import { UserCard } from './UserCard';
import { ExtendSubscriptionDialog } from './ExtendSubscriptionDialog';
import { PaymentHistoryDialog } from './PaymentHistoryDialog';

const BACKEND_URL = 'https://functions.poehali.dev/2163d682-19a2-462b-b577-7f04219cc3c8';
const CHECK_SUBSCRIPTIONS_URL = 'https://functions.poehali.dev/2b45e5d6-8138-4bae-9236-237fe424ef95';
const SETUP_CRONJOB_URL = 'https://functions.poehali.dev/5d34eeb6-9825-4d73-80eb-bc6c1ded58c9';

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

interface Payment {
  id: number;
  payment_id: string;
  amount: number;
  status: string;
  tariff_id: string;
  tariff_name: string;
  payment_type: string;
  created_at: string;
}

const UsersManagementPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSubscriptions, setIsCheckingSubscriptions] = useState(false);
  const [cronjobStatus, setCronjobStatus] = useState<any>(null);
  const [isLoadingCronjob, setIsLoadingCronjob] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<number | null>(null);
  const [selectedTenantName, setSelectedTenantName] = useState<string>('');
  const [extendMonths, setExtendMonths] = useState<number>(1);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
    loadCronjobStatus();
  }, []);

  useEffect(() => {
    let result = users;

    if (statusFilter !== 'all') {
      result = result.filter(user => user.subscription_status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user =>
        user.tenant_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.tenant_slug.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(result);
  }, [users, searchQuery, statusFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}?action=users_list`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({ title: 'Ошибка', description: 'Не удалось загрузить пользователей', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      const response = await fetch(`${BACKEND_URL}?action=toggle_user_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, is_active: isActive })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Статус пользователя обновлен' });
        loadUsers();
      } else {
        throw new Error('Failed to toggle user status');
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const toggleTenantPublic = async (tenantId: number, isPublic: boolean) => {
    try {
      const response = await fetch(`${BACKEND_URL}?action=toggle_tenant_public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, is_public: isPublic })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Публичная видимость обновлена' });
        loadUsers();
      } else {
        throw new Error('Failed to toggle tenant public status');
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Активна</Badge>;
      case 'expired':
        return <Badge variant="destructive">Истекла</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Отменена</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const loadPaymentHistory = async (tenantId: number) => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`${BACKEND_URL}?action=payment_history&tenant_id=${tenantId}`);
      const data = await response.json();
      setPaymentHistory(data.payments || []);
    } catch (error) {
      console.error('Error loading payment history:', error);
      toast({ title: 'Ошибка', description: 'Не удалось загрузить историю платежей', variant: 'destructive' });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleExtendSubscription = async () => {
    if (!selectedTenant) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}?action=extend_subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: selectedTenant, months: extendMonths })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: `Подписка продлена на ${extendMonths} мес.` });
        setShowExtendDialog(false);
        setSelectedTenant(null);
        setSelectedTenantName('');
        setExtendMonths(1);
        loadUsers();
      } else {
        throw new Error('Failed to extend subscription');
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const handleCheckSubscriptions = async () => {
    setIsCheckingSubscriptions(true);
    try {
      const response = await fetch(CHECK_SUBSCRIPTIONS_URL);
      const data = await response.json();
      
      if (response.ok) {
        toast({ 
          title: 'Проверка завершена', 
          description: `Истекло подписок: ${data.expired_count}, Отправлено уведомлений: ${data.notifications_sent}` 
        });
        loadUsers();
      } else {
        throw new Error(data.error || 'Failed to check subscriptions');
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setIsCheckingSubscriptions(false);
    }
  };

  const loadCronjobStatus = async () => {
    try {
      const response = await fetch(`${SETUP_CRONJOB_URL}?action=status`);
      const data = await response.json();
      if (response.ok) {
        setCronjobStatus(data);
      }
    } catch (error) {
      console.error('Error loading cronjob status:', error);
    }
  };

  const handleSetupCronjob = async () => {
    setIsLoadingCronjob(true);
    try {
      const response = await fetch(`${SETUP_CRONJOB_URL}?action=create`);
      const data = await response.json();
      
      if (response.ok) {
        toast({ 
          title: 'Успешно', 
          description: 'Автоматическая проверка подписок настроена! Задание будет выполняться ежедневно в 9:00 МСК' 
        });
        loadCronjobStatus();
      } else {
        throw new Error(data.error || 'Failed to setup cronjob');
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoadingCronjob(false);
    }
  };

  const handleStopCronjob = async () => {
    if (!cronjobStatus?.job?.jobId) return;
    
    setIsLoadingCronjob(true);
    try {
      const response = await fetch(`${SETUP_CRONJOB_URL}?action=delete&job_id=${cronjobStatus.job.jobId}`);
      const data = await response.json();
      
      if (response.ok) {
        toast({ 
          title: 'Успешно', 
          description: 'Автоматическая проверка подписок остановлена' 
        });
        loadCronjobStatus();
      } else {
        throw new Error(data.error || 'Failed to stop cronjob');
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoadingCronjob(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleShowExtendDialog = (tenantId: number, tenantName: string) => {
    setSelectedTenant(tenantId);
    setSelectedTenantName(tenantName);
    setShowExtendDialog(true);
  };

  const handleShowPaymentHistory = (tenantId: number, tenantName: string) => {
    setSelectedTenant(tenantId);
    setSelectedTenantName(tenantName);
    setShowPaymentHistory(true);
    loadPaymentHistory(tenantId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icon name="Loader2" className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsersManagementHeader
        filteredCount={filteredUsers.length}
        totalCount={users.length}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        onResetFilters={handleResetFilters}
        cronjobStatus={cronjobStatus}
        isLoadingCronjob={isLoadingCronjob}
        isCheckingSubscriptions={isCheckingSubscriptions}
        onSetupCronjob={handleSetupCronjob}
        onStopCronjob={handleStopCronjob}
        onCheckSubscriptions={handleCheckSubscriptions}
      />

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Users" className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-lg font-semibold mb-2">Пользователи не найдены</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Попробуйте изменить фильтры поиска'
              : 'Пользователи появятся после первой оплаты'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onToggleUserStatus={toggleUserStatus}
              onToggleTenantPublic={toggleTenantPublic}
              onExtendSubscription={handleShowExtendDialog}
              onShowPaymentHistory={handleShowPaymentHistory}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </div>
      )}

      <ExtendSubscriptionDialog
        open={showExtendDialog}
        tenantName={selectedTenantName}
        extendMonths={extendMonths}
        onOpenChange={setShowExtendDialog}
        onMonthsChange={setExtendMonths}
        onConfirm={handleExtendSubscription}
      />

      <PaymentHistoryDialog
        open={showPaymentHistory}
        tenantName={selectedTenantName}
        payments={paymentHistory}
        isLoading={isLoadingHistory}
        onOpenChange={setShowPaymentHistory}
      />
    </div>
  );
};

export default UsersManagementPanel;
