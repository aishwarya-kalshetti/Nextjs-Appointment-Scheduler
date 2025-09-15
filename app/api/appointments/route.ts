import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

// GET all appointments
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("appointments");
    const collection = db.collection("bookings");

    const appointments = await collection.find({}).toArray();

    const formatted = appointments.map((a) => ({
      ...a,
      _id: a._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

// POST a new appointment
export async function POST(req: Request) {
  try {
    const { name, date, time } = await req.json();
    if (!name || !date || !time)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("appointments");
    const collection = db.collection("bookings");

    const result = await collection.insertOne({ name, date, time, createdAt: new Date() });

    return NextResponse.json({ ...result, success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
