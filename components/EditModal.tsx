"use client";
import React, { useState } from "react";
import type { Appointment } from "@/types/appointment";


function toInputFormat(dateStr: string) {
  if (!dateStr) return "";
  
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;

  if (parts[0].length === 4) return dateStr; 
  const [day, month, year] = parts;
  return `${day}-${month}-${year}`;
}


function toDBFormat(dateStr: string) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  if (parts[0].length === 4) {
    const [day, month, year] = parts;
    return `${day}-${month}-${year}`;
  }
  return dateStr; 
}

export default function EditModal({
  appointment,
  onClose,
  onSave,
}: {
  appointment: Appointment;
  onClose: () => void;
  onSave: (a: Appointment) => void;
}) {
  const [name, setName] = useState(appointment.name);
  const [date, setDate] = useState(toInputFormat(appointment.date));
  const [time, setTime] = useState(appointment.time);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Appointment = {
        ...appointment,
        name,
        date: toDBFormat(date), 
        time,
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow">
        <h3 className="text-lg font-medium mb-3">Edit Appointment</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="flex flex-col">
            <span className="text-sm">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm">Time</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1 bg-slate-800 text-white rounded disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
