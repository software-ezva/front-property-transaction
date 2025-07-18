"use client"

import { useState } from "react"
import { ArrowLeft, Edit, Copy, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import DashboardLayout from "@/components/templates/DashboardLayout"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Link from "next/link"
import { TransactionType, type WorkflowTemplate } from "@/types/workflow-templates"

const mockAgentUser = {
  name: "Ana García",
  role: "agent" as const,
}

// Mock data - en una app real esto vendría de la API
const mockWorkflowTemplate: WorkflowTemplate = {
  id: "wt-1",
  transactionType: TransactionType.SALE,
  name: "Standard Property Sale",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-20"),
  checklistTemplates: [
    {
      id: "ct-1",
      name: "Initial Setup & Documentation",
      description: "Initial documentation and setup tasks for property sale",
      order: 1,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      items: [
        {
          id: "it-1",
          description: "Initial client consultation and needs assessment",
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-2",
          description: "Property listing agreement signed",
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-3",
          description: "MLS listing created and published",
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-4",
          description: "Professional photography scheduled",
          order: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: "ct-2",
      name: "Marketing & Showings",
      description: "Property marketing and promotion activities",
      order: 2,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      items: [
        {
          id: "it-5",
          description: "Property photos and virtual tour completed",
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-6",
          description: "Marketing materials created (flyers, brochures)",
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-7",
          description: "Open house events scheduled and conducted",
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-8",
          description: "Private showings with qualified buyers",
          order: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: "ct-3",
      name: "Offer & Negotiation",
      description: "Handle offers and negotiate terms",
      order: 3,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      items: [
        {
          id: "it-9",
          description: "Buyer offer received and reviewed",
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-10",
          description: "Offer terms negotiated with buyer's agent",
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-11",
          description: "Purchase agreement signed by all parties",
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-12",
          description: "Earnest money deposit received",
          order: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: "ct-4",
      name: "Due Diligence & Inspections",
      description: "Property inspections and due diligence process",
      order: 4,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      items: [
        {
          id: "it-13",
          description: "Home inspection scheduled and completed",
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-14",
          description: "Inspection report reviewed with client",
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-15",
          description: "Appraisal ordered and scheduled",
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-16",
          description: "Title search and insurance initiated",
          order: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: "ct-5",
      name: "Closing Preparation",
      description: "Prepare for closing and final transfer",
      order: 5,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      items: [
        {
          id: "it-17",
          description: "Final walkthrough scheduled",
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-18",
          description: "Closing documents prepared and reviewed",
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-19",
          description: "Funds transfer arrangements confirmed",
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "it-20",
          description: "Keys and property access prepared",
          order: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ],
}

interface WorkflowTemplateDetailsClientProps {
  templateId: string
}

export default function WorkflowTemplateDetailsClient({ templateId }: WorkflowTemplateDetailsClientProps) {
  const [expandedChecklists, setExpandedChecklists] = useState<string[]>(["ct-1", "ct-2"])

  // En una app real, aquí harías fetch de los datos usando el templateId
  const template = mockWorkflowTemplate

  const toggleChecklistExpansion = (checklistId: string) => {
    setExpandedChecklists((prev) =>
      prev.includes(checklistId) ? prev.filter((id) => id !== checklistId) : [...prev, checklistId],
    )
  }

  const handleEdit = () => {
    window.location.href = `/agent/workflow-templates/${templateId}/edit`
  }

  const handleDuplicate = () => {
    // Lógica para duplicar template
    console.log("Duplicate template:", templateId)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this workflow template?")) {
      console.log("Delete template:", templateId)
      window.location.href = "/agent/workflow-templates"
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
      [TransactionType.SALE]: "success" as const,
      [TransactionType.PURCHASE]: "warning" as const,
      [TransactionType.LEASE]: "default" as const,
      [TransactionType.RENTAL]: "error" as const,
    }
    return variants[type]
  }

  const getTotalTasks = () => {
    return template.checklistTemplates.reduce((total, checklist) => total + checklist.items.length, 0)
  }

  return (
    <DashboardLayout user={mockAgentUser}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/agent/workflow-templates">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-primary">{template.name}</h1>
              <p className="text-muted-foreground font-secondary">Workflow Template Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getTransactionTypeVariant(template.transactionType)}>
              {getTransactionTypeLabel(template.transactionType)}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive bg-transparent"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Template Overview */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Template Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{template.checklistTemplates.length}</div>
              <div className="text-sm text-muted-foreground">Checklists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{getTotalTasks()}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-tertiary">{template.createdAt.toLocaleDateString()}</div>
              <div className="text-sm text-muted-foreground">Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{template.updatedAt.toLocaleDateString()}</div>
              <div className="text-sm text-muted-foreground">Last Updated</div>
            </div>
          </div>
        </div>

        {/* Workflow Structure */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Workflow Structure</h2>
            <p className="text-muted-foreground">Detailed breakdown of checklists and tasks</p>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {template.checklistTemplates
                .sort((a, b) => a.order - b.order)
                .map((checklist, checklistIndex) => {
                  const isExpanded = expandedChecklists.includes(checklist.id)

                  return (
                    <div key={checklist.id} className="relative">
                      {/* Vertical line connecting checklists */}
                      {checklistIndex < template.checklistTemplates.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-16 bg-border" />
                      )}

                      {/* Checklist Header */}
                      <div
                        className="flex items-center space-x-4 cursor-pointer hover:bg-muted/30 rounded-lg p-3 transition-colors"
                        onClick={() => toggleChecklistExpansion(checklist.id)}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground text-xs font-bold">{checklist.order}</span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{checklist.name}</h3>
                              <p className="text-sm text-muted-foreground">{checklist.description}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-muted-foreground">{checklist.items.length} tasks</span>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Checklist Items */}
                      {isExpanded && (
                        <div className="ml-10 mt-4 space-y-2">
                          {checklist.items
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                              <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                <div className="flex-shrink-0">
                                  <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center">
                                    <span className="text-muted-foreground text-xs">{item.order}</span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-foreground">{item.description}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Usage Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">12</div>
              <div className="text-sm text-muted-foreground">Active Transactions</div>
              <div className="text-xs text-muted-foreground mt-1">Using this template</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">45</div>
              <div className="text-sm text-muted-foreground">Completed Transactions</div>
              <div className="text-xs text-muted-foreground mt-1">Total completed</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">87%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-xs text-muted-foreground mt-1">Transactions closed</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
