export interface LoanrecordFormDataResponse {
    customerName1: Array<{ id: number; label: string }>;
    customerName2: Array<{ id: number; label: string }>;
    currencies: Array<{ id: number; label: string }>;
    loanTypes: Array<{ id: number; label: string }>;
    paybacks: Array<{ id: number; label: string }>;
    loanGroupPositions: Array<{ id: number; label: string }>;
    loanStatuses: Array<{ id: number; label: string }>;
    sourceMoneys: Array<{ label: string }>;
}

export interface Loanrecord {
    id?:                           number;
    cust_id?:                      number;
    loan_lastcash?:                number;
    loan_newcash?:                 number;
    loan_totalcash?:               number;
    currency_id?:                  number;
    source_money?:                 string;
    loantype_id?:                  number;
    loan_over_draft?:              number;
    payback_id?:                   number;
    loan_peroid?:                  number;
    loan_startdate?:               string;
    loan_enddate?:                 string;
    loan_startdate_principle?:     string;
    loan_interest_rate?:           number;
    loan_principle?:               number;
    loan_collateral_1?:            string;
    loan_collateral_2?:            string;
    loan_note?:                    string;
    cust_comission_id?:            number;
    cust_comission_interest_rate?: number;
    cust_loangroup_id?:            number;
    cust_guarantor_id?:            number;
    cust_position_loangroup_id?:   number;
    invoice_id?:                   number;
    loan_status_id?:               number;
    created_by?:                   number;
    updated_by?:                   number;
    active?:                       number;
    created_at?:                   Date;
    updated_at?:                   Date;
    loan_check_status?:            number;
    loan_check_approver?:          number | null;
    loan_check_date?:              string | null;
}