<script setup lang="ts">

definePageMeta({
  layout: "print",
  requiresAuth: false,
  ssr: false
})

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import ContractType1 from '~/components/loanrecords/contracts2/ContractType1.vue'
import ContractType3 from '~/components/loanrecords/contracts2/ContractType3.vue'
import ContractType4 from '~/components/loanrecords/contracts2/ContractType4.vue'
import ContractType5 from '~/components/loanrecords/contracts2/ContractType5.vue'
import ContractType6 from '~/components/loanrecords/contracts2/ContractType6.vue'
import ContractType7 from '~/components/loanrecords/contracts2/ContractType7.vue'
import ContractType8 from '~/components/loanrecords/contracts2/ContractType8.vue'
import ContractType10 from '~/components/loanrecords/contracts2/ContractType10.vue'

function getComponent(type: number) {
  switch (type) {
    case 1: return ContractType1
    case 3: return ContractType3
    case 4: return ContractType4
    case 5: return ContractType5
    case 6: return ContractType6
    case 7: return ContractType7
    case 8: return ContractType8
    case 10: return ContractType10
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
// const capital = computed(() => dd.value?.capital ?? null)
// const loanrecord = computed(() => dd.value?.loanrecord ?? null)
// const invoice = computed(() => dd.value?.invoice ?? null)
const loan2 = computed(() => dd.value?.loan2 ?? null)
// const schedules = computed(() => dd.value?.schedules ?? null)
// const loan_cheques = computed(() => dd.value?.loan_cheques ?? null)

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


</script>


<template>
  <div v-if="loan2">
    <component
      :is="getComponent(loan2.contract_type)"
      :dd="dd"
      :loading="loading"
    />
  </div>
</template>
