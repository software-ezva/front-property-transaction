import { NextRequest, NextResponse } from "next/server";
import { ApiServerClient } from "@/lib/api-server";
import { ENDPOINTS } from "@/lib/constants";
import { auth0 } from "@/lib/auth0";
import type { SupportingProfessionalProfile } from "@/types/professionals";

/**
 * GET /api/supporting-professionals
 * Get all supporting professionals
 */
export async function GET() {
  try {
    const professionals = await ApiServerClient.get(
      ENDPOINTS.api.SUPPORTING_PROFESSIONALS
    );

    return NextResponse.json(professionals);
  } catch (error: any) {
    console.error("Error getting supporting professionals:", error);

    return NextResponse.json(
      {
        error: error.message || "Error loading supporting professionals",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST /api/supporting-professionals
 * Create or update supporting professional profile
 */
export async function POST(request: NextRequest) {
  try {
    const body: SupportingProfessionalProfile = await request.json();

    const professional = await ApiServerClient.post(
      ENDPOINTS.api.SUPPORTING_PROFESSIONALS,
      body
    );

    // Get current session and update it with supporting professional profile data
    const session = await auth0.getSession();

    if (session) {
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          profile: {
            profileType: "supporting_professional",
            esignName: body.esign_name,
            esignInitials: body.esign_initials,
            professionalOf: body.professional_of,
          },
        },
      };

      // Apply session updates
      await auth0.updateSession(updatedSession);
    }

    return NextResponse.json(professional, { status: 201 });
  } catch (error: any) {
    console.error("Error creating supporting professional profile:", error);

    return NextResponse.json(
      {
        error:
          error.message || "Error creating supporting professional profile",
        details: error.data?.message || error.details,
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
