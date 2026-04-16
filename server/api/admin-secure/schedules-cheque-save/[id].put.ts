
// type APIResponse = {
//     success: boolean;
//     message: string;
//     data: Data;
// }

// type Data = {
//     loanrecord: Loanrecord;
//     schedules: Schedule[];
//     count_schedule_principle_payment: number;
//     cheque: number;
//     bank_loanrecords?: {
//         loan_id: number;
//         cheque_order: number;
//         cheque_number: number;
//         schedule_paymentnumber_from: number;
//         schedule_paymentnumber_to: number;
//         schedule_totalpay: string;
//     }
//     bank_id: number;
// }

// type Loanrecord = {
//     id: number;
//     cust_id: number;
//     loan_peroid: number;
//     customer: { id: number; cust_name_1: string };
// }

// type Schedule = {
//     id: number;
//     loan_id: number;
//     schedule_paymentnumber: number;
//     schedule_totalpay: string;
// }

import { getCookie, getRouterParam, createError } from "h3"

export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig(event);
  const id = getRouterParam(event, "id")
  const body = await readBody(event)

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
    
    const res = await $fetch<any>(
      `${apiBaseUrl}/api/admin-secure/schedules-cheque-save/${id}`, 
      {
        method: "PUT",
        body,
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