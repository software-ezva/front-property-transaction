import { Search } from "lucide-react";
import Input from "@/components/atoms/Input";
import { TransactionStatus } from "@/types/transactions";

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
  placeholder?: string;
  showStatusFilter?: boolean;
}

export default function TransactionFilters({
  searchTerm,
  onSearchChange,
  statusFilter = "all",
  onStatusChange,
  placeholder = "Search by property or client...",
  showStatusFilter = true,
}: TransactionFiltersProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {showStatusFilter && onStatusChange && (
          <div>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-auto"
            >
              <option value="all">All statuses</option>
              <option value={TransactionStatus.IN_PREPARATION}>
                In Preparation
              </option>
              <option value={TransactionStatus.ACTIVE}>Active</option>
              <option value={TransactionStatus.UNDER_CONTRACT}>
                Under Contract
              </option>
              <option value={TransactionStatus.SOLD_LEASED}>Sold/Leased</option>
              <option value={TransactionStatus.TERMINATED}>Terminated</option>
              <option value={TransactionStatus.WITHDRAWN}>Withdrawn</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
