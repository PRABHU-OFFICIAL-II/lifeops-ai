import { NextResponse } from "next/server";
import { getDb } from "@/src/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();

    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      collections: collections.map((c) => c.name),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}