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

import ContractType1 from '~/components/loanrecords/contracts2/ContractType1.vue'

function getComponent(type: number) {
  switch (type) {
    case 1: return ContractType1
    // case 4: return ContractType4
    default: return ContractType1
  }
}

type ApiResponse = {
  success: boolean
  data: PrintContract2
}
type PrintContract2 = {
    invoice: Invoice
    capital: Capital
    loanrecord: Loanrecord
    schedules: Schedule[]
    loan2: Loan2
    loan_cheques: Cheque[]
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
type Schedule = {
    id:                         number
    loan_id:                    number
    schedule_startdate:         string
    schedule_enddate:           string
    schedule_totaldays:         number
    schedule_principle_date:    string
    schedule_paymentnumber:     number
    schedule_outstanding:       string
    schedule_over_draft:        string
    schedule_principle:         string
    schedule_interest_rate:     string
    schedule_interest:          number
    schedule_totalpay:          string
    schedule_paidcash:          string
    schedule_note:              string
    schedule_cashin_1:          string
    schedule_cashin_2:          string
    schedule_cashin_3:          string
    schedule_totalcashin:       string
    schedule_remaincash:        string
    schedule_preless_1:         string
    schedule_preless_2:         string
    schedule_preless_3:         string
    schedule_totalpreless:      string
    schedule_lessmoney:         string
    schedule_principle_payment: string
    cheque_number:              string
    invoice_id:                 number
    created_by:                 number
    updated_by:                 number
    active:                     number
    created_at:                 string
    updated_at:                 string
}
type Loan2 = {
  contract_type: number
  contract_schedule_totalpay_all: string
  contract_schedule_totalpay_first: string
  contract_schedule_totalpay_first_date: string
  contract_schedule_totalpay_last: string
  contract_schedule_totalpay_last_date: string
  bank: string
}
type Cheque = {
    id:                          number
    loan_id:                     number
    cheque_order:                number
    cheque_number:               number
    schedule_paymentnumber_from: number
    schedule_cheque_from_date:   string
    schedule_paymentnumber_to:   string
    schedule_cheque_to_date:     string
    schedule_totalpay:           string
    created_by:                  number
    updated_by:                  number
    created_at:                  string
    updated_at:                  string
}



const route = useRoute()
const lid = route.params.lid as string

const dd = ref<PrintContract2 | null>(null)
const capital = computed(() => dd.value?.capital ?? null)
const loanrecord = computed(() => dd.value?.loanrecord ?? null)
const invoice = computed(() => dd.value?.invoice ?? null)
const loan2 = computed(() => dd.value?.loan2 ?? null)
const schedules = computed(() => dd.value?.schedules ?? null)
const loan_cheques = computed(() => dd.value?.loan_cheques ?? null)

const loading = ref(false)



// ---------------- FETCH DATA ----------------
const fetchData = async () => {
  loading.value = true

  try {
    const { data } =  await $fetch<ApiResponse>(`/api/admin-secure/loanrecords/${lid}/print-contract2`)
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
  <div v-if="loan2" class="page">
    <component
      :is="getComponent(loan2.contract_type)"
      :data="dd"
    />
  </div>
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