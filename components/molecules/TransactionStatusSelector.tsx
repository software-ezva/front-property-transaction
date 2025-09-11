import { useState } from "react";
import Badge from "@/components/atoms/Badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TransactionStatus } from "@/types/transactions";

interface TransactionStatusSelectorProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
  disabled?: boolean;
}

const statusVariant = {
  [TransactionStatus.IN_PREPARATION]: "warning" as const,
  [TransactionStatus.ACTIVE]: "default" as const,
  [TransactionStatus.UNDER_CONTRACT]: "default" as const,
  [TransactionStatus.SOLD_LEASED]: "success" as const,
  [TransactionStatus.TERMINATED]: "error" as const,
  [TransactionStatus.WITHDRAWN]: "error" as const,
};

const statusOptions = [
  { value: TransactionStatus.IN_PREPARATION, label: "In Preparation" },
  { value: TransactionStatus.ACTIVE, label: "Active" },
  { value: TransactionStatus.UNDER_CONTRACT, label: "Under Contract" },
  { value: TransactionStatus.SOLD_LEASED, label: "Sold/Leased" },
  { value: TransactionStatus.TERMINATED, label: "Terminated" },
  { value: TransactionStatus.WITHDRAWN, label: "Withdrawn" },
];

export default function TransactionStatusSelector({
  currentStatus,
  onStatusChange,
  disabled = false,
}: TransactionStatusSelectorProps) {
  const handleStatusChange = (newStatus: string) => {
    if (currentStatus === newStatus) return;
    onStatusChange(newStatus);
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[170px] h-8 px-2 py-0 border-none bg-transparent shadow-none">
        <Badge
          variant={
            statusVariant[currentStatus as keyof typeof statusVariant] ||
            "default"
          }
          className="w-full justify-between cursor-pointer px-3 py-1 text-xs font-semibold"
        >
          <SelectValue>
            {statusOptions
              .find((opt) => opt.value === currentStatus)
              ?.label.toUpperCase()}
          </SelectValue>
          {disabled && (
            <span className="ml-2 animate-pulse text-xs text-muted-foreground">
              ...
            </span>
          )}
        </Badge>
      </SelectTrigger>
      <SelectContent className="min-w-[170px]">
        {statusOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
