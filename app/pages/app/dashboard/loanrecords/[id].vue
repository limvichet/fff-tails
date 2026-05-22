<script setup lang="ts">

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Loans", subTitle: "Detail" }
})

useHead({
  title: "Edit loans",
  meta: [{ name: "loanrecords", content: "edit loan records" }],
})

import { z } from "zod"
import { useRoute } from "vue-router"
import ComponentCard from "@/components/common/ComponentCard.vue"
import ComponentGrowCard from "@/components/common/ComponentGrowCard.vue"
import type { LoanrecordFormDataResponse } from "~/types/loanrecord"
import { formatDateForInput } from "@/utils/date"
import { useCustomToast } from '~/composables/useCustomToast';
const { showToast } = useCustomToast();

const { hasRole } = useAuth()


const { successMsg, errorMsg } = useMessage()
const loading = ref(false)
const errors = reactive<Record<string,string>>({})

const route = useRoute()
const id = route.params.id

errorMsg.value = null

/* FORM OPTIONS */
const customerName1 = ref<any[]>([])
const currencies = ref<any[]>([])
const loanTypes = ref<any[]>([])
const sourceMoneys = ref<any[]>([])
const paybacks = ref<any[]>([])
const loanStatuses = ref<any[]>([])
const loanCheckStatuses = ref<any[]>([])
const loanGroupPositions = ref<any[]>([])

/* FETCH FORM DATA */
const fetchFormData = async () => {
  const data = await $fetch<LoanrecordFormDataResponse>(
    "/api/admin-secure/loanrecords-form-data"
  )

  const map = (obj:any)=>
    Object.entries(obj).map(([id,label])=>({
      id:Number(id),
      label:String(label)
    }))

  customerName1.value = map(data.customerName1)
  currencies.value = map(data.currencies)
  loanTypes.value = map(data.loanTypes)
  sourceMoneys.value = data.sourceMoneys
  paybacks.value = map(data.paybacks)
  loanStatuses.value = map(data.loanStatuses)
  loanCheckStatuses.value = map(data.loanCheckStatuses)
  loanGroupPositions.value = map(data.loanGroupPositions)
}

onMounted(fetchFormData)

/* FORM STATE */
const form = reactive<any>({
  cust_id:-1,
    currency_id:1,
    loan_lastcash:0,
    loan_newcash:0,
    loan_totalcash:0,
    loan_principle:0,
    source_money:"",
    loantype_id:-1,
    loan_over_draft:0,
    payback_id:1,
    loan_peroid:1,
    loan_startdate:"",
    loan_first_paid_date:"",
    loan_enddate:"",
    loan_interest_rate:0,
    invoice_id:"",
    loan_status_id:1,
    
    cust_comission_id:-1,
    cust_comission_interest_rate:0,
    cust_loangroup_id:-1,
    cust_guarantor_id:-1,
    cust_position_loangroup_id:-1,

    loan_collateral_1:"",
    loan_collateral_map_link_1:"",
    loan_collateral_doc_1: null,
    loan_collateral_doc_1_src: null as string | null,
    loan_collateral_doc_1_check: false,
    loan_collateral_2:"",
    loan_collateral_map_link_2:"",
    loan_collateral_doc_2:null,
    loan_collateral_doc_2_src: null as string | null,
    loan_collateral_doc_2_check: false,
    loan_tag:"",
    loan_note:"",

    active:1,
    loan_check_status:0,
    loan_check_approver:0,
    loan_check_date:'',
    loan_startdate_principle:'',
})

/* FETCH LOAN RECORD */

type ApiResponse<T> = {
  success:boolean
  data:T
}

const headers = useRequestHeaders(["cookie"])

const { data } = await useAsyncData(
  `loanrecord-${id}`,
  () => $fetch<ApiResponse<any>>(`/api/admin-secure/loanrecords/${id}`,{ headers })
)

const loanrecord = computed(()=>data.value?.data ?? null)




watchEffect(() => {
  const lastCash = Number(String(form.loan_lastcash).replace(/,/g, '') || 0)
  const newCash  = Number(String(form.loan_newcash).replace(/,/g, '') || 0)
  form.loan_totalcash = lastCash + newCash
})

