import { useState, useCallback, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { apiClient } from "@/lib/api-internal";
import { ENDPOINTS } from "@/lib/constants";

export interface PDFAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  pageNumber: number;
  fontSize?: number;
  color?: { r: number; g: number; b: number };
  type: "text" | "signature";
  userId?: string;
  createdAt: Date;
}

export interface PDFSignature {
  id: string;
  x: number;
  y: number;
  pageNumber: number;
  signatureData: string; // Base64 signature image
  signerName: string;
  signerEmail: string;
  signedAt: Date;
}

interface UsePDFEditorProps {
  documentId?: string; // Opcional - no siempre necesario para edición básica
  documentUrl: string;
  mode?: "view" | "edit" | "sign";
  loadExistingData?: boolean; // Nueva opción para controlar si cargar datos existentes
}

export function usePDFEditor({
  documentId,
  documentUrl,
  mode = "view",
  loadExistingData = true,
}: UsePDFEditorProps) {
  // Si loadExistingData es false, no necesitamos documentId para nada
  const skipApiCalls = !loadExistingData;
  const [annotations, setAnnotations] = useState<PDFAnnotation[]>([]);
  const [signatures, setSignatures] = useState<PDFSignature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(
    null
  );
  const pdfBytesRef = useRef<Uint8Array | null>(null);

  // Cargar anotaciones existentes
  const loadExistingAnnotations = useCallback(async () => {
    // Solo intentar cargar si tenemos un documentId válido y está habilitado
    if (skipApiCalls || !loadExistingData || !documentId) {
      return;
    }

    try {
      const response = await apiClient.get(
        `${ENDPOINTS.internal.DOCUMENTS}/${documentId}/annotations`
      );
      if (response.annotations) {
        setAnnotations(response.annotations);
      }
      if (response.signatures) {
        setSignatures(response.signatures);
      }
    } catch (err) {
      console.warn("No existing annotations found:", err);
    }
  }, [documentId, loadExistingData, skipApiCalls]);

  // Cargar PDF para edición
  const loadPDF = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Usar proxy API para evitar problemas de CORS
      const proxyUrl = `/api/proxy/pdf?url=${encodeURIComponent(documentUrl)}`;

      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error("Failed to load PDF through proxy");
      }

      const pdfArrayBuffer = await response.arrayBuffer();
      const pdfBytes = new Uint8Array(pdfArrayBuffer);
      const doc = await PDFDocument.load(pdfBytes);

      setPdfDoc(doc);
      setOriginalPdfBytes(pdfBytes);
      pdfBytesRef.current = pdfBytes;

      // Cargar anotaciones y firmas existentes solo si está habilitado
      if (!skipApiCalls) {
        await loadExistingAnnotations();
      } else {
        console.log("Skipping API calls - working in standalone mode");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unknown error loading PDF"
      );
    } finally {
      setIsLoading(false);
    }
  }, [documentUrl, skipApiCalls, loadExistingAnnotations]);

  // Agregar anotación
  const addAnnotation = useCallback(
    (annotation: Omit<PDFAnnotation, "id" | "createdAt">) => {
      const newAnnotation: PDFAnnotation = {
        ...annotation,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        fontSize: annotation.fontSize || 12,
        color: annotation.color || { r: 0, g: 0, b: 0 },
      };

      setAnnotations((prev) => [...prev, newAnnotation]);
      return newAnnotation.id;
    },
    []
  );

  // Remover anotación
  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
  }, []);

  // Agregar firma
  const addSignature = useCallback(
    (signature: Omit<PDFSignature, "id" | "signedAt">) => {
      const newSignature: PDFSignature = {
        ...signature,
        id: crypto.randomUUID(),
        signedAt: new Date(),
      };

      setSignatures((prev) => [...prev, newSignature]);
      return newSignature.id;
    },
    []
  );

  // Generar PDF con anotaciones y firmas
  const generateModifiedPDF =
    useCallback(async (): Promise<Uint8Array | null> => {
      if (!pdfDoc || !originalPdfBytes) return null;

      try {
        // Crear copia del documento original
        const pdfDocCopy = await PDFDocument.load(originalPdfBytes);
        const pages = pdfDocCopy.getPages();
        const font = await pdfDocCopy.embedFont(StandardFonts.Helvetica);

        // Aplicar anotaciones de texto
        for (const annotation of annotations) {
          const page = pages[annotation.pageNumber - 1];
          if (page && annotation.type === "text") {
            const { height } = page.getSize();

            page.drawText(annotation.text, {
              x: annotation.x,
              y: height - annotation.y, // Convertir coordenadas Y
              size: annotation.fontSize || 12,
              font,
              color: rgb(
                annotation.color?.r || 0,
                annotation.color?.g || 0,
                annotation.color?.b || 0
              ),
            });
          }
        }

        // Aplicar firmas
        for (const signature of signatures) {
          const page = pages[signature.pageNumber - 1];
          if (page) {
            try {
              // Convertir base64 a imagen
              const signatureBytes = Uint8Array.from(
                atob(signature.signatureData),
                (c) => c.charCodeAt(0)
              );
              const signatureImage = await pdfDocCopy.embedPng(signatureBytes);

              const { height } = page.getSize();

              page.drawImage(signatureImage, {
                x: signature.x,
                y: height - signature.y - 30, // Ajustar para altura de imagen
                width: 120,
                height: 30,
              });
            } catch (err) {
              console.warn("Error embedding signature:", err);
            }
          }
        }

        const modifiedPdfBytes = await pdfDocCopy.save();
        pdfBytesRef.current = modifiedPdfBytes;
        return modifiedPdfBytes;
      } catch (err) {
        setError(
          "Error generating modified PDF: " +
            (err instanceof Error ? err.message : "Unknown error")
        );
        return null;
      }
    }, [pdfDoc, originalPdfBytes, annotations, signatures]);

  // Guardar PDF modificado en el backend
  const savePDF = useCallback(
    async (title?: string, status?: string) => {
      setIsLoading(true);
      try {
        const pdfBytes = await generateModifiedPDF();
        if (!pdfBytes) {
          throw new Error("Failed to generate PDF");
        }

        // En modo standalone, solo generar el PDF sin guardar en API
        if (skipApiCalls || !loadExistingData || !documentId) {
          return true;
        }

        const formData = new FormData();
        const blob = new Blob([new Uint8Array(pdfBytes)], {
          type: "application/pdf",
        });
        formData.append("file", blob, `${title || "modified-document"}.pdf`);
        formData.append("documentId", documentId);
        formData.append("annotations", JSON.stringify(annotations));
        formData.append("signatures", JSON.stringify(signatures));

        if (status) {
          formData.append("status", status);
        }

        const response = await apiClient.put(
          `${ENDPOINTS.internal.DOCUMENTS}/${documentId}`,
          formData,
          { showError: true, errorTitle: "Error saving document" }
        );

        return !!response;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error saving PDF");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [
      documentId,
      annotations,
      signatures,
      generateModifiedPDF,
      loadExistingData,
      skipApiCalls,
    ]
  );

  // Descargar PDF modificado
  const downloadPDF = useCallback(
    async (filename?: string) => {
      const pdfBytes = await generateModifiedPDF();
      if (!pdfBytes) return;

      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    [generateModifiedPDF]
  );

  return {
    // Estado
    annotations,
    signatures,
    isLoading,
    error,
    pdfDoc,

    // Métodos
    loadPDF,
    addAnnotation,
    removeAnnotation,
    addSignature,
    generateModifiedPDF,
    savePDF,
    downloadPDF,

    // Utilidades
    canEdit: mode === "edit",
    canSign: mode === "sign",
    hasChanges: annotations.length > 0 || signatures.length > 0,
  };
}
