<template>
  <div v-if="dd" class="page">
    <div class="wrapper" id="root">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="vertical-align: middle;">
            <td style="text-align: center; width: 25%;">
              <img src="/imgs/logo.png" alt="Logo" class="logo" />
              <h4>{{ capital?.organization }}</h4>
            </td>
            <td style="width: 50%; text-align: center; vertical-align: top;">
              <h1>ព្រះរាជាណាចក្រកម្ពុជា</h1>
              <h1>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1>
              <div class="tacteng">3</div>
              <h2>កិច្ចសន្យាខ្ចីប្រាក់បង់រំលោះ</h2>
            </td>
            <td style="width: 25%;"></td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colspan="3">
              <h3 class="mt">បញ្ចាំមូលប្បទានប័ត្រ</h3>
            </td>
          </tr>

          <tr>
            <td colspan="3">
              <p class="justify">
                លោកស្រី <strong>{{ capital?.name }}</strong> កើតឆ្នាំ១៩៨៨ 
                កាន់អត្តសញ្ញាណប័ណ្ណសញ្ចាតិខ្មែរលេខ១៥០៩៧៧៨៨៩ ចុះថ្ងៃទី ២៥/១២/២០២០ 
                មានទីលំនៅស្ថិតនៅភូមិកំពង់ក្របៅ សង្កាត់កំពង់ក្របៅ ក្រុងស្ទឹងសែន ខេត្តកំពង់ធំ 
                ជាអ្នកឲ្យខ្ចី <strong>(ម្ចាស់បំណុល)</strong> តទៅហៅកាត់ថា <strong>ភាគី “ក”</strong> ។
              </p>
            </td>
          </tr>

          <tr>
            <td colspan="3"><h2 class="center mt">និង</h2></td>
          </tr>

          <tr>
            <td colspan="3">
              <p class="justify">
                {{ loanrecord?.customer?.nametitle1?.nametitle_kh }} 
                <strong>{{ loanrecord?.customer?.cust_name_1 }}</strong>
                កើតឆ្នាំ {{ toKhmerNum(formatYear(loanrecord?.customer?.cust_dob_1)) }}
                កាន់ {{ loanrecord?.customer?.identification1?.identification_kh }} លេខ 
                {{ toKhmerNum(loanrecord?.customer?.cust_idcardnum_1) }}
                ចុះថ្ងៃទី {{ toKhmerNum(formatDay(loanrecord?.customer?.cust_idcardnum_date_1)) }}
                ខែ {{ getKhmerMonth(formatMonth(loanrecord?.customer?.cust_idcardnum_date_1)) }}
                ឆ្នាំ {{ toKhmerNum(formatYear(loanrecord?.customer?.cust_idcardnum_date_1)) }}
                មានអាសយដ្ឋានស្ថិតនៅ {{ loanrecord?.customer?.cust_address }}
                ជាអ្នកខ្ចីប្រាក់ <strong>(កូនបំណុល)</strong> តទៅហៅកាត់ថា <strong>ភាគី “ខ”</strong> ។
              </p>
            </td>
          </tr>

          <tr>
            <td colspan="3" class="mt">
              <strong>ប្រការ១_អំពីប្រាក់ដើម និងអំឡុងពេល</strong>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <p class="justify inden">
                ភាគី “ក” យល់ព្រមឲ្យភាគី “ខ” ខ្ចីប្រាក់ចំនួន 
                <b>{{ toKhmerNum(Number(loan2?.contract_schedule_totalpay_all).toLocaleString()) }} {{ loanrecord?.currency?.currency_kh }}</b>
                ដោយមិនគិតការប្រាក់ហើយភាគី “ខ” ស្នើសុំបង់រំលោះសម្រាប់រយៈពេលចំនួន
                <b>{{ toKhmerNum(loanrecord?.loan_peroid || '') }}</b> ក្នុង១ខែចំនួន 
                <b>{{ toKhmerNum(Number(loan2?.contract_schedule_totalpay_first).toLocaleString()) }} {{ loanrecord?.currency?.currency_kh }}</b>
                គិតចាប់ពីថ្ងៃទី <b>{{ toKhmerNum(formatDay(loan2?.contract_schedule_totalpay_first_date)) }} 
                ខែ {{ getKhmerMonth(formatMonth(loan2?.contract_schedule_totalpay_first_date)) }} 
                ឆ្នាំ {{ toKhmerNum(formatYear(loan2?.contract_schedule_totalpay_first_date)) }}</b>
                ដល់ថ្ងៃទី <b>{{ toKhmerNum(formatDay(loan2?.contract_schedule_totalpay_last_date)) }} 
                ខែ {{ getKhmerMonth(formatMonth(loan2?.contract_schedule_totalpay_last_date)) }} 
                ឆ្នាំ {{ toKhmerNum(formatYear(loan2?.contract_schedule_totalpay_last_date)) }}</b>។
              </p>
            </td>
          </tr>

          <tr v-for="(cheque, index) in loan_cheques" :key="cheque.id">
            <td colspan="3">
              <p style="margin-left: 40px;">
                <b>{{ toKhmerNum(index + 1) }}. </b>
                មូលប្បទានប័ត្រធនាគារ {{ loan2?.bank }} លេខ <b>{{ toKhmerNum(cheque.cheque_number) }}</b> 
                ចុះថ្ងៃទី <b>{{ toKhmerNum(formatDay(cheque.schedule_cheque_to_date)) }}</b> 
                ទឹកប្រាក់ <b>{{ toKhmerNum(cheque.schedule_totalpay) }} {{ loanrecord?.currency?.currency_kh }}</b>.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
// Inherit your props or use the data logic from your main file
const { toKhmerNum, getKhmerMonth } = useKhmerLabel()

// Logic for formatDay, formatMonth, formatYear remains same as your snippet
</script>