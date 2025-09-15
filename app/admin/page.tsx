import React from "react";
import AdminTable from "@/components/AdminTable";

export default function AdminPage() {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-medium mb-4">Admin Dashboard</h2>
      <p className="text-sm text-slate-600 mb-4">View all appointment requests. You can reschedule or delete.</p>
      <AdminTable />
    </section>
  );
}