/* POPULATE FORM */
watch(loanrecord,(l)=>{
  if(!l) return

  Object.assign(form,{
    id:l.id,

    cust_id:l.cust_id ?? -1,
    currency_id:l.currency_id ?? 1,
    loan_lastcash:l.loan_lastcash ?? 0,
    loan_newcash:l.loan_newcash ?? 0,
    loan_totalcash:l.loan_totalcash ?? 0,
    loan_principle:l.loan_principle ?? 0,
    source_money:l.source_money ?? "",
    loantype_id:l.loantype_id ?? -1,
    loan_over_draft:l.loan_over_draft ?? 0,
    payback_id:l.payback_id ?? 1,
    loan_peroid:l.loan_peroid ?? 1,
    loan_startdate:formatDateForInput(l.loan_startdate ?? ""),
    loan_first_paid_date:formatDateForInput(l.loan_first_paid_date ?? ""),
    loan_enddate:formatDateForInput(l.loan_enddate ?? ""),
    loan_interest_rate:l.loan_interest_rate ?? 0,
    invoice_id:(l.invoice?.invoice_type ?? "") + String(l.invoice_id).padStart(8, '0'),
    loan_status_id:l.loan_status_id ?? 1,
    loan_check_status:l.loan_check_status ?? 0,

    cust_comission_id:l.cust_comission_id ?? -1,
    cust_comission_interest_rate:l.cust_comission_interest_rate ?? 0,
    cust_loangroup_id:l.cust_loangroup_id ?? -1,
    cust_guarantor_id:l.cust_guarantor_id ?? -1,
    cust_position_loangroup_id:l.cust_position_loangroup_id ?? -1,

    loan_collateral_1:l.loan_collateral_1 ?? "",
    loan_collateral_map_link_1:l.loan_collateral_map_link_1 ?? "",
    loan_collateral_doc_1:l.loan_collateral_doc_1 ?? null,
    loan_collateral_doc_1_src: l.loan_collateral_doc_1_url ?? null,
    // loan_collateral_doc_1_check: !!l.loan_collateral_doc_1_url,
    loan_collateral_doc_1_check: l.loan_collateral_doc_1_url ? 1 : 0,
    loan_collateral_2:l.loan_collateral_2 ?? "",
    loan_collateral_map_link_2:l.loan_collateral_map_link_2 ?? "",
    loan_collateral_doc_2:l.loan_collateral_doc_2 ?? null,
    loan_collateral_doc_2_src: l.loan_collateral_doc_2_url ?? null,
    // loan_collateral_doc_2_check: !!l.loan_collateral_doc_2_url,
    loan_collateral_doc_2_check: l.loan_collateral_doc_2_url ? 1 : 0,
    loan_tag:l.loan_tag ?? "",
    loan_note:l.loan_note ?? "",
  })

},{immediate:true})




watch(
  () => [form.loan_startdate, form.loan_peroid, form.loantype_id],
  ([start, period, loantype]) => {
    if (!start || !period || loantype === undefined || loantype === null) return

    const startDate = new Date(start)
    form.loan_startdate = String(start) // same as loan_startdate.val(startdate)

    let endDate = new Date(startDate)

    const loanTypeNum = Number(loantype)
    const periodNum = Number(period)
    if (loanTypeNum <= 31) {
      endDate.setMonth(endDate.getMonth() + periodNum)
      endDate.setDate(endDate.getDate() - 1)
    } else if (loanTypeNum === 32) {
      endDate.setDate(endDate.getDate() + periodNum * 7 - 1)
    } else if (loanTypeNum === 35) {
      endDate.setDate(endDate.getDate() + periodNum * 10 - 1)
    } else {
      endDate.setDate(endDate.getDate() + periodNum - 1)
    }
    // Format as YYYY-MM-DD
    form.loan_enddate = endDate.toISOString().split("T")[0] ?? ""
  }
)

