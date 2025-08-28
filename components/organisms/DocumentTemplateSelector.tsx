import { useState } from "react";
import { FileText, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/atoms/Button";
import { DocumentTemplate, DocumentCategory } from "@/types/document-templates";

interface DocumentTemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: DocumentTemplate[];
  selectedTemplates: Set<string>;
  onTemplateToggle: (templateId: string) => void;
  onAddSelected: () => void;
  loading?: boolean;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function DocumentTemplateSelector({
  open,
  onOpenChange,
  templates,
  selectedTemplates,
  onTemplateToggle,
  onAddSelected,
  loading = false,
}: DocumentTemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleClose = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b border-border">
            <DialogTitle>Add Documents from Templates</DialogTitle>
            <DialogDescription>
              Select document templates to add to this transaction. You can
              search and filter templates by category.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="p-4 space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
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
              </div>

              {/* Add Button and Selection Summary */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedTemplates.size > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <strong>{selectedTemplates.size}</strong> selected
                    </div>
                  )}
                </div>
                <Button
                  onClick={onAddSelected}
                  disabled={selectedTemplates.size === 0 || loading}
                  size="sm"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    `Add ${selectedTemplates.size || ""} ${
                      selectedTemplates.size === 1 ? "Document" : "Documents"
                    }`
                  )}
                </Button>
              </div>

              {/* Templates List */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {filteredTemplates.length > 0 ? (
                    <div className="divide-y divide-border">
                      {filteredTemplates.map((template) => (
                        <div
                          key={template.uuid}
                          className="flex items-center space-x-3 p-3 hover:bg-muted/30 transition-colors"
                        >
                          <Checkbox
                            id={template.uuid}
                            checked={selectedTemplates.has(template.uuid)}
                            onCheckedChange={() =>
                              onTemplateToggle(template.uuid)
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={template.uuid}
                              className="font-medium text-foreground cursor-pointer block truncate text-sm"
                            >
                              {template.title}
                            </label>
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                              <span>{template.category}</span>
                              <span>•</span>
                              <span>{formatDate(template.updatedAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        No templates found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-4 py-3 border-t border-border">
            <Button variant="outline" onClick={handleClose} size="sm">
              Cancel
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
