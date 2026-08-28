import { ref, reactive } from "vue"
import { z } from "zod"
import { useCustomToast } from "~/composables/useCustomToast"




type ApiResponse = {
  success: boolean
  data: {
    schedule: Schedule
    prelesses: Preless[]
  }
}

type Preless = {
  id: number
  schedule_id: number
  preless_number: number
  cash: number
  recipient: string
  note: string
  invoice_id: number
  created_at: string
  created_by: number
  createdby: Createdby
  invoice: Invoice
}

type Createdby = {
  id: number;
  emp_id: number;
  employee: Employee;
}

type Employee = {
  id: number;
  surname: string;
  first_name: string;
  full_name: string;
}

type Invoice = {
  id: number
  invoice_type: string
  invoice_number: string
}

type Schedule = {
    id: number
    loan_id: number
    schedule_principle_date: string
    schedule_paymentnumber: number
    schedule_interest_rate: number
    schedule_interest: number
    schedule_outstanding: number
    schedule_over_draft: number
    schedule_principle: number
    schedule_totalpay: number
    schedule_next_paynumber: number
    loantype_id: number
    loan_status: number
    last_loan_status: string
}

export const usePaymentPreless = () => {
  const { showToast } = useCustomToast()
  const paymentPrelessErrors = reactive<Record<string,string>>({})
  const paymentPrelessShowModal = ref(false)
  const paymentPrelessLoading = ref(false)
  const paymentPrelessIsEditMode = ref(false)

  const paymentPrelessItems = ref<Preless[]>([])
  const paymentPrelessScheduleItem = ref<Schedule | null>(null);

  const paymentPrelessShowSaveButton = ref(true)

  const paymentPrelessForm = reactive<Partial<Preless>>({
    id: undefined,
    schedule_id: 0,
    cash: 0,
    recipient: "",
    note: "",
    invoice_id: undefined
  })

  const paymentPrelessSchema = z.object({
    cash: z.number().min(1, "Required"),
    recipient: z.string().min(1, "Required"),
    note: z.string().min(1, "Required"),
  })

  const validateField = (field: keyof typeof paymentPrelessSchema.shape) => {
    try {
      paymentPrelessSchema.shape[field].parse(paymentPrelessForm[field])
      paymentPrelessErrors[field] = ""
    } catch (err: any) {
      paymentPrelessErrors[field] = err.paymentPrelessErrors?.[0]?.message || "Invalid value"
    }
  }


  Object.keys(paymentPrelessSchema.shape).forEach((field) => {
    watch(
      () => paymentPrelessForm[field as keyof typeof paymentPrelessForm],
      () => validateField(field as keyof typeof paymentPrelessSchema.shape)
    )
  })


  const validateForm = () => {
  const result = paymentPrelessSchema.safeParse(paymentPrelessForm)
  if (!result.success) {
      result.error.errors.forEach((e) => {
        paymentPrelessErrors[e.path[0] as string] = e.message
      })
      return false
    }
    return true
  }


  // RESET
  const resetForm = () => {
    paymentPrelessForm.id = undefined
    paymentPrelessForm.schedule_id = 0
    paymentPrelessForm.cash = 0
    paymentPrelessForm.recipient = ""
    paymentPrelessForm.note = ""
    paymentPrelessForm.invoice_id = undefined
  }


  // FETCH LIST
  const paymentPrelessFetchItems = async (schedule_id: number) => {
    paymentPrelessLoading.value = true
    paymentPrelessForm.schedule_id = schedule_id

    try {
      const res = await $fetch<ApiResponse>(`/admin-secure/payment-prelesses?param=${schedule_id}`)
      const data = res?.data ?? res
      paymentPrelessItems.value = data?.prelesses ?? []
      paymentPrelessScheduleItem.value = data?.schedule ?? null

      if (paymentPrelessScheduleItem.value) {
        paymentPrelessHandleScheduleStatus(
          paymentPrelessScheduleItem.value,
          paymentPrelessScheduleItem.value.schedule_next_paynumber
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      paymentPrelessLoading.value = false
    }
  }


  // OPEN MODAL
  const paymentPrelessOpenModal = async (schedule_id: number) => {
    resetForm()
    paymentPrelessIsEditMode.value = false
    paymentPrelessShowModal.value = true
    await paymentPrelessFetchItems(schedule_id)
  }

  // EDIT
  const paymentPrelessEditItem = (item: Preless) => {
    Object.assign(paymentPrelessForm, item)
    paymentPrelessIsEditMode.value = true
    paymentPrelessShowModal.value = true
  }

  // ======================
  // CLOSE
  // ======================
  const paymentPrelessCloseModal = () => {
    paymentPrelessShowModal.value = false
    paymentPrelessIsEditMode.value = false
    resetForm()
  }

  // ======================
  // CREATE / UPDATE
  // ======================
  const paymentPrelessSubmitForm = async () => {
    if (!validateForm()) {
      showToast("Validation error", "Please fix the highlighted fields", "error")
      return
    }

    try {
      paymentPrelessLoading.value = true

      const body = {
        schedule_id: paymentPrelessForm.schedule_id,
        cash: paymentPrelessForm.cash,
        recipient: paymentPrelessForm.recipient,
        note: paymentPrelessForm.note,
        invoice_id: paymentPrelessForm.invoice_id
      }

      if (paymentPrelessIsEditMode.value) {
        // UPDATE
        await $fetch(`/admin-secure/payment-prelesses/${paymentPrelessForm.id}`, {
          method: "PUT",
          body
        })

        showToast("Updated", "Cash-in updated", "success")
      } else {
        // CREATE
        await $fetch(`/admin-secure/payment-prelesses`, {
          method: "POST",
          body
        })
        paymentPrelessIsEditMode.value = true
        showToast("Created", "Cash-in saved", "success")
      }

      if (paymentPrelessForm.schedule_id) {
        await paymentPrelessFetchItems(paymentPrelessForm.schedule_id)
      }
      // paymentPrelessCloseModal()

    } catch (err) {
      console.error(err)
    } finally {
      paymentPrelessLoading.value = false
    }
  }

  // ======================
  // DELETE
  // ======================
  const paymentPrelessDeleteItem = async (id: number) => {
    if (!confirm("Delete this item?")) return

    try {
      await $fetch(`/admin-secure/payment-prelesses/${id}`, {
        method: "DELETE"
      })

      showToast("Deleted", "Cash-in removed", "success")
      if (paymentPrelessForm.schedule_id) {
        await paymentPrelessFetchItems(paymentPrelessForm.schedule_id)
      }
    } catch (err) {
      console.error(err)
    }
  }


  const paymentPrelessHandleScheduleStatus = (
    data: any,
    schedule_next_paynumber: number
  ) => {

    if ([14, 36].includes(data.loantype_id)) {

      if (schedule_next_paynumber > 0) {
        paymentPrelessShowSaveButton.value = false
      } else {
        paymentPrelessShowSaveButton.value = true
      }

    } else {

      if (
        schedule_next_paynumber > 0 &&
        data.last_loan_status == "active"
      ) {

        paymentPrelessShowSaveButton.value = false

      } else if (
        schedule_next_paynumber == 0 &&
        data.last_loan_status == "active"
      ) {

        paymentPrelessShowSaveButton.value = true

      } else if (
        schedule_next_paynumber > 0 &&
        [0, 1].includes(data.loan_status)
      ) {

        paymentPrelessShowSaveButton.value = false

      } else if (
        schedule_next_paynumber == 0 &&
        data.loan_status == 0
      ) {

        paymentPrelessShowSaveButton.value = false

      } else {

        paymentPrelessShowSaveButton.value = true
      }
    }
  }

  return {
    paymentPrelessItems,
    paymentPrelessForm,
    paymentPrelessShowModal,
    paymentPrelessLoading,
    paymentPrelessIsEditMode,

    paymentPrelessFetchItems,
    paymentPrelessOpenModal,
    paymentPrelessCloseModal,
    paymentPrelessSubmitForm,
    paymentPrelessEditItem,
    paymentPrelessDeleteItem,
    paymentPrelessScheduleItem,
    paymentPrelessShowSaveButton,
    paymentPrelessErrors,
  }
}