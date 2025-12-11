import { useState } from "react";
import { FileText, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Button from "@/components/atoms/Button";
import DocumentCard from "@/components/molecules/DocumentCard";
import Stats from "@/components/molecules/Stats";
import LoadingState from "@/components/molecules/LoadingState";
import ErrorState from "@/components/molecules/ErrorState";
import EmptyState from "@/components/molecules/EmptyState";
import { StatItemData } from "@/components/atoms/StatItem";
import { Document, DocumentStatus, DocumentCategory } from "@/types/documents";

interface DocumentsListProps {
  documents: Document[];
  loading?: boolean;
  error?: string | null;
  onAddDocuments?: () => void;
  onViewDocument?: (document: Document) => void;
  onArchiveDocument?: (document: Document) => void;
  onRetry?: () => void;
  readOnly?: boolean;
  className?: string;
}

export default function DocumentsList({
  documents,
  loading = false,
  error = null,
  onAddDocuments,
  onViewDocument,
  onArchiveDocument,
  onRetry,
  readOnly = false,
  className = "",
}: DocumentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || doc.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const getDocumentStats = () => {
    const total = documents.length;
    const signed = documents.filter(
      (doc) => doc.status === DocumentStatus.SIGNED
    ).length;
    const pending = documents.filter(
      (doc) => doc.status === DocumentStatus.PENDING
    ).length;
    const awaitingSignatures = documents.filter(
      (doc) => doc.status === DocumentStatus.AWAITING_SIGNATURES
    ).length;
    return { total, signed, pending, awaitingSignatures };
  };

  const stats = getDocumentStats();
  const statsData: StatItemData[] = [
    {
      value: stats.total,
      label: "Total Documents",
    },
    {
      value: stats.signed,
      label: "Signed",
    },
    {
      value: stats.awaitingSignatures,
      label: "Awaiting Signatures",
    },
    {
      value: stats.pending,
      label: "Pending",
    },
  ];

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <LoadingState title="Loading documents..." icon={FileText} size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <ErrorState
          title="Error Loading Documents"
          error={error}
          onRetry={onRetry}
          icon={FileText}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Transaction Documents
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage all documents related to this transaction
          </p>
        </div>
        {onAddDocuments && !readOnly && (
          <Button onClick={onAddDocuments}>
            <Plus className="w-4 h-4 mr-2" />
            Add Documents
          </Button>
        )}
      </div>

      {/* Stats */}
      <Stats stats={statsData} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.values(DocumentCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(DocumentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Documents List */}
      <div className="space-y-2">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((document) => (
            <DocumentCard
              key={document.documentId}
              document={document}
              onView={onViewDocument}
              onArchive={onArchiveDocument}
              readOnly={readOnly}
            />
          ))
        ) : (
          <EmptyState
            title="No documents found"
            description={
              searchTerm ||
              selectedCategory !== "all" ||
              selectedStatus !== "all"
                ? "Try adjusting your filters or search terms"
                : "Start by adding documents from templates"
            }
            icon={FileText}
            actionLabel={
              !searchTerm &&
              selectedCategory === "all" &&
              selectedStatus === "all" &&
              onAddDocuments &&
              !readOnly
                ? "Add Your First Document"
                : undefined
            }
            onAction={
              !searchTerm &&
              selectedCategory === "all" &&
              selectedStatus === "all" &&
              !readOnly
                ? onAddDocuments
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
