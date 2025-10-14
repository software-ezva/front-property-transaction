"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Save, Type, Download, Undo, Plus, X, Trash2 } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { usePDFEditor, type PDFAnnotation } from "@/hooks/use-pdf-editor";
import LoadingState from "@/components/molecules/LoadingState";
import ErrorState from "@/components/molecules/ErrorState";
import PDFViewer from "./PDFViewer";

interface PDFEditorProps {
  documentId?: string; // Opcional para casos de solo visualización/edición sin API
  documentUrl: string;
  documentTitle: string;
  onSave?: (success: boolean) => void;
  onCancel?: () => void;
  className?: string;
}

export default function PDFEditor({
  documentId,
  documentUrl,
  documentTitle,
  onSave,
  onCancel,
  className = "",
}: PDFEditorProps) {
  const {
    annotations,
    isLoading,
    error,
    loadPDF,
    addAnnotation,
    removeAnnotation,
    savePDF,
    hasChanges,
    canEdit,
  } = usePDFEditor({
    documentId,
    documentUrl,
    mode: "edit",
    loadExistingData: false, // Don't load existing annotations from API
  });

  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotationText, setAnnotationText] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [previewText, setPreviewText] = useState(""); // Preview text while typing

  const pdfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPDF();
  }, [loadPDF]);

  // Handle PDF click to add annotation
  const handlePDFClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isAnnotating || !canEdit) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setClickPosition({ x, y });
      setShowTextInput(true);
    },
    [isAnnotating, canEdit]
  );

  // Confirm annotation
  const confirmAnnotation = useCallback(() => {
    if (!clickPosition || !annotationText.trim()) return;

    addAnnotation({
      x: clickPosition.x,
      y: clickPosition.y,
      text: annotationText.trim(),
      pageNumber: currentPage,
      fontSize: 12,
      color: { r: 0, g: 0, b: 0 },
      type: "text",
    });

    // Reset
    setAnnotationText("");
    setPreviewText(""); // Clear preview
    setShowTextInput(false);
    setClickPosition(null);
    setIsAnnotating(false);
  }, [clickPosition, annotationText, currentPage, addAnnotation]);

  // Cancel annotation
  const cancelAnnotation = useCallback(() => {
    setAnnotationText("");
    setPreviewText(""); // Clear preview
    setShowTextInput(false);
    setClickPosition(null);
    setIsAnnotating(false);
  }, []);

  // Save PDF
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await savePDF(documentTitle, "ready");
      onSave?.(success);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle keys in annotation input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      confirmAnnotation();
    } else if (e.key === "Escape") {
      cancelAnnotation();
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        title="Loading document editor..."
        description="Please wait while we prepare the document for editing"
      />
    );
  }

  if (error) {
    return (
      <ErrorState title="Editor Load Error" error={error} onRetry={loadPDF} />
    );
  }

  return (
    <div
      className={`bg-card rounded-lg border border-border overflow-hidden ${className}`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/5">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-foreground">{documentTitle}</h3>
          {annotations.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {annotations.length} annotation
              {annotations.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Activate annotation mode */}
          <Button
            variant={isAnnotating ? "primary" : "outline"}
            size="sm"
            onClick={() => setIsAnnotating(!isAnnotating)}
            disabled={!canEdit}
          >
            <Type className="w-4 h-4 mr-1" />
            {isAnnotating ? "Annotating..." : "Annotate"}
          </Button>

          {/* Undo last annotation */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const lastAnnotation = annotations[annotations.length - 1];
              if (lastAnnotation) removeAnnotation(lastAnnotation.id);
            }}
            disabled={annotations.length === 0}
            title="Undo last annotation"
          >
            <Undo className="w-4 h-4" />
          </Button>

          {/* Cancel */}
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              size="sm"
            >
              Cancel
            </Button>
          )}

          {/* Save */}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            size="sm"
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Instructions */}
      {isAnnotating && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-sm">
          📝 Click anywhere on the document to add an annotation
        </div>
      )}

      {/* PDF Container */}
      <div className="relative h-[600px] overflow-auto bg-muted/10">
        <div ref={pdfContainerRef} className="h-full w-full relative">
          <PDFViewer
            documentUrl={documentUrl}
            documentTitle={documentTitle}
            allowDownload={false}
            allowFullscreen={false}
            showToolbar={false}
            className="h-full"
          />

          {/* Transparent overlay for annotation clicks */}
          {isAnnotating && (
            <div
              className="absolute inset-0 cursor-crosshair z-20"
              onClick={handlePDFClick}
            />
          )}
        </div>

        {/* Annotations Overlay - Simulating final appearance */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {annotations
            .filter((ann) => ann.pageNumber === currentPage)
            .map((annotation) => (
              <div
                key={annotation.id}
                className="absolute pointer-events-auto group"
                style={{
                  left: annotation.x,
                  top: annotation.y,
                  transform: "translate(0, -100%)", // Inicia en el punto, se extiende a la derecha
                }}
              >
                {/* Text as it will appear in the final PDF */}
                <div
                  className="relative select-none cursor-pointer"
                  style={{
                    fontSize: `${annotation.fontSize || 12}px`,
                    color: `rgb(${annotation.color?.r || 0}, ${
                      annotation.color?.g || 0
                    }, ${annotation.color?.b || 0})`,
                    fontFamily: "Arial, sans-serif", // Fuente similar a Helvetica del PDF
                    fontWeight: "normal",
                    lineHeight: "1.2",
                    textShadow: "0 0 2px rgba(255,255,255,0.8)", // Sombra sutil para mejor legibilidad
                  }}
                >
                  {annotation.text}

                  {/* Delete button that appears on hover */}
                  <button
                    onClick={() => removeAnnotation(annotation.id)}
                    className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-bold hover:bg-red-600"
                    title="Delete annotation"
                    style={{ fontSize: "10px" }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

          {/* Preview of text while typing */}
          {showTextInput && clickPosition && previewText && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: clickPosition.x,
                top: clickPosition.y,
                transform: "translate(0, -100%)", // Preview también inicia en el punto
              }}
            >
              <div
                className="opacity-70"
                style={{
                  fontSize: "12px",
                  color: "rgb(0, 0, 0)",
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "normal",
                  lineHeight: "1.2",
                  textShadow: "0 0 4px rgba(255,255,255,1)", // Sombra más visible para preview
                }}
              >
                {previewText}
              </div>
            </div>
          )}
        </div>

        {/* Text input for new annotation */}
        {showTextInput && clickPosition && (
          <div
            className="absolute z-30"
            style={{
              left: clickPosition.x,
              top: clickPosition.y - 60, // Position input slightly above the text
              transform: "translate(0, 0)", // Input starts at the point, like the text
            }}
            onClick={(e) => e.stopPropagation()} // Prevent click from propagating to parent container
          >
            <div className="bg-background border-2 border-primary rounded-lg p-3 shadow-xl min-w-[250px]">
              <Input
                value={annotationText}
                onChange={(e) => {
                  setAnnotationText(e.target.value);
                  setPreviewText(e.target.value); // Update preview in real time
                }}
                placeholder="Type your annotation..."
                className="mb-2"
                autoFocus
                onKeyDown={handleKeyPress}
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={confirmAnnotation}
                  disabled={!annotationText.trim()}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
                <Button variant="outline" size="sm" onClick={cancelAnnotation}>
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Annotations list */}
      {annotations.length > 0 && (
        <div className="border-t border-border p-4 bg-muted/5">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Annotations ({annotations.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {annotations.map((annotation, index) => (
              <div
                key={annotation.id}
                className="flex items-center justify-between p-2 bg-background rounded border border-border"
              >
                <div className="flex-1">
                  <span className="text-sm text-foreground">
                    {annotation.text}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    (Page {annotation.pageNumber})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAnnotation(annotation.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
