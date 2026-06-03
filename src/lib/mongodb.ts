import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise: Promise<MongoClient> = global._mongoClientPromise ?? (() => {
  const client = new MongoClient(uri);
  return (global._mongoClientPromise = client.connect());
})();

export async function getDb() {
  const client = await clientPromise;

  return client.db("lifeops");
}