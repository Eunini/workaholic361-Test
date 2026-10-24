import { listCandidates } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(
      { candidates: listCandidates() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to retrieve candidates:", error);
    return Response.json(
      { error: "Unable to load candidates. Please try again." },
      { status: 500 },
    );
  }
}
