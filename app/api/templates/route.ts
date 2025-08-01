import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const result = await ApiServerClient.get(ENDPOINTS.api.TEMPLATES);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch templates",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validaciones básicas
    if (!body.name || !body.transactionType) {
      return NextResponse.json(
        { error: "Template name and transaction type are required" },
        { status: 400 }
      );
    }

    // Forward POST to backend API
    const result = await ApiServerClient.post(ENDPOINTS.api.TEMPLATES, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create template",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) {
      return NextResponse.json(
        { error: "Template ID is required for update" },
        { status: 400 }
      );
    }
    rest.checklistTemplates.forEach(
      (template: { id: string; items: any[] }) => {
        if (Array.isArray(template.items)) {
          console.log(`Checklist Template ID: ${template.id}`);
          console.log(`Items: ${JSON.stringify(template.items, null, 2)}`);
        }
      }
    );
    // Forward PATCH to backend API with the ID in the URL
    const result = await ApiServerClient.patch(
      `${ENDPOINTS.api.TEMPLATES}/${id}`,
      rest
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to update template",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
