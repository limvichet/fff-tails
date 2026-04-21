<script setup lang="ts">

definePageMeta({
  layout: false,
  requiresAuth: false,
  ssr: false
})

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

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

function formatDay(date: string) {
  return date ? new Date(date).getDate() : ""
}
function formatMonth(date: string) {
  return date ? new Date(date).getMonth() + 1 : ""
}
function formatYear(date: string) {
  return date ? new Date(date).getFullYear() : ""
}


/* convert num to num unicode */
function numUnicode(value: string | number): string {
  if (value === null || value === undefined) return ""

  const map: Record<string, string> = {
    "0": "០",
    "1": "១",
    "2": "២",
    "3": "៣",
    "4": "៤",
    "5": "៥",
    "6": "៦",
    "7": "៧",
    "8": "៨",
    "9": "៩"
  }

  return value
    .toString()
    .split("")
    .map(char => map[char] ?? char) // keep , . etc
    .join("")
}


/* convert num to khmer month */
function khMonth(month: number | string): string {
  const months = [
    "",        // index 0 (not used)
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ"
  ]

  const m = Number(month)

  if (!m || m < 1 || m > 12) return ""

  return months[m] ?? ""
}

</script>

<template>
  <div v-if="!loading && loanrecord" class="page">
    <!-- HEADER -->
    <header class="center mt">
      <h1>ព្រះរាជាណាចក្រកម្ពុជា</h1>
      <h1>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1>
      <p class="tacteng">3</p>
      <h2>លិខិតផ្ទេកម្មសិទ្ធិ</h2>
    </header>

    <!-- MAIN -->
    <main class="mt">
      <p class="inden">
        {{ loanrecord!.customer.nametitle1.type }}ឈ្មោះ
        <strong>{{ loanrecord!.customer.cust_name_1 }}</strong>
        កើតនៅថ្ងៃទី{{ numUnicode(formatDay(loanrecord!.customer.cust_dob_1)) }}
        ខែ{{ khMonth(formatMonth(loanrecord!.customer.cust_dob_1)) }}
        ឆ្នាំ{{ numUnicode(formatYear(loanrecord!.customer.cust_dob_1)) }}
        អាសយដ្ឋាន {{ loanrecord!.customer.cust_address }}។
      </p>

      <h2 class="center mt bold">យល់ព្រម</h2>

      <p>
        <strong>១-</strong>
        ប្រគល់កាត ATM លេខ
        <span v-if="!loanrecord?.customer?.cust_atm_num">............................</span>
        <span v-else>{{ loanrecord?.customer?.cust_atm_num }}</span>

        ទៅលោកស្រី <strong>{{ capital?.name }}</strong>
        នៅភូមិ {{ capital?.village }}
        សង្កាត់ {{ capital?.commune }}
        ក្រុង {{ capital?.district }}
        ខេត្ត {{ capital?.province }}។
      </p>

      <p><strong>២-</strong> ស្នើសុំរបាយការណ៍គណនីតាមការស្នើសុំ។</p>

      <p><strong>៣-</strong> ផ្អាកការប្រើប្រាស់ APP ធនាគារ ក្នុងអំឡុងពេលសងប្រាក់។</p>

      <p><strong>៤-</strong> មិនបើកកាត ATM ថ្មីដោយមិនពិភាក្សា។</p>

      <p class="mt">
        ខ្ញុំបាទ/នាងខ្ញុំសូមធានាថាកាត ATM នេះជាកម្មសិទ្ធិរបស់ខ្ញុំ។
      </p>

      <p>
        ខ្ញុំបាទ/នាងខ្ញុំសូមផ្ដិតស្នាមមេដៃស្ដាំទុកជាភស្តុតាង។
      </p>

    </main>

    <!-- FOOTER -->
    <footer class="mt">

      <div class="row">
        <div class="col-6">
          <p>{{ invoice?.datesignChhankitek }}</p>
          <p>{{ invoice?.datesignSoriyakitek }}</p>
        </div>
      </div>

      <div class="mt center">
        <h3>ស្នាមម្រាមដៃ</h3>
        <p class="bold">{{ loanrecord.customer?.cust_name_1 }}</p>
      </div>

    </footer>

  </div>

  <div v-else class="center mt">
    Loading...
  </div>
</template>



<style scoped>

@font-face {
  font-family: 'Siemreap';
  src: url('/fonts/Siemreap.ttf') format('truetype');
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

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

/* h1 {
  line-height: 1.6;
} */

h1, .muol {
  font-family: "Muol", Arial, sans-serif !important;
  font-size: 13pt !important;
  margin-top: 6px;
}
h2 {
  font-family: "Muol", Arial, sans-serif !important;
  font-size: 12pt !important;
  margin-bottom: 6px;
}

.tacteng {
  font-family: "tacteng", Arial, sans-serif !important;
  font-size: 16pt !important;
  line-height: 1.4 !important;
}

p {
  line-height: 1.8 !important;
}

.inden {
  text-indent: 50px;
}


/* 2. SCREEN PREVIEW */
.page {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm 15mm;
  margin: 20px auto;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  font-family: "Siemreap", Arial, sans-serif;
  font-size: 12pt;
  line-height: 1.4;
}

/* 3. PRINT */
@page {
  size: A4;
  margin: 20mm 12.5mm 25mm 12.5mm;
}

@media print {
  html, body {
    width: 210mm;
    background: #fff;
  }

  .page {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
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

/* 4. UTILITIES */
.row { display: flex; margin-bottom: 10px; }
.col-6 { width: 50%; }

.center { text-align: center; }
.bold { font-weight: bold; }
.mt { margin-top: 15px; }
</style>