<script setup lang="ts">
definePageMeta({
  layout: "print",
  requiresAuth: false,
  ssr: false
})

  useHead({
    title: "Preview schedule 2",
    meta: [{ name: "Schedule", content: "preview schedule 2" }],
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
// const sumSchedule = computed(() => dd.value?.sum_schedule_principle ?? 0)
const invoice = computed(() => dd.value?.invoice ?? null)

const loading = ref(false)

// ---------------- FETCH DATA ----------------
const fetchData = async () => {
  loading.value = true

  try {
    const { data } = await $fetch<ApiResponse>(`/admin-secure/schedules/${id}/print-sched2`)
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



// setTimeout(() => {
//   window.print()
// }, 500)

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

</script>


<template>

  <div v-if="loading" class="loading"><p>Preparing Document ...</p></div>
  <div v-else-if="!dd">No Data ...</div>



  <div class="page" v-if="dd">

    <!-- HEADER -->
    <header class="row">

      <div class="col-8 row end">
        <img ref="logoRef" src="/imgs/logo.png" class="logo" alt="logo" />
        <div class="pl">
          <h2 class="color-blue">{{ capital?.organization }}</h2>
          <h3><b>កាលវិភាគសងប្រាក់</b></h3>
        </div>
      </div>

      <div class="col-4">
        <table class="table">
          <tbody>
            <tr>
              <td>&nbsp; លេខសម្គាល់កម្ចី </td>
              <td class="right">{{ loanrecord!.id }} &nbsp; </td>
            </tr>
          </tbody>
        </table>
      </div>

    </header>


  

  <main class="mt">

      <!-- CUSTOMER INFO -->
      <table>
        <tbody>
          <tr>
            <td>អតិថិជន</td>
            <td>
              {{ loanrecord!.customer.nametitle1?.nametitle_kh }}
              {{ loanrecord!.customer.cust_name_1 }}

              <span v-if="loanrecord!.customer.cust_name_2">
                - {{ loanrecord!.customer.cust_name_2 }}
              </span>
            </td>
          </tr>
          <tr>
            <td>ថ្ងៃខែឆ្នាំខ្ចីប្រាក់</td>
            <td>{{ invoice!.datesignSoriyakitek }}</td>
          </tr>
        </tbody>
      </table>


      <!-- SCHEDULE TABLE -->
      <table class="mt">
        <tbody>

          <tr>
            <th class="left bold">ល.រ</th>
            <th class="left bold">កាលបរិច្ឆេទបង់ប្រាក់</th>
            <th class="left bold">សរុបប្រាក់ត្រូវបង់</th>
            <th class="left bold">ផ្សេងៗ</th>
          </tr>

          <tr v-for="(schedule, i) in schedules" :key="schedule.id">
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
      <p>
        <center>{{ invoice!.datesignChhankitek }}</center>
      </p>
      <p>
        <center>កំពង់ធំ {{ invoice!.datesignSoriyakitek }}</center>
      </p>
      <p>
        <center>អ្នកធ្វើតារាង</center>
      </p>
    </div>
    <div class="v-space"></div>
    <div>
      <p>
        <center>{{ capital!.name }}</center>
      </p>
    </div>
  </footer>

  </div>
  <div v-else class="center mt">Loading...</div>

</template>