/* VALIDATION */
const MIN_FILE_SIZE = 2.01 * 1024 * 1024       // 2MB
const schema = z.object({
  cust_id:z.number().min(1,"Please select"),
  currency_id:z.number().min(1,"Please select"),
  loan_lastcash:z.coerce.number().min(0,"Required"),
  loan_newcash:z.coerce.number().min(0,"Required"),
  loan_totalcash:z.coerce.number().min(0,"Required"),
  loan_principle:z.coerce.number().min(0,"Required"),
  source_money:z.string().nonempty("Required"),
  loantype_id:z.number().min(1,"Please select"),
  loan_over_draft: z.coerce.number().optional(),
  payback_id:z.number().min(1,"Please select"),
  loan_peroid:z.coerce.number().min(1,"Required"),
  loan_startdate:z.string().nonempty("Required"),
  loan_first_paid_date:z.string().nonempty("Required"),
  loan_enddate:z.string().nonempty("Required"),
  loan_interest_rate:z.coerce.number().min(0.000001,"Required"),
  invoice_id:z.string().optional(),
  loan_status_id:z.number().min(1,"Please select"),
  loan_check_status:z.number().optional(),
  cust_comission_id:z.number().min(1,"Please select"),
  cust_comission_interest_rate:z.coerce.number().min(0,"Required"),
  cust_loangroup_id:z.number().min(1,"Please select"),
  active:z.number().min(1,"required"),
  cust_guarantor_id:z.number().optional(),
  cust_position_loangroup_id:z.number().min(1,"Please select"),
  loan_collateral_1:z.string().optional(),
  loan_collateral_map_link_1:z.string().optional(),
  loan_collateral_doc_1:z
      .any()
      .optional()
      .nullable()
      .refine((file) => {
        if (!file) return true
        const f = file instanceof File ? file : file?.[0]
        if (!f) return true
        return f.size <= MIN_FILE_SIZE
      }, { message: 'Size must be less than 2MB' }),
  loan_collateral_2:z.string().optional(),
  loan_collateral_map_link_2:z.string().optional(),
  loan_collateral_doc_2:z
      .any()
      .optional()
      .nullable()
      .refine((file) => {
        if (!file) return true
        const f = file instanceof File ? file : file?.[0]
        if (!f) return true
        return f.size <= MIN_FILE_SIZE
      }, { message: 'Size must be less than 2MB' }),
  loan_tag:z.string().optional(),
  loan_note:z.string().optional()
})

  type FileKey = 'loan_collateral_doc_1' | 'loan_collateral_doc_2';

  type FileItem  = {
  file: File | null;
  src: string | null;
  check: boolean;
}

  const images: Record<FileKey, FileItem> = {
    loan_collateral_doc_1: { file: null, src: null, check: false },
    loan_collateral_doc_2: { file: null, src: null, check: false },
  };

  const updateFromBackend = (key: FileKey, url: string | null) => {
    images[key].file = null;
    images[key].src = url ? '/storage/' + url + '?v=' + Date.now() : null;
    images[key].check = !!url;
  };

