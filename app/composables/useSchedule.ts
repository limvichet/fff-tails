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


  /*  generateM11  */
  const generateM11 = (form: FormType) => {
    schedules.value = []

    for (let i = 0; i < form.loan_peroid; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate))

      const newStartDate = new Date(baseStart)
      newStartDate.setMonth(newStartDate.getMonth() + i)

      let newEndDate: Date

      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date))
        newEndDate.setMonth(newEndDate.getMonth() + i)
      } else {
        newEndDate = new Date(baseStart) // ✅ fresh copy
        newEndDate.setMonth(newEndDate.getMonth() + i + 1) // ✅ FIX HERE
        newEndDate.setDate(newEndDate.getDate() - 1) // 🔥 important (like jQuery)
      }


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

    for (let i = 0; i < form.loan_peroid; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate))

      const newStartDate = new Date(baseStart)
      newStartDate.setMonth(newStartDate.getMonth() + i)

      let newEndDate: Date

      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date))
        newEndDate.setMonth(newEndDate.getMonth() + i)
      } else {
        newEndDate = new Date(baseStart) // ✅ fresh copy
        newEndDate.setMonth(newEndDate.getMonth() + i + 1) // ✅ FIX HERE
        newEndDate.setDate(newEndDate.getDate() - 1) // 🔥 important (like jQuery)
      }

      let totalDays = Math.round(
        (newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0)
      const loan_principle = 0
      let loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)
      
      let schedule_outstanding = loan_totalcash
      let schedule_principle = 0
      let schedule_interest = 0
      let schedule_totalpay = 0

      if (schedule_outstanding > 0) {
        schedule_principle = loan_principle // 🔥 always 0
        schedule_interest =
          fixDouble(loan_interest_rate / 100, 3) *
          (loan_totalcash - loan_principle * i)

        schedule_totalpay = schedule_principle + schedule_interest
      }

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

      const interestRate = Number(current.schedule_interest_rate || 0)

      // ✅ prevent negative
      let nextOutstanding = outstanding - depreciation
      if (nextOutstanding < 0) nextOutstanding = 0

      let interest = 0
      let principle = 0

      if (outstanding <= 0 || depreciation <= 0) {
        interest = 0
        principle = 0
      } else {
        interest = nextOutstanding * (interestRate / 100)

        const totalPay = Number(next.schedule_totalpay || 0)
        principle = totalPay - interest

        // ✅ prevent negative principle
        if (principle < 0) principle = 0
      }

      // ✅ assign
      next.schedule_outstanding = nextOutstanding
      next.schedule_interest = interest
      next.schedule_principle = principle
      next.schedule_totalpay = principle + interest
    }

    // keep your existing fixes
    reculculateNClean()
    reculculateFixOutstanding()
  }


  /* generateM13 */
  const generateM13 = (form: FormType) => {
    schedules.value = []

    for (let i = 0; i < form.loan_peroid; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate))

      const newStartDate = new Date(baseStart)
      newStartDate.setMonth(newStartDate.getMonth() + i)

      let newEndDate: Date

      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date))
        newEndDate.setMonth(newEndDate.getMonth() + i)
      } else {
        newEndDate = new Date(baseStart) // ✅ fresh copy
        newEndDate.setMonth(newEndDate.getMonth() + i + 1) // ✅ FIX HERE
        newEndDate.setDate(newEndDate.getDate() - 1) // 🔥 important (like jQuery)
      }

      const totalDays = Math.round(
        (newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0)
      const loan_principle = Number(form.loan_principle.replace(/,/g, "") || 0)
      let loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)

      const interest = loan_totalcash * fixDouble(loan_interest_rate / 100, 3)
      const principle = loan_principle - interest
      //const principle = loan_totalcash - loan_principle

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


  const generateM14 = (form: FormType) => {
    schedules.value = []

    const loan_period = form.loan_peroid
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)
    const overdraft = Number(form.loan_over_draft.replace(/,/g, "") || 0)
