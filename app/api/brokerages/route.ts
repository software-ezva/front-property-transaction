import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

/**
 * GET /api/brokerages
 * Get all brokerages
 */
export async function GET(request: NextRequest) {
  try {
    const result = await ApiServerClient.get(ENDPOINTS.api.BROKERAGE);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Error fetching brokerages",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
