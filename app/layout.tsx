import "./globals.css";
import React from "react";
import type { ReactNode } from "react";

export const metadata = {
  title: "Appointment Scheduler",
  description: "Simple appointment scheduler with admin dashboard"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen max-w-5xl mx-auto p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold">Appointment Scheduler</h1>
            <p className="text-sm text-slate-600">Book appointments — Admin can view / reschedule / delete</p>
            <nav className="mt-3 flex gap-4">
              <a className="text-sm underline" href="/">User</a>
              <a className="text-sm underline" href="/admin">Admin</a>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
