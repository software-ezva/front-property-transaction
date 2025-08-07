import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";
import { auth0 } from "@/lib/auth0";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (
      !body.esign_name ||
      !body.esign_initials ||
      !body.phone_number ||
      !body.date_of_birth
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Llama al backend usando el cliente genérico
    const result = await ApiServerClient.post(ENDPOINTS.api.CLIENT_PROFILE, {
      esign_name: body.esign_name,
      esign_initials: body.esign_initials,
      phone_number: body.phone_number,
      date_of_birth: body.date_of_birth,
    });
    // Get current session (App Router style)
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Update session with new profile data
    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        profile: {
          profileType: body.profile_type || "client",
          esignName: body.esign_name,
          esignInitials: body.esign_initials,
          dateOfBirth: body.date_of_birth,
        },
      },
    };

    // Apply session updates
    await auth0.updateSession(updatedSession);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Error creating client profile",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const result = await ApiServerClient.get(ENDPOINTS.api.CLIENT_PROFILE);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error del backend:", error);
    return NextResponse.json(
      {
        error: error.message || "Error fetching client profile",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
