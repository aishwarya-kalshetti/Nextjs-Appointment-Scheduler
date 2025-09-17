"use client";
import React, { useState, useEffect } from "react";
import type { Appointment, Availability } from "@/types/appointment";

function generateSlots(start: string, end: string): string[] {
  const slots: string[] = [];
  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  while (h < endH || (h === endH && m <= endM)) {
    slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
    m += 15;
    if (m === 60) { m = 0; h++; }
  }
  return slots;
}

export default function UserBooking() {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!date) return;
    async function fetchData() {
      const resAvail = await fetch(`/api/availability?date=${date}`);
      const avail: Availability[] = await resAvail.json();
      if (avail.length) {
        const slotsGenerated = generateSlots(avail[0].startTime, avail[0].endTime);
        setSlots(slotsGenerated);
      } else {
        setSlots([]);
      }

      const resAppt = await fetch(`/api/appointments?date=${date}`);
      const booked: Appointment[] = await resAppt.json();
      setBookedTimes(booked.map((b) => b.time));
    }
    fetchData();
  }, [date]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, time }),
    });
    const data = await res.json();
    if (data.error) alert(data.error);
    else alert("Booked successfully!");
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded max-w-md space-y-3">
      <h2 className="text-lg font-bold">Book Appointment</h2>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
      />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 w-full" />
      <select value={time} onChange={(e) => setTime(e.target.value)} className="border p-2 w-full">
        <option value="">Select Time</option>
        {slots.map((slot) => (
          <option key={slot} value={slot} disabled={bookedTimes.includes(slot)}>
            {slot}
          </option>
        ))}
      </select>
      <button className="px-3 py-1 bg-green-600 text-white rounded">Book</button>
    </form>
  );
}