console.log(overdraft)
    for (let i = 0; i < loan_period; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate))

      const newStartDate = new Date(baseStart)
      newStartDate.setMonth(newStartDate.getMonth() + i)

      let newEndDate: Date

      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date))
        newEndDate.setMonth(newEndDate.getMonth() + i)
      } else {
        newEndDate = new Date(baseStart) // ✅ fresh copy
        newEndDate.setMonth(newEndDate.getMonth() + i + 1) // ✅ FIX HERE
        newEndDate.setDate(newEndDate.getDate() - 1) // 🔥 important (like jQuery)
      }


      // END DATE (end of month period)
      // const newEndDate = new Date(newStartDate)
      // newEndDate.setMonth(newEndDate.getMonth() + 1)
      // newEndDate.setDate(newEndDate.getDate() - 1)

      // TOTAL DAYS
      const totalDays =
        Math.round(
          (newEndDate.getTime() - newStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1

      // VALUES
      const schedule_outstanding = 0
      const schedule_over_draft = 0
      const schedule_principle = 0

      // 🔥 Interest based on overdraft
      const schedule_interest =
        fixDouble((overdraft * loan_interest_rate) / 100, 2)

      const schedule_totalpay = schedule_interest

      schedules.value.push({
        schedule_paymentnumber: i + 1,
        schedule_startdate: newStartDate,
        schedule_enddate: newEndDate,
        schedule_totaldays: totalDays,
        schedule_interest_rate: loan_interest_rate,
        schedule_outstanding,
        schedule_over_draft: overdraft,
        schedule_principle,
        schedule_interest,
        schedule_totalpay,
      })
    }

    recalculcateDateM()
    //reculculateNClean()
    reculculateFixOutstandingM14()
  }


  /* generateM31 */
  const generateM31 = (form: FormType) => {
    schedules.value = []

    const loan_period = form.loan_peroid
    const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0)
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)

    // 🔥 Monthly fixed principal
    const principle_per_month = loan_totalcash / loan_period

    for (let i = 0; i < loan_period; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate))

      const newStartDate = new Date(baseStart)
      newStartDate.setMonth(newStartDate.getMonth() + i)

      let newEndDate: Date

      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date))
        newEndDate.setMonth(newEndDate.getMonth() + i)
      } else {
        newEndDate = new Date(baseStart) // ✅ fresh copy
        newEndDate.setMonth(newEndDate.getMonth() + i + 1) // ✅ FIX HERE
        newEndDate.setDate(newEndDate.getDate() - 1) // 🔥 important (like jQuery)
      }

      // TOTAL DAYS (+1 like old jQuery)
      const totalDays =
        Math.round(
          (newEndDate.getTime() - newStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1

      // OUTSTANDING
      const schedule_outstanding =
        loan_totalcash - principle_per_month * i

      // PRINCIPAL (fixed every month)
      const schedule_principle = principle_per_month

      // INTEREST (flat on original loan)
      const schedule_interest =
        fixDouble(loan_interest_rate / 100, 3) * loan_totalcash

      const schedule_totalpay =
        schedule_principle + schedule_interest

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

    // POST PROCESS (same as yours)
    reculculateNClean()
    reculculateFixOutstanding()
  }


  /* generateW32 */
  const generateW32 = (form: FormType) => {
    schedules.value = []

    const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0)
    const loan_period = form.loan_peroid
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)

    // 🔥 Fixed principal per week
    const principle_per_week = loan_totalcash / loan_period

    for (let i = 0; i < loan_period; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate))

      let newEndDate: Date

      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date))
      } else {
        newEndDate = new Date(baseStart)
      }

      // START DATE (+7 days each period)
      const newStartDate = new Date(newEndDate)
      newStartDate.setDate(newStartDate.getDate() + 7 * i)

      // END DATE (7 days - 1)
      newEndDate = new Date(newStartDate)
      newEndDate.setDate(newEndDate.getDate() + 6)

      // TOTAL DAYS (+1 same as old logic)
      const totalDays =
        Math.round(
          (newEndDate.getTime() - newStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1

      // OUTSTANDING (decreasing)
      const schedule_outstanding =
        loan_totalcash - principle_per_week * i

      // PRINCIPAL (fixed weekly)
      const schedule_principle = principle_per_week

      // INTEREST (flat on total loan)
      const schedule_interest =
        fixDouble(loan_interest_rate / 100, 3) * loan_totalcash

      const schedule_totalpay =
        schedule_principle + schedule_interest

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
    reculculateNClean()
    reculculateFixOutstanding()
  }


  /* generateD33 */
  const generateD33 = (form: FormType) => {
    schedules.value = []

    const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0)
    const loan_period = form.loan_peroid
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)

    // 🔥 Fixed principal per day
    const principle_per_day = loan_totalcash / loan_period

    for (let i = 0; i < loan_period; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate))

      let newEndDate: Date

      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date))
      } else {
        newEndDate = new Date(baseStart) // ✅ fresh copy
      }

      // START DATE (+1 day each loop)
      const newStartDate = new Date(newEndDate)
      newStartDate.setDate(newStartDate.getDate() + i)

      // END DATE (same day)
      newEndDate = new Date(newStartDate)

      // TOTAL DAYS (always 1)
      const totalDays =
        Math.round(
          (newEndDate.getTime() - newStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1

      // OUTSTANDING (decreasing)
      const schedule_outstanding =
        loan_totalcash - principle_per_day * i

      // PRINCIPAL (fixed daily)
      const schedule_principle = principle_per_day

      // INTEREST (flat on total loan)
      const schedule_interest =
        fixDouble(loan_interest_rate / 100, 3) * loan_totalcash

      const schedule_totalpay =
        schedule_principle + schedule_interest

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
    reculculateNClean()
    reculculateFixOutstanding()
  }


  /* generateD34 */
  const generateD34 = (form: FormType) => {
    schedules.value = []

    const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0)
    const loan_period = form.loan_peroid
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)

    for (let i = 0; i < loan_period; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate))

     let newEndDate: Date

      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date))
      } else {
        newEndDate = new Date(baseStart) // ✅ fresh copy
      }

      // START DATE (+1 day per period)
      const newStartDate = new Date(baseStart)
      newStartDate.setDate(newStartDate.getDate() + i)

      // END DATE = same day
      newEndDate = new Date(newStartDate)

      // TOTAL DAYS = 1
      const totalDays =
        Math.round(
          (newEndDate.getTime() - newStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1

      // OUTSTANDING = always full loan (NO reduction)
      const schedule_outstanding = loan_totalcash

      // PRINCIPAL = ALWAYS 0
      const schedule_principle = 0

      // INTEREST = daily interest on full loan
      const schedule_interest =
        fixDouble(
          (loan_interest_rate / 100) * loan_totalcash,
          2
        )

      // TOTAL PAY = interest only
      const schedule_totalpay = schedule_interest

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
    reculculateNClean()
    reculculateFixOutstanding()
  }


  /* generateD35 */
  const generateD35 = (form: FormType) => {
    schedules.value = []

    const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0)
    const loan_period = form.loan_peroid
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0)

    const cycleDays = 10

    for (let i = 0; i < loan_period; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate))

      let newEndDate: Date

      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date))
      } else {
        newEndDate = new Date(baseStart)
      }

      // START DATE (+10 days per cycle)
      const newStartDate = new Date(baseStart)
      newStartDate.setDate(newStartDate.getDate() + cycleDays * i)

      // END DATE (+9 days)
      newEndDate = new Date(newStartDate)
      newEndDate.setDate(newEndDate.getDate() + (cycleDays - 1))

      // TOTAL DAYS
      const totalDays =
        Math.round(
          (newEndDate.getTime() - newStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1

      // OUTSTANDING (constant)
      const schedule_outstanding = loan_totalcash

      // PRINCIPAL = 0
      const schedule_principle = 0

      // INTEREST (flat on full loan)
      const schedule_interest =
        fixDouble((loan_interest_rate / 100) * loan_totalcash, 2)

      const schedule_totalpay = schedule_interest

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
    reculculateNClean()
    reculculateFixOutstanding()
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
      // if (end.getDate() >= 31) {
      //   end.setDate(31)
      //   item.schedule_enddate = new Date(end)
      // }

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
      const rate = Number(item.schedule_interest_rate || 0) / 100
      const totalDays = Number(item.schedule_totaldays || 0)

      /* fix interest and total pay for M11 */
      if (outstanding > 0) {
        if (totalDays >= 28 && totalDays <= 31) {
          item.schedule_interest = rate * outstanding
        } else {
          item.schedule_interest = fixDouble(
            (rate / 30) * outstanding * totalDays,
            3
          )
        }
        item.schedule_totalpay = item.schedule_interest + principle
      }

      /* fix last record */
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

  /* if last record adjust outstanding fix it */
  const reculculateFixOutstandingM14 = () => {

    const lastRow = schedules.value.at(-1)
    if (!lastRow) return

    const interestRate = Number(lastRow.schedule_interest_rate || 0)
    const overdraft = Number(lastRow.schedule_over_draft || 0)
    const principle = Number(lastRow.schedule_principle || 0)

    if (overdraft > principle) {
      // lastRow.schedule_principle = overdraft

      lastRow.schedule_interest = fixDouble(
        overdraft * (interestRate / 100),
        2
      )

      lastRow.schedule_totalpay = fixDouble(
        overdraft + (overdraft * (interestRate / 100)),
        2
      )
    }
  }



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
      14: () => generateM14(form),

      // 31: () => generateM31(form),
      // 32: () => generateW32(form),
      // 33: () => generateD33(form),
      // 14: () => {
      //   if (Number(form.loan_over_draft) === 0) {
      //     alert("Loanrecord has no over draft")
      //   } else {
      //     generateM11(form)
      //   }
      // },
    }

    const generator = generators[Number(form.loantype_id)]
    if (generator) generator()
  }


  /* handleReround */
  const reroundMap: Record<number, () => void> = {
    11: reroundDownM,
    12: reroundDownM,
    13: reroundDownF,
    14: reroundDownM,
    // 31: reroundDownF,
    // 33: reroundDownF,
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