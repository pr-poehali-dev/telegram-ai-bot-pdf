import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface UsersManagementHeaderProps {
  filteredCount: number;
  totalCount: number;
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onResetFilters: () => void;
  cronjobStatus: any;
  isLoadingCronjob: boolean;
  isCheckingSubscriptions: boolean;
  onSetupCronjob: () => void;
  onStopCronjob: () => void;
  onCheckSubscriptions: () => void;
}

export const UsersManagementHeader = ({
  filteredCount,
  totalCount,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onResetFilters,
  cronjobStatus,
  isLoadingCronjob,
  isCheckingSubscriptions,
  onSetupCronjob,
  onStopCronjob,
  onCheckSubscriptions
}: UsersManagementHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управление пользователями</h2>
          <p className="text-muted-foreground">
            Пользователи, созданные после оплаты подписки ({filteredCount} из {totalCount})
          </p>
        </div>
        <div className="flex gap-2">
          {cronjobStatus?.exists ? (
            <Button 
              onClick={onStopCronjob} 
              disabled={isLoadingCronjob}
              variant="destructive"
            >
              {isLoadingCronjob ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                  Остановка...
                </>
              ) : (
                <>
                  <Icon name="StopCircle" className="mr-2" size={16} />
                  Остановить автопроверку
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={onSetupCronjob} 
              disabled={isLoadingCronjob}
              variant="default"
            >
              {isLoadingCronjob ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                  Настройка...
                </>
              ) : (
                <>
                  <Icon name="Settings" className="mr-2" size={16} />
                  Настроить автопроверку
                </>
              )}
            </Button>
          )}
          <Button 
            onClick={onCheckSubscriptions} 
            disabled={isCheckingSubscriptions}
            variant="outline"
          >
            {isCheckingSubscriptions ? (
              <>
                <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                Проверка...
              </>
            ) : (
              <>
                <Icon name="Clock" className="mr-2" size={16} />
                Проверить сейчас
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Поиск</Label>
          <Input
            id="search"
            placeholder="Имя компании, email, логин или slug..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Label htmlFor="status-filter">Статус подписки</Label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="all">Все статусы</option>
            <option value="active">Активна</option>
            <option value="expired">Истекла</option>
            <option value="cancelled">Отменена</option>
          </select>
        </div>
        {(searchQuery || statusFilter !== 'all') && (
          <div className="flex items-end">
            <Button variant="ghost" onClick={onResetFilters}>
              <Icon name="X" className="mr-2" size={16} />
              Сбросить
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
