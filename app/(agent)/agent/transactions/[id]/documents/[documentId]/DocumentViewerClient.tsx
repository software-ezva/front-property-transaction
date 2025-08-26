"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DocumentStatus, DocumentCategory, type Document } from "@/types/documents"

// Mock data - replace with actual API call
const mockDocument: Document = {
  documentId: "doc-1",
  title: "Purchase Agreement Contract",
  category: DocumentCategory.CONTRACT_AND_NEGOTIATION,
  url: "/documents/purchase-agreement.pdf",
  status: DocumentStatus.PENDING,
  createdAt: new Date("2024-01-15T10:30:00"),
  updatedAt: new Date("2024-01-20T14:45:00"),
}

const getStatusVariant = (status: DocumentStatus) => {
  switch (status) {
    case DocumentStatus.PENDING:
      return "secondary"
    case DocumentStatus.WAITING:
      return "outline"
    case DocumentStatus.SIGNED:
      return "default"
    case DocumentStatus.READY:
      return "default"
    case DocumentStatus.REJECTED:
      return "destructive"
    case DocumentStatus.ARCHIVED:
      return "secondary"
    default:
      return "secondary"
  }
}

interface DocumentViewerClientProps {
  transactionId: string
  documentId: string
}

export default function DocumentViewerClient({ transactionId, documentId }: DocumentViewerClientProps) {
  const router = useRouter()
  const [isDetailsSidebarCollapsed, setIsDetailsSidebarCollapsed] = useState(false)

  // In a real app, fetch document data using documentId
  const document = mockDocument

  const handleStatusChange = (newStatus: string) => {
    // Handle status change logic here
    console.log("Status changed to:", newStatus)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Transaction</span>
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-semibold">{document.title}</h1>
          </div>
          <Badge variant={getStatusVariant(document.status)}>{document.status}</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Collapsible Details Sidebar */}
        <div
          className={`${
            isDetailsSidebarCollapsed ? "w-0" : "w-80"
          } transition-all duration-300 overflow-hidden border-r border-border bg-muted/30`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Status</h4>
                <Badge variant={getStatusVariant(document.status)}>{document.status}</Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Category</h4>
                <p className="text-sm text-foreground">{document.category}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Created</h4>
                <p className="text-sm text-foreground">{format(document.createdAt, "MMMM dd, yyyy 'at' h:mm a")}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Last Updated</h4>
                <p className="text-sm text-foreground">{format(document.updatedAt, "MMMM dd, yyyy 'at' h:mm a")}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Change Status</h4>
                <Select defaultValue={document.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DocumentStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Document Preview Area */}
        <div className="flex-1 relative">
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDetailsSidebarCollapsed(!isDetailsSidebarCollapsed)}
            className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm"
          >
            {isDetailsSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>

          {/* Document Preview */}
          <div className="h-full flex items-center justify-center bg-muted/10">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Document Preview</h3>
              <p className="text-muted-foreground mb-4">{document.title}</p>
              <p className="text-sm text-muted-foreground">PDF/Word viewer integration would be implemented here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
