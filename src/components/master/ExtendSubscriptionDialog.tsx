import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ExtendSubscriptionDialogProps {
  open: boolean;
  tenantName: string;
  extendMonths: number;
  onOpenChange: (open: boolean) => void;
  onMonthsChange: (months: number) => void;
  onConfirm: () => void;
}

export const ExtendSubscriptionDialog = ({
  open,
  tenantName,
  extendMonths,
  onOpenChange,
  onMonthsChange,
  onConfirm
}: ExtendSubscriptionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Продлить подписку</DialogTitle>
          <DialogDescription>
            Продление подписки для: <strong>{tenantName}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="months">Количество месяцев</Label>
            <Input
              id="months"
              type="number"
              min="1"
              max="24"
              value={extendMonths}
              onChange={(e) => onMonthsChange(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={onConfirm}>
              Продлить на {extendMonths} мес.
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
