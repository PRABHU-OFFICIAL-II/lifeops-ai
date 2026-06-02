import { NextRequest, NextResponse } from "next/server";
import { generatePlan } from "@/src/lib/goalPlanner";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const plan = await generatePlan(body.goal);

    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate plan",
      },
      {
        status: 500,
      }
    );
  }
}