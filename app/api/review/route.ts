import { NextResponse } from "next/server";
import { getDb } from "@/src/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();

    const totalGoals =
      await db.collection("goals").countDocuments();

    const totalProjects =
      await db.collection("projects").countDocuments();

    const completedTasks =
      await db.collection("tasks").countDocuments({
        completed: true,
      });

    const totalTasks =
      await db.collection("tasks").countDocuments();

    const remainingTasks =
      totalTasks - completedTasks;

    const progress =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    return NextResponse.json({
      totalGoals,
      totalProjects,
      totalTasks,
      completedTasks,
      remainingTasks,
      progress,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}