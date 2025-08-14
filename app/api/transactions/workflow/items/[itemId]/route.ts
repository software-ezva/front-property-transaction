import { NextRequest, NextResponse } from "next/server";
import { ItemStatus } from "@/types/workflow";

// PUT /api/transactions/[transactionId]/workflow/items/[itemId]
export async function PUT(
  request: NextRequest,
  { params }: { params: { transactionId: string; itemId: string } }
) {
  try {
    const { transactionId, itemId } = params;
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

    if (
      updates.expectClosingDate &&
      updates.expectClosingDate !== null &&
      isNaN(Date.parse(updates.expectClosingDate))
    ) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Log what fields are being updated
    const updatedFields = Object.keys(updates);
    console.log(
      `Updating item ${itemId} in transaction ${transactionId}. Fields: ${updatedFields.join(
        ", "
      )}`,
      updates
    );

    // In a real application, you would:
    // 1. Validate the user has permission to update this item in this transaction
    // 2. Verify the item belongs to the specified transaction
    // 3. Update the item in your database
    // 4. Return the updated item

    // Simulated response
    const updatedItem = {
      id: itemId,
      description: "Sample task description", // This would come from the database
      order: 1,
      status: updates.status || ItemStatus.NOT_STARTED,
      expectClosingDate: updates.expectClosingDate || null,
      ...updates,
    };

    return NextResponse.json({
      success: true,
      item: updatedItem,
      updatedFields: Object.keys(updates),
      message: `Successfully updated ${Object.keys(updates).length} field(s)`,
    });
  } catch (error) {
    console.error("Error updating workflow item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}
