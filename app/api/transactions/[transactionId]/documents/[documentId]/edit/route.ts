import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

interface UpdateDocumentResponse {
  documentId: string;
  title: string;
  category: string;
  status: string;
  url: string;
  isEditable: boolean;
  isSignable: boolean;
  couldBeRequestedForSignature: boolean;
  createdAt: string;
  updatedAt: string;
}

// PATCH /api/transactions/[transactionId]/documents/[documentId]/edit
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ transactionId: string; documentId: string }> }
) {
  try {
    const { transactionId, documentId } = await params;
    const requestData = await req.json();

    const result = await ApiServerClient.patch<UpdateDocumentResponse>(
      `${ENDPOINTS.api.TRANSACTIONS}/${transactionId}/documents/${documentId}/edit`,
      {
        isReadyForSigning: Boolean(requestData.isReadyForSigning),
      }
    );

    return NextResponse.json({
      ...result,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to update document",
        details: error.details,
      },
      { status: error.status || 500 }
    );
  }
}
