import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";

import type { PatchTransaction } from "@/types/transactions";
import { ENDPOINTS } from "@/lib/constants";

// PATCH /api/transactions
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, status, additionalNotes } = body;
    if (!transactionId) {
      return NextResponse.json(
        { error: "transactionId and status are required" },
        { status: 400 }
      );
    }
    // Construir el payload solo con los campos presentes
    const payload: PatchTransaction = { status };
    if (additionalNotes) payload.additionalNotes = additionalNotes;
    console.log("Payload for PATCH /api/transactions:", payload);
    // Llamar al backend correcto
    const result = await ApiServerClient.patch(
      `${ENDPOINTS.api.TRANSACTIONS}/${transactionId}`,
      payload
    );
    console.log("Result from PATCH /api/transactions:", result);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to update transaction status",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const payload: any = {
    propertyId: body.propertyId,
    workflowTemplateId: body.workflowTemplateId,
  };

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

// GET /api/transactions
export async function GET() {
  try {
    const result = await ApiServerClient.get(ENDPOINTS.api.TRANSACTIONS);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch transactions",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
