import { NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";
import type { Brokerage } from "@/types/brokerage";

/**
 * POST /api/brokers/brokerage/regenerate-access-code
 * Regenerate access code for the broker's brokerage
 */
export async function POST() {
  try {
    // First, get the current brokerage to get the ID
    const currentBrokerage = await ApiServerClient.get<Brokerage | null>(
      ENDPOINTS.api.BROKER_BROKERAGE
    );

    if (!currentBrokerage) {
      return NextResponse.json(
        { error: "No brokerage found" },
        { status: 404 }
      );
    }

    // Regenerate the access code
    const response = await ApiServerClient.post<Brokerage>(
      ENDPOINTS.api.REGENERATE_ACCESS_CODE(currentBrokerage.id),
      {}
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error regenerating access code:", error);

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: "Brokerage not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to regenerate access code" },
      { status: error.response?.status || 500 }
    );
  }
}
