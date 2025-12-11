import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;
    const result = await ApiServerClient.get(
      ENDPOINTS.api.TRANSACTION_PEOPLE(transactionId)
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch transaction people",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