/* UPDATE */
const updateForm = async () => {
  loading.value = true
  errorMsg.value = ""
  successMsg.value = ""

  // ⭐ set principle start date
  form.loan_startdate_principle = form.loan_startdate

  // clear old errors
  Object.keys(errors).forEach(k => errors[k] = "")

  // console.log("FORM BEFORE PARSE:", form)

  // Clean numeric fields before validation
  const newForm = { ...form }

  // compress
  // newForm.loan_collateral_doc_1 = form.loan_collateral_doc_1
  // newForm.loan_collateral_doc_2 = form.loan_collateral_doc_2

  const numericFields: (keyof typeof form)[] = [
    "loan_lastcash",
    "loan_newcash",
    "loan_totalcash",
    "loan_principle",
    "loan_over_draft",
    "loan_interest_rate",
    "cust_comission_interest_rate",
    "loan_peroid",
    "currency_id",
    "loantype_id",
    "payback_id",
    "loan_status_id",
    "loan_check_status",
    "cust_id",
    "cust_comission_id",
    "cust_loangroup_id",
    "cust_guarantor_id",
    "cust_position_loangroup_id",
    "active"
  ]

  if (!(newForm.loan_collateral_doc_1 instanceof File)) {
    newForm.loan_collateral_doc_1 = undefined
  }

  if (!(newForm.loan_collateral_doc_2 instanceof File)) {
    newForm.loan_collateral_doc_2 = undefined
  }

  numericFields.forEach(field => {
    const value = newForm[field]
    if (typeof value === "string") {
      // Remove commas and parse
      newForm[field] = parseFloat(value.replace(/,/g, '')) || 0
    } else {
      newForm[field] = Number(value) || 0
    }
  })

  try {
    // console.log("FORM CLEANED:", newForm)
    const parsed = schema.safeParse(newForm)

    if (!parsed.success) {
      const errorList: string[] = []
      parsed.error.errors.forEach((e) => {
        const field = e.path.join('.')
        errors[field] = e.message
        errorList.push(`${field}: ${e.message}`)
      })
      errorMsg.value = "Please fix the validation errors before submitting."
      loading.value = false
      showToast(
        `Please fill the validation.`,
        `Please fill the validation fields.`,
        `error`
      )
      return
    }

    // console.log("PARSED FORM:", parsed)
    const fd = new FormData()
    const formDataObj = parsed.data
    Object.entries(formDataObj).forEach(([k, v]) => {
      if (v === -1 || v === "") {
        fd.append(k, "")
      } else {
        fd.append(k, String(v))
      }
    })

    // files
    if (newForm.loan_collateral_doc_1 && form.loan_collateral_doc_1_check) fd.append("loan_collateral_doc_1", newForm.loan_collateral_doc_1)
    if (newForm.loan_collateral_doc_2 && form.loan_collateral_doc_2_check) fd.append("loan_collateral_doc_2", newForm.loan_collateral_doc_2)

    // flags
    if (form.loan_collateral_doc_1_check) fd.append("loan_collateral_doc_1_check", "1")
    if (form.loan_collateral_doc_2_check) fd.append("loan_collateral_doc_2_check", "1")

    fd.append("_method", "PUT")

    /* ✅ REQUEST */
    await $fetch(`/api/admin-secure/loanrecords/${id}`, {
      method: "POST",
      body: fd
    })

    successMsg.value = "Loan updated successfully!"

    showToast(
      `ID #${id}`,
      `Updated successfully!`,
      `success`
    )

    // ✅ REFRESH IMAGE FROM BACKEND
    const refreshed = await $fetch<{ succes: number, data: any }>(`/api/admin-secure/loanrecords/${id}`)
    updateFromBackend("loan_collateral_doc_1", refreshed.data.loan_collateral_doc_1_url)
    updateFromBackend("loan_collateral_doc_2", refreshed.data.loan_collateral_doc_2_url)

  } catch (err: any) {

    if (err.errors) {
      err.errors.forEach((e: any) => {
        errors[e.path[0]] = e.message
      })
    } else {
      errorMsg.value = "Error while saving"
    }

  } finally {
    loading.value = false
  }

}


/* Native select2 */
// Search input
const search = ref("")
const isOpen = ref(false)
const highlightedIndex = ref(0)

// Filtered customers
const filteredCustomers = computed(() => {
  if (!search.value) return customerName1.value
  const term = search.value.toLowerCase()
  return customerName1.value.filter(c =>
    String(c.id).includes(term) || c.label.toLowerCase().includes(term)
  )
})

// Select an item
function selectCustomer(c: { id: number; label: string }) {
  form.cust_id = c.id
  search.value = c.label
  isOpen.value = false
  highlightedIndex.value = 0
}

// Keyboard navigation
function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === "ArrowDown") {
    highlightedIndex.value =
      (highlightedIndex.value + 1) % filteredCustomers.value.length
    e.preventDefault()
  } else if (e.key === "ArrowUp") {
    highlightedIndex.value =
      (highlightedIndex.value - 1 + filteredCustomers.value.length) %
      filteredCustomers.value.length
    e.preventDefault()
  } else if (e.key === "Enter") {
    selectCustomer(filteredCustomers.value[highlightedIndex.value])
    e.preventDefault()
  } else if (e.key === "Escape") {
    isOpen.value = false
  }
}

// Click outside to close dropdown
function clickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest(".select-container")) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", clickOutside)
})

// Keep <select> in sync with custom input
watch(form, () => {
  const selected = customerName1.value.find(c => c.id === form.cust_id)
  if (selected) search.value = selected.label
})

/*  end Native select2 */

function onInput<K extends keyof typeof form>(event: Event, field: K) {
  const target = event.target as HTMLInputElement
  if (!target) return

  // Remove commas
  const cleanValue = target.value.replace(/,/g, '')

  // Parse number safely
  const numericValue = parseFloat(cleanValue)
  form[field] = isNaN(numericValue) ? 0 : numericValue

  // Update the input display with formatted value
  target.value = form[field].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

}




  const isloan_collateral_map_link_1_Valid = computed(() => {
    return form.loan_collateral_map_link_1
  })
  const isloan_collateral_map_link_2_Valid = computed(() => {
    return form.loan_collateral_map_link_2
  })
  const openLink = (url: string) => {
    if (!url) return
    window.open(url, '_blank')
  }

