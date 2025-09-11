import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";

import type { PatchTransaction } from "@/types/transactions";
import { ENDPOINTS } from "@/lib/constants";

// PATCH /api/transactions
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, status, clientId, additionalNotes } = body;
    if (!transactionId) {
      return NextResponse.json(
        { error: "transactionId and status are required" },
        { status: 400 }
      );
    }
    // Construir el payload solo con los campos presentes
    const payload: PatchTransaction = { status };
    if (clientId) payload.clientId = clientId;
    if (additionalNotes) payload.additionalNotes = additionalNotes;
    // Llamar al backend correcto
    const result = await ApiServerClient.patch(
      `${ENDPOINTS.api.TRANSACTIONS}/${transactionId}`,
      payload
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error updating transaction status:", error);
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

  if (body.clientId && body.clientId !== "") {
    payload.clientId = body.clientId;
  }

  if (body.additionalNotes && body.additionalNotes.trim() !== "") {
    payload.additionalNotes = body.additionalNotes;
  }
  console.log("Creating transaction with payload:", payload);
  try {
    const result = await ApiServerClient.post(
      ENDPOINTS.api.TRANSACTIONS,
      payload
    );
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating transaction:", error);
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
    console.error("Error fetching transactions:", error);
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
