export type UserRole = 'client' | 'lawyer' | 'admin';

export interface User {
  id: string;
  email: string;
  role: 'client' | 'lawyer' | 'admin';
  full_name: string;
  phone?: string;
  created_at: string;
}

export interface Lawyer {
  id: string;
  user_id: string;
  specialization: string;
  experience_years: number;
  description: string;
  rating: number;
  created_at: string;
  users: User;
}

export interface TimeSlot {
  id: string;
  lawyer_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  lawyer_id: string;
  time_slot_id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  time_slots?: TimeSlot;
  lawyers?: {
    users?: {
      full_name: string;
    };
    specialization: string;
  };
} 