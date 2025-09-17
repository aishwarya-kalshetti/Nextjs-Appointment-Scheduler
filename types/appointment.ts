export interface Appointment {
  _id?: string;
  name: string;
  date: string; 
  time: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Availability {
  _id?: string;
  date: string;     
  startTime: string; 
  endTime: string;   
  createdAt?: string;
}
