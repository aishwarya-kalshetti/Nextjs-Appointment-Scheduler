import React from "react";

import AppointmentForm from "../components/AppointmentForm";

export default function HomePage() {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-medium mb-4">Book an Appointment</h2>
      <p className="text-sm text-slate-600 mb-4">Enter name, choose date and time.</p>
      <AppointmentForm />
    </section>
  );
}