const onFileDocChange1 = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // ✅ validate pdf
  if (!file.type.includes("pdf")) {
    errors.loan_collateral_doc_1 = "Only PDF allowed";
    return;
  }

  errors.loan_collateral_doc_1 = "";

  // ✅ revoke old preview
  if (form.loan_collateral_doc_1_src) {
    URL.revokeObjectURL(form.loan_collateral_doc_1_src);
  }

  // ✅ store file (correct)
  form.loan_collateral_doc_1 = file;

  // ✅ must be number for Laravel
  form.loan_collateral_doc_1_check = 1;

  // ✅ preview
  form.loan_collateral_doc_1_src = URL.createObjectURL(file);
};



const onFileDocChange2 = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // ✅ validate pdf
  if (!file.type.includes("pdf")) {
    errors.loan_collateral_doc_2 = "Only PDF allowed";
    return;
  }

  errors.loan_collateral_doc_2 = "";

  // ✅ revoke old preview
  if (form.loan_collateral_doc_2_src) {
    URL.revokeObjectURL(form.loan_collateral_doc_2_src);
  }

  // ✅ store file (correct)
  form.loan_collateral_doc_2 = file;

  // ✅ must be number for Laravel
  form.loan_collateral_doc_2_check = 1;

  // ✅ preview
  form.loan_collateral_doc_2_src = URL.createObjectURL(file);
};


  const formatFileSize = (size?: number) => {
    if (!size) return "";

    const kb = size / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";

    const mb = kb / 1024;
    return mb.toFixed(1) + " MB";
  };

  const getFileUrl = (src: string) => {
    if (!src) return '#'

    // already blob
    if (src.startsWith('blob:')) return src

    // already full URL (IMPORTANT FIX)
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src
    }
    

    // backend file
    return '/storage/' + src
  }

</script>


