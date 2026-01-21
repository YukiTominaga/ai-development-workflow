import * as Dialog from '@radix-ui/react-dialog';
import type { Transaction } from '../../types/household';
import { TransactionForm } from './TransactionForm';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  defaultDate?: string;
}

export function TransactionModal({ isOpen, onClose, onAddTransaction, defaultDate }: TransactionModalProps) {
  const handleSubmit = (transaction: Omit<Transaction, 'id'>) => {
    onAddTransaction(transaction);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-slate-900">
              取引を追加
            </Dialog.Title>
            <Dialog.Close className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Dialog.Close>
          </div>

          <TransactionForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            defaultDate={defaultDate}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
