"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, FileText, Save } from "lucide-react"
import DashboardLayout from "@/components/templates/DashboardLayout"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import { DocumentCategory } from "@/types/document-templates"

const mockAgentUser = {
  name: "Ana García",
  role: "agent" as const,
}

export default function CreateDocumentTemplateClient() {
  const [formData, setFormData] = useState({
    title: "",
    category: DocumentCategory.MISCELLANEOUS,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      if (!allowedTypes.includes(file.type)) {
        alert("Please select a PDF or Word document (.pdf, .doc, .docx)")
        return
      }

      setSelectedFile(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      alert("Please select a document file")
      return
    }

    console.log("Creating template:", formData, selectedFile)
    // Here you would typically upload the file and send the data to your API
    window.location.href = "/agent/document-templates"
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => (window.location.href = "/agent/document-templates")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-primary">Create Document Template</h1>
            <p className="text-muted-foreground font-secondary">
              Add a new document template for real estate transactions
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg border border-border">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Template Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter document title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
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

            {/* File Upload */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Document File</h2>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileText className="w-12 h-12 text-primary mx-auto" />
                    <p className="text-foreground font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <Button type="button" variant="outline" onClick={() => setSelectedFile(null)}>
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-foreground font-medium">Upload Document Template</p>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop a PDF or Word document here, or click to select
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
                      onClick={() => document.getElementById("file-upload")?.click()}
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

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => (window.location.href = "/agent/document-templates")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedFile || !formData.title.trim()}>
                <Save className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
          </form>
        </div>
      </div>
  )
}