<template>

  <!-- Messages -->
  <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm">
    {{ errorMsg }}
  </div>
  <div v-if="successMsg" class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm">
    {{ successMsg }}
  </div>

  <div v-if="loanrecord" class="grid grid-cols-1 lg:grid-cols-3 gap-4">

    <ComponentCard title="1. General Information">

      <!-- cust_id -->
      <CommonCustomerSelect2
        label="Customer"
        v-model="form.cust_id"
        :required=true
        :error="errors.cust_id"
        :options="customerName1"
      />

      <!-- currency_id -->
      <div>
        <div class="flex items-center justify-between">
          <label class="label">Currency<span class="text-red-500 text-sm"> *</span></label>
          <span class="text-red-500 text-sm">{{ errors.currency_id }}</span>
        </div>
        <select v-model.number="form.currency_id" class="input">
          <option v-for="c in currencies" :key="c.id" :value="c.id">
            {{ c.label }}
          </option>
        </select>
      </div>

        <!-- loan_lastcash -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Last Cash<span class="text-red-500 text-sm"> *</span></label>
            <span class="text-red-500 text-sm">{{ errors.loan_lastcash }}</span>
          </div>
          <!-- <input v-model.number="form.loan_lastcash" type="number" class="input"/> -->
          <input
            type="text"
            class="input"
            :value="form.loan_lastcash.toLocaleString()"
            @input="(e) => onInput(e, 'loan_lastcash')"
          />
        </div>

      <!-- loan_newcash -->
      <div>
        <div class="flex items-center justify-between">
          <label class="label">New Cash<span class="text-red-500 text-sm"> *</span></label>
          <span class="text-red-500 text-sm">{{ errors.loan_newcash }}</span>
        </div>
        <!-- <input v-model.number="form.loan_newcash" type="number" class="input"/> -->
        <input
          type="text"
          class="input"
          :value="form.loan_newcash.toLocaleString()"
          @input="(e) => onInput(e, 'loan_newcash')"
        />
      </div>

    <!-- loan_totalcash -->
     <div>
      <div class="flex items-center justify-between">
        <label class="label">Total Cash<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.loan_totalcash }}</span>
      </div>
      <!-- <input v-model.number="form.loan_totalcash" type="number" class="input" readonly/> -->
        <input
          type="text"
          class="input bg-gray-100 cursor-not-allowed"
  :value="form.loan_totalcash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })"
          readonly
        />
    </div>

  <!-- loan_principle -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">Principle<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.loan_principle }}</span>
      </div>
      <!-- <input v-model.number="form.loan_principle" type="number" class="input"/> -->
        <input
          type="text"
          class="input"
          :value="form.loan_principle.toLocaleString()"
          @input="(e) => onInput(e, 'loan_principle')"
        />
    </div>

    <!-- source_money -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">Source Money<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.source_money }}</span>
      </div>
      <input
        v-model="form.source_money"
        list="sourceMoneyList"
        class="input"
        placeholder="Type source..."
      />
      <datalist id="sourceMoneyList">
        <option v-for="s in sourceMoneys" :key="s" :value="s" />
      </datalist>
    </div>

    <!-- loantype_id -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">Loan Type<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.loantype_id }}</span>
      </div>
      <select v-model.number="form.loantype_id" class="input">
        <option value="-1">Choose...</option>
        <option v-for="l in loanTypes" :key="l.id" :value="l.id">
          {{ l.label }}
        </option>
      </select>
    </div>

    <!-- loan_over_draft -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">Over Draft</label><span class="text-red-500 text-sm">{{ errors.loan_over_draft }}</span>
      </div>
      <!-- <input v-model.number="form.loan_over_draft" type="number" class="input"/> -->
        <input
          type="text"
          class="input"
          :value="form.loan_over_draft.toLocaleString()"
          @input="(e) => onInput(e, 'loan_over_draft')"
        />
    </div>

    <!-- payback_id -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">Payback<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.payback_id }}</span>
      </div>
      <select v-model.number="form.payback_id" class="input">
        <option value="-1">Choose...</option>
        <option v-for="l in paybacks" :key="l.id" :value="l.id">
          {{ l.label }}
        </option>
      </select>
    </div>

    <!-- loan_peroid -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">Loan Period<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.loan_peroid }}</span>
      </div>
      <input v-model.number="form.loan_peroid" type="number" class="input"/>
    </div>

    <!-- loan_startdate -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">Start Date<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.loan_startdate }}</span>
      </div>
      <input v-model="form.loan_startdate" type="date" class="input"/>
    </div>

    <!-- loan_first_paid_date -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">First Paid Date<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.loan_first_paid_date }}</span>
      </div>
      <input v-model="form.loan_first_paid_date" type="date" class="input"/>
    </div>

    <!-- loan_enddate -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">End Date<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.loan_enddate }}</span>
      </div>
      <input v-model="form.loan_enddate" type="date" class="input"/>
    </div>

    <!-- loan_interest_rate -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">Interest Rate (%) <span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.loan_interest_rate }}</span>
      </div>
      <input v-model.number="form.loan_interest_rate" type="number" step="0.01" class="input"/>
    </div>

    </ComponentCard>


  <!-- MIDDLE -->
  <ComponentCard title="2. Guarantor/Comission">

      <!-- cust_comission_id -->
      <CommonCustomerSelect2
        label="Comission Customer"
        v-model="form.cust_comission_id"
        :required=true
        :error="errors.cust_comission_id"
        :options="customerName1"
      />
      <!-- <div>
        <label class="label">Comission Customer<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.cust_comission_id }}</span>
        <select v-model.number="form.cust_comission_id" class="input">
          <option value="-1">Choose ...</option>
          <option v-for="c in customerName1" :key="c.id" :value="c.id">
            {{ String(c.id).padStart(8, '0') }} - {{ c.label }}
          </option>
        </select>
      </div> -->
  
      <!-- cust_comission_interest_rate -->
      <div>
        <label class="label">Comission Interest Rate (%)<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.cust_comission_interest_rate }}</span>
        <input v-model.number="form.cust_comission_interest_rate" type="number" step="0.01" class="input"/>
      </div>

       <!-- cust_loangroup_id -->
      <CommonCustomerSelect2
        label="Loan Group"
        v-model="form.cust_loangroup_id"
        :required=true
        :error="errors.cust_loangroup_id"
        :options="customerName1"
      />
       <!-- <div>
        <label class="label">Loan Group<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.cust_loangroup_id }}</span>
        <select v-model.number="form.cust_loangroup_id" class="input">
          <option value="-1">Choose ...</option>
          <option v-for="c in customerName1" :key="c.id" :value="c.id">
            {{ String(c.id).padStart(8, '0') }} - {{ c.label }}
          </option>
        </select>
      </div> -->

      <!-- cust_guarantor_id -->
      <CommonCustomerSelect2
        label="Guarantor Customer"
        v-model="form.cust_guarantor_id"
        :required=false
        :error="errors.cust_guarantor_id"
        :options="customerName1"
      />
      <!-- <div>
        <label class="label">Guarantor Customer</label>
        <select v-model.number="form.cust_guarantor_id" class="input">
          <option value="-1">Choose ...</option>
          <option v-for="c in customerName1" :key="c.id" :value="c.id">
            {{ String(c.id).padStart(8, '0') }} - {{ c.label }}
          </option>
        </select>
      </div> -->

      <!-- cust_position_loangroup_id -->
      <div>
        <label class="label">Position in Loan Group<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.cust_position_loangroup_id }}</span>
        <select v-model.number="form.cust_position_loangroup_id" class="input">
          <option value="-1">Choose ...</option>
          <option v-for="c in loanGroupPositions" :key="c.id" :value="c.id">
            {{ c.label }}
          </option>
        </select>
      </div>

    <!-- invoice_id -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">Invoice ID</label>
      </div>
      <input v-model.number="form.invoice_id" type="text" class="input bg-gray-100 cursor-not-allowed" readonly/>
    </div>

    <!-- loan_status_id -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">Status<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.loan_status_id }}</span>
      </div>
      <select v-model.number="form.loan_status_id" class="input">
        <option value="-1">Choose...</option>
        <option v-for="l in loanStatuses" :key="l.id" :value="l.id">
          {{ l.label }}
        </option>
      </select>
    </div>

    <!-- loan_check_status -->
    <div :class="{ hidden: !(hasRole('admin') || hasRole('ceo')) }">
      <div class="flex items-center justify-between">
        <label class="label">Approver</label>
      </div>
      <select v-model.number="form.loan_check_status" class="input">
        <option v-for="l in loanCheckStatuses" :key="l.id" :value="l.id">
          {{ l.label }}
        </option>
      </select>
    </div>

  </ComponentCard>


  <!-- RIGHT -->
