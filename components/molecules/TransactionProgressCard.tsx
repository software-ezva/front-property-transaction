import ProgressBar from "@/components/atoms/ProgressBar";
import { Transaction } from "@/types/transactions";

interface TransactionProgressCardProps {
  transaction: Transaction;
}

export default function TransactionProgressCard({
  transaction,
}: TransactionProgressCardProps) {
  const progress =
    (transaction.completedWorkflowItems / transaction.totalWorkflowItems) * 100;

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-foreground">
          Overall Progress
        </h3>
        <span className="text-xs font-medium">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <ProgressBar value={progress} variant="primary" />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>
          {transaction.completedWorkflowItems} of{" "}
          {transaction.totalWorkflowItems} tasks
        </span>
        <span>
          Started {new Date(transaction.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
