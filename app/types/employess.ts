export interface APIResponse {
    genders: Array<{ id: number; label: string }>;
    roles: Array<{ id: number; label: string }>;
    maritalStatuses: Array<{ id: number; label: string }>;
    statuses: Array<{ id: number; label: string }>;
    educations: string[];
    occupations: string[];
}

export interface Employee {
  id?: number;
  surname?: string;
  first_name?: string;
  gender_id?: number;
  role_id?: number;
  dob?: string;
  hire_date?: string;
  leave_date?: string;
  marital_status_id?: number;
  spouse_name?: string;
  spouse_job?: string;
  father_name?: string;
  father_job?: string;
  mother_name?: string;
  mother_job?: string;
  phone?: string;
  telegram?: string;
  facebook?: string;
  current_address?: string;
  note?: number;
  guarantor_name?: string;
  guarantor_job?: string;
  guarantor_working_place?: string;
  guarantor_address?: string;
  guarantor_phone?: string;
  education?: any[];
  work_histories?: any[];
  active?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
  status_id?: number;
  img1?: string;
  img1_url?: string;
  photo1_url?: string;
  full_name?: string;
}