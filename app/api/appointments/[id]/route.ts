import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";


function formatDate(dateStr: string) {
  if (!dateStr.includes("-")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("appointments");
    const collection = db.collection("bookings");

    const appointment = await collection.findOne({ _id: new ObjectId(params.id) });
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...appointment,
      _id: appointment._id.toString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error fetching appointment" }, { status: 500 });
  }
}


export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, date, time } = await req.json();
    if (!name || !date || !time) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const formattedDate = formatDate(date);

    const client = await clientPromise;
    const db = client.db("appointments");
    const collection = db.collection("bookings");

    // Prevent double booking
    const conflict = await collection.findOne({
      date: formattedDate,
      time,
      _id: { $ne: new ObjectId(params.id) },
    });

    if (conflict) {
      return NextResponse.json({ error: "Time slot already booked" }, { status: 400 });
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { name, date: formattedDate, time, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...result.value,
      _id: result.value._id.toString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

//  DELETE appointment by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("appointments");
    const collection = db.collection("bookings");

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
