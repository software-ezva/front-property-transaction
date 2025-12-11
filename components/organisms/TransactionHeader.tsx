import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/atoms/Button";
import { PageTitle, TransactionStatusSelector } from "@/components/molecules";
import TransactionDeadlineStatus from "@/components/molecules/TransactionDeadlineStatus";

interface TransactionHeaderProps {
  title: string;
  subtitle: string;
  backLink: string;
  backText: string;
  currentStatus: string;
  onStatusChange?: (status: string) => void;
  statusUpdating?: boolean;
  readOnly?: boolean;
  nextIncompleteItemDate?: string | null;
}

export default function TransactionHeader({
  title,
  subtitle,
  backLink,
  backText,
  currentStatus,
  onStatusChange,
  statusUpdating = false,
  readOnly = false,
  nextIncompleteItemDate,
}: TransactionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <Link href={backLink}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backText}
          </Button>
        </Link>
        <div>
          <PageTitle title={title} subtitle={subtitle} />
        </div>

        <div className="hidden md:block">
          <TransactionDeadlineStatus
            nextIncompleteItemDate={nextIncompleteItemDate}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TransactionStatusSelector
          currentStatus={currentStatus}
          onStatusChange={onStatusChange || (() => {})}
          disabled={statusUpdating}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}
