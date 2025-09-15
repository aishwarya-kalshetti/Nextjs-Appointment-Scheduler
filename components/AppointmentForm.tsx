"use client";
import React, { useState } from "react";

export default function AppointmentForm() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!name || !date || !time) {
      setMessage("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, date, time })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || "Failed to book");
      } else {
        setMessage("Appointment requested successfully!");
        setName("");
        setDate("");
        setTime("");
      }
    } catch (err) {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
      <label className="flex flex-col">
        <span className="text-sm font-medium">Full Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-2 border rounded"
          placeholder="Your name"
        />
      </label>

      <label className="flex flex-col">
        <span className="text-sm font-medium">Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 p-2 border rounded"
        />
      </label>

      <label className="flex flex-col">
        <span className="text-sm font-medium">Time</span>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-1 p-2 border rounded"
        />
      </label>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-60"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </div>

      {message && (
        <div className="mt-2 text-sm text-slate-700">{message}</div>
      )}
    </form>
  );
}
