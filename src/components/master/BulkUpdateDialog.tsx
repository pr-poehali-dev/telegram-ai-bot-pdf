import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Version {
  version: string;
  description: string;
  code_hash: string;
  created_at: string;
  created_by: string;
  tenant_count: number;
}

interface BulkUpdateDialogProps {
  open: boolean;
  isLoading: boolean;
  versions: Version[];
  selectedTenantsCount: number;
  onOpenChange: (open: boolean) => void;
  onSubmit: (targetVersion: string) => void;
}

export const BulkUpdateDialog = ({
  open,
  isLoading,
  versions,
  selectedTenantsCount,
  onOpenChange,
  onSubmit
}: BulkUpdateDialogProps) => {
  const [targetVersion, setTargetVersion] = useState('');

  const handleSubmit = () => {
    if (!targetVersion) return;
    onSubmit(targetVersion);
    setTargetVersion('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Массовое обновление версий</DialogTitle>
          <DialogDescription>
            {selectedTenantsCount > 0
              ? `Обновить ${selectedTenantsCount} выбранных тенантов`
              : 'Обновить все теnanты'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Целевая версия</Label>
            <select
              className="w-full mt-2 p-2 border rounded-md"
              value={targetVersion}
              onChange={(e) => setTargetVersion(e.target.value)}
            >
              <option value="">Выберите версию...</option>
              {versions.map((v) => (
                <option key={v.version} value={v.version}>
                  v{v.version} - {v.description}
                </option>
              ))}
            </select>
          </div>
          {targetVersion && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-2">
                <Icon name="AlertTriangle" className="text-amber-600" size={20} />
                <div>
                  <p className="font-medium text-amber-900">Внимание!</p>
                  <p className="text-sm text-amber-700">
                    Это действие обновит версию кода для{' '}
                    {selectedTenantsCount > 0 ? `${selectedTenantsCount} тенантов` : 'всех тенантов'}.
                    Убедитесь, что новая версия протестирована.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !targetVersion}
              variant="default"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                  Обновление...
                </>
              ) : (
                'Обновить'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
