"use client";

import { useState } from "react";
import {
  Download,
  Maximize2,
  Minimize2,
  Loader2,
  FileText,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import LoadingState from "@/components/molecules/LoadingState";
import ErrorState from "@/components/molecules/ErrorState";

interface PDFViewerProps {
  documentUrl: string;
  documentTitle?: string;
  allowDownload?: boolean;
  allowFullscreen?: boolean;
  showToolbar?: boolean;
  className?: string;
  onError?: (error: string) => void;
  onLoad?: () => void;
}

export default function PDFViewer({
  documentUrl,
  documentTitle = "Document",
  allowDownload = true,
  allowFullscreen = true,
  showToolbar = true,
  className = "",
  onError,
  onLoad,
}: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
    onLoad?.();
  };

  const handleError = (errorMsg: string) => {
    setIsLoading(false);
    setError(errorMsg);
    onError?.(errorMsg);
  };

  const handleDownload = async () => {
    if (!allowDownload) return;

    try {
      const response = await fetch(documentUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${documentTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      handleError(
        err instanceof Error ? err.message : "Failed to download document"
      );
    }
  };

  const toggleFullscreen = () => {
    if (!allowFullscreen) return;
    setIsFullscreen(!isFullscreen);
  };

  if (!documentUrl) {
    return (
      <ErrorState
        title="No Document Available"
        error="No document URL provided"
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <div
        className={`relative bg-card rounded-lg border border-border overflow-hidden ${className}`}
      >
        {/* Toolbar Minimalista - Solo lo que el navegador NO puede hacer */}
        {showToolbar && (
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted/5">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                {documentTitle}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              {/* Solo funcionalidades que el navegador no ofrece directamente */}

              {/* Fullscreen personalizado */}
              {allowFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
              )}

              {/* Download personalizado (por si queremos renombrar el archivo) */}
              {allowDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  title="Download document"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* PDF Content - Dejamos que el navegador maneje todo */}
        <div className="relative h-full min-h-[600px] overflow-auto">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Loading document...
                </h3>
                <p className="text-muted-foreground">
                  Please wait while the document loads
                </p>
              </div>
            </div>
          )}

          {error ? (
            <ErrorState
              title="Document Load Error"
              error={error}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <iframe
              src={documentUrl} // URL limpia, sin parámetros que interfieran
              className="w-full h-full border-0"
              title={documentTitle}
              onLoad={handleLoad}
              onError={() => handleError("Failed to load document")}
              loading="lazy"
            />
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-background border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              {documentTitle}
            </h2>
            <Button
              variant="ghost"
              onClick={toggleFullscreen}
              className="text-foreground hover:text-destructive"
            >
              <Minimize2 className="w-5 h-5" />
            </Button>
          </div>
          <iframe
            src={documentUrl}
            className="flex-1 border-0 bg-white"
            title={documentTitle}
            loading="lazy"
          />
        </div>
      )}
    </>
  );
}
