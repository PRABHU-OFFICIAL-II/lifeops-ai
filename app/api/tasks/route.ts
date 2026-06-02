import { NextResponse } from "next/server";
import { getDb } from "@/src/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();

    const tasks = await db
      .collection("tasks")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tasks);
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