<ComponentGrowCard title="3. Collateral/Note" class="h-full">

  <!-- Collateral 1 -->
  <div>
    <div class="flex items-center justify-between">
      <label class="label !text-blue-900 text-bold -ml-1">Collateral 1 - Description</label>
      <span class="text-red-500 text-sm">{{ errors.loan_collateral_1 }}</span>
    </div>
    <textarea v-model="form.loan_collateral_1" class="input" rows="6"></textarea>
  </div>

  <!-- loan_collateral_map_link_1 -->
  <div>
    <div class="flex items-center justify-between">
      <label 
        :class="[
          'label',
          isloan_collateral_map_link_1_Valid ? 'cursor-pointer !text-blue-900' : 'text-gray-400'
        ]" 
        @click="isloan_collateral_map_link_1_Valid && openLink(form.loan_collateral_map_link_1)">
        Collateral 1 Map link <span v-if="isloan_collateral_map_link_1_Valid"> 📌</span>
      </label>
    </div>
    <input v-model="form.loan_collateral_map_link_1" class="input" />
  </div>

  <!-- loan_collateral_doc_1 -->
  <div>
    <div class="flex items-center justify-between">
      <label class="label">Collateral 1 - Document <span class="!text-red-300">PDF</span></label>
      <span class="text-red-500 text-sm">{{ errors.loan_collateral_doc_1 }}</span>
    </div>

    <input type="file" accept="application/pdf" @change="onFileDocChange1" class="input" />

    <!-- Show only link -->
    <div v-if="form.loan_collateral_doc_1_src" class="mt-3">
      <div class="relative group w-full">

        <!-- CLICKABLE LINK -->
        <a :href="getFileUrl(form.loan_collateral_doc_1_src)" target="_blank"
          class="flex items-center justify-between p-3 hover:bg-gray-50 transition">
          <!-- Left -->
          <div class="flex items-center gap-3">
            <!-- PDF Icon -->
            <div class="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg">
              PDF
            </div>

            <!-- File Info -->
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-800">
                {{ form.loan_collateral_doc_1?.name || 'document.pdf' }}
              </span>
              <span class="text-xs text-gray-500">
                {{ formatFileSize(form.loan_collateral_doc_1?.size) }}
              </span>
            </div>
          </div>

        </a>

        <!-- ✅ CHECK OVERLAY -->
        <div
          class="absolute bottom-1 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow flex items-center gap-2">
          <input type="checkbox" v-model="form.loan_collateral_doc_1_check" :true-value="1" :false-value="0"
            class="w-4 h-4 text-blue-600 rounded" />
          <span class="text-sm text-gray-700">Check</span>
        </div>

      </div>
    </div>
    
  </div>


   <div class="border-b border-gray-100 dark:border-gray-800 !pt-3"></div>


  <!-- Collateral 2 -->
  <div>
    <div class="flex items-center justify-between">
      <label class="label">Collateral 2</label>
      <span class="text-red-500 text-sm">{{ errors.loan_collateral_2 }}</span>
    </div>
    <textarea v-model="form.loan_collateral_2" class="input" rows="6"></textarea>
  </div>

  <!-- loan_collateral_map_link_2 -->
  <div>
    <div class="flex items-center justify-between">
      <label 
        :class="[
          'label',
          isloan_collateral_map_link_2_Valid ? 'cursor-pointer !text-blue-900' : 'text-gray-400'
        ]" 
        @click="isloan_collateral_map_link_2_Valid && openLink(form.loan_collateral_map_link_2)">
        Collateral 2 Map link <span v-if="isloan_collateral_map_link_2_Valid"> 📌</span>
      </label>
    </div>
    <input v-model="form.loan_collateral_map_link_2" class="input" />
  </div>

  <!-- loan_collateral_doc_2 -->
  <div>
    <div class="flex items-center justify-between">
      <label class="label">Collateral 2 - Document <span class="!text-red-300">PDF</span></label>
      <span class="text-red-500 text-sm">{{ errors.loan_collateral_doc_2 }}</span>
    </div>

    <input type="file" accept="application/pdf" @change="onFileDocChange2" class="input" />

    <!-- Show only link -->
    <div v-if="form.loan_collateral_doc_2_src" class="mt-3">
      <div class="relative group w-full">

        <!-- CLICKABLE LINK -->
        <a :href="getFileUrl(form.loan_collateral_doc_2_src)" target="_blank"
          class="flex items-center justify-between p-3 hover:bg-gray-50 transition">
          <!-- Left -->
          <div class="flex items-center gap-3">
            <!-- PDF Icon -->
            <div class="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg">
              PDF
            </div>

            <!-- File Info -->
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-800">
                {{ form.loan_collateral_doc_2?.name || 'document.pdf' }}
              </span>
              <span class="text-xs text-gray-500">
                {{ formatFileSize(form.loan_collateral_doc_2?.size) }}
              </span>
            </div>
          </div>

        </a>

        <!-- ✅ CHECK OVERLAY -->
        <div
          class="absolute bottom-1 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow flex items-center gap-2">
          <input type="checkbox" :true-value="1" :false-value="0" v-model="form.loan_collateral_doc_2_check"
            class="w-4 h-4 text-blue-600 rounded" />
          <span class="text-sm text-gray-700">Check</span>
        </div>

      </div>
    </div>

  </div>

  <div class="border-b border-gray-100 dark:border-gray-800 pt-3"></div>

    <!-- Tag -->
  <div>
    <label class="label">Tage</label>
    <input 
      v-model="form.loan_tag" 
      class="input"
    />
  </div>
  
  <!-- Note -->
  <div>
    <div class="flex items-center justify-between">
      <label class="label">Note</label>
      <span class="text-red-500 text-sm">{{ errors.loan_note }}</span>
    </div>
    <textarea v-model="form.loan_note" class="input" rows="6"></textarea>
  </div>

  <!-- BUTTON -->
  <template #footer>
<!-- Update Loan Button -->
<div>
  <button
    @click="updateForm"
    type="button"
    :disabled="loading"
    class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
  >
    <!-- Spinner Icon -->
    <svg
      v-if="loading"
      class="w-5 h-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>

    <span>{{ loading ? "Saving..." : "Update Loan" }}</span>
  </button>
</div>
  </template>
</ComponentGrowCard>

  </div>

</template>


<style scoped>
.label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #555;
}
.dark .label {
  color: #ccc;
}

.input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
}
/* Fix date input */
input[type="date"] { appearance: none; -webkit-appearance: none;}
.text-red-500 {
  color: #f56565;
}

.text-sm {
  font-size: 12px;
}


</style>