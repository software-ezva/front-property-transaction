import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";
import { auth0 } from "@/lib/auth0";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.esign_name || !body.esign_initials) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create agent profile via API
    const result = await ApiServerClient.post(ENDPOINTS.api.AGENT_PROFILE, {
      esign_name: body.esign_name,
      esign_initials: body.esign_initials,
      license_number: body.license_number,
    });

    // Get current session (App Router style)
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Update session with new profile data
    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        profile: {
          profileType: body.profile_type || "real_estate_agent",
          esignName: body.esign_name,
          esignInitials: body.esign_initials,
          licenseNumber: body.license_number,
        },
      },
    };

    // Apply session updates
    await auth0.updateSession(updatedSession);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      {
        message: error.message || "Error creating agent profile",
        details: error instanceof Error ? error.stack : null,
      },
      { status: 500 }
    );
  }
}
