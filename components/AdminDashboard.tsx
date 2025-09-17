"use client";
import React, { useState, useEffect } from "react";
import type { Appointment, Availability } from "@/types/appointment";
import EditModal from "./EditModal";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; 
  });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editing, setEditing] = useState<Appointment | null>(null);

  // Fetch all appointments and availability
  useEffect(() => {
    async function fetchData() {
      const resAppt = await fetch(`/api/appointments`);
      const allAppointments: Appointment[] = await resAppt.json();
      setAppointments(allAppointments);

      // Filter by selected date
      setFilteredAppointments(
        allAppointments.filter((a) => {
          const aDate = a.date.includes("-") && a.date.split("-")[0].length === 4 ? a.date : a.date.split("-").reverse().join("-");
          return aDate === date;
        })
      );

      const resAvail = await fetch(`/api/availability?date=${date}`);
      setAvailabilities(await resAvail.json());
    }
    fetchData();
  }, [date]);

  // Save availability
  async function handleSaveAvailability(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, startTime, endTime }),
    });
    alert("Availability saved!");
  }

  // Delete appointment
  async function handleDelete(id?: string) {
    if (!id || !confirm("Delete this appointment?")) return;
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    if (!res.ok) return alert("Delete failed");
    setAppointments((s) => s.filter((a) => a._id !== id));
    setFilteredAppointments((s) => s.filter((a) => a._id !== id));
  }

  // Update appointment
  async function handleUpdate(updated: Appointment) {
    if (!updated._id) return;
    const res = await fetch(`/api/appointments/${updated._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: updated.name, date: updated.date, time: updated.time }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Update failed");

    setAppointments((s) => s.map((a) => (a._id === updated._id ? updated : a)));
    setFilteredAppointments((s) => s.map((a) => (a._id === updated._id ? updated : a)));
    setEditing(null);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

      {/* Date filter */}
      <div className="mb-4">
        <label>Select Date: </label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2" />
      </div>

      {/* Availability form */}
      <form onSubmit={handleSaveAvailability} className="flex gap-2 mb-6">
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2" />
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2" />
        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save Availability</button>
      </form>

      {/* Appointments table */}
      <table className="w-full table-auto border">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Time</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((a) => (
            <tr key={a._id} className="border-t">
              <td className="p-2">{a.name}</td>
              <td className="p-2">{a.date}</td>
              <td className="p-2">{a.time}</td>
              <td className="p-2 flex gap-2">
                <button onClick={() => setEditing(a)} className="px-3 py-1 border rounded text-sm bg-white hover:bg-slate-50">Edit</button>
                <button onClick={() => handleDelete(a._id)} className="px-3 py-1 border rounded text-sm text-red-600 bg-white hover:bg-red-50">Delete</button>
              </td>
            </tr>
          ))}
          {filteredAppointments.length === 0 && (
            <tr>
              <td colSpan={4} className="p-2 text-center">No appointments for this date.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit modal */}
      {editing && <EditModal appointment={editing} onClose={() => setEditing(null)} onSave={handleUpdate} />}
    </div>
  );
}
