import { ref, reactive } from "vue"
import { useCustomToast } from '~/composables/useCustomToast';
const { showToast } = useCustomToast();


type Schedule = {
  id: number
  loan_id: number
  schedule_paymentnumber: number
  schedule_totalpay: string
  schedule_startdate: string
  schedule_enddate: string
}

type ChequeItem = {
  id?: number
  cheque_order: number
  cheque_number: string
  from: number
  to: number
  total: string
  locked?: boolean
}

export const useChequeSchedule = () => {
  const showModal = ref(false)
  const loading = ref(false)

  const schedules = ref<Schedule[]>([])
  const period = ref()
  const banks = ref<{ id: number; label: string }[]>([])

  const isEditMode = ref(false)

  const createEmptyCheques = (): ChequeItem[] =>
    Array.from({ length: 4 }, (_, i) => ({
      cheque_order: i + 1,
      cheque_number: "",
      from: 0,
      to: 0,
      total: ""
    }))

  const form = reactive({
    chequeschedule_cust_name_1: "",
    chequeschedule_loan_id: "",
    chequeschedule_loan_peroid: "",
    chequeschedule_bank_id: -1,
    cheques: createEmptyCheques()
  })

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    form.chequeschedule_cust_name_1 = ""
    form.chequeschedule_loan_id = ""
    form.chequeschedule_loan_peroid = ""
    form.chequeschedule_bank_id = -1
    form.cheques = createEmptyCheques()
  }

  // =========================
  // FETCH DATA (CREATE + EDIT)
  // =========================
  const fetchChequeData = async (url: string) => {
    loading.value = true

    try {
      const res = await $fetch<any>(url)
      // ✅ IMPORTANT: unwrap correctly
      const root = res?.data ?? res
      const data = root?.data ?? root

      // =========================
      // MODE CHECK
      // =========================
      isEditMode.value = data.cheque === 1

      // =========================
      // BASIC INFO
      // =========================
      schedules.value = data.schedules ?? []
      period.value = data.loanrecord?.loan_peroid ?? 0

      form.chequeschedule_cust_name_1 =
        data.loanrecord?.customer?.cust_name_1 ?? ""

      form.chequeschedule_loan_id = String(data.loanrecord?.id ?? "")
      form.chequeschedule_loan_peroid = String(
        data.loanrecord?.loan_peroid ?? ""
      )

      // =========================
      // BANKS
      // =========================
      banks.value = Object.entries(data.banks ?? {}).map(
        ([id, name]) => ({
          id: Number(id),
          label: String(name)
        })
      )

      // =========================
      // CHEQUES SOURCE
      // =========================
      const chequesSource = isEditMode.value
        ? data.bank_loanrecords?.cheques ?? []
        : []

      // =========================
      // BUILD FORM
      // =========================
      const mapped = createEmptyCheques().map((_, index) => {
        const saved = chequesSource[index]
        const schedule = data.schedules?.[index]

        if (saved) {
          return {
            id: saved.id,
            cheque_order: saved.cheque_order,
            cheque_number: saved.cheque_number,
            from: saved.schedule_paymentnumber_from,
            to: saved.schedule_paymentnumber_to,
            total: saved.schedule_totalpay
          }
        }

        return {
          cheque_order: index + 1,
          cheque_number: "",
          from: schedule?.schedule_paymentnumber ?? 0,
          to: schedule?.schedule_paymentnumber ?? 0,
          total: schedule?.schedule_totalpay ?? ""
        }
      })

      form.cheques = [...mapped]
    } catch (err) {
      console.error("fetchChequeData error:", err)
    } finally {
      loading.value = false
    }
  }

  // =========================
  // OPEN MODAL
  // =========================
  const openModal = async (dataUrl: string, editUrl: string) => {
    resetForm()
    showModal.value = true

    // 1. base data
    await fetchChequeData(dataUrl)

    // 2. edit data
    const res = await $fetch<any>(editUrl)
    const data = res?.data ?? res

    isEditMode.value = data.cheque === 1

    // if (!isEditMode.value) return

    if (!isEditMode.value) {
      // ✅ clear table (from/to empty)
      form.cheques = createEmptyCheques().map((row, i) => ({
        ...row,
        from: 0,
        to: 0,
        total: ""
      }))
      return
    }

    // ✅ FIX: set selected bank
    form.chequeschedule_bank_id =
      data.bank_loanrecords?.bank_id ?? -1

    // ✅ map cheques
    form.cheques = createEmptyCheques().map((_, i) => {
      const c = data.bank_loanrecords?.cheques?.[i]

      return c
        ? {
          id: c.id,
          cheque_order: c.cheque_order,
          cheque_number: c.cheque_number,
          from: c.schedule_paymentnumber_from,
          to: c.schedule_paymentnumber_to,
          total: c.schedule_totalpay
        }
        : {
          cheque_order: i + 1,
          cheque_number: "",
          from: 0,
          to: 0,
          total: ""
        }
    })
  }

  // =========================
  // CLOSE MODAL
  // =========================
  const closeModal = () => {
    showModal.value = false
    resetForm()
    initialized.value = false // 🔥 IMPORTANT
  }

  // =========================
  // CALCULATE TOTALS
  const initialized = ref(false)
  const calculateTotals = () => {
  let lastTo = 0
  const maxPay = period.value

  form.cheques.forEach((row, index) => {
    // ✅ LOCK RULE
    row.locked = index === 2 || index === 3

    // ✅ STEP 1: set FROM
    if (index === 0) row.from = 1
    else if (index === 3) row.from = 1
    else row.from = lastTo + 1

    // ✅ STEP 2: normalize TO
    let to = Number(row.to) || 0

    // ✅ SPECIAL RULE: row 4 always goes to max
    if (index === 3) {
      to = maxPay
    }


    // if empty → skip but keep flow safe
    if (!to) {
      row.total = ""
      return
    }

    // ✅ enforce range
    to = Math.max(to, row.from)   // prevent to < from
    to = Math.min(to, maxPay)     // prevent to > maxPay

    // // FIX: prevent to < from
    // if (to < row.from) {
    //   to = row.from
    // }

    // // FIX: prevent overflow
    // if (to > maxPay) {
    //   to = maxPay
    // }

    // assign back AFTER validation
    row.to = to

    // ✅ STEP 3: calculate total
    let sum = 0

    for (let i = row.from; i <= to; i++) {
      const found = schedules.value.find(
        s => s.schedule_paymentnumber === i
      )
      if (found) {
        sum += Number(found.schedule_totalpay)
      }
    }

    row.total = sum.toFixed(2)

    // ✅ STEP 4: update lastTo safely
    lastTo = to
  })

  initialized.value = true
}

  // =========================
  // SUBMIT (SAVE ONLY)
  // =========================
  const submitForm = async () => {
    try {
      loading.value = true

      const payload = {
        chequeschedule_loan_id: form.chequeschedule_loan_id,
        chequeschedule_bank_id: form.chequeschedule_bank_id,
        cheques: form.cheques.map(c => ({
          cheque_order: c.cheque_order,
          cheque_number: c.cheque_number,
          schedule_paymentnumber_from: c.from,
          schedule_paymentnumber_to: c.to,
          schedule_totalpay: c.total
        }))
      }

      await $fetch(`/api/admin-secure/schedules-cheque-save/${form.chequeschedule_loan_id}`, {
        method: "PUT",
        body: payload
      })


      showToast(
        `ID #${form.chequeschedule_loan_id}`,
        `Updated cheque successfully!`,
        `success`
      )

     closeModal()
      


    } catch (err) {
      console.error("submitForm error:", err)
    } finally {
      loading.value = false
    }
  }



  const fetchEditData = async (id: string | number) => {
  loading.value = true

  try {
    const res = await $fetch<any>(
      `/api/admin-secure/schedules-cheque-edit/${id}`
    )

    const data = res?.data ?? res

    isEditMode.value = true

    schedules.value = data.schedules ?? []

    form.chequeschedule_cust_name_1 =
      data.loanrecord?.customer?.cust_name_1 ?? ""

    form.chequeschedule_loan_id = String(data.loanrecord?.id ?? "")
    form.chequeschedule_loan_peroid = String(
      data.loanrecord?.loan_peroid ?? ""
    )

    // ✅ FIX HERE
    form.chequeschedule_bank_id = Number(
      data.bank_loanrecords?.bank_id ?? -1
    )

    // banks
    banks.value = Object.entries(data.banks ?? {}).map(
      ([id, name]) => ({
        id: Number(id),
        label: String(name)
      })
    )

    const chequesSource = data.bank_loanrecords?.cheques ?? []

    form.cheques = createEmptyCheques().map((_, i) => {
      const c = chequesSource[i]

      return c
        ? {
            id: c.id,
            cheque_order: c.cheque_order,
            cheque_number: c.cheque_number,
            from: c.schedule_paymentnumber_from,
            to: c.schedule_paymentnumber_to,
            total: c.schedule_totalpay
          }
        : {
            cheque_order: i + 1,
            cheque_number: "",
            from: 0,
            to: 0,
            total: ""
          }
    })

    form.cheques = [...form.cheques]

  } catch (err) {
    console.error("fetchEditData error:", err)
  } finally {
    loading.value = false
  }
}



  return {
    showModal,
    form,
    loading,
    banks,
    isEditMode,

    openModal,
    closeModal,
    calculateTotals,
    submitForm,
  }
}