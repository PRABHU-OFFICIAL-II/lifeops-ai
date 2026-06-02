import { NextResponse } from "next/server";
import { getDb } from "@/src/lib/mongodb";
import { logActivity } from "@/src/lib/activityLogger";

export async function GET() {
  try {
    const db = await getDb();

    const projects = await db
      .collection("projects")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    for (const project of projects) {
      await logActivity("PROJECT_CREATED", `Created project: ${project.title}`);
    }

    return NextResponse.json(projects);
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
