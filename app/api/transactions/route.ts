import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const payload: any = {
    propertyId: Number(body.propertyId),
    transactionType: body.transactionType,
  };

  if (body.clientId && body.clientId !== "") {
    payload.clientId = Number(body.clientId);
  }

  if (body.additionalNotes && body.additionalNotes.trim() !== "") {
    payload.additionalNotes = body.additionalNotes;
  }

  try {
    const result = await ApiServerClient.post(
      ENDPOINTS.api.TRANSACTIONS,
      payload
    );
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to create transaction",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
