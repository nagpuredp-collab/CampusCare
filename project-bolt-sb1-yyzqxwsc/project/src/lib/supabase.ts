import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'Student' | 'Faculty' | 'Admin';

export type Profile = {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  user_id: string;
  department: string;
  created_at: string;
};

export type GrievanceStatus = 'Submitted' | 'In Progress' | 'Resolved' | 'Closed';
export type GrievanceCategory = 'Academic' | 'Facility' | 'Examination' | 'Placement' | 'Other';

export type Grievance = {
  id: string;
  grievance_id: string;
  submitted_by: string;
  title: string;
  description: string;
  category: GrievanceCategory;
  status: GrievanceStatus;
  assigned_to?: string;
  resolution_comments?: string;
  details: Record<string, any>;
  created_at: string;
  updated_at: string;
  submitter?: Profile;
  assignee?: Profile;
};
