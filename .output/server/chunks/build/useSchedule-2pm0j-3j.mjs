import { ref } from 'vue';
import { a as formatDateForInput } from './date-D_--uZCu.mjs';
import { a as fixDouble } from './number-BUJwr6QZ.mjs';

const reroundLoading = ref(false);
const reroundDone = ref(false);
const useSchedule = () => {
  const schedules = ref([]);
  const generateM11 = (form) => {
    schedules.value = [];
    for (let i = 0; i < form.loan_peroid; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate));
      const newStartDate = new Date(baseStart);
      newStartDate.setMonth(newStartDate.getMonth() + i);
      let newEndDate;
      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date));
        newEndDate.setMonth(newEndDate.getMonth() + i);
      } else {
        newEndDate = new Date(baseStart);
        newEndDate.setMonth(newEndDate.getMonth() + i + 1);
        newEndDate.setDate(newEndDate.getDate() - 1);
      }
      let totalDays = Math.ceil(
        (newEndDate.getTime() - newStartDate.getTime()) / (1e3 * 60 * 60 * 24)
      );
      const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0);
      const loan_principle = Number(form.loan_principle.replace(/,/g, "") || 0);
      let loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0);
      let schedule_outstanding = loan_totalcash - loan_principle * i;
      let schedule_principle = 0;
      let schedule_interest = 0;
      let schedule_totalpay = 0;
      if (schedule_outstanding > 0) {
        schedule_principle = loan_principle;
        schedule_interest = fixDouble(loan_interest_rate / 100, 3) * (loan_totalcash - loan_principle * i);
        schedule_totalpay = schedule_principle + schedule_interest;
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
        schedule_totalpay
      });
    }
    recalculcateDateM();
    reculculateNClean();
    reculculateFixOutstanding();
  };
  const generateM12 = (form) => {
    schedules.value = [];
    for (let i = 0; i < form.loan_peroid; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate));
      const newStartDate = new Date(baseStart);
      newStartDate.setMonth(newStartDate.getMonth() + i);
      let newEndDate;
      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date));
        newEndDate.setMonth(newEndDate.getMonth() + i);
      } else {
        newEndDate = new Date(baseStart);
        newEndDate.setMonth(newEndDate.getMonth() + i + 1);
        newEndDate.setDate(newEndDate.getDate() - 1);
      }
      let totalDays = Math.round(
        (newEndDate.getTime() - newStartDate.getTime()) / (1e3 * 60 * 60 * 24)
      );
      const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0);
      const loan_principle = 0;
      let loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0);
      let schedule_outstanding = loan_totalcash;
      let schedule_principle = 0;
      let schedule_interest = 0;
      let schedule_totalpay = 0;
      if (schedule_outstanding > 0) {
        schedule_principle = loan_principle;
        schedule_interest = fixDouble(loan_interest_rate / 100, 3) * (loan_totalcash - loan_principle * i);
        schedule_totalpay = schedule_principle + schedule_interest;
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
        schedule_totalpay
      });
    }
    recalculcateDateM();
    reculculateNClean();
    reculculateFixOutstanding();
  };
  const reculculateCreatloanM13 = () => {
    for (let i = 0; i < schedules.value.length - 1; i++) {
      const current = schedules.value[i];
      const next = schedules.value[i + 1];
      const outstanding = Number(current.schedule_outstanding || 0);
      const depreciation = Number(current.schedule_principle || 0);
      const interestRate = Number(current.schedule_interest_rate || 0);
      let nextOutstanding = outstanding - depreciation;
      if (nextOutstanding < 0) nextOutstanding = 0;
      let interest = 0;
      let principle = 0;
      if (outstanding <= 0 || depreciation <= 0) {
        interest = 0;
        principle = 0;
      } else {
        interest = nextOutstanding * (interestRate / 100);
        const totalPay = Number(next.schedule_totalpay || 0);
        principle = totalPay - interest;
        if (principle < 0) principle = 0;
      }
      next.schedule_outstanding = nextOutstanding;
      next.schedule_interest = interest;
      next.schedule_principle = principle;
      next.schedule_totalpay = principle + interest;
    }
    reculculateNClean();
    reculculateFixOutstanding();
  };
  const generateM13 = (form) => {
    schedules.value = [];
    for (let i = 0; i < form.loan_peroid; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate));
      const newStartDate = new Date(baseStart);
      newStartDate.setMonth(newStartDate.getMonth() + i);
      let newEndDate;
      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date));
        newEndDate.setMonth(newEndDate.getMonth() + i);
      } else {
        newEndDate = new Date(baseStart);
        newEndDate.setMonth(newEndDate.getMonth() + i + 1);
        newEndDate.setDate(newEndDate.getDate() - 1);
      }
      const totalDays = Math.round(
        (newEndDate.getTime() - newStartDate.getTime()) / (1e3 * 60 * 60 * 24)
      );
      const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0);
      const loan_principle = Number(form.loan_principle.replace(/,/g, "") || 0);
      let loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0);
      const interest = loan_totalcash * fixDouble(loan_interest_rate / 100, 3);
      const principle = loan_principle - interest;
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
        schedule_totalpay: loan_principle
      });
    }
    recalculcateDateM();
    reculculateCreatloanM13();
  };
  const generateM14 = (form) => {
    schedules.value = [];
    const loan_period = form.loan_peroid;
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0);
    const overdraft = Number(form.loan_over_draft.replace(/,/g, "") || 0);
    for (let i = 0; i < loan_period; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate));
      const newStartDate = new Date(baseStart);
      newStartDate.setMonth(newStartDate.getMonth() + i);
      let newEndDate;
      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date));
        newEndDate.setMonth(newEndDate.getMonth() + i);
      } else {
        newEndDate = new Date(baseStart);
        newEndDate.setMonth(newEndDate.getMonth() + i + 1);
        newEndDate.setDate(newEndDate.getDate() - 1);
      }
      const totalDays = Math.round(
        (newEndDate.getTime() - newStartDate.getTime()) / (1e3 * 60 * 60 * 24)
      ) + 1;
      const schedule_principle = 0;
      const schedule_interest = fixDouble(overdraft * loan_interest_rate / 100, 2);
      const schedule_totalpay = schedule_interest;
      schedules.value.push({
        schedule_paymentnumber: i + 1,
        schedule_startdate: newStartDate,
        schedule_enddate: newEndDate,
        schedule_totaldays: totalDays,
        schedule_interest_rate: loan_interest_rate,
        schedule_outstanding: overdraft,
        schedule_over_draft: overdraft,
        schedule_principle,
        schedule_interest,
        schedule_totalpay
      });
    }
    recalculcateDateM();
    reculculate_over_draft_m14();
    reculculateNClean();
    reculculateFixOutstanding();
  };
  const generateM31 = (form) => {
    schedules.value = [];
    const loan_period = form.loan_peroid;
    const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0);
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0);
    const principle_per_month = loan_totalcash / loan_period;
    for (let i = 0; i < loan_period; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate));
      const newStartDate = new Date(baseStart);
      newStartDate.setMonth(newStartDate.getMonth() + i);
      let newEndDate;
      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date));
        newEndDate.setMonth(newEndDate.getMonth() + i);
      } else {
        newEndDate = new Date(baseStart);
        newEndDate.setMonth(newEndDate.getMonth() + i + 1);
        newEndDate.setDate(newEndDate.getDate() - 1);
      }
      const totalDays = Math.round(
        (newEndDate.getTime() - newStartDate.getTime()) / (1e3 * 60 * 60 * 24)
      ) + 1;
      const schedule_outstanding = loan_totalcash - principle_per_month * i;
      const schedule_principle = principle_per_month;
      const schedule_interest = fixDouble(loan_interest_rate / 100, 3) * loan_totalcash;
      const schedule_totalpay = schedule_principle + schedule_interest;
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
        schedule_totalpay
      });
    }
    recalculcateDateM();
    reculculateNCleanM31();
  };
  const generateD33 = (form) => {
    schedules.value = [];
    const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0);
    const loan_period = form.loan_peroid;
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0);
    const principle_per_day = loan_totalcash / loan_period;
    for (let i = 0; i < loan_period; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate));
      let newEndDate;
      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date));
      } else {
        newEndDate = new Date(baseStart);
      }
      const newStartDate = new Date(newEndDate);
      newStartDate.setDate(newStartDate.getDate() + i);
      newEndDate = new Date(newStartDate);
      const totalDays = Math.round(
        (newEndDate.getTime() - newStartDate.getTime()) / (1e3 * 60 * 60 * 24)
      ) + 1;
      const schedule_outstanding = loan_totalcash - principle_per_day * i;
      const schedule_principle = principle_per_day;
      const schedule_interest = fixDouble(loan_interest_rate / 100, 3) * loan_totalcash;
      const schedule_totalpay = schedule_principle + schedule_interest;
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
        schedule_totalpay
      });
    }
  };
  const generateD34 = (form) => {
    schedules.value = [];
    const loan_totalcash = Number(form.loan_totalcash.replace(/,/g, "") || 0);
    const loan_period = form.loan_peroid;
    const loan_interest_rate = Number(form.loan_interest_rate.replace(/,/g, "") || 0);
    for (let i = 0; i < loan_period; i++) {
      const baseStart = new Date(formatDateForInput(form.loan_startdate));
      let newEndDate;
      if (form.loan_first_paid_date) {
        newEndDate = new Date(formatDateForInput(form.loan_first_paid_date));
      } else {
        newEndDate = new Date(baseStart);
      }
      const newStartDate = new Date(baseStart);
      newStartDate.setDate(newStartDate.getDate() + i);
      newEndDate = new Date(newStartDate);
      const totalDays = Math.round(
        (newEndDate.getTime() - newStartDate.getTime()) / (1e3 * 60 * 60 * 24)
      ) + 1;
      const schedule_outstanding = loan_totalcash;
      const schedule_principle = 0;
      const schedule_interest = fixDouble(
        loan_interest_rate / 100 * loan_totalcash,
        2
      );
      const schedule_totalpay = schedule_interest;
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
        schedule_totalpay
      });
    }
    reculculateFixOutstanding();
  };
  const recalculcateDateM = () => {
    schedules.value.forEach((item, index) => {
      if (index > 0) {
        const prevEnd = new Date(schedules.value[index - 1].schedule_enddate);
        prevEnd.setDate(prevEnd.getDate() + 1);
        item.schedule_startdate = new Date(prevEnd);
      }
      let start = new Date(item.schedule_startdate);
      let end = new Date(item.schedule_enddate);
      let totalDays = Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1e3)) + 1;
      item.schedule_totaldays = totalDays;
    });
  };
  const reculculate_over_draft_m14 = () => {
    schedules.value.forEach((item, index) => {
      if (index > 0) {
        item.schedule_over_draft = 0;
      }
    });
  };
  const reculculateNClean = () => {
    schedules.value.forEach((item, index) => {
      const outstanding = Number(item.schedule_outstanding || 0);
      const principle = Number(item.schedule_principle || 0);
      const rate = Number(item.schedule_interest_rate || 0) / 100;
      const totalDays = Number(item.schedule_totaldays || 0);
      if (outstanding > 0) {
        if (totalDays >= 28 && totalDays <= 31) {
          item.schedule_interest = rate * outstanding;
        } else {
          item.schedule_interest = fixDouble(
            rate / 30 * outstanding * totalDays,
            3
          );
        }
        item.schedule_totalpay = item.schedule_interest + principle;
      }
      if (outstanding <= principle) {
        try {
          item.schedule_principle = outstanding;
          item.schedule_totalpay = Number(item.schedule_principle || 0) + Number(item.schedule_interest || 0);
          if (index === schedules.value.length - 1) return;
        } catch (err) {
          console.error(err);
        }
      }
    });
  };
  const reculculateNCleanM31 = () => {
    schedules.value.forEach((item, index) => {
      const outstanding = Number(item.schedule_outstanding || 0);
      const principle = Number(item.schedule_principle || 0);
      const rate = Number(item.schedule_interest_rate || 0) / 100;
      const totalDays = Number(item.schedule_totaldays || 0);
      if (index == 0) {
        if (outstanding > 0) {
          if (totalDays >= 28 && totalDays <= 31) {
            item.schedule_interest = rate * outstanding;
          } else {
            item.schedule_interest = fixDouble(
              rate / 30 * outstanding * totalDays,
              3
            );
          }
          item.schedule_totalpay = item.schedule_interest + principle;
        }
      }
    });
  };
  const reculculateFixOutstanding = () => {
    const lastRow = schedules.value.at(-1);
    if (!lastRow) return;
    const interestRate = Number(lastRow.schedule_interest_rate || 0);
    const outstanding = Number(lastRow.schedule_outstanding || 0);
    const principle = Number(lastRow.schedule_principle || 0);
    if (outstanding > principle) {
      lastRow.schedule_principle = outstanding;
      lastRow.schedule_interest = fixDouble(
        outstanding * (interestRate / 100),
        2
      );
      lastRow.schedule_totalpay = fixDouble(
        outstanding + outstanding * (interestRate / 100),
        2
      );
    }
  };
  const reroundDownM = () => {
    const f = 0;
    const m = 30;
    const e = 27;
    if (!schedules.value.length) return;
    let remainDD = 0;
    let allDD = 0;
    const first = schedules.value[f];
    const First_Interest = Number(first.schedule_interest_rate || 0);
    const First_outstanding = Number(first.schedule_outstanding || 0);
    const First_Depreciation = Number(first.schedule_principle || 0);
    let First_PtEndDate = new Date(first.schedule_enddate);
    remainDD = First_PtEndDate.getDate();
    First_PtEndDate.setDate(First_PtEndDate.getDate() - remainDD);
    allDD = First_PtEndDate.getDate();
    const totaldays = allDD - remainDD;
    first.schedule_enddate = new Date(First_PtEndDate);
    first.schedule_totaldays = totaldays;
    first.schedule_principle_date = new Date(First_PtEndDate);
    if (totaldays >= e) {
      first.schedule_interest = fixDouble(
        First_Interest / 100 * First_outstanding,
        3
      );
      first.schedule_totalpay = fixDouble(
        First_Interest / 100 * First_outstanding + First_Depreciation,
        3
      );
    } else {
      first.schedule_interest = fixDouble(
        First_Interest / 100 / m * First_outstanding * totaldays,
        3
      );
      first.schedule_totalpay = fixDouble(
        First_Interest / 100 / m * (First_outstanding * totaldays) + First_Depreciation,
        3
      );
    }
    for (let i = f; i < schedules.value.length - 1; i++) {
      const current = schedules.value[i];
      const next = schedules.value[i + 1];
      const PtStartDate = new Date(current.schedule_enddate);
      PtStartDate.setDate(PtStartDate.getDate() + 1);
      next.schedule_startdate = new Date(PtStartDate);
      const endDate = new Date(PtStartDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);
      next.schedule_enddate = new Date(endDate);
      const totaldays1 = endDate.getDate() - PtStartDate.getDate() + 1;
      next.schedule_totaldays = totaldays1;
      next.schedule_principle_date = new Date(PtStartDate);
    }
  };
  const generateSchedule = (form) => {
    schedules.value = [];
    const generators = {
      11: () => generateM11(form),
      12: () => generateM12(form),
      13: () => generateM13(form),
      14: () => generateM14(form),
      31: () => generateM31(form),
      33: () => generateD33(form),
      34: () => generateD34(form)
      // 32: () => generateW32(form),
      // 14: () => {
      //   if (Number(form.loan_over_draft) === 0) {
      //     alert("Loanrecord has no over draft")
      //   } else {
      //     generateM11(form)
      //   }
      // },
    };
    const generator = generators[Number(form.loantype_id)];
    if (generator) generator();
  };
  const reroundMap = {
    11: reroundDownM,
    12: reroundDownM,
    13: reroundDownM,
    14: reroundDownM,
    31: reroundDownM
  };
  const handleReround = (form) => {
    try {
      reroundLoading.value = true;
      const fn = reroundMap[Number(form.loantype_id)];
      if (fn) fn();
      reculculateNClean();
      reculculateFixOutstanding();
      reroundDone.value = true;
    } catch (err) {
      console.error(err);
    } finally {
      reroundLoading.value = false;
    }
  };
  return {
    schedules,
    generateSchedule,
    handleReround,
    reroundLoading,
    reroundDone
  };
};

export { useSchedule as u };
//# sourceMappingURL=useSchedule-2pm0j-3j.mjs.map
