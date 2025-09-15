export interface Appointment {
  _id?: string;
  name: string;
  date: string; // ISO date string (yyyy-mm-dd)
  time: string; // HH:MM
  createdAt?: string;
  updatedAt?: string;
}
