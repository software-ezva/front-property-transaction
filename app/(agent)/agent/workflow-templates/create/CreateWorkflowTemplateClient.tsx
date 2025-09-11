"use client";
import { SortableChecklist } from "@/components/organisms/SortableChecklist";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TransactionType,
  type ChecklistTemplate,
  type ChecklistItem,
} from "@/types/workflow-templates";
import { SortableItem } from "../../../../../components/organisms/SortableItem";
import { useWorkflowTemplates } from "@/hooks/use-workflow-templates";
import { ENDPOINTS } from "@/lib/constants";

interface FormData {
  name: string;
  transactionType: TransactionType | "";
  checklists: ChecklistTemplate[];
}

interface FormErrors {
  name?: string;
  transactionType?: string;
  checklists?: string;
}

function CreateWorkflowTemplateClient() {
  const router = useRouter();
  const { createTemplate } = useWorkflowTemplates();

  // Only call hooks at the top level, not inside loops or conditionals
  const sensors = useSensors(useSensor(PointerSensor));
  const checklistSensors = useSensors(useSensor(PointerSensor));
  const [formData, setFormData] = useState<FormData>({
    name: "",
    transactionType: "",
    checklists: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(
    new Set()
  );

  // Funciones helper necesarias
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Template name is required";
    }
    if (!formData.transactionType) {
      newErrors.transactionType = "Transaction type is required";
    }
    if (formData.checklists.length === 0) {
      newErrors.checklists = "At least one checklist is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare data for API - only send required fields
      const createData = {
        name: formData.name,
        transactionType: formData.transactionType as TransactionType,
        checklistTemplates: formData.checklists.map((checklist, order) => ({
          name: checklist.name,
          description: checklist.description || "",
          order: order + 1,
          items: checklist.items.map((item, itemOrder) => ({
            description: item.description,
            order: itemOrder + 1,
          })),
        })),
      };

      // The hook automatically handles errors via useErrorNotification
      await createTemplate(createData);

      // If we get here, it was successful - redirect to template list
      router.push("/agent/workflow-templates");
    } catch (error) {
      // Errors are already handled automatically by the notification system
      console.error("Error creating template:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addChecklist = () => {
    const newChecklist: ChecklistTemplate = {
      id: Date.now().toString(),
      name: "",
      description: "",
      order: formData.checklists.length + 1,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setFormData((prev) => ({
      ...prev,
      checklists: [...prev.checklists, newChecklist],
    }));
    setExpandedChecklists((prev) => new Set([...prev, newChecklist.id]));
  };

  const toggleChecklistExpansion = (id: string) => {
    setExpandedChecklists((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const removeChecklist = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      checklists: prev.checklists.filter((c) => c.id !== id),
    }));
    setExpandedChecklists((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const updateChecklist = (
    id: string,
    field: keyof ChecklistTemplate,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  };

  const addItem = (checklistId: string) => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      description: "",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setFormData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((c) =>
        c.id === checklistId ? { ...c, items: [...c.items, newItem] } : c
      ),
    }));
  };

  const updateItem = (
    checklistId: string,
    itemId: string,
    description: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((c) =>
        c.id === checklistId
          ? {
              ...c,
              items: c.items.map((item) =>
                item.id === itemId ? { ...item, description } : item
              ),
            }
          : c
      ),
    }));
  };

  const removeItem = (checklistId: string, itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((c) =>
        c.id === checklistId
          ? { ...c, items: c.items.filter((item) => item.id !== itemId) }
          : c
      ),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Create Workflow Template
          </h1>
          <p className="text-muted-foreground">
            Create a new workflow template for transactions
          </p>
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction-type">Transaction Type</Label>
              <Select
                value={formData.transactionType}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    transactionType: value as TransactionType,
                  }))
                }
              >
                <SelectTrigger
                  className={errors.transactionType ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TransactionType).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.transactionType && (
                <p className="text-sm text-destructive">
                  {errors.transactionType}
                </p>
              )}
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
                <p>
                  No checklists added yet. Click "Add Checklist" to get started.
                </p>
              </div>
            ) : (
              <DndContext
                sensors={checklistSensors}
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                  if (!over || active.id === over.id) return;
                  setFormData((prev) => ({
                    ...prev,
                    checklists: arrayMove(
                      prev.checklists,
                      prev.checklists.findIndex((c) => c.id === active.id),
                      prev.checklists.findIndex((c) => c.id === over.id)
                    ).map((cl, idx) => ({ ...cl, order: idx + 1 })),
                  }));
                }}
              >
                <SortableContext
                  items={formData.checklists.map((cl) => cl.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {formData.checklists.map((checklist, index) => (
                      <SortableChecklist
                        key={checklist.id}
                        id={checklist.id}
                        index={index}
                        checklist={checklist}
                        expanded={expandedChecklists.has(checklist.id)}
                        toggleExpansion={toggleChecklistExpansion}
                        removeChecklist={removeChecklist}
                        updateChecklist={updateChecklist}
                        addItem={addItem}
                        updateItem={updateItem}
                        removeItem={removeItem}
                        sensors={sensors}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Template"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Export usando withAgentAuth como HOC (ahora no es necesario porque el layout maneja la auth)
export default CreateWorkflowTemplateClient;
