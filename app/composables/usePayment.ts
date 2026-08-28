import { ref, reactive, watch } from "vue"
import { z } from "zod"
import { useCustomToast } from "~/composables/useCustomToast"

export interface ApiResponse {
  success: boolean
  data: {
    invoice_id: number
    schedule_next_paynumber: number
    invoice_number: string
    loantype_id: number
    loantype: string
    od_loan_totalcash: number
    previous_outstanding: number
    loan_status: number
    last_loan_status: string
    schedule: Schedule
  }
}

export interface Schedule {
  id: number
  loan_id: number
  schedule_startdate: string
  schedule_enddate: string
  schedule_totaldays: number
  schedule_principle_date: string
  schedule_paymentnumber: number
  schedule_outstanding: number
  schedule_over_draft: number
  schedule_principle: number
  schedule_interest_rate: number
  schedule_interest: number
  schedule_totalpay: number
  schedule_paidcash: number
  schedule_note: string
  schedule_cashin_1: number
  schedule_cashin_2: number
  schedule_cashin_3: number
  schedule_totalcashin: number
  schedule_remaincash: number
  schedule_preless_1: number
  schedule_preless_2: number
  schedule_preless_3: number
  schedule_totalpreless: number
  schedule_lessmoney: number
  schedule_principle_payment: number
  cheque_number: string
  invoice_id: number
  created_by: number
  updated_by: number
  active: number
  created_at: string
  updated_at: string
}

type PaymentForm = Partial<{
  id: number
  schedule_paymentnumber: number
  schedule_principle_date: string
  schedule_interest_rate: number
  schedule_interest: number
  schedule_outstanding: number
  schedule_over_draft: number
  schedule_principle: number
  schedule_totalpay: number
  schedule_totalcashin: number
  schedule_cashin_3: number
  schedule_remaincash: number
  schedule_paidcash: number
  schedule_totalpreless: number
  schedule_note: string
  invoice_id: number
  schedule_lessmoney: number
}>

const defaultForm: PaymentForm = {}

const toNumber = (v: any) => v ?? 0

// ======================
// ZOD SCHEMA (FIXED)
// ======================
const numberField = z.preprocess(
  (v) => (v === null || v === undefined ? 0 : Number(v)),
  z.number()
)

const paymentSchema = z.object({
  schedule_paymentnumber: numberField,
  schedule_principle_date: z.string().optional(),
  schedule_interest_rate: numberField,
  schedule_interest: numberField,
  schedule_outstanding: numberField,
  schedule_over_draft: numberField,
  schedule_principle: numberField,
  schedule_totalpay: numberField,
  schedule_totalcashin: numberField,
  schedule_cashin_3: numberField,
  schedule_remaincash: numberField,
  schedule_paidcash: numberField,
  schedule_totalpreless: numberField,
  schedule_note: z.string().optional(),
  invoice_id: numberField,
  schedule_lessmoney: numberField,
})

