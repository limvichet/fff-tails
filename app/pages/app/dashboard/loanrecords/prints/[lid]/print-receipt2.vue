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
  import { numUnicode, FixNumber } from "~/utils/number"
  import { formatFullDate, formatYear } from "~/utils/date"
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
  await waitImageLoad()
  // setTimeout(() => window.print(), 300)
})



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

  <div v-if="!loading && dd" class="page">

    <!-- HEADER -->
    <header class="row center">

      <div class="col-2" style="margin-top: 20px; margin-left: -20px; display: flex; flex-direction: column; align-items: center;">
          <img ref="logoRef" src="/imgs/logo.png" class="logo" />
          <h4 class="color-blue">{{ capital!.organization }}</h4>
      </div>

      <div class="center">
        <h1>ព្រះរាជាណាចក្រកម្ពុជា</h1>
        <h1>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1>
        <p class="tacteng">3</p>
        <br>
        <h2>កិច្ចសន្យាខ្ចីប្រាក់ និងលិខិតទទួលប្រគល់-ទទួលប្រាក់កម្ចី</h2>
      </div>

      <!-- <div class="col-1"></div> -->

    </header>

    <br>
    <!-- MAIN CONTENT -->
    <main class="justify mt">

      <!-- CUSTOMER -->
      <p class="inden">
        {{ loanrecord!.customer.nametitle1?.nametitle_kh }}
        <strong>{{ loanrecord!.customer.cust_name_1 }}</strong>

        កើតឆ្នាំ{{ numUnicode(formatYear(loanrecord!.customer.cust_dob_1)) }}

        កាន់{{ loanrecord!.customer.identification1?.identification_kh }}

        លេខ{{ numUnicode(loanrecord!.customer.cust_idcardnum_1) }}

        ចុះ
        <span v-if="loanrecord!.customer.cust_idcardnum_date_1">
          {{ formatFullDate(loanrecord!.customer.cust_idcardnum_date_1) }}
        </span>
        <span v-else>ថ្ងៃទី......................</span>

        <!-- customer2 -->
        <span v-if="loanrecord!.customer.cust_name_2">
          និង{{ loanrecord!.customer.nametitle2?.nametitle_kh }}
          <strong>{{ loanrecord!.customer.cust_name_2 }}</strong>

          កើតឆ្នាំ{{ numUnicode(formatYear(loanrecord!.customer.cust_dob_2)) }}

          កាន់{{ loanrecord!.customer.identification2?.identification_kh }}

          លេខ{{ numUnicode(loanrecord!.customer.cust_idcardnum_2) }}

          ចុះ
          <span v-if="loanrecord!.customer.cust_idcardnum_date_2">
            {{ formatFullDate(loanrecord!.customer.cust_idcardnum_date_2) }}
          </span>
          <span v-else>ថ្ងៃទី......................</span>
        </span>

        <!-- ADDRESS -->
        <span v-if="loanrecord!.customer.cust_address">
          មានអាសយដ្ឋានស្ថិតនៅ{{ loanrecord!.customer.cust_address }}
        </span>

        <!-- GUARANTOR -->
        <span v-if="loanrecord!.guarantor?.cust_name_1">
          និង{{ loanrecord!.guarantor.nametitle1?.nametitle_kh }}
          <strong>{{ loanrecord!.guarantor.cust_name_1 }}</strong>

          កើត{{ formatFullDate(loanrecord!.guarantor.cust_dob_1) }}

          កាន់{{ loanrecord!.guarantor.identification1?.identification_kh }}

          លេខ{{ numUnicode(loanrecord!.guarantor.cust_idcardnum_1) }}

          <span v-if="loanrecord!.guarantor.cust_address">
            សព្វថ្ងៃរស់នៅ{{ loanrecord!.guarantor.cust_address }}
          </span>
        </span>

        <span>
          បានទទួលប្រាក់ចំនួន
          <b>
            {{ numUnicode(formatNumber(FixNumber(schedule_amount))) }}{{ loanrecord!.currency.currency_kh }}
          </b>
          ({{ UnicodeHelper.spellkhmer(Number(FixNumber(schedule_amount))) }}{{ loanrecord!.currency?.currency_kh }}គត់)
          ពីលោកស្រី <b>ឈួង សុខផេង</b> កើតថ្ងៃទី១៦ ខែមេសា ឆ្នាំ១៩៨៨  កាន់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរលេខ១៥០៩៧៧៨៨៩ ចុះថ្ងៃទី២៥ ខែធ្នូ ឆ្នាំ២០២០ មានអាសយដ្ឋានស្ថិតនៅភូមិកំពង់ក្របៅ សង្កាត់កំពង់ក្របៅ ក្រុងស្ទឹងសែន ខេត្តកំពង់ធំ។ 
        </span>

      </p>

      


      <!-- AGREEMENT -->
      <p class="inden">
        លិខិតនេះត្រូវបានធ្វើឡើងដោយគ្មានការបង្ខិតបង្ខំពីភាគីណាមួយឡើយហើយបានអាន និងយល់នូវរាល់ខ្លឹមសារទាំងឡាយនៃលិខិតនេះយ៉ាងច្បាស់លាស់ ហើយយល់ព្រមផ្ដិតមេដៃស្ដាំចាប់ពីថ្ងៃនេះតទៅ។
      </p>
      <p class="inden mt">ក្រែងពុំប្រាកដ ភាគីទាំងពីរ ព្រមព្រៀងគ្នាផ្តិតមេដៃទុកជាភស្តុតាង។ </p>

    </main>

    <!-- FOOTER -->
    <footer class="mt bold center">

      <div>
        <p>{{ invoice!.datesignChhankitek }}</p>
        <p>ធ្វើនៅកំពង់ធំ {{ invoice!.datesignSoriyakitek }}</p>
      </div>

      <!-- SIGNATURE GRID -->
      <div class="row around mt">

        <!-- CAPITAL -->
        <div>
          <span>អ្នកប្រគល់ប្រាក់</span>
          <div class="v-space"></div>
          <span>{{ capital!.name }}</span>
        </div>

        <!-- CUSTOMER -->
        <div>
          <span>អ្នកទទួលប្រាក់</span>
          <div class="v-space"></div>
          <span>
            {{ loanrecord!.customer.cust_name_1 }}
            <span v-if="loanrecord!.customer.cust_name_2">
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              {{ loanrecord!.customer.cust_name_2 }}
            </span>
          </span>
        </div>

        <!-- GUARANTOR -->
        <div
          v-if="loanrecord!.guarantor?.cust_name_1"
          class="fingerprint-article"
        >
          <span>អ្នកធានា</span>
          <div class="v-space"></div>
          <span>{{ loanrecord!.guarantor.cust_name_1 }}</span>
        </div>

      </div>

    </footer>
  </div>

  <div v-else class="center mt">Loading...</div>
</template>
