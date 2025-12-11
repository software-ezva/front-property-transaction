import { FileText } from "lucide-react";
import TransactionCard from "@/components/molecules/TransactionCard";
import EmptyState from "@/components/molecules/EmptyState";
import ErrorState from "@/components/molecules/ErrorState";
import { Transaction } from "@/types/transactions";

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  onViewDetails: (transactionId: string) => void;
  emptyStateAction?: {
    label: string;
    onClick: () => void;
  };
  emptyStateMessage?: string;
  renderAdditionalContent?: (transaction: Transaction) => React.ReactNode;
}

export default function TransactionList({
  transactions,
  loading,
  error,
  onViewDetails,
  emptyStateAction,
  emptyStateMessage = "No transactions match the applied filters.",
  renderAdditionalContent,
}: TransactionListProps) {
  if (error) {
    return (
      <ErrorState
        title="Error Loading Transactions"
        error={error}
        onRetry={() => window.location.reload()}
        icon={FileText}
      />
    );
  }

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-12 border border-border text-center">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Loading transactions...
        </h3>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        description={emptyStateMessage}
        icon={FileText}
        actionLabel={emptyStateAction?.label}
        onAction={emptyStateAction?.onClick}
      />
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.transactionId}
          className="bg-card rounded-lg border border-border"
        >
          <TransactionCard
            transaction={transaction}
            onViewDetails={() => onViewDetails(transaction.transactionId)}
          />
          {renderAdditionalContent && renderAdditionalContent(transaction)}
        </div>
      ))}
    </div>
  );
}
