import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const days = searchParams.get("days") || "7";

    const result = await ApiServerClient.get(
      `${ENDPOINTS.api.EXPIRING_ITEMS}?days=${days}`
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in /api/transactions/items/expiring:", error);
    return NextResponse.json(
      {
        error: error.message || "Error fetching expiring items",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
