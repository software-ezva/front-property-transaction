import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = params;
    const result = await ApiServerClient.post(
      ENDPOINTS.api.TRANSACTION_REGENERATE_ACCESS_CODE(transactionId),
      {}
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to regenerate access code",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
