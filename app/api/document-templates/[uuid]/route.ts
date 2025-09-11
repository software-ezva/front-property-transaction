import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  try {
    const { uuid } = params;

    const response = await ApiServerClient.get(
      `${ENDPOINTS.api.DOCUMENT_TEMPLATES}/${uuid}`
    );
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching document template:", error);

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
    console.error("Error deleting document template:", error);

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
