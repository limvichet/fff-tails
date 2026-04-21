<script setup lang="ts">

definePageMeta({
  layout: false,
  requiresAuth: false,
  ssr: false
})

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { numUnicode } from "~/utils/number"

type ApiResponse = {
  success: boolean
  data: PrintLoanrecord
}

type PrintLoanrecord = {
    invoice: Invoice
    capital: Capital
    loanrecord: Loanrecord
}

type Invoice = {
  id: number
  datesignChhankitek: string
  datesignSoriyakitek: string
}
type Capital = {
    organization: string,
    title_pay: string,
    name: string,
    sex: string,
    birth_year: number,
    age: number,
    village: string ,
    commune: string,
    district: string,
    province: string,
    idPassportNum: string,
    phone: string,
    phone1: string,
    phone2: string
}
type Loanrecord = {
    id:       number,
    cust_id:  number,
    loan_collateral_1: string,
    loan_collateral_2: string,
    customer: Customer,
}
type Customer = {
    id: number,
    cust_title_1: number,
    cust_name_1: string,
    cust_name_2: string,
    nametitle1: NameTitle,
    cust_dob_1: string,
    cust_address: string,
}
type NameTitle = {
    id: number,
    nametitle_kh: string,
    type: string
}

const route = useRoute()
const lid = route.params.lid as string

const dd = ref<PrintLoanrecord | null>(null)
const capital = computed(() => dd.value?.capital ?? null)
const loanrecord = computed(() => dd.value?.loanrecord ?? null)
const invoice = computed(() => dd.value?.invoice ?? null
)
const loading = ref(false)

// ---------------- FETCH DATA ----------------
const fetchData = async () => {
  loading.value = true

  try {
    const { data } =  await $fetch<ApiResponse>(`/api/admin-secure/loanrecords/${lid}/print-landlayout`)
    dd.value = data
  } finally {
    loading.value = false
  }
}

// ---------------- LIFECYCLE ----------------
onMounted(async () => {
  await fetchData()
  // setTimeout(() => window.print(), 300)
})

function formatDay(date: string) {
  return date ? new Date(date).getDate() : ""
}
function formatMonth(date: string) {
  return date ? new Date(date).getMonth() + 1 : ""
}
function formatYear(date: string) {
  return date ? new Date(date).getFullYear() : ""
}

</script>


