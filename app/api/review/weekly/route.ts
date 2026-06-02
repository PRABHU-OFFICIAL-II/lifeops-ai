import { NextResponse } from "next/server";
import { getDb } from "@/src/lib/mongodb";

export async function GET() {
  const db = await getDb();

  const completedTasks =
    await db.collection("tasks").countDocuments({
      completed: true,
    });

  const totalTasks =
    await db.collection("tasks").countDocuments();

  const productivityScore =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  return NextResponse.json({
    completedThisWeek: completedTasks,
    productivityScore,
    summary:
      productivityScore > 70
        ? "Excellent progress this week."
        : productivityScore > 30
        ? "Steady progress. Keep momentum."
        : "Focus on completing a few key tasks.",
  });
}