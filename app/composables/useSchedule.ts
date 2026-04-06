import { ref } from "vue"
import { formatDateForInput } from "@/utils/date"
import { fixDouble } from "@/utils/number"

const reroundLoading = ref(false)
const reroundDone = ref(false)

/*  TYPES  */
type FormType = {
  loan_startdate: string
  loan_first_paid_date: string
  loan_totalcash: string
  loan_principle: string
  loan_interest_rate: string
  loan_peroid: number
  loantype_id: number
  loan_over_draft: string
}

/*  STATE  */
export const useSchedule = () => {

  const schedules = ref<any[]>([])

  /*  generateM11 original  */
  // const generateM11 = (form: FormType) => {
  //   schedules.value = []

  //   for (let i = 0; i < form.loan_peroid; i++) {
  //     let startDate = new Date(formatDateForInput(form.loan_startdate))

  //     let newStartDate = new Date(startDate)
  //     newStartDate.setMonth(newStartDate.getMonth() + i)

  //     let newEndDate = new Date(newStartDate)
  //     newEndDate.setMonth(newStartDate.getMonth() + 1)

  //     let totalDays = Math.ceil(
  //       (newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24)
  //     )

  //     const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0)
  //     const loan_principle = Number(form.loan_principle.replace(/,/g, "") || 0)
  //     let loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)

  //     let schedule_outstanding = loan_totalcash - loan_principle * i

  //     let schedule_principle = 0
  //     let schedule_interest = 0
  //     let schedule_totalpay = 0

  //     if (schedule_outstanding > 0) {
  //       schedule_principle = loan_principle
  //       schedule_interest =
  //         fixDouble(loan_interest_rate / 100, 3) *
  //         (loan_totalcash - loan_principle * i)

  //       schedule_totalpay = schedule_principle + schedule_interest
  //     }

  //     schedules.value.push({
  //       schedule_paymentnumber: i + 1,
  //       schedule_startdate: newStartDate,
  //       schedule_enddate: newEndDate,
  //       schedule_totaldays: totalDays,
  //       schedule_interest_rate: loan_interest_rate,
  //       schedule_outstanding,
  //       schedule_over_draft: 0,
  //       schedule_principle,
  //       schedule_interest,
  //       schedule_totalpay,
  //     })
  //   }

  //   recalculcateDateM()
  //   reculculateNClean()
  //   reculculateFixOutstanding()
  // }

  /*  generateM11  */
  const generateM11 = (form: FormType) => {
    schedules.value = []

    for (let i = 0; i < form.loan_peroid; i++) {
      let startDate = new Date(formatDateForInput(form.loan_startdate))

      let newStartDate = new Date(formatDateForInput(form.loan_startdate))
      //newStartDate.setMonth(newStartDate.getMonth() + i)

      let newEndDate = form.loan_first_paid_date 
                        ? new Date(formatDateForInput(form.loan_first_paid_date))
                        : new Date(newStartDate.setMonth(newStartDate.getMonth() + i))

      newEndDate.setMonth(newStartDate.getMonth() + i)

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
    reculculateNClean()
    reculculateFixOutstanding()
  }

  /* generateM12 */
  const generateM12 = (form: FormType) => {
    schedules.value = []

    const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0)
    const loan_principle = Number(form.loan_principle.replace(/,/g, "") || 0)
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)

    for (let i = 0; i < form.loan_peroid; i++) {

      // DATE
      let startDate = new Date(formatDateForInput(form.loan_startdate))

      let newStartDate = new Date(startDate)
      newStartDate.setMonth(newStartDate.getMonth() + i)

      let newEndDate = new Date(newStartDate)
      newEndDate.setMonth(newStartDate.getMonth() + 1)
      newEndDate.setDate(newEndDate.getDate() - 1) // 🔥 important (like jQuery)

      let totalDays =
        Math.round(
          (newEndDate.getTime() - newStartDate.getTime()) /
          (1000 * 60 * 60 * 24)
        ) + 1

      // LOGIC (M12)
      const schedule_outstanding = loan_totalcash

      const schedule_principle = 0 // 🔥 always 0

      const schedule_interest =
        fixDouble(loan_interest_rate / 100, 3) * loan_totalcash

      const schedule_totalpay =
        schedule_interest + schedule_principle

      // PUSH
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

    // POST PROCESS
    recalculcateDateM()
    reculculateNClean()
    reculculateFixOutstanding()
  }


  /* reculculateCreatloanM13 */
  const reculculateCreatloanM13 = () => {
    for (let i = 0; i < schedules.value.length - 1; i++) {
      const current = schedules.value[i]
      const next = schedules.value[i + 1]

      const outstanding = Number(current.schedule_outstanding || 0)
      const depreciation = Number(current.schedule_principle || 0)

      const interestRate = Number(next.schedule_interest_rate || 0)

      // calculate next row
      const nextOutstanding = outstanding - depreciation
      const interest = nextOutstanding * (interestRate / 100)
      const principle =
        Number(next.schedule_totalpay || 0) - interest

      next.schedule_outstanding = nextOutstanding
      next.schedule_principle = principle
      next.schedule_interest = interest
      next.schedule_totalpay = principle + interest
    }

    // keep your existing fixes
    reculculateNClean()
    reculculateFixOutstanding()
  }


  /* generateM13 */
  const generateM13 = (form: FormType) => {
    schedules.value = []

    const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0)
    const loan_principle = Number(form.loan_principle.replace(/,/g, "") || 0)
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)

    for (let i = 0; i < form.loan_peroid; i++) {
      let startDate = new Date(formatDateForInput(form.loan_startdate))

      let newStartDate = new Date(startDate)
      newStartDate.setMonth(newStartDate.getMonth() + i)

      let newEndDate = new Date(newStartDate)
      newEndDate.setMonth(newStartDate.getMonth() + 1)
      newEndDate.setDate(newEndDate.getDate() - 1)

      const totalDays =
        Math.round(
          (newEndDate.getTime() - newStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1

      const interest =
        loan_totalcash * fixDouble(loan_interest_rate / 100, 3)

      const principle =
        loan_principle - interest

      schedules.value.push({
        schedule_paymentnumber: i + 1,
        schedule_startdate: newStartDate,
        schedule_enddate: newEndDate,
        schedule_totaldays: totalDays,
        schedule_interest_rate: loan_interest_rate,
        schedule_principle_date: newStartDate,
        schedule_outstanding: loan_totalcash,
        schedule_over_draft: 0,
        schedule_principle: principle,
        schedule_interest: interest,
        schedule_totalpay: loan_principle,
      })
    }

    recalculcateDateM()
    reculculateCreatloanM13()
  }


  /* if end date >28 force to 28th day */
  const recalculcateDateM = () => {
    schedules.value.forEach((item, index) => {

      // FIX START DATE (chain)
      if (index > 0) {
        const prevEnd = new Date(schedules.value[index - 1].schedule_enddate)
         prevEnd.setDate(prevEnd.getDate() + 1)
        item.schedule_startdate = new Date(prevEnd)
      }

      let start = new Date(item.schedule_startdate)
      let end = new Date(item.schedule_enddate)

      // 🔥 FIX END DATE → MAX 31
      if (end.getDate() >= 31) {
        end.setDate(31)
        item.schedule_enddate = new Date(end)
      }

      // RECALCULATE DAYS
      let totalDays =
        Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1

      item.schedule_totaldays = totalDays
    })
  }


  /* if last record adjust principle fix it */
  const reculculateNClean = () => {
    schedules.value.forEach((item, index) => {
      const outstanding = Number(item.schedule_outstanding || 0)
      const principle = Number(item.schedule_principle || 0)

      if (outstanding <= principle) {
        try {
          // adjust principle
          item.schedule_principle = outstanding

          // recalc total pay
          item.schedule_totalpay =
            Number(item.schedule_principle || 0) +
            Number(item.schedule_interest || 0)

          // stop at last item (optional, same as your jQuery)
          if (index === schedules.value.length - 1) return
        } catch (err) {
          console.error(err)
        }
      }
    })
  }


  /* if last record adjust outstanding fix it */
  const reculculateFixOutstanding = () => {
    const lastRow = schedules.value.at(-1)
    if (!lastRow) return

    const interestRate = Number(lastRow.schedule_interest_rate || 0)
    const outstanding = Number(lastRow.schedule_outstanding || 0)
    const principle = Number(lastRow.schedule_principle || 0)

    if (outstanding > principle) {
      lastRow.schedule_principle = outstanding

      lastRow.schedule_interest = fixDouble(
        outstanding * (interestRate / 100),
        2
      )

      lastRow.schedule_totalpay = fixDouble(
        outstanding + (outstanding * (interestRate / 100)),
        2
      )
    }
  }



  /* reroundDownM modify */
  // const reroundDownM = () => {
  //   const f = 0     // 🔥 first row only
  //   const m = 30    // 🔥 assume 30 days in a month (for interest calculation)
  //   const e = 27    // 🔥 if total days >= 27
  //   const d = null    // 🔥 move to 28th day of first month

  //   if (!schedules.value.length) return

  //   let remainDD = 0
  //   let allDD = 0

  //   const first = schedules.value[f]

  //   const First_Interest = Number(first.schedule_interest_rate || 0)
  //   const First_outstanding = Number(first.schedule_outstanding || 0)
  //   const First_Depreciation = Number(first.schedule_principle || 0)

  //   // clone date (important to avoid mutating original)
  //   let First_PtEndDate = new Date(first.schedule_enddate)

  //   // if d exists → set custom day
  //   if (d != null) {
  //     First_PtEndDate.setDate(d)
  //   }

  //   // FIRST ROW FIX
  //   remainDD = First_PtEndDate.getDate()

  //   // move back to end of previous month
  //   First_PtEndDate.setDate(First_PtEndDate.getDate() - remainDD)

  //   allDD = First_PtEndDate.getDate()
  //   const totaldays = allDD - remainDD

  //   first.schedule_enddate = new Date(First_PtEndDate)
  //   first.schedule_totaldays = totaldays
  //   first.schedule_principle_date = new Date(First_PtEndDate)

  //   if (totaldays >= e) {
  //     first.schedule_interest = fixDouble(
  //       (First_Interest / 100) * First_outstanding,
  //       3
  //     )

  //     first.schedule_totalpay = fixDouble(
  //       (First_Interest / 100) * First_outstanding + First_Depreciation,
  //       3
  //     )
  //   } else {
  //     first.schedule_interest = fixDouble(
  //       ((First_Interest / 100) / m) *
  //         First_outstanding *
  //         totaldays,
  //       3
  //     )

  //     first.schedule_totalpay = fixDouble(
  //       ((First_Interest / 100) / m) *
  //         (First_outstanding * totaldays) +
  //         First_Depreciation,
  //       3
  //     )
  //   }

  //   // LOOP NEXT ROWS
  //   for (let i = f; i < schedules.value.length - 1; i++) {
  //     const current = schedules.value[i]
  //     const next = schedules.value[i + 1]

  //     // start date = previous end + 1 day
  //     const PtStartDate = new Date(current.schedule_enddate)
  //     PtStartDate.setDate(PtStartDate.getDate() + 1)

  //     next.schedule_startdate = new Date(PtStartDate)

  //     // end date = start + 1 month - 1 day
  //     const endDate = new Date(PtStartDate)
  //     endDate.setMonth(endDate.getMonth() + 1)
  //     endDate.setDate(endDate.getDate() - 1)

  //     next.schedule_enddate = new Date(endDate)

  //     // total days
  //     const totaldays1 =
  //       endDate.getDate() - PtStartDate.getDate() + 1

  //     next.schedule_totaldays = totaldays1
  //     next.schedule_principle_date = new Date(PtStartDate)
  //   }
  // }

  /* reroundDownM original */
  const reroundDownM = () => {
    const f = 0     // 🔥 first row only
    const m = 30    // 🔥 assume 30 days in a month (for interest calculation)
    const e = 27    // 🔥 if total days >= 27

    if (!schedules.value.length) return

    let remainDD = 0
    let allDD = 0

    const first = schedules.value[f]

    const First_Interest = Number(first.schedule_interest_rate || 0)
    const First_outstanding = Number(first.schedule_outstanding || 0)
    const First_Depreciation = Number(first.schedule_principle || 0)

    let First_PtEndDate = new Date(first.schedule_enddate)

    // FIRST ROW FIX
    remainDD = First_PtEndDate.getDate()

    // move back to end of previous month
    First_PtEndDate.setDate(First_PtEndDate.getDate() - remainDD)

    allDD = First_PtEndDate.getDate()
    const totaldays = allDD - remainDD

    first.schedule_enddate = new Date(First_PtEndDate)
    first.schedule_totaldays = totaldays
    first.schedule_principle_date = new Date(First_PtEndDate)

    if (totaldays >= e) {
      first.schedule_interest = fixDouble(
        (First_Interest / 100) * First_outstanding,
        3
      )

      first.schedule_totalpay = fixDouble(
        (First_Interest / 100) * First_outstanding + First_Depreciation,
        3
      )
    } else {
      first.schedule_interest = fixDouble(
        ((First_Interest / 100) / m) *
          First_outstanding *
          totaldays,
        3
      )

      first.schedule_totalpay = fixDouble(
        ((First_Interest / 100) / m) *
          (First_outstanding * totaldays) +
          First_Depreciation,
        3
      )
    }

    // LOOP NEXT ROWS
    for (let i = f; i < schedules.value.length - 1; i++) {
      const current = schedules.value[i]
      const next = schedules.value[i + 1]

      // start date = previous end + 1 day
      const PtStartDate = new Date(current.schedule_enddate)
      PtStartDate.setDate(PtStartDate.getDate() + 1)

      next.schedule_startdate = new Date(PtStartDate)

      // end date = start + 1 month - 1 day
      const endDate = new Date(PtStartDate)
      endDate.setMonth(endDate.getMonth() + 1)
      endDate.setDate(endDate.getDate() - 1)

      next.schedule_enddate = new Date(endDate)

      // total days
      const totaldays1 =
        endDate.getDate() - PtStartDate.getDate() + 1

      next.schedule_totaldays = totaldays1
      next.schedule_principle_date = new Date(PtStartDate)
    }
  }


  /* reroundDownF */
  const reroundDownF = () => {
    const f = 0
    const m = 30

    if (!schedules.value.length) return

    let remainDD = 0
    let allDD = 0

    const first = schedules.value[f]

    const First_Interest = Number(first.schedule_interest_rate || 0)
    const First_outstanding = Number(first.schedule_outstanding || 0)
    const First_Depreciation = Number(first.schedule_principle || 0)

    let First_PtEndDate = new Date(first.schedule_enddate)

    // FIRST ROW
    remainDD = First_PtEndDate.getDate()

    // move to end of previous month
    First_PtEndDate.setDate(First_PtEndDate.getDate() - remainDD)

    allDD = First_PtEndDate.getDate()

    // ⚠️ safer
    const totaldays = Math.abs(allDD - remainDD)

    first.schedule_enddate = new Date(First_PtEndDate)
    first.schedule_totaldays = totaldays
    first.schedule_principle_date = new Date(First_PtEndDate)

    if (totaldays >= 27) {
      first.schedule_interest =
        (First_Interest / 100) * First_outstanding

      first.schedule_totalpay =
        (First_Interest / 100) * First_outstanding +
        First_Depreciation
    } else {
      first.schedule_interest =
        (First_Interest / m / 100) *
        First_outstanding *
        totaldays

      first.schedule_totalpay =
        (First_Interest / m / 100) *
          (First_outstanding * totaldays) +
        First_Depreciation
    }

    // LOOP NEXT ROWS
    for (let i = f; i < schedules.value.length - 1; i++) {
      const current = schedules.value[i]
      const next = schedules.value[i + 1]

      // start = previous end + 1
      const start = new Date(current.schedule_enddate)
      start.setDate(start.getDate() + 1)

      next.schedule_startdate = new Date(start)

      // end = +1 month -1 day
      const end = new Date(start)
      end.setMonth(end.getMonth() + 1)
      end.setDate(end.getDate() - 1)

      next.schedule_enddate = new Date(end)

      // ⚠️ difference from M version (NO +1)
      const totaldays1 =
        end.getDate() - start.getDate()

      next.schedule_totaldays = totaldays1
      next.schedule_principle_date = new Date(start)
    }
  }

  /*  MAIN  */
  const generateSchedule = (form: FormType) => {
    schedules.value = []

    const generators: Record<number, () => void> = {
      11: () => generateM11(form),
      12: () => generateM12(form),
      13: () => generateM13(form),
      14: () => {
        if (Number(form.loan_over_draft) === 0) {
          alert("Loanrecord has no over draft")
        } else {
          generateM11(form)
        }
      },
    }

    const generator = generators[Number(form.loantype_id)]
    if (generator) generator()
  }


  /* handleReround */
  const reroundMap: Record<number, () => void> = {
    11: reroundDownM,
    12: reroundDownM,
    14: reroundDownM,
    13: reroundDownF,
    31: reroundDownF,
  }
  const handleReround = (form: FormType) => {
    try {
      reroundLoading.value = true
      const fn = reroundMap[Number(form.loantype_id)]
      if (fn) fn()

      reculculateNClean()
      reculculateFixOutstanding()
      reroundDone.value = true

    } catch (err) {
      console.error(err)
    } finally {
      reroundLoading.value = false
    }
  }


  return {
    schedules,
    generateSchedule,
    handleReround,
    reroundLoading,
    reroundDone
  }
}