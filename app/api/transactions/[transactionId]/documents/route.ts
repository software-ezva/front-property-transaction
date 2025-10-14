import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

const createDocumentSchema = z.object({
  documentTemplateId: z
    .string()
    .uuid("Document template ID must be a valid UUID"),
});

interface CreateDocumentResponse {
  documentId: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// GET /api/transactions/[transactionId]/documents
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(transactionId)) {
      return NextResponse.json(
        { error: "Invalid transaction ID format" },
        { status: 400 }
      );
    }

    const result = await ApiServerClient.get(
      `${ENDPOINTS.api.TRANSACTIONS}/${transactionId}/documents`
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch transaction documents",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}

// POST /api/transactions/[transactionId]/documents
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
): Promise<NextResponse> {
  try {
    const { transactionId } = await params;

    // Validate transaction ID format
    if (!transactionId || typeof transactionId !== "string") {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(transactionId)) {
      return NextResponse.json(
        { error: "Invalid transaction ID format" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createDocumentSchema.parse(body);

    // Call external API
    const response = await ApiServerClient.post<CreateDocumentResponse>(
      `${ENDPOINTS.api.TRANSACTIONS}/${transactionId}/documents`,
      validatedData
    );

    // Transform response to match our internal format
    const transformedDocument = {
      documentId: response.documentId,
      title: response.title,
      category: response.category,
      status: response.status.toUpperCase(),
      createdAt: response.createdAt ? new Date(response.createdAt) : new Date(),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : new Date(),
      url: `/documents/${response.documentId}`, // Generate URL based on document ID
    };

    return NextResponse.json(transformedDocument, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      // Handle specific API errors
      if (error.message.includes("404")) {
        return NextResponse.json(
          { error: "Transaction or document template not found" },
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
