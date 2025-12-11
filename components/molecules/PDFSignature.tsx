"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Save, PenTool, Download, Undo, X, Trash2, Check } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { usePDFEditor, type PDFSignature } from "@/hooks/use-pdf-editor";
import LoadingState from "@/components/molecules/LoadingState";
import ErrorState from "@/components/molecules/ErrorState";
import PDFViewer from "./PDFViewer";

interface PDFSignatureProps {
  documentId: string;
  documentUrl: string;
  documentTitle: string;
  signerName?: string;
  signerEmail?: string;
  onSign?: (success: boolean) => void;
  onCancel?: () => void;
  className?: string;
}

export default function PDFSignature({
  documentId,
  documentUrl,
  documentTitle,
  signerName = "",
  signerEmail = "",
  onSign,
  onCancel,
  className = "",
}: PDFSignatureProps) {
  const {
    signatures,
    isLoading,
    error,
    loadPDF,
    addSignature,
    savePDF,
    hasChanges,
    canSign,
  } = usePDFEditor({ documentId, documentUrl, mode: "sign" });

  const [isSigning, setIsSigning] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para el canvas de firma
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string>("");
  const [inputSignerName, setInputSignerName] = useState(signerName);
  const [inputSignerEmail, setInputSignerEmail] = useState(signerEmail);

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadPDF();
  }, [loadPDF]);

  // Inicializar canvas para firma
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar canvas
    canvas.width = 400;
    canvas.height = 150;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Fondo blanco
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Borde
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Reset stroke style para dibujo
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
  }, []);

  useEffect(() => {
    if (showSignatureModal) {
      setTimeout(initCanvas, 100);
    }
  }, [showSignatureModal, initCanvas]);

  // Manejar click en PDF para agregar firma
  const handlePDFClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isSigning || !canSign) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setClickPosition({ x, y });
      setShowSignatureModal(true);
    },
    [isSigning, canSign]
  );

  // Funciones de dibujo en canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Limpiar canvas
  const clearCanvas = useCallback(() => {
    initCanvas();
    setSignatureData("");
  }, [initCanvas]);

  // Confirmar firma
  const confirmSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !clickPosition || !inputSignerName.trim()) return;

    // Convertir canvas a base64
    const dataURL = canvas.toDataURL("image/png");
    const base64Data = dataURL.split(",")[1];

    addSignature({
      x: clickPosition.x,
      y: clickPosition.y,
      pageNumber: currentPage,
      signatureData: base64Data,
      signerName: inputSignerName.trim(),
      signerEmail: inputSignerEmail.trim(),
    });

    // Reset
    setShowSignatureModal(false);
    setClickPosition(null);
    setIsSigning(false);
    setSignatureData("");
  }, [
    clickPosition,
    currentPage,
    inputSignerName,
    inputSignerEmail,
    addSignature,
  ]);

  // Cancelar firma
  const cancelSignature = useCallback(() => {
    setShowSignatureModal(false);
    setClickPosition(null);
    setIsSigning(false);
    setSignatureData("");
    clearCanvas();
  }, [clearCanvas]);

  // Guardar documento firmado
  const handleSign = async () => {
    setIsSaving(true);
    try {
      const success = await savePDF(documentTitle, "signed");
      onSign?.(success);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        title="Loading document for signing..."
        description="Please wait while we prepare the document"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Signature Load Error"
        error={error}
        onRetry={loadPDF}
      />
    );
  }

  return (
    <>
      <div
        className={`bg-card rounded-lg border border-border overflow-hidden ${className}`}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/5">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-foreground">{documentTitle}</h3>
            {signatures.length > 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {signatures.length} firma{signatures.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Información del firmante */}
            <div className="text-right text-sm text-muted-foreground">
              <div>{inputSignerName || "Sin nombre"}</div>
              {inputSignerEmail && (
                <div className="text-xs">{inputSignerEmail}</div>
              )}
            </div>

            {/* Activar modo firma */}
            <Button
              variant={isSigning ? "primary" : "outline"}
              size="sm"
              onClick={() => setIsSigning(!isSigning)}
              disabled={!canSign}
            >
              <PenTool className="w-4 h-4 mr-1" />
              {isSigning ? "Firmando..." : "Firmar"}
            </Button>

            {/* Cancelar */}
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSaving}
                size="sm"
              >
                Cancelar
              </Button>
            )}

            {/* Finalizar firma */}
            <Button
              onClick={handleSign}
              disabled={signatures.length === 0 || isSaving}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              {isSaving ? "Firmando..." : "Finalizar Firma"}
            </Button>
          </div>
        </div>

        {/* Instrucciones */}
        {isSigning && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border-b border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 text-sm">
            ✍️ Haz click en cualquier parte del documento donde deseas colocar
            tu firma
          </div>
        )}

        {/* PDF Container */}
        <div className="relative h-[600px] overflow-auto bg-muted/10">
          <div
            ref={pdfContainerRef}
            className={`h-full w-full ${
              isSigning ? "cursor-crosshair" : "cursor-default"
            }`}
            onClick={handlePDFClick}
          >
            {/* PDF Viewer Base */}
            <div className="h-full w-full pointer-events-none">
              <PDFViewer
                documentUrl={documentUrl}
                documentTitle={documentTitle}
                allowDownload={false}
                allowFullscreen={false}
                className="h-full"
              />
            </div>

            {/* Firmas Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {signatures
                .filter((sig) => sig.pageNumber === currentPage)
                .map((signature) => (
                  <div
                    key={signature.id}
                    className="absolute pointer-events-auto"
                    style={{
                      left: signature.x,
                      top: signature.y,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="bg-white border-2 border-green-500 rounded p-2 shadow-lg">
                      <Image
                        src={`data:image/png;base64,${signature.signatureData}`}
                        alt="Signature"
                        width={96}
                        height={24}
                        className="w-24 h-6 object-contain"
                        unoptimized
                      />
                      <div className="text-xs text-center text-gray-600 mt-1">
                        {signature.signerName}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Lista de firmas */}
        {signatures.length > 0 && (
          <div className="border-t border-border p-4 bg-muted/5">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Firmas ({signatures.length})
            </h4>
            <div className="space-y-2">
              {signatures.map((signature) => (
                <div
                  key={signature.id}
                  className="flex items-center justify-between p-2 bg-background rounded border border-border"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={`data:image/png;base64,${signature.signatureData}`}
                      alt="Signature"
                      width={64}
                      height={16}
                      className="w-16 h-4 object-contain border rounded"
                      unoptimized
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {signature.signerName}
                      </span>
                      {signature.signerEmail && (
                        <div className="text-xs text-muted-foreground">
                          {signature.signerEmail}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Página {signature.pageNumber} •{" "}
                        {signature.signedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Firma */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg border border-border w-full max-w-md">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                Crear Firma
              </h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Información del firmante */}
              <div className="space-y-2">
                <Input
                  placeholder="Nombre completo"
                  value={inputSignerName}
                  onChange={(e) => setInputSignerName(e.target.value)}
                />
                <Input
                  placeholder="Email (opcional)"
                  type="email"
                  value={inputSignerEmail}
                  onChange={(e) => setInputSignerEmail(e.target.value)}
                />
              </div>

              {/* Canvas de firma */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Dibuja tu firma aquí:
                </label>
                <canvas
                  ref={canvasRef}
                  className="border border-border rounded cursor-crosshair w-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCanvas}
                  className="w-full"
                >
                  Limpiar Firma
                </Button>
              </div>
            </div>

            <div className="p-4 border-t border-border flex space-x-2">
              <Button
                variant="outline"
                onClick={cancelSignature}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button
                onClick={confirmSignature}
                disabled={!inputSignerName.trim()}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-1" />
                Confirmar Firma
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
