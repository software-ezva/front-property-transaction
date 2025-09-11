import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ApiServerClient } from "@/lib/api-server";

const createDocumentSchema = z.object({
  documentTemplateId: z
    .string()
    .uuid("Document template ID must be a valid UUID"),
});

type CreateDocumentRequest = z.infer<typeof createDocumentSchema>;

interface CreateDocumentResponse {
  documentId: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createDocumentSchema.parse(body);

    // Call external API
    const response = await ApiServerClient.post<CreateDocumentResponse>(
      `/transactions/${transactionId}/documents`,
      validatedData
    );

    // Transform response to match our internal format
    const transformedDocument = {
      documentId: response.documentId,
      title: response.title,
      category: response.category,
      status: response.status.toUpperCase(),
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
      url: `/documents/${response.documentId}`, // Generate URL based on document ID
    };

    return NextResponse.json(transformedDocument, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);

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
