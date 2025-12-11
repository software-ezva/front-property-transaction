import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

// POST /api/transactions/[transactionId]/workflow/checklists/[checklistId]/items
export async function POST(
  req: NextRequest,
  {
    params,
  }: { params: Promise<{ transactionId: string; checklistId: string }> }
) {
  try {
    const { transactionId, checklistId } = await params;
    const body = await req.json();

    if (!transactionId || !checklistId) {
      return NextResponse.json(
        { error: "Transaction ID and Checklist ID are required" },
        { status: 400 }
      );
    }

    const result = await ApiServerClient.post(
      `${ENDPOINTS.api.TRANSACTIONS}/${transactionId}/workflow/checklists/${checklistId}/items`,
      body
    );
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to add item",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
