import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    // Fetch properties from the API
    const properties = await ApiServerClient.get(ENDPOINTS.api.PROPERTIES);
    console.log("Properties fetched successfully:", properties);

    return NextResponse.json(properties, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { message: error.message || "Error fetching properties" },
      { status: 500 }
    );
  }
}


