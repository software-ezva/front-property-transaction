import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessCode } = body;

    if (!accessCode) {
      return NextResponse.json(
        { error: "Access code is required" },
        { status: 400 }
      );
    }

    const result = await ApiServerClient.post(
      `${ENDPOINTS.api.TRANSACTIONS}/join-with-code`,
      { accessCode }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to join transaction",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
