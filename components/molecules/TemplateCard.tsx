import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Edit, Copy, Trash2, Settings } from "lucide-react";
import React from "react";

interface TemplateCardProps {
  template: any;
  getTransactionTypeLabel: (type: string) => string;
  onEdit: (id: string) => void;
  onDuplicate: (template: any) => void;
  onDelete: (id: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  getTransactionTypeLabel,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  return (
    <div className="bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Title and Badge in one row */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {template.name}
          </h3>
          <Badge>{getTransactionTypeLabel(template.transactionType)}</Badge>
        </div>

        {/* Checklists Preview */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-foreground">Checklists:</h4>
          <div className="space-y-1">
            {template.checklistTemplates
              .slice(0, 3)
              .map((checklist: any, idx: number) => (
                <div
                  key={checklist.name + idx}
                  className="flex items-center justify-between text-xs bg-muted/30 rounded px-2 py-1"
                >
                  <span className="text-foreground">{checklist.name}</span>
                  <span className="text-muted-foreground">
                    {typeof checklist.taskCount === "number"
                      ? checklist.taskCount
                      : 0}{" "}
                    tasks
                  </span>
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
              onClick={() =>
                (window.location.href = `/agent/workflow-templates/${template.id}`)
              }
            >
              <Settings className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(template.id)}
              title="Edit template"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicate(template)}
              title="Duplicate template"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(template.id)}
              title="Delete template"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
