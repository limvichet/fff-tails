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
  id: number
  cust_id: number
  loantype_id: number
  customer: Customer
  currency: Currency
  loantype: Loantype
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


type Loantype = {
    id:                number;
    loantype_kh:       string;
    loantype_shortcut: string;
}

type Schedule = {
  id: number
  schedule_paymentnumber: number
  schedule_principle_date: string
  schedule_totalpay: string
  schedule_note: string
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
    const { data } = await $fetch<ApiResponse>(`/api/admin-secure/schedules/${id}/print-sched2`)
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
  <div class="container page" v-if="dd">

    <!-- HEADER -->
    <header class="row">
      <div class="col-8">

        <!-- LOGO + TITLE -->
        <div class="row mb-3 header-left">
          <img
            ref="logoRef"
            src="/imgs/logo.png"
            class="logo"
            alt="logo"
          />

          <div class="header-text">
            <h2>{{ capital?.organization }}</h2>
            <div>កាលវិភាគសងប្រាក់</div>
          </div>
        </div>

        <!-- CUSTOMER INFO -->
        <table>
          <tbody>
            <tr>
              <th style="width:20%">អតិថិជន</th>
              <td style="width:40%">
                {{ loanrecord!.customer.nametitle1?.nametitle_kh }}
                {{ loanrecord!.customer.cust_name_1 }}

                <template v-if="loanrecord!.customer.cust_name_2">
                  - {{ loanrecord!.customer.cust_name_2 }}
                </template>
              </td>
            </tr>

            <tr>
              <th>ថ្ងៃខែឆ្នាំខ្ចីប្រាក់</th>
              <td>{{ invoice!.datesignSoriyakitek }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- RIGHT SIDE -->
      <div class="col-3">
        <table>
          <tbody>
            <tr>
              <td>លេខសម្គាល់កម្ចី</td>
              <td class="right">{{ loanrecord!.id }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </header>

    <!-- SCHEDULE TABLE -->
    <main class="row mt">
      
        <table>
          <thead>
            <tr>
              <th>ល.រ</th>
              <th>កាលបរិច្ឆេទបង់ប្រាក់</th>
              <th>សរុបប្រាក់ត្រូវបង់</th>
              <th>ផ្សេងៗ</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(schedule, i) in schedules"
              :key="schedule.id"
            >
              <td>{{ schedule.schedule_paymentnumber }}</td>

              <td>
                {{ formatDate(schedule.schedule_principle_date) }}
              </td>

              <td>
                {{ formatNumber(schedule.schedule_totalpay) }} {{ loanrecord!.currency.currency_kh }}
              </td>

              <td>
                {{ schedule.schedule_note || '' }}
              </td>
            </tr>
          </tbody>
        </table>
      
    </main>

    <!-- FOOTER / SIGN -->
    <footer class="mt l-space">
      <div>
        <p><center>{{ invoice!.datesignChhankitek }}</center></p>
        <p><center>កំពង់ធំ {{ invoice!.datesignSoriyakitek }}</center></p> 
        <p><center>អ្នកធ្វើតារាង</center></p>
      </div>
       <div class="v-space"></div>
      <div>
        <p><center>{{ capital!.name }}</center></p>
      </div>
    </footer>
  </div>

  <!-- LOADING -->
  <div v-else class="center mt">
    Loading...
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
.l-space { padding-left: 200px; }
</style>