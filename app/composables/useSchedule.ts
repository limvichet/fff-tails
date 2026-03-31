import { ref } from "vue"

/* ================= TYPES ================= */
type FormType = {
  loan_startdate: string
  loan_totalcash: string
  loan_principle: string
  loan_interest_rate: string
  loan_peroid: number
  loantype_id: number
  loan_over_draft: string
}

/* ================= STATE ================= */
export const useSchedule = () => {
  const schedules = ref<any[]>([])

  /* ================= HELPERS ================= */
  function formatDateForInput(date: string | null) {
    if (!date) return ""
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date

    const [d, m, y] = date.split("-")
    return `${y}-${m}-${d}`
  }

  const fixDouble = (value: number, n: number): number => {
    const power = Math.pow(10, n)
    return Math.floor(value * power) / power
  }

  /* ================= GENERATOR ================= */
  const generateLoanM11 = (form: FormType) => {
    schedules.value = []

    for (let i = 0; i < form.loan_peroid; i++) {
      let startDate = new Date(formatDateForInput(form.loan_startdate))

      let newStartDate = new Date(startDate)
      newStartDate.setMonth(newStartDate.getMonth() + i)

      let newEndDate = new Date(newStartDate)
      newEndDate.setMonth(newStartDate.getMonth() + 1)

      let totalDays = Math.ceil(
        (newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0)
      const loan_principle = Number(form.loan_principle.replace(/,/g, "") || 0)
      let loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)

      let schedule_outstanding = loan_totalcash - loan_principle * i

      let schedule_principle = 0
      let schedule_interest = 0
      let schedule_totalpay = 0

      if (schedule_outstanding > 0) {
        schedule_principle = loan_principle
        schedule_interest =
          fixDouble(loan_interest_rate / 100, 3) *
          (loan_totalcash - loan_principle * i)

        schedule_totalpay = schedule_principle + schedule_interest
      }

      schedules.value.push({
        schedule_paymentnumber: i + 1,
        schedule_startdate: newStartDate,
        schedule_enddate: newEndDate,
        schedule_totaldays: totalDays,
        schedule_interest_rate: loan_interest_rate,
        schedule_outstanding,
        schedule_over_draft: 0,
        schedule_principle,
        schedule_interest,
        schedule_totalpay,
      })
    }

    recalculcateDateM()
  }

  const recalculcateDateM = () => {
    schedules.value.forEach((item, index) => {
      if (index > 0) {
        const prevEnd = new Date(schedules.value[index - 1].schedule_enddate)
        prevEnd.setDate(prevEnd.getDate() + 1)
        schedules.value[index].schedule_startdate = new Date(prevEnd)
      }

      const start = new Date(item.schedule_startdate)
      const end = new Date(item.schedule_enddate)

      let totalDays =
        Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1

      if (totalDays >= 32) totalDays = 31

      item.schedule_totaldays = totalDays
    })
  }

  /* ================= MAIN ================= */
  const generateSchedule = (form: FormType) => {
    schedules.value = []

    const generators: Record<number, () => void> = {
      11: () => generateLoanM11(form),
      12: () => generateLoanM11(form),
      13: () => generateLoanM11(form),
      14: () => {
        if (Number(form.loan_over_draft) === 0) {
          alert("Loanrecord has no over draft")
        } else {
          generateLoanM11(form)
        }
      },
    }

    const generator = generators[Number(form.loantype_id)]
    if (generator) generator()
  }

  return {
    schedules,
    generateSchedule,
  }
}