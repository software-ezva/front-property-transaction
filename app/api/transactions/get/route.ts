import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

// GET /api/transactions/:id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get("id");

  if (!transactionId) {
    return NextResponse.json(
      { error: "Transaction ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await ApiServerClient.get(
      `${ENDPOINTS.api.TRANSACTIONS}/${transactionId}`
    );
    console.log("Fetching transaction with ID:", transactionId);
    console.log("Transaction details:", result);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch transaction",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
