export type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  active: boolean;
};

export type Barber = {
  id: string;
  name: string;
  active: boolean;
};

export type BusinessSettings = {
  id: string;
  business_name: string;
  whatsapp_phone: string;
  address: string | null;
  instagram: string | null;
  hero_title: string | null;
  hero_description: string | null;
};

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "completed"
  | "no_show";

export type Appointment = {
  id: string;
  client_id: string;
  client_name: string;
  client_phone: string;
  service_id: string | null;
  service_name: string;
  barber_id: string | null;
  barber_name: string;
  appointment_date: string;
  appointment_time: string;
  price: number;
  status: AppointmentStatus;
  notes: string | null;
  admin_note: string | null;
  created_at: string;
};
