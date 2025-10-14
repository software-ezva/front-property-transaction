import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  try {
    const { uuid } = params;

    if (!uuid) {
      return NextResponse.json(
        { error: "Document template UUID is required" },
        { status: 400 }
      );
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      return NextResponse.json(
        { error: "Invalid document template UUID format" },
        { status: 400 }
      );
    }

    const response = await ApiServerClient.get(
      `${ENDPOINTS.api.DOCUMENT_TEMPLATES}/${uuid}`
    );

    return NextResponse.json(response);
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json(
        {
          error: error.message || "Backend error",
          details: error.data?.details || error.details,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: "Failed to fetch document template",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  try {
    const { uuid } = params;

    await ApiServerClient.delete(`${ENDPOINTS.api.DOCUMENT_TEMPLATES}/${uuid}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json(
        {
          error: error.message || "Backend error",
          details: error.data?.details || error.details,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: "Failed to delete document template",
      },
      { status: 500 }
    );
  }
}
