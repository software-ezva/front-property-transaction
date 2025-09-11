"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, FileText, Save } from "lucide-react";
import DashboardLayout from "@/components/templates/DashboardLayout";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/molecules/PageTitle";
import LoadingState from "@/components/molecules/LoadingState";

import { DocumentCategory } from "@/types/document-templates";
import { createTemplate } from "@/lib/api/document-templates";

export default function CreateDocumentTemplateClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: DocumentCategory.MISCELLANEOUS,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const processFile = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    setSelectedFile(file);

    // Extraer el nombre del archivo sin la extensión para usar como título
    const fileName = file.name;
    const titleFromFile =
      fileName.substring(0, fileName.lastIndexOf(".")) || fileName;

    // Solo actualizar el título si está vacío o si es la primera vez que se selecciona un archivo
    if (!formData.title.trim()) {
      setFormData((prev) => ({
        ...prev,
        title: titleFromFile,
      }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a document file");
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    setIsSubmitting(true);

    try {
      const newTemplate = await createTemplate({
        title: formData.title.trim(),
        category: formData.category as DocumentCategory,
        file: selectedFile,
      });

      // Redirigir a la lista de templates con el UUID del template recién creado
      router.push(`/agent/document-templates?viewTemplate=${newTemplate.uuid}`);
    } catch (error) {
      console.error("Error creating template:", error);
      // El error se mostrará automáticamente por el sistema de notificaciones
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <LoadingState
            title="Creating Template..."
            description="Please wait while we upload your document template."
            icon={FileText}
            size="lg"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/agent/document-templates")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Button>
        <div>
          <PageTitle
            title="Create Document Template"
            subtitle="Add a new document template for real estate transactions"
          />
        </div>
      </div>
      {/* Form */}
      <div className="bg-card rounded-lg border border-border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload - Ahora primero */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Step 1: Upload Document
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Start by selecting your document file. The title will be
                automatically extracted from the filename.
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="w-12 h-12 text-primary mx-auto" />
                  <p className="text-foreground font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      // Limpiar el título cuando se remueve el archivo
                      setFormData((prev) => ({
                        ...prev,
                        title: "",
                      }));
                    }}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-foreground font-medium">
                    {isDragOver
                      ? "Drop your document here!"
                      : "Upload Document Template"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop a PDF or Word document here, or click to
                    select
                  </p>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select File
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOC, DOCX. Maximum file size: 10MB
            </p>
          </div>

          {/* Basic Information - Ahora después del archivo */}
          {selectedFile && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Step 2: Template Information
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Review and customize the template details extracted from your
                  file.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter document title"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can modify the title extracted from the file name
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    {Object.values(DocumentCategory).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/agent/document-templates")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || !formData.title.trim() || isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Template"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
