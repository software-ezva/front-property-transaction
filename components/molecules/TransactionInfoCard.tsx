import { FileText } from "lucide-react";
import { Transaction } from "@/types/transactions";

interface TransactionInfoCardProps {
  transaction: Transaction;
}

export default function TransactionInfoCard({
  transaction,
}: TransactionInfoCardProps) {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="w-5 h-5 text-tertiary" />
        <h3 className="text-lg font-semibold text-foreground">
          Transaction Information
        </h3>
      </div>
      <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type:</span>
          <span className="font-medium capitalize">
            {transaction.transactionType}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Created:</span>
          <span className="font-medium">
            {new Date(transaction.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last Updated:</span>
          <span className="font-medium">
            {new Date(transaction.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className="font-medium capitalize">
            {transaction.status.replace("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );
}
