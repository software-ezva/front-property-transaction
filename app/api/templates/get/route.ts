import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

// GET /api/templates/:id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const templateId = searchParams.get("id");

  if (!templateId) {
    return NextResponse.json(
      { error: "Template ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = (await ApiServerClient.get(
      `${ENDPOINTS.api.TEMPLATES}/${templateId}`
    )) as { checklistTemplates: { id: string; items: any[] }[] };
    result.checklistTemplates.forEach(
      (template: { id: string; items: any[] }) => {
        if (Array.isArray(template.items)) {
          console.log(`Checklist Template ID: ${template.id}`);
          console.log(`Items: ${JSON.stringify(template.items, null, 2)}`);
        }
      }
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch template",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
