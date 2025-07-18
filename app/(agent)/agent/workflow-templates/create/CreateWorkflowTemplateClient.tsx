"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Plus, Trash2, GripVertical, ChevronDown, ChevronRight, AlertCircle } from "lucide-react"
import DashboardLayout from "@/components/templates/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TransactionType, type ChecklistTemplate, type ChecklistItem } from "@/types/workflow-templates"

const mockAgentUser = {
  name: "Ana García",
  role: "agent" as const,
}

interface FormData {
  name: string
  transactionType: TransactionType | ""
  checklists: ChecklistTemplate[]
}

interface FormErrors {
  name?: string
  transactionType?: string
  checklists?: string
}

export default function CreateWorkflowTemplateClient() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    transactionType: "",
    checklists: [],
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(new Set())

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Template name is required"
    }

    if (!formData.transactionType) {
      newErrors.transactionType = "Transaction type is required"
    }

    if (formData.checklists.length === 0) {
      newErrors.checklists = "At least one checklist is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to templates list
      window.location.href = "/agent/workflow-templates"
    } catch (error) {
      console.error("Error creating template:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addChecklist = () => {
    const newChecklist: ChecklistTemplate = {
      id: `temp-${Date.now()}`,
      name: "",
      description: "",
      order: formData.checklists.length + 1,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setFormData((prev) => ({
      ...prev,
      checklists: [...prev.checklists, newChecklist],
    }))

    // Expand the new checklist
    setExpandedChecklists((prev) => new Set([...prev, newChecklist.id]))
  }

  const removeChecklist = (checklistId: string) => {
    setFormData((prev) => ({
      ...prev,
      checklists: prev.checklists.filter((c) => c.id !== checklistId),
    }))

    setExpandedChecklists((prev) => {
      const newSet = new Set(prev)
      newSet.delete(checklistId)
      return newSet
    })
  }

  const updateChecklist = (checklistId: string, field: keyof ChecklistTemplate, value: any) => {
    setFormData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((checklist) =>
        checklist.id === checklistId ? { ...checklist, [field]: value, updatedAt: new Date() } : checklist,
      ),
    }))
  }

  const addItem = (checklistId: string) => {
    const newItem: ChecklistItem = {
      id: `temp-item-${Date.now()}`,
      description: "",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setFormData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: [...checklist.items, { ...newItem, order: checklist.items.length + 1 }],
              updatedAt: new Date(),
            }
          : checklist,
      ),
    }))
  }

  const removeItem = (checklistId: string, itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.filter((item) => item.id !== itemId),
              updatedAt: new Date(),
            }
          : checklist,
      ),
    }))
  }

  const updateItem = (checklistId: string, itemId: string, description: string) => {
    setFormData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.map((item) =>
                item.id === itemId ? { ...item, description, updatedAt: new Date() } : item,
              ),
              updatedAt: new Date(),
            }
          : checklist,
      ),
    }))
  }

  const toggleChecklistExpansion = (checklistId: string) => {
    setExpandedChecklists((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(checklistId)) {
        newSet.delete(checklistId)
      } else {
        newSet.add(checklistId)
      }
      return newSet
    })
  }

  return (
    <DashboardLayout user={mockAgentUser}>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Workflow Template</h1>
            <p className="text-muted-foreground">Create a new workflow template for transactions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="Enter template name..."
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-type">Transaction Type</Label>
                <Select
                  value={formData.transactionType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, transactionType: value as TransactionType }))
                  }
                >
                  <SelectTrigger className={errors.transactionType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TransactionType.SALE}>Sale</SelectItem>
                    <SelectItem value={TransactionType.PURCHASE}>Purchase</SelectItem>
                    <SelectItem value={TransactionType.LEASE}>Lease</SelectItem>
                    <SelectItem value={TransactionType.RENTAL}>Rental</SelectItem>
                  </SelectContent>
                </Select>
                {errors.transactionType && <p className="text-sm text-destructive">{errors.transactionType}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Checklists */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Checklists</CardTitle>
                <Button type="button" onClick={addChecklist} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Checklist
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {errors.checklists && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.checklists}</AlertDescription>
                </Alert>
              )}

              {formData.checklists.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No checklists added yet. Click "Add Checklist" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.checklists.map((checklist, index) => (
                    <Card key={checklist.id} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                            <span className="text-sm font-medium text-muted-foreground">Checklist {index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleChecklistExpansion(checklist.id)}
                              className="p-1"
                            >
                              {expandedChecklists.has(checklist.id) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChecklist(checklist.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      {expandedChecklists.has(checklist.id) && (
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`checklist-name-${checklist.id}`}>Checklist Name</Label>
                              <Input
                                id={`checklist-name-${checklist.id}`}
                                placeholder="Enter checklist name..."
                                value={checklist.name}
                                onChange={(e) => updateChecklist(checklist.id, "name", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`checklist-desc-${checklist.id}`}>Description (Optional)</Label>
                              <Input
                                id={`checklist-desc-${checklist.id}`}
                                placeholder="Enter description..."
                                value={checklist.description}
                                onChange={(e) => updateChecklist(checklist.id, "description", e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Items */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label>Checklist Items</Label>
                              <Button type="button" variant="outline" size="sm" onClick={() => addItem(checklist.id)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Item
                              </Button>
                            </div>

                            {checklist.items.length === 0 ? (
                              <div className="text-center py-4 text-muted-foreground text-sm">
                                No items added yet. Click "Add Item" to add checklist items.
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {checklist.items.map((item, itemIndex) => (
                                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                                    <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                                      {itemIndex + 1}.
                                    </span>
                                    <Input
                                      placeholder="Enter item description..."
                                      value={item.description}
                                      onChange={(e) => updateItem(checklist.id, item.id, e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeItem(checklist.id, item.id)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Template"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
