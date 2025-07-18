"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Copy, FileText, Settings } from "lucide-react"
import DashboardLayout from "@/components/templates/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TransactionType, type WorkflowTemplate } from "@/types/workflow-templates"

const mockAgentUser = {
  name: "Ana García",
  role: "agent" as const,
}

// Mock data para workflow templates
const mockWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: "wt-1",
    transactionType: TransactionType.SALE,
    name: "Standard Property Sale",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    checklistTemplates: [
      {
        id: "ct-1",
        name: "Initial Setup",
        description: "Initial documentation and setup tasks",
        order: 1,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        items: [
          { id: "it-1", description: "Client consultation", order: 1, createdAt: new Date(), updatedAt: new Date() },
          { id: "it-2", description: "Listing agreement", order: 2, createdAt: new Date(), updatedAt: new Date() },
        ],
      },
      {
        id: "ct-2",
        name: "Marketing",
        description: "Property marketing and promotion tasks",
        order: 2,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        items: [
          {
            id: "it-3",
            description: "Professional photography",
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { id: "it-4", description: "MLS listing", order: 2, createdAt: new Date(), updatedAt: new Date() },
        ],
      },
    ],
  },
  {
    id: "wt-2",
    transactionType: TransactionType.PURCHASE,
    name: "Buyer Representation",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    checklistTemplates: [
      {
        id: "ct-3",
        name: "Buyer Consultation",
        description: "Initial buyer consultation and needs assessment",
        order: 1,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
        items: [
          { id: "it-5", description: "Needs assessment", order: 1, createdAt: new Date(), updatedAt: new Date() },
          { id: "it-6", description: "Pre-approval letter", order: 2, createdAt: new Date(), updatedAt: new Date() },
        ],
      },
    ],
  },
  {
    id: "wt-3",
    transactionType: TransactionType.LEASE,
    name: "Commercial Lease",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-25"),
    checklistTemplates: [
      {
        id: "ct-4",
        name: "Lease Preparation",
        description: "Prepare lease documentation and terms",
        order: 1,
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05"),
        items: [
          {
            id: "it-7",
            description: "Lease terms negotiation",
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { id: "it-8", description: "Credit check", order: 2, createdAt: new Date(), updatedAt: new Date() },
        ],
      },
    ],
  },
]

export default function WorkflowTemplatesClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all")
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(mockWorkflowTemplates)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || template.transactionType === typeFilter
    return matchesSearch && matchesType
  })

  const handleEdit = (templateId: string) => {
    window.location.href = `/agent/workflow-templates/${templateId}/edit`
  }

  const handleDuplicate = (template: WorkflowTemplate) => {
    const duplicatedTemplate: WorkflowTemplate = {
      ...template,
      id: `wt-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      checklistTemplates: template.checklistTemplates.map((checklist) => ({
        ...checklist,
        id: `ct-${Date.now()}-${checklist.order}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: checklist.items.map((item) => ({
          ...item,
          id: `it-${Date.now()}-${item.order}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      })),
    }
    setTemplates([...templates, duplicatedTemplate])
  }

  const handleDelete = (templateId: string) => {
    if (confirm("Are you sure you want to delete this workflow template?")) {
      setTemplates(templates.filter((t) => t.id !== templateId))
    }
  }

  const getTransactionTypeLabel = (type: TransactionType) => {
    const labels = {
      [TransactionType.SALE]: "Sale",
      [TransactionType.PURCHASE]: "Purchase",
      [TransactionType.LEASE]: "Lease",
      [TransactionType.RENTAL]: "Rental",
    }
    return labels[type]
  }

  const getTransactionTypeVariant = (type: TransactionType) => {
    const variants = {
      [TransactionType.SALE]: "default" as const,
      [TransactionType.PURCHASE]: "secondary" as const,
      [TransactionType.LEASE]: "outline" as const,
      [TransactionType.RENTAL]: "destructive" as const,
    }
    return variants[type]
  }

  return (
    <DashboardLayout user={mockAgentUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-primary">Workflow Templates</h1>
            <p className="text-muted-foreground font-secondary">
              Manage workflow templates for different transaction types
            </p>
          </div>
          <Button onClick={() => (window.location.href = "/agent/workflow-templates/create")} className="sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <div className="text-2xl font-bold text-foreground">{templates.length}</div>
            <div className="text-sm text-muted-foreground">Total Templates</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <div className="text-2xl font-bold text-foreground">
              {templates.filter((t) => t.transactionType === TransactionType.SALE).length}
            </div>
            <div className="text-sm text-muted-foreground">Sale Templates</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <div className="text-2xl font-bold text-foreground">
              {templates.filter((t) => t.transactionType === TransactionType.PURCHASE).length}
            </div>
            <div className="text-sm text-muted-foreground">Purchase Templates</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <div className="text-2xl font-bold text-foreground">
              {templates.filter((t) => t.transactionType === TransactionType.LEASE).length}
            </div>
            <div className="text-sm text-muted-foreground">Lease Templates</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TransactionType | "all")}
                className="px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Types</option>
                <option value={TransactionType.SALE}>Sale</option>
                <option value={TransactionType.PURCHASE}>Purchase</option>
                <option value={TransactionType.LEASE}>Lease</option>
                <option value={TransactionType.RENTAL}>Rental</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="space-y-4">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    {/* Title and Badge in one row */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                      <Badge variant={getTransactionTypeVariant(template.transactionType)}>
                        {getTransactionTypeLabel(template.transactionType)}
                      </Badge>
                    </div>

                    {/* Checklists Preview */}
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium text-foreground">Checklists:</h4>
                      <div className="space-y-1">
                        {template.checklistTemplates
                          .sort((a, b) => a.order - b.order)
                          .slice(0, 3)
                          .map((checklist) => (
                            <div
                              key={checklist.id}
                              className="flex items-center justify-between text-xs bg-muted/30 rounded px-2 py-1"
                            >
                              <span className="text-foreground">{checklist.name}</span>
                              <span className="text-muted-foreground">{checklist.items.length} tasks</span>
                            </div>
                          ))}
                        {template.checklistTemplates.length > 3 && (
                          <div className="text-xs text-muted-foreground px-2">
                            +{template.checklistTemplates.length - 3} more checklists
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => (window.location.href = `/agent/workflow-templates/${template.id}`)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(template.id)} title="Edit template">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicate(template)}
                          title="Duplicate template"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(template.id)}
                          title="Delete template"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg p-12 border border-border text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || typeFilter !== "all"
                  ? "No templates match your current filters."
                  : "Create your first workflow template to get started."}
              </p>
              <Button onClick={() => (window.location.href = "/agent/workflow-templates/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
