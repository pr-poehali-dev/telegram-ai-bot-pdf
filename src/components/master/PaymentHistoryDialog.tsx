import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

interface PaymentHistoryDialogProps {
  open: boolean;
  tenantName: string;
  payments: Payment[];
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaymentHistoryDialog = ({
  open,
  tenantName,
  payments,
  isLoading,
  onOpenChange
}: PaymentHistoryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>История платежей</DialogTitle>
          <DialogDescription>
            Платежи для: <strong>{tenantName}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Icon name="Loader2" className="animate-spin" size={24} />
            </div>
          ) : payments.length === 0 ? (
            <p className="text-center text-muted-foreground p-8">
              Платежи не найдены
            </p>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{payment.tariff_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{payment.amount.toFixed(2)} ₽</p>
                    <Badge variant={payment.status === 'succeeded' ? 'default' : 'secondary'}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>ID: {payment.payment_id}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {payment.payment_type === 'initial' ? 'Первый платеж' : 'Продление'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
