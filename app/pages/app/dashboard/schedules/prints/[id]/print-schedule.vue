<script setup lang="ts">
definePageMeta({
  layout: "default",
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
const schedules = computed(() => dd.value?.schedules.values ?? [])
// const sum_schedule_principle = computed(() => data.value?.sum_schedule_principle || 0)
// const invoice = computed(() => data.value?.invoice || {} as Invoice)


const loading = ref(false)
// ---------------- FETCH DATA ----------------
const fetchData = async () => {
  loading.value = true

  try {


    const { data } = await $fetch<ApiResponse>(`/api/admin-secure/schedules/${id}/print-schedule`)
    

      console.log("API RESPONSE:", data ?? null )

    dd.value = data



  } finally {
    loading.value = false
  }
}

// ---------------- LIFECYCLE ----------------
onMounted(async () => {
  await fetchData()
  window.print()
})

// ---------------- HELPERS ----------------
const pad = (num:number) => String(num).padStart(8,"0")
</script>

<template>
<div class="p-4">
  <h1>Print Schedule</h1>
</div>
<div>{{ capital?.organization }}</div>
<div>{{ loanrecord?.customer?.cust_name_1 }}</div>
<!-- <tr v-for="s in schedules" :key="s.id">
  <td>{{ s.schedule_principle }}</td>
</tr> -->
</template>