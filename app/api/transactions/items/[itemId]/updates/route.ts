import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

// POST /api/transactions/items/[itemId]/updates
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await req.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    if (!body.content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (!body.userName) {
      return NextResponse.json(
        { error: "User name is required" },
        { status: 400 }
      );
    }

    // Call backend API: /transactions/items/{itemId}/updates
    const result = await ApiServerClient.post(
      `${ENDPOINTS.api.TRANSACTIONS}/items/${itemId}/updates`,
      body
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to add update",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