export const usePayment = () => {
  const { showToast } = useCustomToast()

  const paymentLoading = ref(false)
  const paymentShowModal = ref(false)
  const paymentShowSaveButton = ref(true)
  // const default_schedule_principle = ref(0)
  // const loantype_id = ref(0)

  const paymentErrors = reactive<Record<string, string>>({})

  const paymentItem = ref<ApiResponse["data"] | null>(null)
  const paymentSchedule = ref<Schedule | null>(null)

  const paymentForm = reactive<PaymentForm>({
    ...defaultForm,
  })

  // ======================
  // VALIDATE FIELD
  // ======================
  const validateField = (field: keyof typeof paymentSchema.shape) => {
    try {
      paymentSchema.shape[field].parse(paymentForm[field])
      paymentErrors[field] = ""
    } catch (err: any) {
      paymentErrors[field] =
        err?.errors?.[0]?.message || "Invalid value"
    }
  }

  Object.keys(paymentSchema.shape).forEach((field) => {
    watch(
      () => paymentForm[field as keyof PaymentForm],
      () => validateField(field as keyof typeof paymentSchema.shape)
    )
  })

  // ======================
  // VALIDATE FORM
  // ======================
  const validateForm = () => {
    const result = paymentSchema.safeParse(paymentForm)

    if (!result.success) {
      result.error.errors.forEach((e) => {
        paymentErrors[e.path[0] as string] = e.message
      })
      return false
    }
    return true
  }

  // ======================
  // RESET FORM
  // ======================
  const resetForm = () => {
    Object.assign(paymentForm, defaultForm)
    Object.keys(paymentErrors).forEach((k) => {
      paymentErrors[k] = ""
    })
  }

  // ======================
  // MAP API DATA (FIXED NULL ISSUE)
  // ======================
  const mapScheduleToForm = (schedule?: Schedule | null) => {
    if (!schedule) return

    Object.assign(paymentForm, {
      id: schedule.id,
      schedule_paymentnumber: toNumber(schedule.schedule_paymentnumber),
      schedule_principle_date: schedule.schedule_principle_date,
      schedule_interest_rate: toNumber(schedule.schedule_interest_rate),
      schedule_interest: toNumber(schedule.schedule_interest),
      schedule_outstanding: toNumber(schedule.schedule_outstanding),
      schedule_over_draft: toNumber(schedule.schedule_over_draft),
      schedule_principle: toNumber(schedule.schedule_principle),
      schedule_totalpay: toNumber(schedule.schedule_totalpay),
      schedule_totalcashin: toNumber(schedule.schedule_totalcashin),
      schedule_cashin_3: toNumber(schedule.schedule_cashin_3),
      schedule_remaincash: toNumber(schedule.schedule_remaincash),
      schedule_paidcash: toNumber(schedule.schedule_paidcash),
      schedule_totalpreless: toNumber(schedule.schedule_totalpreless),
      schedule_note: schedule.schedule_note ?? "",
      invoice_id: schedule.invoice_id,
      schedule_lessmoney: toNumber(schedule.schedule_lessmoney),
    })
  }

  // ======================
  // FETCH ITEM
  // ======================
  const paymentFetchItem = async (pid: number) => {
    paymentLoading.value = true

    try {
      const res = await $fetch<ApiResponse>(
        `/admin-secure/payments/${pid}/edit`
      )

      const data = res.data

      paymentItem.value = data
      paymentSchedule.value = data.schedule
      // default_schedule_principle.value = data.schedule.schedule_principle
      // loantype_id.value = data.loantype_id

      mapScheduleToForm(data.schedule)

      paymentHandleScheduleStatus(
        data,
        data.schedule_next_paynumber
      )
    } catch (err) {
      console.error(err)
    } finally {
      paymentLoading.value = false
    }
  }

  // ======================
  // OPEN MODAL
  // ======================
  const paymentOpenModal = async (pid: number) => {
    resetForm()
    paymentShowModal.value = true

    try {
      await paymentFetchItem(pid)
    } finally {
      paymentLoading.value = false
    }
  }

  // ======================
  // CLOSE MODAL
  // ======================
  const paymentCloseModal = () => {
    paymentShowModal.value = false
    resetForm()
  }

  // ======================
  // SUBMIT
  // ======================
  const paymentSubmitForm = async () => {
    if (!validateForm()) {
      showToast(
        "Validation error",
        "Please fix the highlighted fields",
        "error"
      )
      return
    }

    try {
      paymentLoading.value = true


      const payload = {
        schedule_interest_rate: parseFloat(String(paymentForm.schedule_interest_rate).replace(/,/g, "")),
        schedule_interest: parseFloat(String(paymentForm.schedule_interest).replace(/,/g, "")),
        schedule_outstanding: parseFloat(String(paymentForm.schedule_outstanding).replace(/,/g, "")),
        schedule_over_draft: parseFloat(String(paymentForm.schedule_over_draft).replace(/,/g, "")),
        schedule_principle: parseFloat(String(paymentForm.schedule_principle).replace(/,/g, "")),
        schedule_cashin_3: parseFloat(String(paymentForm.schedule_cashin_3).replace(/,/g, "")),
        schedule_totalpay: parseFloat(String(paymentForm.schedule_totalpay).replace(/,/g, "")),
        schedule_paidcash: parseFloat(String(paymentForm.schedule_paidcash).replace(/,/g, "")),
        schedule_lessmoney: parseFloat(String(paymentForm.schedule_lessmoney).replace(/,/g, "")),
        schedule_note: paymentForm.schedule_note,
      }

      console.log(payload)

      await $fetch(`/admin-secure/payments/${paymentForm.id}`, {
        method: "PUT",
        body: payload,
      })

      showToast("Success", "Payment updated", "success")

      if (paymentForm.id) {
        await paymentFetchItem(paymentForm.id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      paymentLoading.value = false
    }
  }

  // ======================
  // STATUS LOGIC
  // ======================
  const paymentHandleScheduleStatus = (
    data: ApiResponse["data"],
    schedule_next_paynumber: number
  ) => {
    if ([14, 36].includes(data.loantype_id)) {
      paymentShowSaveButton.value = schedule_next_paynumber <= 0
      return
    }

    if (schedule_next_paynumber > 0 && data.last_loan_status === "active") {
      paymentShowSaveButton.value = false
    } else if (schedule_next_paynumber === 0 && data.last_loan_status === "active") {
      paymentShowSaveButton.value = true
    } else if (schedule_next_paynumber > 0 && [0, 1].includes(data.loan_status)) {
      paymentShowSaveButton.value = false
    } else if (schedule_next_paynumber === 0 && data.loan_status === 0) {
      paymentShowSaveButton.value = false
    } else {
      paymentShowSaveButton.value = true
    }
  }

  return {
    paymentLoading,
    paymentShowModal,
    paymentShowSaveButton,
    paymentErrors,
    paymentItem,
    paymentSchedule,
    paymentForm,
    paymentFetchItem,
    paymentOpenModal,
    paymentCloseModal,
    paymentSubmitForm,
  }
}