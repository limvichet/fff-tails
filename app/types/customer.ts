export interface CustomerFormDataResponse {
  nameTitles: Array<{ id: number; label: string }>;
  identifications: Array<{ id: number; label: string }>;
  idLicenses: Array<{ id: number; label: string }>;
  occupations: Array<{ id: number; label: string }>;
  loanStatuses: Array<{ id: number; label: string }>;
}

export interface Customer {
  id?: number;
  cust_title_1?: number;
  cust_name_1?: string;
  cust_dob_1?: string;
  cust_idcardnum_1?: string;
  cust_idcardnum_date_1?: string;
  iden_id_1?: number;
  idli_id_1?: number;
  occu_id_1?: number;
  cust_phone_1?: string;
  img1?: string;
  img1_url?: string;
  cust_title_2?: number;
  cust_name_2?: string;
  cust_dob_2?: string;
  cust_idcardnum_2?: string;
  cust_idcardnum_date_2?: string;
  iden_id_2?: number;
  idli_id_2?: number;
  occu_id_2?: number;
  img2?: string;
  img2_url?: string;
  cust_phone_2?: string;
  cust_account_num?: string;
  cust_atm_num?: string;
  cust_facebook?: string;
  cust_telegram?: string;
  cust_address?: string;
  created_by?: number;
  updated_by?: number;
  active?: number;
  created_at?: string;
  updated_at?: string;
}