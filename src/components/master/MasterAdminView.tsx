import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import MasterDashboardStats from './MasterDashboardStats';
import VersionsList from './VersionsList';
import BulkUpdatePanel from './BulkUpdatePanel';
import TenantsListTable from './TenantsListTable';
import AdminUsersPanel from './AdminUsersPanel';
import MessengersStatusCard from './MessengersStatusCard';
import DefaultSettingsPanel from './DefaultSettingsPanel';
import CreateTenantWithUserPanel from './CreateTenantWithUserPanel';
import TariffManagementPanel from './TariffManagementPanel';
import UsersManagementPanel from './UsersManagementPanel';
import { CreateTenantDialog, TenantFormData } from './CreateTenantDialog';
import { CreateVersionDialog, VersionFormData } from './CreateVersionDialog';
import { BulkUpdateDialog } from './BulkUpdateDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tenant {
  id: number;
  slug: string;
  name: string;
  description: string;
  owner_email: string;
  owner_phone: string;
  template_version: string;
  auto_update: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  doc_count: number;
  message_count: number;
}

interface Version {
  version: string;
  description: string;
  code_hash: string;
  created_at: string;
  created_by: string;
  tenant_count: number;
}

const BACKEND_URLS = {
  tenants: 'https://functions.poehali.dev/2163d682-19a2-462b-b577-7f04219cc3c8',
  bulkUpdate: 'https://functions.poehali.dev/06059507-42f3-4144-bcb9-b152556cd5ae',
  versions: 'https://functions.poehali.dev/7f6c3892-47f2-47aa-91b0-541f0de7c211'
};

const MasterAdminView = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<number[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showBulkUpdateDialog, setShowBulkUpdateDialog] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();

  useEffect(() => {
    loadTenants();
    loadVersions();
  }, []);

  const loadTenants = async () => {
    try {
      const response = await fetch(BACKEND_URLS.tenants);
      const data = await response.json();
      setTenants(data.tenants || []);
    } catch (error) {
      console.error('Error loading tenants:', error);
    }
  };

  const loadVersions = async () => {
    try {
      const response = await fetch(BACKEND_URLS.versions);
      const data = await response.json();
      setVersions(data.versions || []);
    } catch (error) {
      console.error('Error loading versions:', error);
    }
  };

  const handleCreateTenant = async (tenantData: TenantFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(BACKEND_URLS.tenants, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenantData)
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Тенант создан' });
        setShowCreateDialog(false);
        loadTenants();
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

  const handleCreateVersion = async (versionData: VersionFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(BACKEND_URLS.versions, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...versionData, created_by: 'admin' })
      });

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Версия создана' });
        setShowVersionDialog(false);
        loadVersions();
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

  const handleBulkUpdate = async (targetVersion: string) => {
    if (!targetVersion) {
      toast({ title: 'Ошибка', description: 'Выберите версию для обновления', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(BACKEND_URLS.bulkUpdate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_version: targetVersion,
          tenant_ids: selectedTenants,
          update_all: selectedTenants.length === 0,
          updated_by: 'admin'
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Обновление завершено',
          description: `Обновлено: ${data.updated_count}, Ошибок: ${data.failed_count}`
        });
        setShowBulkUpdateDialog(false);
        setSelectedTenants([]);
        loadTenants();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTenantSelection = (tenantId: number) => {
    setSelectedTenants(prev =>
      prev.includes(tenantId) ? prev.filter(id => id !== tenantId) : [...prev, tenantId]
    );
  };

  const selectAll = () => {
    setSelectedTenants(tenants.map(t => t.id));
  };

  const deselectAll = () => {
    setSelectedTenants([]);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Мастер-админка</h1>
          <p className="text-slate-600">Управление AI чат-ботами</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open('https://docs.google.com/document/d/1wBzrp-6JvCUFMwI04m44fmaqb_x6Og1t3bPVdP-Bfds/edit?usp=sharing', '_blank')}
          >
            <Icon name="BookOpen" size={16} className="mr-2" />
            Документация
          </Button>
          <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Icon name="GitBranch" size={16} className="mr-2" />
                Новая версия
              </Button>
            </DialogTrigger>
          </Dialog>
          <CreateVersionDialog
            open={showVersionDialog}
            isLoading={isLoading}
            onOpenChange={setShowVersionDialog}
            onSubmit={handleCreateVersion}
          />
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Новый тенант
              </Button>
            </DialogTrigger>
          </Dialog>
          <CreateTenantDialog
            open={showCreateDialog}
            isLoading={isLoading}
            onOpenChange={setShowCreateDialog}
            onSubmit={handleCreateTenant}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
          <TabsTrigger value="tenants">Теnanты</TabsTrigger>
          <TabsTrigger value="versions">Версии</TabsTrigger>
          <TabsTrigger value="bulk-update">Массовое обновление</TabsTrigger>
          <TabsTrigger value="create-with-user">Создать с пользователем</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
          <TabsTrigger value="admin-users">Админы</TabsTrigger>
          <TabsTrigger value="tariffs">Тарифы</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-6">
            <MasterDashboardStats tenants={tenants} />
            <MessengersStatusCard tenants={tenants} />
          </div>
        </TabsContent>

        <TabsContent value="tenants">
          <TenantsListTable
            tenants={tenants}
            selectedTenants={selectedTenants}
            onToggleSelection={toggleTenantSelection}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onRefresh={loadTenants}
          />
        </TabsContent>

        <TabsContent value="versions">
          <VersionsList versions={versions} onRefresh={loadVersions} />
        </TabsContent>

        <TabsContent value="bulk-update">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {selectedTenants.length > 0
                  ? `Выбрано тенантов: ${selectedTenants.length}`
                  : 'Не выбрано ни одного тенанта (будут обновлены все)'}
              </p>
              <Button onClick={() => setShowBulkUpdateDialog(true)}>
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Запустить массовое обновление
              </Button>
            </div>
            <BulkUpdatePanel tenants={tenants} />
          </div>
          <BulkUpdateDialog
            open={showBulkUpdateDialog}
            isLoading={isLoading}
            versions={versions}
            selectedTenantsCount={selectedTenants.length}
            onOpenChange={setShowBulkUpdateDialog}
            onSubmit={handleBulkUpdate}
          />
        </TabsContent>

        <TabsContent value="create-with-user">
          <CreateTenantWithUserPanel />
        </TabsContent>

        <TabsContent value="settings">
          <DefaultSettingsPanel />
        </TabsContent>

        <TabsContent value="admin-users">
          <AdminUsersPanel />
        </TabsContent>

        <TabsContent value="tariffs">
          <TariffManagementPanel />
        </TabsContent>

        <TabsContent value="users">
          <UsersManagementPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterAdminView;
