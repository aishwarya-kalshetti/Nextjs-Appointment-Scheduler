import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

// GET availability 
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date");

    const client = await clientPromise;
    const db = client.db("appointments");
    const collection = db.collection("availability");

    const query = date ? { date } : {};
    const availability = await collection.find(query).toArray();

    const formatted = availability.map((a) => ({
      ...a,
      _id: a._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

// POST availability
export async function POST(req: Request) {
  try {
    const { date, startTime, endTime } = await req.json();
    if (!date || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("appointments");
    const collection = db.collection("availability");

    await collection.updateOne(
      { date },
      { $set: { date, startTime, endTime, createdAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
