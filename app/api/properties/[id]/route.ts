import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await ApiServerClient.get(
      `${ENDPOINTS.api.PROPERTIES}/${id}`
    );
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch property",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = await ApiServerClient.patch(
      `${ENDPOINTS.api.PROPERTIES}/${id}`,
      body
    );
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to update property",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ApiServerClient.delete(`${ENDPOINTS.api.PROPERTIES}/${id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to delete property",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
