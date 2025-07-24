import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const result = await ApiServerClient.get(ENDPOINTS.api.TEMPLATES);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch templates",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}