<template>
  <div class="page" v-if="!loading && loanrecord && capital && invoice">
    <!-- HEADER -->
    <header class="center mt">
      <h1>ព្រះរាជាណាចក្រកម្ពុជា</h1>
      <h1>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1>
      <p class="tacteng">3</p>
      <h2>លិខិតស្នើសុំតម្កល់ និងរក្សាទុកប្លង់</h2>
    </header>

    <!-- MAIN -->
    <main class="mt">
      <p class="inden">
        {{ loanrecord.customer.nametitle1.type }}ឈ្មោះ
        &nbsp; <strong>{{ loanrecord.customer.cust_name_1 }}</strong> &nbsp; 
        កើតនៅថ្ងៃទី{{ numUnicode(formatDay(loanrecord.customer.cust_dob_1)) }}
        ខែ{{ numUnicode(formatMonth(loanrecord.customer.cust_dob_1)) }}
        ឆ្នាំ{{ numUnicode(formatYear(loanrecord.customer.cust_dob_1)) }}
        អាសយដ្ឋានបច្ចុប្បន្ន{{ loanrecord.customer.cust_address }}
      </p>

      <!-- TITLE -->
      <h2 class="center mt">សូមគោរពជូន</h2>
      <h2 class="center">លោកស្រីប្រធាន{{ capital.organization }}</h2>

      <!-- DESCRIPTION -->
      <p class="inden">
        ដោយខ្លាចក្រែងបាត់បង់ ឬខូចខាតដោយប្រការណាមួយនូវប្លង់ដែលបានដាក់ហ៊ីប៉ូតែក
        យើងខ្ញុំឯកភាពស្នើសុំលោកស្រីប្រធាន
        <strong>{{ capital.organization }}</strong>
        ជួយគ្រប់គ្រង និងថែរក្សាប្លង់(ច្បាប់ដើម)ដូចមានក្នុងតារាងខាងក្រោម៖
      </p>

      <!-- COLLATERAL 1 -->
      <p class="inden">
        <span v-if="!loanrecord.loan_collateral_1">
          -&nbsp; .........................................................
        </span>
        <span v-else>
          -&nbsp; {{ loanrecord.loan_collateral_1 }}
        </span>
      </p>

      <!-- COLLATERAL 2 -->
      <p class="inden">
        <span v-if="!loanrecord.loan_collateral_2">
          -&nbsp; .........................................................
        </span>
        <span v-else>
          -&nbsp; {{ loanrecord.loan_collateral_2 }}
        </span>
      </p>

      <!-- RESPONSIBILITY -->
      <p class="inden mt">
        <strong>{{ capital.organization }}</strong>
        ទទួលខុសត្រូវលើការខូចខាត ឬបាត់បង់ដែលកើតឡើងក្នុងកំឡុងពេលរក្សាទុកប្លង់
        និងវត្ថុតម្កល់ផ្សេងៗ។
      </p>

      <!-- CONDITION -->
      <p class="inden">
        -&nbsp; ក្នុងករណីមិនបានបំពេញកាតព្វកិច្ចស្របតាមកិច្ចសន្យាខ្ចីប្រាក់នោះទេ យល់ព្រមឲ្យអ្នកធានា`ឬសាច់ញាតិ
                ទូទាត់សងបំណុលផ្ដាច់ជំនួស និងអនុញ្ញាតប្រគល់ប្លង់ និងវត្ថុតម្កល់ផ្សេងៗទៅអ្នកធានា ឬសាច់ញាតិ យកទៅគ្រប់គ្រង
                រក្សាទុកក្លាយជាម្ចាស់បំណុលជំនួស និងទទួលខុសត្រូវលើការរក្សាទុកចាប់ពីថ្ងៃសងផ្ដាច់តទៅ។
      </p>
    </main>

    <!-- FOOTER -->
    <footer >
      <!-- DATE -->
      <div class="center l-space mt">
        <p>{{ invoice.datesignChhankitek }}</p>
        <p>ខេត្តកំពង់ធំ {{ invoice.datesignSoriyakitek }}</p>
      </div>

      <!-- SIGNATURE -->
      <div class="fingerprint mt">
        <!-- LEFT -->
        <div class="fingerprint-article">
          <div>
            <p><strong><center>ស្នាមម្រាមដៃ</center></strong></p>
            <p><strong><center>អ្នកស្នើសុំតម្កល់​ឯកសារ</center></strong></p>
          </div>

          <p>
            <strong>
              {{ loanrecord.customer.cust_name_1 }}
            <template v-if="loanrecord?.customer?.cust_name_2">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{ loanrecord.customer.cust_name_2 }}
            </template>
            </strong>
          </p>
        </div>

        <!-- RIGHT -->
        <div class="fingerprint-article">
          <div>
            <p><strong><center>យល់ព្រមតាមការស្នើសុំ</center></strong></p>
            <p><strong><center>{{ capital.organization }}</center></strong></p>
            <p><strong><center>ហត្ថលេខា</center></strong></p>
          </div>

          <p><strong><center>{{ capital.name }}</center></strong></p>
        </div>
      </div>
    </footer>
  </div>

  <!-- LOADING -->
  <div v-else class="center">Loading...</div>
</template>


<style scoped>

/* =======================
   1. FONTS
======================= */
@font-face {
  font-family: 'Notosan';
  src: url('/fonts/NotoSansKhmer.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Muol';
  src: url('/fonts/KhmerOSmuollight.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'tacteng';
  src: url('/fonts/TACTENG.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* =======================
   2. GLOBAL RESET
======================= */
* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

html, body {
  margin: 0;
  padding: 0;
}

/* =======================
   3. BASE TYPOGRAPHY
======================= */
body {
  font-family: "Notosan", "Noto Sans Khmer", Arial, sans-serif;
  font-size: 12pt;
  line-height: 1.4;
  color: #000;
}

strong {
  font-weight: 700;
}

p {
  line-height: 1.6;
}

/* =======================
   4. PAGE LAYOUT (SCREEN)
======================= */
.page {
  width: 210mm;
  min-height: auto;
  padding: 15mm;
  margin: 20px auto;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* =======================
   5. UTILITIES
======================= */
.row { display: flex; margin-bottom: 10px; }
.col-6 { width: 50%; }

.center { text-align: center; }
.mt { margin-top: 15px; }
.justify { text-align: justify; }

.inden {
  text-indent: 50px;
}

.v-space { height: 100px; }
.l-space { padding-left: 260px; }

/* =======================
   6. HEADINGS / SPECIAL FONTS
======================= */
h1, .muol {
  font-family: "Muol", Arial, sans-serif !important;
  font-size: 13pt;
  margin-top: 6px;
}

h2 {
  font-family: "Muol", Arial, sans-serif !important;
  font-size: 12pt;
  margin-bottom: 6px;
}

.tacteng {
  font-family: "tacteng", Arial, sans-serif !important;
  font-size: 16pt;
  line-height: 1.4;
  text-align: center;
}

  /* fingerprint-2grid */
  /* footer .fingerprint-article h2 {
      margin: 0;
      padding: 0;
  } */
  footer .fingerprint {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      column-gap: .6em;
  }
  .fingerprint-article {
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
  }

/* =======================
   7. PRINT SETTINGS (IMPORTANT FIX)
======================= */
@page {
  size: A4;
  margin: 12mm 17.5mm;
}

@media print {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 210mm;
  }

  .page {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;

    /* IMPORTANT: prevents blank page */
    overflow: hidden;
    page-break-after: avoid;
    break-after: avoid;
  }

  .no-print {
    display: none !important;
  }

  body {
    font-size: 12pt;
    line-height: 1.4;
    color: #000;
  }
}

</style>