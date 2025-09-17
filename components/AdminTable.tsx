// "use client";
// import React, { useEffect, useState } from "react";
// import type { Appointment } from "@/types/appointment";
// import EditModal from "./EditModal";

// export default function AdminTable() {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState<Appointment | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   async function fetchList() {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch("/api/appointments");
//       if (!res.ok) throw new Error("Failed to fetch");
//       const data = await res.json();
//       // ensure _id is string
//       setAppointments(data.map((a: any) => ({ ...a, _id: a._id?.toString?.() })));
//     } catch (err) {
//       setError("Failed to load appointments");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchList();
//   }, []);

//   // delete handler
//   async function handleDelete(id?: string) {
//     if (!id) return;
//     if (!confirm("Delete this appointment?")) return;
//     try {
//       const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
//       if (!res.ok) {
//         const data = await res.json().catch(() => null);
//         alert(data?.error || "Delete failed");
//         return;
//       }
//       setAppointments((s) => s.filter((a) => a._id !== id));
//     } catch {
//       alert("Network error");
//     }
//   }

//   // called by EditModal after saving
//   async function handleUpdate(updated: Appointment) {
//     if (!updated._id) return;
//     try {
//       const res = await fetch(`/api/appointments/${updated._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: updated.name,
//           date: updated.date,
//           time: updated.time,
//         }),
//       });

//       const data = await res.json().catch(() => null);
//       if (!res.ok) {
//         alert(data?.error || "Update failed");
//         return;
//       }

//       // server may return the updated document, or not — merge conservatively
//       const updatedDoc = data && data._id ? data : updated;
//       setAppointments((s) => s.map((a) => (a._id === updatedDoc._id ? updatedDoc : a)));
//       setEditing(null);
//     } catch {
//       alert("Network error");
//     }
//   }

//   return (
//     <div>
//       {loading ? (
//         <div>Loading appointments...</div>
//       ) : error ? (
//         <div className="text-red-600">{error}</div>
//       ) : appointments.length === 0 ? (
//         <div>No appointment requests yet.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full table-auto border">
//             <thead className="bg-slate-100">
//               <tr>
//                 <th className="p-2 text-left">Name</th>
//                 <th className="p-2 text-left">Date</th>
//                 <th className="p-2 text-left">Time</th>
//                 <th className="p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appointments.map((a) => (
//                 <tr key={a._id} className="border-t">
//                   <td className="p-2">{a.name}</td>
//                   <td className="p-2">{a.date}</td>
//                   <td className="p-2">{a.time}</td>
//                   <td className="p-2 flex gap-2">
//                     <button
//                       onClick={() => setEditing(a)}
//                       className="px-3 py-1 border rounded text-sm bg-white hover:bg-slate-50"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(a._id)}
//                       className="px-3 py-1 border rounded text-sm text-red-600 bg-white hover:bg-red-50"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {editing && (
//         <EditModal
//           appointment={editing}
//           onClose={() => setEditing(null)}
//           onSave={handleUpdate}
//         />
//       )}
//     </div>
//   );
// }
