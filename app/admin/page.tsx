import React from "react";
import AdminDashboard from "@/components/AdminDashboard";
//import AdminTable from "@/components/AdminTable";

export default function AdminPage() {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-medium mb-4">Admin Dashboard</h2>
      <p className="text-sm text-slate-600 mb-4">
        View all appointment requests. You can reschedule or delete.
      </p>

      <AdminDashboard />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Manage Appointments</h3>
        {/* <AdminTable /> */}
      </div>
    </section>
  );
}
