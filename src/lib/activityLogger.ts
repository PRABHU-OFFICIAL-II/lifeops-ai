import { getDb } from "./mongodb";

export async function logActivity(
  type: string,
  message: string
) {
  const db = await getDb();

  await db.collection("activity_logs").insertOne({
    type,
    message,
    createdAt: new Date(),
  });
}