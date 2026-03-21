export interface User {
    id:               number;
    name?:            string;
    photo_url?:       string;
    email?:           string;
    active:           number;
    emp_id:           number;
    lastdate_login:   null;
    created_by:       null;
    updated_by:       number;
    created_at:       string;
    updated_at:       string;
    identifier_token: string;
}

export type LoginRES = {
  user: User;
  roles: string[];
  permissions: string[];
  token: string;
  message: string;
  code: number;
};


