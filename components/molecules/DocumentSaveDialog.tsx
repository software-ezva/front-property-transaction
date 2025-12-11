"use client";

import { useEffect, useState } from "react";
import { Save, X, Check } from "lucide-react";
import Button from "@/components/atoms/Button";
import { Checkbox } from "@/components/ui/checkbox";

export interface DocumentSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (isReadyToSign: boolean) => void;
  title: string;
  documentTitle: string;
  isReadyForReview: boolean;
  isLoading?: boolean;
}

export default function DocumentSaveDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  documentTitle,
  isReadyForReview,
  isLoading = false,
}: DocumentSaveDialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isReadyToSign, setIsReadyToSign] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the transition plays after mount
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsReadyToSign(false); // Reset checkbox when dialog opens
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm(isReadyToSign);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        margin: 0,
        padding: 16,
        boxSizing: "border-box",
        width: "100vw",
        height: "100vh",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-card rounded-lg border border-border w-full max-w-lg shadow-2xl transition-all duration-200 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Save className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-muted"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Are you sure you want to save the changes to{" "}
            <strong>&quot;{documentTitle}&quot;</strong>?
          </p>

          {/* Ready for Review Status */}
          {isReadyForReview && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  This document will be marked as ready for review.
                </span>
              </div>
            </div>
          )}

          {/* Ready to Sign Checkbox */}
          <div className="border border-border rounded-md p-4 bg-muted/20">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="ready-to-sign"
                checked={isReadyToSign}
                onCheckedChange={(checked) => setIsReadyToSign(!!checked)}
                disabled={isLoading}
              />
              <div className="space-y-1">
                <label
                  htmlFor="ready-to-sign"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Mark document as ready to sign
                </label>
                <p className="text-xs text-muted-foreground">
                  This will notify the client that the document is ready for
                  their signature.
                </p>
              </div>
            </div>

            {isReadyToSign && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <Check className="w-3 h-3 inline mr-1" />
                The client will be notified that this document is ready for
                signature.
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/20">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading}
            className="min-w-[100px] flex items-center gap-2"
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
