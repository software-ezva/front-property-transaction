import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";
import type { Brokerage, CreateBrokeragePayload } from "@/types/brokerage";

/**
 * GET /api/brokers/brokerage
 * Get brokerage information for the authenticated broker
 * Returns null if broker is not assigned to any brokerage
 */
export async function GET() {
  try {
    const response = await ApiServerClient.get<Brokerage | null>(
      ENDPOINTS.api.BROKER_BROKERAGE
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching brokerage:", error);

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch brokerage information" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBrokeragePayload = await request.json();
    console.log("Creating brokerage with payload:", body);
    const response = await ApiServerClient.post<Brokerage>(
      ENDPOINTS.api.BROKERAGE,
      body
    );
    console.log("Created brokerage:", response);
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating brokerage:", error);

    if (error.response?.status === 400) {
      return NextResponse.json(
        { error: error.data?.message || "Bad request" },
        { status: 400 }
      );
    }

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create brokerage" },
      { status: error.response?.status || 500 }
    );
  }
}
