import { NextRequest, NextResponse } from "next/server";
import { ItemStatus, UpdateItemResponse } from "@/types/workflow";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

// PUT /api/transactions/[transactionId]/workflow/items/[itemId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string; itemId: string }> }
) {
  try {
    const { transactionId, itemId } = await params;
    const updates = await request.json();

    // Check if there are any updates to process
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No updates provided" },
        { status: 400 }
      );
    }

    // Validate the updates
    if (updates.status && !Object.values(ItemStatus).includes(updates.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Validate date format only if a date value is provided (not undefined/null/empty)
    if (
      updates.hasOwnProperty("expectClosingDate") &&
      updates.expectClosingDate !== undefined &&
      updates.expectClosingDate !== null &&
      updates.expectClosingDate !== "" &&
      isNaN(Date.parse(updates.expectClosingDate))
    ) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // If empty string is sent for date, convert to null for the API
    if (
      updates.hasOwnProperty("expectClosingDate") &&
      updates.expectClosingDate === ""
    ) {
      updates.expectClosingDate = null;
    }

    // Call the real API using PATCH method
    const result = await ApiServerClient.patch<UpdateItemResponse>(
      `${ENDPOINTS.api.TRANSACTIONS}/${transactionId}/workflow/items/${itemId}`,
      updates
    );

    return NextResponse.json({
      success: true,
      item: result,
      transactionId,
      updatedFields: Object.keys(updates),
      message:
        result.message ||
        `Successfully updated ${
          Object.keys(updates).length
        } field(s) in transaction ${transactionId}`,
    });
  } catch (error: any) {
    // Handle different types of API errors
    if (error.status) {
      return NextResponse.json(
        {
          error: error.message || "Failed to update item",
          details: error.data?.message || error.details,
          status: error.status,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}
