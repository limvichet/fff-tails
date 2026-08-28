<script setup lang="ts">

  definePageMeta({
    layout: "print",
    requiresAuth: false,
    ssr: false
  })

  useHead({
    title: "Preview schedule",
    meta: [{ name: "Schedule", content: "preview schedule" }],
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
    const { data } = await $fetch<ApiResponse>(`/admin-secure/schedules/${id}/print-sched`,{credentials: 'include'})
    dd.value = data
  } finally {
    loading.value = false
  }
}

// ---------------- LIFECYCLE ----------------
onMounted(async () => {
  await fetchData()
  await waitImageLoad()
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
  return `${date.getMonth() + 1}/${date.getFullYear()}`
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

  <div v-if="loading" class="loading"><p>Preparing Document ...</p></div>
  <div v-else-if="!dd">No Data ...</div>


  <div v-if="!loading && dd" class="page">
    
    <!-- HEADER -->
    <header class="row">

      <div class="col-8 row end">
        <img ref="logoRef" src="/imgs/logo-48.png" class="logo" />
        <div class="pl">
          <h2 class="color-blue">{{ capital?.organization }}</h2>
          <h3><b>កាលវិភាគសងប្រាក់</b></h3>
        </div>
      </div>

      <div class="col-4">
        <table class="table border">
          <tbody>
            <tr>
              <td>&nbsp; លេខសម្គាល់កម្ចី</td>
              <td class="right">{{ pad(loanrecord?.id || 0) }} &nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp; លេខអតិថិជន</td>
              <td class="right">{{ pad(loanrecord?.customer?.id || 0) }} &nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp; អត្រាកាប្រាក់%</td>
              <td class="right">{{ loanrecord?.loan_interest_rate }} &nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </header>

    <main>
    <!-- CUSTOMER -->
    <table>
      <tbody>
        <tr>
          <td>អតិថិជន</td>
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
          <td>សរុបទឹកប្រាក់</td>
          <td>
            {{ formatNumber(Number(loanrecord?.loan_totalcash || 0)) }}
            {{ loanrecord?.currency?.currency_kh }}
          </td>
          <td>
            រយៈពេលខ្ចី {{ loanrecord?.loan_peroid }}
            {{ loanrecord?.loantype?.loantype_shortcut }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- SCHEDULE -->
    <table class="mt left">
      <tbody>
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
      

      
        <tr v-for="s in schedules" :key="s.id">
          <td class="center">{{ s.schedule_paymentnumber }}</td>
          <td>{{ formatDate(s.schedule_principle_date) }}</td>
          <td>{{ formatMonthYear(s.schedule_principle_date) }}</td>
          <td>{{ formatNumber(Number(s.schedule_outstanding || 0)) }}</td>
          <td>{{ formatNumber(Number(s.schedule_principle || 0)) }}</td>
          <td>{{ formatNumber(Number(s.schedule_interest)) }}</td>
          <td>{{ formatNumber(Number(s.schedule_totalpay || 0)) }}</td>
          <td>{{ formatNumber(Number(s.schedule_totalcashin || 0)) }}</td>
          <td>{{ formatNumber(Number(s.schedule_paidcash || 0)) }}</td>
          <td>{{ formatNumber(Number(s.schedule_lessmoney || 0))}}</td>
        </tr>
      

      
        <tr class="bold">
          <td colspan="3" class="center bold">សរុប</td>
          <td colspan="7">{{ formatNumber(sumSchedule) }}</td>
        </tr>
      </tbody>
    </table>

    
      <!-- NOTE -->
      <div class="row mt note">
        <div class="col-2">កំណត់សម្គាល់</div>
        <div class="col-10">
          {{ loanrecord?.loan_note || '........................' }}
        </div>
      </div>

    </main>


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
          <div class="sign">{{ loanrecord?.guarantor?.cust_name_1 || '....................' }}</div>
        </div>
        <div class="col-3">
          <div>ស្នាមម្រាមដៃ</div>
          <div>អ្នកខ្ចីប្រាក់</div>
          <div class="v-space"></div>
          <div class="sign">
            {{ loanrecord?.customer?.cust_name_1 }}
            &nbsp;  &nbsp; &nbsp;
            {{ loanrecord?.customer?.cust_name_2 }}
          </div>
        </div>
        <div class="col-3">
          <div>ស្នាមម្រាមដៃ</div>
          <div>ម្ចាស់ប្រាក់</div>
          <div class="v-space"></div>
          <div class="mt">{{ capital?.name }}</div>
        </div>
      </div>
    </footer>
  </div>

  <div v-else class="center mt">Loading...</div>
</template>
