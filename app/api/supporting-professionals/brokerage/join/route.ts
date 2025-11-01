import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";

/**
 * PUT /api/supporting-professionals/brokerage/join
 * Join an existing brokerage using an access code (supporting professional endpoint)
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessCode } = body;

    if (!accessCode) {
      return NextResponse.json(
        { error: "Access code is required" },
        { status: 400 }
      );
    }

    const response = await ApiServerClient.put(
      "/supporting-professionals/me/join-brokerage",
      { accessCode }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error joining brokerage:", error);

    if (error.response?.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: "Brokerage not found with this access code" },
        { status: 404 }
      );
    }

    if (error.response?.status === 400) {
      return NextResponse.json(
        { error: error.response.data?.message || "Invalid access code" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to join brokerage" },
      { status: 500 }
    );
  }
}
