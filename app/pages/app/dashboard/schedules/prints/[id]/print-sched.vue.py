<script setup lang="ts">
definePageMeta({
  layout: false,
  requiresAuth: false,
  ssr: false
})

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'




type PrintSchedule = {
    capital:                Capital;
    loanrecord:             Loanrecord;
    schedules:              Schedule[];
    sum_schedule_principle: number;
    invoice:                Invoice;
}

type Capital = {
    organization:  string;
    title_pay:     string;
    name:          string;
    sex:           string;
    birth_year:    string;
    age:           string;
    village:       string;
    commune:       string;
    district:      string;
    province:      string;
    idPassportNum: string;
    phone:         string;
    phone1:        string;
    phone2:        string;
}

type Invoice = {
    id:                  number;
    datesignChhankitek:  string;
    datesignSoriyakitek: string;
}

type Loanrecord = {
    id:                 number;
    cust_id:            number;
    loantype_id:        number;
    currency_id:        number;
    cust_guarantor_id:  number;
    invoice_id:         number;
    loan_startdate:     string;
    loan_totalcash:     string;
    loan_interest_rate: string;
    loan_peroid:        number;
    loan_note:          string;
    customer:           Customer;
    loantype:           Loantype;
    currency:           Currency;
    guarantor:          Guarantor;
    invoice:            LoanrecordInvoice;
}

type Currency = {
    id:          number;
    currency_kh: string;
}

type Customer = {
    id:           number;
    cust_name_1:  string;
    cust_title_1: number;
    cust_title_2: number;
    cust_name_2:  string;
    cust_phone_1: string;
    nametitle1:   Nametitle;
    nametitle2:   Nametitle;
}

type Nametitle = {
    id:           number;
    nametitle_kh: string;
}

type Guarantor = {
    id:           number;
    cust_name_1:  string;
    cust_title_1: number;
}

type LoanrecordInvoice = {
    id:             number;
    invoice_type:   string;
    created_by:     number;
    updated_by:     number;
    active:         number;
    created_at:     Date;
    updated_at:     Date;
    invoice_number: string;
}

type Loantype = {
    id:                number;
    loantype_kh:       string;
    loantype_shortcut: string;
}

type Schedule = {
    id:                      number;
    schedule_paymentnumber:  number;
    schedule_principle_date: string;
    schedule_outstanding:    string;
    schedule_principle:      string;
    schedule_interest:       string;
    schedule_totalpay:       string;
    schedule_totalcashin:    string;
    schedule_paidcash:       string;
    schedule_lessmoney:      string;
}


type ApiResponse = {
  success: boolean
  data: PrintSchedule
}


// ---------------- REFS ----------------
const route = useRoute()
const id = route.params.id as string

const dd = ref<PrintSchedule | null>(null)
const capital = computed(() => dd.value?.capital ?? null)
const loanrecord = computed(() => dd.value?.loanrecord ?? null)
const schedules = computed(() => dd.value?.schedules ?? [])
const sumSchedule = computed(() => dd.value?.sum_schedule_principle ?? 0)
const invoice = computed(() => dd.value?.invoice ?? null)

const loading = ref(false)
// ---------------- FETCH DATA ----------------
const fetchData = async () => {
  loading.value = true

  try {


    const { data } = await $fetch<ApiResponse>(`/api/admin-secure/schedules/${id}/print-sched`)
    

      console.log("API RESPONSE:", data ?? null )

    dd.value = data



  } finally {
    loading.value = false
  }
}

// ---------------- LIFECYCLE ----------------
onMounted(async () => {
  await fetchData()
  await waitImageLoad()   // ✅ wait image
  window.print()
})

// ---------------- HELPERS ----------------
const pad = (num:number) => String(num).padStart(8,"0")

const formatDate = (d: string) => {
  const date = new Date(d)
  return date.toLocaleDateString("en-GB") // dd-mm-yyyy
}

const formatMonthYear = (d: string) => {
  const date = new Date(d)
  return `${date.getMonth() + 1}-${date.getFullYear()}`
}

const formatNumber = (n: number) => {
  return new Intl.NumberFormat().format(n)
}


const logoRef = ref<HTMLImageElement | null>(null)

const waitImageLoad = () => {
  return new Promise<void>((resolve) => {
    if (!logoRef.value) return resolve()

    if (logoRef.value.complete) {
      resolve() // already loaded
    } else {
      logoRef.value.onload = () => resolve()
      logoRef.value.onerror = () => resolve() // avoid blocking
    }
  })
}

// setTimeout(() => {
//   window.print()
// }, 500)

</script>

