<script setup lang="ts">
definePageMeta({
  layout: false,
  requiresAuth: false,
  ssr: false
})

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { formatNumber, numUnicode } from "~/utils/number"


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
    dd.value = data
  } finally {
    loading.value = false
  }
}

// ---------------- LIFECYCLE ----------------
onMounted(async () => {
  await fetchData()
  await waitImageLoad()   // ✅ wait image
  // window.print()
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
      <header class="col-8 header-left">
        <img ref="logoRef" src="/imgs/logo-48.png" class="logo" />
        <div class="header-text">
          <div class="title">{{ capital?.organization }}</div>
          <div class="subtitle">កាលវិភាគសងប្រាក់</div>
        </div>
      </header>

      <div class="col-4">
        <table class="table border">
          <tr>
            <td>&nbsp; លេខសម្គាល់កម្ចី</td>
            <td class="right">{{ pad(loanrecord?.id || 0) }}</td>
          </tr>
          <tr>
            <td>&nbsp; លេខអតិថិជន</td>
            <td class="right">{{ pad(loanrecord?.customer?.id || 0) }}</td>
          </tr>
          <tr>
            <td>&nbsp; អត្រាកាប្រាក់%</td>
            <td class="right">{{ loanrecord?.loan_interest_rate }}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- CUSTOMER -->
    <table>
      <tr>
        <td class="label">អតិថិជន</td>
        <td>
          {{ loanrecord?.customer?.nametitle1?.nametitle_kh }}
          {{ loanrecord?.customer?.cust_name_1 }}
        </td>
        <td>
          {{ loanrecord?.customer?.nametitle2?.nametitle_kh || " "}}
          {{ loanrecord?.customer?.cust_name_2 || " "}}
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
    <table class="table mt">
      <thead>
        <tr>
          <th>ល.រ</th>
          <th>ថ្ងៃខែឆ្នាំ</th>
          <th>ទូទាត់ខែ</th>
          <th>ប្រាក់ដើម</th>
          <th>រំលោះដើម</th>
          <th>ការប្រាក់</th>
          <th>សរុប</th>
          <th>ប្រាក់បើកបាន</th>
          <th>ប្រាក់បង់</th>
          <th>ប្រាក់សល់</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="s in schedules" :key="s.id">
          <td class="center">{{ s.schedule_paymentnumber }}</td>
          <td>{{ formatDate(s.schedule_principle_date) }}</td>
          <td>{{ formatMonthYear(s.schedule_principle_date) }}</td>
          <td>{{ s.schedule_outstanding || 0 }}</td>
          <td>{{ s.schedule_principle }}</td>
          <td>{{ formatNumber(Number(s.schedule_interest)) }}</td>
          <td>{{ s.schedule_totalpay }}</td>
          <td>{{ s.schedule_totalcashin }}</td>
          <td>{{ s.schedule_paidcash }}</td>
          <td>{{ s.schedule_lessmoney }}</td>
        </tr>
      </tbody>

      <tfoot>
        <tr class="bold">
          <td colspan="3" class="center bold">សរុប</td>
          <td colspan="7">{{ formatNumber(sumSchedule) }}</td>
        </tr>
      </tfoot>
    </table>

    
      <!-- NOTE -->
      <div class="row mt note">
        <div class="col-2">កំណត់សម្គាល់</div>
        <div class="col-10">
          {{ loanrecord?.loan_note || '........................' }}
        </div>
      </div>
    <footer>
      <!-- SIGN DATE -->
      <div class="center l-space mt">
        <div>{{ invoice?.datesignChhankitek }}</div>
        <div>{{ invoice?.datesignSoriyakitek }}</div>
      </div>
      <!-- SIGNATURE -->
      <div class="row center mt">
        <div class="col-3">
          <div>ស្នាមម្រាមដៃ</div>
          <div>សាក្សី</div>
          <div class="v-space"></div>
          <div class="sign">....................</div>
        </div>
        <div class="col-3">
          <div>ស្នាមម្រាមដៃ</div>
          <div>អ្នកធានា</div>
          <div class="v-space"></div>
          <div class="sign">{{ loanrecord?.guarantor?.cust_name_1 || '........' }}</div>
        </div>
        <div class="col-3">
          <div>ស្នាមម្រាមដៃ</div>
          <div>អ្នកខ្ចីប្រាក់</div>
          <div class="v-space"></div>
          <div class="sign">
            {{ loanrecord?.customer?.cust_name_1 }}
            {{ loanrecord?.customer?.cust_name_2 }}
          </div>
        </div>
        <div class="col-3">
          <div>ស្នាមម្រាមដៃ</div>
          <div>ម្ចាស់ប្រាក់</div>
          <div class="v-space"></div>
          <div class="sign">{{ capital?.name }}</div>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* 1. FONTS & BASE */
@font-face {
  font-family: 'Notosan';
  src: url('/fonts/NotoSansKhmer.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

body {
  font-family: "Notosan", Arial, sans-serif;
  font-size: 12pt;
  margin: 0;
  padding: 0;
}

/* 2. SCREEN PREVIEW */
.page {
  width: 210mm;
  padding: 15mm;
  margin: 20px auto;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* 3. PRINT CONFIGURATION */
@page {
  size: A4;
  margin: 15mm; 

  /* @bottom-right {
    content: counter(page) " / " counter(pages);
    font-family: "Notosan", sans-serif;
    font-size: 8pt;
  } */
}

@media print {
  html, body {
    width: 210mm;
    background: #fff;
  }

  .page {
    width: auto;
    height: auto;
    margin: 0 !important;
    padding: 0 !important; /* Let @page handle the margins */
    border: none !important;
    box-shadow: none !important;
  }

  .no-print {
    display: none !important;
  }

  /* Typography for Print */
  body {
    font-size: 11pt;
    line-height: 1.2;
    color: #000;
  }
}

/* 4. TABLE STYLES */
table {
  width: 100%;
  border-collapse: collapse;
}

table td, table th {
  padding: 5px 3px;
  text-align: left;
  font-size: 11pt;
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

@media print {
  footer, tfoot, .note, .table tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .table thead {
    display: table-header-group;
  }
}

/* 5. LAYOUT UTILITIES */
.row { display: flex; margin-bottom: 10px; }
.col-2 { width: 20%; }
.col-3 { width: 25%; }
.col-4 { width: 33.33%; }
.col-8 { width: 66.66%; }
.col-10 { width: 80%; }

.header-left { display: flex; align-items: center; }
.logo { width: 60px; height: 60px; object-fit: contain; }
.header-text { margin-left: 10px; }
.title, .subtitle { font-weight: bold; }

.right { text-align: right; }
.center { text-align: center; }
.mt { margin-top: 15px; }
.sign { margin-top: 30px; }
.v-space { height: 90px; }
.l-space { padding-left: 260px; }
</style>