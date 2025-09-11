import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

interface DocumentResponse {
  documentId: string;
  title: string;
  category: string;
  status: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

// GET /api/transactions/[transactionId]/documents/[documentId]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ transactionId: string; documentId: string }> }
) {
  try {
    const { transactionId, documentId } = await params;

    if (!transactionId || !documentId) {
      return NextResponse.json(
        { error: "Transaction ID and Document ID are required" },
        { status: 400 }
      );
    }

    // Validate UUID format for both IDs
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(transactionId)) {
      return NextResponse.json(
        { error: "Invalid transaction ID format" },
        { status: 400 }
      );
    }

    if (!uuidRegex.test(documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID format" },
        { status: 400 }
      );
    }

    const result = await ApiServerClient.get<DocumentResponse>(
      `${ENDPOINTS.api.TRANSACTIONS}/${transactionId}/documents/${documentId}`
    );

    // Transform response to match our internal format
    const transformedDocument = {
      documentId: result.documentId,
      title: result.title,
      category: result.category,
      status: result.status.toUpperCase(),
      url: result.url,
      createdAt: result.createdAt ? new Date(result.createdAt) : new Date(),
      updatedAt: result.updatedAt ? new Date(result.updatedAt) : new Date(),
    };

    return NextResponse.json(transformedDocument, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching document:", error);

    if (error instanceof Error) {
      // Handle specific API errors
      if (error.message.includes("404")) {
        return NextResponse.json(
          { error: "Transaction or document not found" },
          { status: 404 }
        );
      }
      if (error.message.includes("403")) {
        return NextResponse.json(
          { error: "Access denied to this transaction" },
          { status: 403 }
        );
      }
      if (error.message.includes("401")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      {
        error: error.message || "Failed to fetch document",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
