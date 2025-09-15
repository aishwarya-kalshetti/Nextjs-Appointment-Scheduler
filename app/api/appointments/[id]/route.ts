import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

// GET a single appointment
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const id = params.id;

  try {
    const client = await clientPromise;
    const db = client.db("appointments");
    const collection = db.collection("bookings");

    const appointment = await collection.findOne({ _id: new ObjectId(id) });
    if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ...appointment, _id: appointment._id.toString() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
  }
}

// PUT update appointment
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const id = params.id;

  try {
    const body = await req.json();
    const { name, date, time } = body;

    if (!name || !date || !time)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("appointments");
    const collection = db.collection("bookings");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, date, time, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result.value) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ...result.value, _id: result.value._id.toString() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE appointment
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const id = params.id;

  try {
    const client = await clientPromise;
    const db = client.db("appointments");
    const collection = db.collection("bookings");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