<template>
  <div class="page" v-if="dd">
    
    <!-- HEADER -->
    <div class="row">
      <div class="col-8 header-left">
        <img ref="logoRef" src="/imgs/logo-48.png" class="logo" />
        <div class="header-text">
          <div class="title">{{ capital?.organization }}</div>
          <div class="subtitle">{{ capital?.title_pay }}</div>
        </div>
      </div>

      <div class="col-4">
        <table class="table border">
          <tr>
            <td>លេខសម្គាល់កម្ចី</td>
            <td class="right">{{ pad(loanrecord?.id || 0) }}</td>
          </tr>
          <tr>
            <td>លេខអតិថិជន</td>
            <td class="right">{{ pad(loanrecord?.customer?.id || 0) }}</td>
          </tr>
          <tr>
            <td>អត្រាកាប្រាក់%</td>
            <td class="right">{{ loanrecord?.loan_interest_rate }}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- CUSTOMER -->
    <table class="table mt">
      <tr>
        <td class="label">អតិថិជន</td>
        <td>
          {{ loanrecord?.customer?.nametitle1?.nametitle_kh }}
          {{ loanrecord?.customer?.cust_name_1 }}
        </td>
        <td v-if="loanrecord?.customer?.cust_name_2">
          {{ loanrecord?.customer?.nametitle2?.nametitle_kh }}
          {{ loanrecord?.customer?.cust_name_2 }}
        </td>
      </tr>

      <tr>
        <td class="label">សរុបទឹកប្រាក់</td>
        <td>
          {{ loanrecord?.loan_totalcash }}
          {{ loanrecord?.currency?.currency_kh }}
        </td>
        <td>
          រយៈពេលខ្ចី {{ loanrecord?.loan_peroid }}
          {{ loanrecord?.loantype?.loantype_shortcut }}
        </td>
      </tr>
    </table>

    <!-- SCHEDULE -->
    <table class="table border mt">
      <thead>
        <tr class="bold left">
          <td>ល.រ</td>
          <td>ថ្ងៃខែឆ្នាំ</td>
          <td>ទូទាត់ខែ</td>
          <td>ប្រាក់ដើម</td>
          <td>រំលោះដើម</td>
          <td>ការប្រាក់</td>
          <td>សរុប</td>
          <td>ប្រាក់បើកបាន</td>
          <td>ប្រាក់បង់</td>
          <td>ប្រាក់សល់</td>
        </tr>
      </thead>

      <tbody>
        <tr v-for="s in schedules" :key="s.id">
          <td>{{ s.schedule_paymentnumber }}</td>
          <td>{{ formatDate(s.schedule_principle_date) }}</td>
          <td>{{ formatMonthYear(s.schedule_principle_date) }}</td>
          <td>{{ s.schedule_outstanding }}</td>
          <td>{{ s.schedule_principle }}</td>
          <td>{{ s.schedule_interest }}</td>
          <td>{{ s.schedule_totalpay }}</td>
          <td>{{ s.schedule_totalcashin }}</td>
          <td>{{ s.schedule_paidcash }}</td>
          <td>{{ s.schedule_lessmoney }}</td>
        </tr>
      </tbody>

      <tfoot>
        <tr class="bold">
          <td colspan="4" class="center">សរុប</td>
          <td>{{ formatNumber(sumSchedule) }}</td>
          <td colspan="5"></td>
        </tr>
      </tfoot>
    </table>

    <!-- NOTE -->
    <div class="row mt">
      <div class="col-2">កំណត់សម្គាល់</div>
      <div class="col-10">
        {{ loanrecord?.loan_note || '........................' }}
      </div>
    </div>

    <!-- SIGN DATE -->
    <div class="center mt">
      <div>{{ invoice?.datesignChhankitek }}</div>
      <div>{{ invoice?.datesignSoriyakitek }}</div>
    </div>

    <!-- SIGNATURE -->
    <div class="row center mt">
      <div class="col-3">
        <div>សាក្សី</div>
        <div class="sign">....................</div>
      </div>

      <div class="col-3">
        <div>អ្នកធានា</div>
        <div class="sign">{{ loanrecord?.guarantor?.cust_name_1 || '........' }}</div>
      </div>

      <div class="col-3">
        <div>អ្នកខ្ចីប្រាក់</div>
        <div class="sign">
          {{ loanrecord?.customer?.cust_name_1 }}
          {{ loanrecord?.customer?.cust_name_2 }}
        </div>
      </div>

      <div class="col-3">
        <div>ម្ចាស់ប្រាក់</div>
        <div class="sign">{{ capital?.name }}</div>
      </div>
    </div>

  </div>
</template>


<style scoped>

@font-face {
  font-family: 'Siemreap';
  src: url('/fonts/Siemreap.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}


body {
  font-family: "Siemreap", Arial, sans-serif;
  font-size: 11px;
}

.page {
  width: 100%;
}

/* Layout */
.row {
  display: flex;
  margin-bottom: 10px;
}

.col-2 { width: 20%; }
.col-3 { width: 25%; }
.col-4 { width: 33.33%; }
.col-8 { width: 66.66%; }
.col-10 { width: 80%; }

/* Header */
.header-left {
  display: flex;
  align-items: center;
}

.logo {
  width: 60px;
  height: 60px;
}

.header-text {
  margin-left: 10px;
}

.title {
  font-weight: bold;
}

.subtitle {
  font-weight: bold;
}

/* Table */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table td {
  padding: 5px 0;
}

.table tr {
 border-bottom:1px #ddd solid;
}

/* Utility */
.right {
  text-align: right;
}

.letf {
  text-align: left;
}

.center {
  text-align: center;
}

.bold {
  font-weight: bold;
}

.mt {
  margin-top: 15px;
}

.sign {
  margin-top: 20px;
}

/* Print */
@page {
  size: A4;
  margin: 15mm;
}

@media print {
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  html, body {
    width: 210mm;
  }

  .page {
    width: 100%;
  }
}
</style>