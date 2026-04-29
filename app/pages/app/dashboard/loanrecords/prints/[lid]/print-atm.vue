<script setup lang="ts">

  definePageMeta({
    layout: "print",
    requiresAuth: false,
    ssr: false
  })

  useHead({
    title: "Preview atm",
    meta: [{ name: "Loan", content: "preview atm" }],
  })

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { formatFullDate } from "~/utils/date"

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
    customer: Customer,
}
type Customer = {
    id: number,
    cust_name_1: number,
    cust_title_1: number,
    nametitle1: NameTitle,
    cust_dob_1: string,
    cust_address: string,
    cust_atm_num: string
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
    const { data } =  await $fetch<ApiResponse>(`/api/admin-secure/loanrecords/${lid}/print-atm`)
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

</script>

<template>

  <div v-if="loading" class="loading"><p>Preparing Document ...</p></div>
  <div v-else-if="!dd">No Data ...</div>
  
  <div v-if="!loading && dd" class="page">
    <!-- HEADER -->
    <header class="row between center">
      <div></div>
      <div>
        <h1>ព្រះរាជាណាចក្រកម្ពុជា</h1>
        <h1>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1>
        <p class="tacteng">3</p>
        <h2>លិខិតផ្ទេកម្មសិទ្ធិ</h2>
      </div>
      <div></div>
    </header>

    <!-- MAIN -->
    <main class="mt">
      <p class="inden">
        {{ loanrecord!.customer.nametitle1.type }}ឈ្មោះ
        &nbsp; <strong>{{ loanrecord!.customer.cust_name_1 }}</strong> &nbsp; 
        កើតនៅ{{ formatFullDate(loanrecord!.customer.cust_dob_1) }}
        អាសយដ្ឋាន {{ loanrecord!.customer.cust_address }}។
      </p>

      <!-- TITLE -->
      <h2 class="center mt">យល់ព្រម</h2>

      <p class="inden justify mt">
        <strong>១-</strong>
        ប្រគល់កាត ATM លេខ
        <span v-if="!loanrecord?.customer?.cust_atm_num">............................</span>
        <span v-else>{{ loanrecord?.customer?.cust_atm_num }}</span>

        ទៅលោកស្រី <strong>{{ capital?.name }}</strong>
        សព្វថ្ងៃរស់នៅភូមិ{{ capital?.village }}
        សង្កាត់ {{ capital?.commune }}
        ក្រុង {{ capital?.district }}
        ខេត្ត {{ capital?.province }}។
        ប្រើប្រាស់សម្រាប់ដកការប្រាក់ រំលោះប្រាក់ដើមប្រចាំខែ រហូតចប់តាមកាលវិភាគសងប្រាក់។
      </p>

      <p class="inden justify"><strong>២-</strong> ស្នើសុំធនាគារព្រីនរបាយការណ៍គណនីក្នុងករណីមានការស្នើសុំពីលោកស្រី {{ capital?.name }}</p>

      <p class="inden justify"><strong>៣-</strong> ផ្ដាច់ការប្រើប្រាស់ប្រព័ន្ធធនាគារតាម APPទូរស័ព្ទដែ ឬប្រព័ន្ធយូនីធីជាដើមក្នុងកំឡុងពេល​ការទូទាត់តាម កាលវិភាគនៅមិនទាន់បានបញ្ចប់នៅឡើយ(ដើម្បីជៀសវាងការមិនទុកចិត្តគ្នាលើការដកប្រាក់)។</p>

      <p class="inden justify"><strong>៤-</strong> មិនបើកកាត ATM ថ្មី ឬបិទគណនីធនាគារ ដោយមិនបានពិភាក្សាជាមួយលោកស្រី
      {{ capital?.name }}ជាមុនឡើយ។
      </p>

      <p class="inden justify">
        ខ្ញុំបាទ/នាងខ្ញុំ សូមធានាថាកាត   ATM  នេះជាកម្មសិទ្ធិរបស់ខ្ញុំបាទ/នាងខ្ញុំប្រាកដមែន។ ការប្រគល់កាត ATM ធ្វើឡើងដោយគ្មានការបង្ខិតបង្ខំពីជនណាម្នាក់ឡើយ។
      </p>

      <p class="inden justify">
        ខ្ញុំបាទ/នាងខ្ញុំសូមផ្ដិតស្នាមមេដៃស្ដាំទុកជាភ័ស្ដុតាង។
      </p>

    </main>

    <!-- FOOTER -->
    <footer>

      <div class="center mt" >
        <p>{{ invoice?.datesignChhankitek }}</p>
        <p>{{ invoice?.datesignSoriyakitek }}</p>
      </div>
      
      <div class="mt center">
        <span><strong>ស្នាមម្រាមដៃ</strong></span>
        <div class="v-space"></div>
        <span><strong>{{ loanrecord!.customer?.cust_name_1 }}</strong></span>
      </div>

    </footer>

  </div>

  <div v-else class="center mt">
    Loading...
  </div>
</template>


<!-- 
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
.bold { font-weight: 700; }
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

</style> -->