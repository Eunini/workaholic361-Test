import { isStage } from "@/lib/candidates";
import { updateCandidateStage } from "@/lib/db";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const candidateId = Number(id);
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(candidateId)) {
    return Response.json(
      { error: "Candidate ID must be a positive integer." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("stage" in body) ||
    !isStage(body.stage)
  ) {
    return Response.json(
      { error: "Stage must be Sourced, Screening, Interview, or Hired." },
      { status: 400 },
    );
  }

  try {
    const candidate = updateCandidateStage(candidateId, body.stage);
    if (!candidate)
      return Response.json({ error: "Candidate not found." }, { status: 404 });
    return Response.json({ candidate });
  } catch (error) {
    console.error("Failed to update candidate:", error);
    return Response.json(
      { error: "Unable to save this stage. Please try again." },
      { status: 500 },
    );
  }
}
