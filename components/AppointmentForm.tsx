// "use client";
// import React, { useState, useEffect } from "react";

// // Generate time slots between start–end with given interval
// function generateTimeSlots(start: string, end: string, interval = 15): string[] {
//   const slots: string[] = [];
//   let [h, m] = start.split(":").map(Number);
//   const [endH, endM] = end.split(":").map(Number);

//   while (h < endH || (h === endH && m <= endM)) {
//     slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
//     m += interval;
//     if (m >= 60) {
//       h++;
//       m = 0;
//     }
//   }
//   return slots;
// }

// // Format date yyyy-mm-dd → DD-MM-YYYY
// function formatDate(dateStr: string) {
//   if (!dateStr) return "";
//   const [year, month, day] = dateStr.split("-");
//   return `${day}-${month}-${year}`;
// }

// export default function AppointmentForm() {
//   const [name, setName] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [bookedSlots, setBookedSlots] = useState<string[]>([]);

//   const slots = generateTimeSlots("10:00", "18:00");

//   // Fetch booked slots whenever date changes
//   useEffect(() => {
//     async function fetchBooked() {
//       if (!date) return;
//       const formatted = formatDate(date);
//       try {
//         const res = await fetch(`/api/appointments?date=${formatted}`);
//         const data = await res.json();
//         setBookedSlots(data.map((a: any) => a.time));
//       } catch {
//         setBookedSlots([]);
//       }
//     }
//     fetchBooked();
//   }, [date]);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setMessage(null);
//     if (!name || !date || !time) {
//       setMessage("Please fill all fields.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch("/api/appointments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, date, time }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setMessage(data?.error || "Failed to book");
//       } else {
//         setMessage("Appointment booked successfully!");
//         setName("");
//         setDate("");
//         setTime("");
//         setBookedSlots([]);
//       }
//     } catch (err) {
//       setMessage("Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
//       <label className="flex flex-col">
//         <span className="text-sm font-medium">Full Name</span>
//         <input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="mt-1 p-2 border rounded"
//           placeholder="Your name"
//         />
//       </label>

//       <label className="flex flex-col">
//         <span className="text-sm font-medium">Date</span>
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className="mt-1 p-2 border rounded"
//         />
//       </label>

//       <label className="flex flex-col">
//         <span className="text-sm font-medium">Time</span>
//         <select
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//           className="mt-1 p-2 border rounded"
//           disabled={!date}
//         >
//           <option value="">Select a time</option>
//           {slots.map((slot) => (
//             <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
//               {slot}
//             </option>
//           ))}
//         </select>
//       </label>

//       <div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-60"
//         >
//           {loading ? "Booking..." : "Book Appointment"}
//         </button>
//       </div>

//       {message && <div className="mt-2 text-sm text-slate-700">{message}</div>}
//     </form>
//   );
// }
