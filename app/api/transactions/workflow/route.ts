// import { NextRequest, NextResponse } from "next/server";
// import { ApiServerClient } from "@/lib/api-server";
// import { ENDPOINTS } from "@/lib/constants";

// export async function GET(req: NextRequest) {
//     const { searchParams } = new URL(req.url);
//     const workflowId = searchParams.get("id");
    
//     if (!workflowId) {
//         return NextResponse.json(
//         { error: "Workflow ID is required" },
//         { status: 400 }
//         );
//     }
    
//     try {
//         const result = await ApiServerClient.get(
//         `${ENDPOINTS.api.WORKFLOWS}/${workflowId}`
//         );
//         console.log("Fetching workflow with ID:", workflowId);
//         console.log("Workflow details:", result);
//         return NextResponse.json(result, { status: 200 });
//     } catch (error: any) {
//         console.error("Error fetching workflow:", error);
//         return NextResponse.json(
//         {
//             error: error.message || "Failed to fetch workflow",
//             details: error.data?.message || error.details,
//             status: error.status || 500,
//         },
//         { status: error.status || 500 }
//         );
//     }
// }   