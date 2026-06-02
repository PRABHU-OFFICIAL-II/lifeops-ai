import { NextResponse } from "next/server";
import { getDb } from "@/src/lib/mongodb";

export async function GET() {
  const db = await getDb();

  const activity = await db
    .collection("activity_logs")
    .find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();

  return NextResponse.json(activity);
}