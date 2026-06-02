import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/src/lib/mongodb";
import { logActivity } from "@/src/lib/activityLogger";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const { id } = await params;

    const db = await getDb();

    const task = await db.collection("tasks").findOne({
      _id: new ObjectId(id),
    });

    await db.collection("tasks").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          completed: body.completed,
          updatedAt: new Date(),
        },
      },
    );

    if (body.completed) {
      await logActivity("TASK_COMPLETED", `Completed task: ${task?.title}`);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
