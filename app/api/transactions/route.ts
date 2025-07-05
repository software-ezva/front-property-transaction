import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  console.log("API INTERNAL TRANSACTIONS POST");
  const body = await req.json();

  // El backend obtiene agentId del access token, no del body
  console.log("Body recibido del frontend:", body);

  const payload: any = {
    propertyId: Number(body.propertyId), // Convertir a number
    transactionType: body.transactionType,
  };

  // Solo incluir clientId si tiene valor (convertir a number)
  if (body.clientId && body.clientId !== "") {
    payload.clientId = Number(body.clientId);
  }

  // Solo incluir additionalNotes si tiene valor
  if (body.additionalNotes && body.additionalNotes.trim() !== "") {
    payload.additionalNotes = body.additionalNotes;
  }

  console.log("Payload enviado al backend:", payload);

  try {
    const result = await ApiServerClient.post(
      ENDPOINTS.api.TRANSACTIONS,
      payload
    );
    console.log("SUCCESS - Transaction created:", result);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error del backend:", error);
    console.error("Error status:", error.status);
    console.error("Error data:", error.data);

    return NextResponse.json(
      {
        error: "Failed to create transaction",
        details: error.message,
        status: error.status,
      },
      { status: error.status || 500 }
    );
  }
}
