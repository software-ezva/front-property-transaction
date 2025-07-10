import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    // Fetch properties from the API
    const properties = await ApiServerClient.get(ENDPOINTS.api.PROPERTIES);

    return NextResponse.json(properties, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Error fetching properties",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
