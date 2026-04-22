<script setup lang="ts">

definePageMeta({
  layout: false,
  requiresAuth: false,
  ssr: false
})

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { numUnicode } from "~/utils/number"
import { formatFullDate } from "~/utils/date"
import { UnicodeHelper } from '~/utils/unicodeHelper'


type ApiResponse = {
  success: boolean
  data: PrintReceipt2
}
type PrintReceipt2 = {
    invoice: Invoice
    capital: Capital
    loanrecord: Loanrecord
    schedule_amount: number
}
type Invoice = {
  id: number
  datesignChhankitek: string
  datesignSoriyakitek: string
}
type Capital = {
    organization: string
    title_pay: string
    name: string
    sex: string
    birth_year: number
    age: number
    village: string 
    commune: string
    district: string
    province: string
    idPassportNum: string
    phone: string
    phone1: string
    phone2: string
}
type Loanrecord = {
    id:       number
    cust_id:  number
    cust_guarantor_id: number
    currency_id: number
    customer: Customer
    guarantor: Guarantor
    currency: Currency
}
type Customer = {
    id: number
    cust_title_1: number
    cust_name_1: string
    cust_dob_1: string
    iden_id_1: number
    cust_idcardnum_1: string
    cust_idcardnum_date_1: string
    nametitle1: NameTitle
    identification1: Identification

    cust_title_2: number
    cust_name_2: string
    cust_dob_2: string
    iden_id_2: number
    cust_idcardnum_2: string
    cust_idcardnum_date_2: string
    nametitle2: NameTitle
    identification2: Identification

    cust_address: string

}
type Guarantor = {
    id: number
    cust_title_1: number
    cust_name_1: string
    cust_dob_1: string
    iden_id_1: number
    cust_idcardnum_1: string
    cust_idcardnum_date_1: string
    nametitle1: NameTitle
    identification1: Identification
    cust_address: string
}
type NameTitle = {
    id: number
    nametitle_kh: string
    type: string
}
type Identification = {
    id: number
    identification_kh: string
}
type Currency = {
    id: number
    currency_kh: string
}


const route = useRoute()
const lid = route.params.lid as string

const dd = ref<PrintReceipt2 | null>(null)
const capital = computed(() => dd.value?.capital ?? null)
const loanrecord = computed(() => dd.value?.loanrecord ?? null)
const invoice = computed(() => dd.value?.invoice ?? null)
const schedule_amount = computed(() => dd.value?.schedule_amount ?? 0)

const loading = ref(false)



// ---------------- FETCH DATA ----------------
const fetchData = async () => {
  loading.value = true

  try {
    const { data } =  await $fetch<ApiResponse>(`/api/admin-secure/loanrecords/${lid}/print-receipt2`)
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
    <header class="row" style="">

      <div style="margin-top: 20px; margin-left: -10px; display: flex; flex-direction: column; align-items: center;">
          <img src="/imgs/logo.png" class="logo" />
          <p><strong>{{ capital.organization }}</strong></p>
      </div>

      <div style="margin-left: 20px;">
        <h1>ព្រះរាជាណាចក្រកម្ពុជា</h1>
        <h1>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1>
        <p class="tacteng">3</p>
        <h2>កិច្ចសន្យាខ្ចីប្រាក់ និង លិខិតទទួលប្រគល់-ទទួលប្រាក់កម្ចី</h2>
      </div>

      <div></div>



    </header>

    <!-- MAIN CONTENT -->
    <main class="justify mt">

      <!-- CUSTOMER -->
      <p>
        {{ loanrecord.customer.nametitle1?.nametitle_kh }}
        <strong>{{ loanrecord.customer.cust_name_1 }}</strong>

        ឆ្នាំ{{ numUnicode(formatYear(loanrecord.customer.cust_dob_1)) }}

        កាន់{{ loanrecord.customer.identification1?.identification_kh }}

        លេខ{{ numUnicode(loanrecord.customer.cust_idcardnum_1) }}

        ចុះថ្ងៃទី
        <span v-if="loanrecord.customer.cust_idcardnum_date_1">
          {{ formatFullDate(loanrecord.customer.cust_idcardnum_date_1) }}
        </span>
        <span v-else>......................</span>

        <!-- ADDRESS -->
        <span v-if="loanrecord.customer.cust_address">
          មានអាសយដ្ឋានស្ថិតនៅ{{ loanrecord.customer.cust_address }}
        </span>

        <!-- GUARANTOR -->
        <span v-if="loanrecord.guarantor?.cust_name_1">
          និង {{ loanrecord.guarantor.nametitle1?.nametitle_kh }}
          <strong>{{ loanrecord.guarantor.cust_name_1 }}</strong>

          កើតថ្ងៃទី{{ formatFullDate(loanrecord.guarantor.cust_dob_1) }}

          កាន់{{ loanrecord.guarantor.identification1?.identification_kh }}

          លេខ{{ numUnicode(loanrecord.guarantor.cust_idcardnum_1) }}

          <span v-if="loanrecord.guarantor.cust_address">
            សព្វថ្ងៃរស់នៅ{{ loanrecord.guarantor.cust_address }}
          </span>
        </span>
      </p>

      <!-- LOAN AMOUNT -->
      <p>
        បានទទួលប្រាក់កម្ចីចំនួន
        <strong>
          {{ numUnicode(formatNumber(schedule_amount)) }}
          {{ loanrecord.currency.currency_kh }}
        </strong>

        ({{ UnicodeHelper.spellkhmer(schedule_amount) }}{{ loanrecord.currency?.currency_kh }})
      </p>

      <!-- AGREEMENT -->
      <p>
        លិខិតនេះធ្វើឡើងដោយគ្មានការបង្ខិតបង្ខំ...
      </p>

    </main>

    <!-- FOOTER -->
    <footer class=" mt">

      <div class="center">
        <p>{{ invoice.datesignChhankitek }}</p>
        <p>ធ្វើនៅកំពង់ធំ {{ invoice.datesignSoriyakitek }}</p>
      </div>

      <!-- SIGNATURE GRID -->
      <div class="row between mt">

        <!-- CAPITAL -->
        <div class="fingerprint-article">
          <h2>អ្នកប្រគល់ប្រាក់</h2>
          <h2>{{ capital.name }}</h2>
        </div>

        <!-- CUSTOMER -->
        <div class="fingerprint-article">
          <h2>អ្នកទទួលប្រាក់</h2>
          <h2>
            {{ loanrecord.customer.cust_name_1 }}
            <span v-if="loanrecord.customer.cust_name_2">
              &nbsp;{{ loanrecord.customer.cust_name_2 }}
            </span>
          </h2>
        </div>

        <!-- GUARANTOR -->
        <div
          v-if="loanrecord.guarantor?.cust_name_1"
          class="fingerprint-article"
        >
          <h2>អ្នកធានា</h2>
          <h2>{{ loanrecord.guarantor.cust_name_1 }}</h2>
        </div>

      </div>

    </footer>
  </div>

  <div v-else class="center mt">Loading...</div>
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
  min-height: 260mm;
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
.row { display: flex;}
.start {align-items: start;}
.between {justify-content: space-between;}
.logo { width: 60px; height: 60px; object-fit: contain; }
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
h1, h2 { text-align:  center; }
h1 {
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