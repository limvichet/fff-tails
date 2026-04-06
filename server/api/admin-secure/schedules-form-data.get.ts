
type APIResponse = {
    customers:  { [key: string]: string };
    loanrecords: Loanrecord[];
}

type Loanrecord = {
    id:                 number;
    cust_id:            number;
    currency_id:        number | null;
    loan_startdate:     null | string;
    loan_first_paid_date:     null | string;
    loan_enddate:       null | string;
    loan_totalcash:     string;
    loan_principle:     string;
    loan_interest_rate: string;
    loan_peroid:        number | null;
    loantype_id:        number | null;
    loan_over_draft?:   string;
    customer:           Customer;
    currency:           Currency | null;
    loantype:           Loantype | null;
}

type Customer = {
    id:          number;
    cust_name_1: string;
    cust_name_2: null | string;
}
type Currency = {
    id:          number;
    currency_en: string;
}
type Loantype = {
    id:              number;
    loantype_detail: string;
}

import { getCookie, createError } from "h3"

const CACHE_TTL = 60 * 60 * 12; // 12 hours

export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event);

  try {
    const token = getCookie(event, "token")
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized access",
      });
    }

    // Updated URL to the endpoint that returns the titles, occupations, etc.
    // Replace '/admin-secure/staffs/metadata' with your actual target route
    const res = await $fetch<APIResponse>(
      `${apiBaseUrl}/api/admin-secure/schedules-form-data`, 
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          'cache-control': 'no-cache'   // ✅ prevent upstream cache
        },
      }
    );

    // 🔥 IMPORTANT: disable Nitro cache
    setHeader(event, 'Cache-Control', 'no-store')

    return res;
  } catch (error: any) {
    // Specific error message for this context
    throw customCreateError(error, "Failed to retrieve staff and customer metadata!");
  }
});