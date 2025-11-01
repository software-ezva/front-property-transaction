import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";
import { auth0 } from "@/lib/auth0";
import type { BrokerProfile } from "@/types/broker";

/**
 * POST /api/brokers
 * Create or update broker profile
 */
export async function POST(request: NextRequest) {
  try {
    const body: BrokerProfile = await request.json();
    // Validate required fields
    if (
      !body.esign_name ||
      !body.esign_initials ||
      !body.phone_number ||
      !body.license_number
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create broker profile via API
    const result = await ApiServerClient.post(
      ENDPOINTS.api.BROKER_PROFILE,
      body
    );

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
          profileType: "broker",
          esignName: body.esign_name,
          esignInitials: body.esign_initials,
          licenseNumber: body.license_number,
          mlsNumber: body.mls_number,
        },
      },
    };

    // Apply session updates
    await auth0.updateSession(updatedSession);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Error creating broker profile",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
