import { ref, reactive } from "vue"
import { z } from "zod"
import { useCustomToast } from "~/composables/useCustomToast"




type ApiResponse = {
  success: boolean
  data: {
    schedule: Schedule
    cashins: Cashin[]
  }
}

type Cashin = {
  id: number
  schedule_id: number
  cashin_number: number
  cash: number
  recipient: string
  note: string
  invoice_id: number
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
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
}

export const usePaymentCashin = () => {
  const { showToast } = useCustomToast()
  const errors = reactive<Record<string,string>>({})
  const paymentCashinShowModal = ref(false)
  const paymentCashinLoading = ref(false)
  const paymentCashinIsEditMode = ref(false)

  const paymentCashinItems = ref<Cashin[]>([])
  const scheduleItem = ref<Schedule | null>(null);

  const paymentCashinForm = reactive<Partial<Cashin>>({
    id: undefined,
    schedule_id: 0,
    cash: 0,
    recipient: "",
    note: "",
    invoice_id: undefined
  })

  const paymentCashinSchema = z.object({
    cash: z.number().min(1, "Required"),
    recipient: z.string().min(1, "Required"),
    note: z.string().min(1, "Required"),
  })

  const validateField = (field: keyof typeof paymentCashinSchema.shape) => {
    try {
      paymentCashinSchema.shape[field].parse(paymentCashinForm[field])
      errors[field] = ""
    } catch (err: any) {
      errors[field] = err.errors?.[0]?.message || "Invalid value"
    }
  }


  Object.keys(paymentCashinSchema.shape).forEach((field) => {
    watch(
      () => paymentCashinForm[field as keyof typeof paymentCashinForm],
      () => validateField(field as keyof typeof paymentCashinSchema.shape)
    )
  })


  const validateForm = () => {
  const result = paymentCashinSchema.safeParse(paymentCashinForm)
  if (!result.success) {
      result.error.errors.forEach((e) => {
        errors[e.path[0] as string] = e.message
      })
      return false
    }
    return true
  }




  // RESET
  const resetForm = () => {
    paymentCashinForm.id = undefined
    paymentCashinForm.schedule_id = 0
    paymentCashinForm.cash = 0
    paymentCashinForm.recipient = ""
    paymentCashinForm.note = ""
    paymentCashinForm.invoice_id = undefined
  }


  // FETCH LIST
  const paymentCashinFetchItems = async (schedule_id: number) => {
    paymentCashinLoading.value = true
    paymentCashinForm.schedule_id = schedule_id

    try {
      const res = await $fetch<ApiResponse>(`/api/admin-secure/payment-cashins?param=${schedule_id}`)
      const data = res?.data ?? res
      paymentCashinItems.value = data?.cashins ?? []
      scheduleItem.value = data?.schedule ?? null
      // console.log(scheduleItem)
    } catch (err) {
      console.error(err)
    } finally {
      paymentCashinLoading.value = false
    }
  }


  // OPEN MODAL
  const paymentCashinOpenModal = async (schedule_id: number) => {
    resetForm()
    paymentCashinIsEditMode.value = false
    paymentCashinShowModal.value = true
    await paymentCashinFetchItems(schedule_id)
  }

  // EDIT
  const paymentCashinEditItem = (item: Cashin) => {
    Object.assign(paymentCashinForm, item)
    paymentCashinIsEditMode.value = true
    paymentCashinShowModal.value = true
  }

  // ======================
  // CLOSE
  // ======================
  const paymentCashinCloseModal = () => {
    paymentCashinShowModal.value = false
    paymentCashinIsEditMode.value = false
    resetForm()
  }

  // ======================
  // CREATE / UPDATE
  // ======================
  const paymentCashinSubmitForm = async () => {
    if (!validateForm()) {
      showToast("Validation error", "Please fix the highlighted fields", "error")
      return
    }

    try {
      paymentCashinLoading.value = true

      const body = {
        schedule_id: paymentCashinForm.schedule_id,
        cash: paymentCashinForm.cash,
        recipient: paymentCashinForm.recipient,
        note: paymentCashinForm.note,
        invoice_id: paymentCashinForm.invoice_id
      }

      if (paymentCashinIsEditMode.value) {
        // UPDATE
        await $fetch(`/api/admin-secure/payment-cashins/${paymentCashinForm.id}`, {
          method: "PUT",
          body
        })

        showToast("Updated", "Cash-in updated", "success")
      } else {
        // CREATE
        await $fetch(`/api/admin-secure/payment-cashins`, {
          method: "POST",
          body
        })
        paymentCashinIsEditMode.value = true
        showToast("Created", "Cash-in saved", "success")
      }

      if (paymentCashinForm.schedule_id) {
        await paymentCashinFetchItems(paymentCashinForm.schedule_id)
      }
      // paymentCashinCloseModal()

    } catch (err) {
      console.error(err)
    } finally {
      paymentCashinLoading.value = false
    }
  }

  // ======================
  // DELETE
  // ======================
  const paymentCashinDeleteItem = async (id: number) => {
    if (!confirm("Delete this item?")) return

    try {
      await $fetch(`/api/admin-secure/payment-cashins/${id}`, {
        method: "DELETE"
      })

      showToast("Deleted", "Cash-in removed", "success")
      if (paymentCashinForm.schedule_id) {
        await paymentCashinFetchItems(paymentCashinForm.schedule_id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    paymentCashinItems,
    paymentCashinForm,
    paymentCashinShowModal,
    paymentCashinLoading,
    paymentCashinIsEditMode,

    paymentCashinFetchItems,
    paymentCashinOpenModal,
    paymentCashinCloseModal,
    paymentCashinSubmitForm,
    paymentCashinEditItem,
    paymentCashinDeleteItem,
    scheduleItem,
    errors,
  }
}