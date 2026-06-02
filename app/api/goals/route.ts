import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/src/lib/mongodb";
import { logActivity } from "@/src/lib/activityLogger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const db = await getDb();

    const result = await db.collection("goals").insertOne({
      title: body.title,
      description: body.description || "",
      targetDate: body.targetDate,
      progress: 0,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await logActivity("GOAL_CREATED", `Created goal: ${body.title}`);

    return NextResponse.json({
      success: true,
      goalId: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  const db = await getDb();

  const goals = await db.collection("goals").find({}).toArray();

  return NextResponse.json(goals);
}
