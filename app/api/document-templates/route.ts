import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Validar campos requeridos
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const file = formData.get("file") as File;

    if (!title || !category || !file) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "title, category, and file are required",
        },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type",
          details: "Only PDF and Word documents are allowed",
        },
        { status: 400 }
      );
    }

    // Validar tamaño de archivo (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File too large",
          details: "Maximum file size is 10MB",
        },
        { status: 400 }
      );
    }

    // Preparar FormData para el backend
    const backendFormData = new FormData();
    backendFormData.append("title", title);
    backendFormData.append("category", category);
    backendFormData.append("file", file);

    // Llamar al backend API
    const response = await ApiServerClient.post(
      ENDPOINTS.api.DOCUMENT_TEMPLATES,
      backendFormData
    );

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating document template:", error);

    if (error.status) {
      return NextResponse.json(
        {
          error: error.message || "Backend error",
          details: error.data?.details || error.details,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: "Failed to create document template",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let endpoint = ENDPOINTS.api.DOCUMENT_TEMPLATES;
    if (category) {
      endpoint += `?category=${encodeURIComponent(category)}`;
    }

    const response = await ApiServerClient.get(endpoint);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching document templates:", error);

    if (error.status) {
      return NextResponse.json(
        {
          error: error.message || "Backend error",
          details: error.data?.details || error.details,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: "Failed to fetch document templates",
      },
      { status: 500 }
    );
  }
}
