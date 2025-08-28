import { FileText, Eye, Archive } from "lucide-react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Document, DocumentStatus } from "@/types/documents";

interface DocumentCardProps {
  document: Document;
  onView?: (document: Document) => void;
  onArchive?: (document: Document) => void;
  className?: string;
}

const getStatusVariant = (status: DocumentStatus) => {
  switch (status) {
    case DocumentStatus.SIGNED:
      return "success" as const;
    case DocumentStatus.READY:
      return "default" as const;
    case DocumentStatus.WAITING:
      return "warning" as const;
    case DocumentStatus.PENDING:
      return "secondary" as const;
    case DocumentStatus.REJECTED:
      return "destructive" as const;
    case DocumentStatus.ARCHIVED:
      return "outline" as const;
    default:
      return "default" as const;
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function DocumentCard({
  document,
  onView,
  onArchive,
  className = "",
}: DocumentCardProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors ${className}`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <FileText className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">
            {document.title}
          </h4>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{document.category}</span>
            <span>•</span>
            <span>Updated {formatDate(document.updatedAt)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Badge variant={getStatusVariant(document.status)}>
          {document.status}
        </Badge>
        <div className="flex items-center space-x-1">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(document)}
              title="View document"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          {onArchive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onArchive(document)}
              title="Archive document"
            >
              <Archive className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
