<script setup lang="ts">

  definePageMeta({
    layout: "auth",
    requiresAuth: true,
    breadcrumb: { title: "Loanrecords", subTitle: "Create" }
  })

  import { z } from "zod"
  import { ref, reactive, onMounted } from "vue"
  import ComponentCard from "@/components/common/ComponentCard.vue"
  import ComponentSubmitCard from "@/components/common/ComponentSubmitCard.vue"
  import type { LoanrecordFormDataResponse } from "~/types/loanrecord"

  const { successMsg, errorMsg, success } = useMessage()
  const loading = ref(false)
  const errors = reactive<Record<string,string>>({})

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
    try {
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
loanCheckStatuses.value = data.loanCheckStatuses ? map(data.loanCheckStatuses) : []
      loanGroupPositions.value = map(data.loanGroupPositions)
    } catch (err: any) {
      errorMsg.value = err?.statusMessage || "Failed to load form data"
    }
  }

  onMounted(fetchFormData)

  /* FORM */
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
    loan_collateral_2:"",
    loan_note:"",

    active:1,
    loan_check_status:0,
    loan_check_approver:0,
    loan_check_date:'',
    loan_startdate_principle:'',
  })

watchEffect(() => {
  const lastCash = Number(String(form.loan_lastcash).replace(/,/g, '') || 0)
  const newCash  = Number(String(form.loan_newcash).replace(/,/g, '') || 0)
  form.loan_totalcash = lastCash + newCash
})

// watch(
//   () => [form.loan_startdate, form.loan_peroid],
//   ([start, period]) => {
//     if (!start || !period) return

//     const d = new Date(start)
//     d.setMonth(d.getMonth() + Number(period))
//     form.loan_enddate = d.toISOString().split("T")[0] ?? ""
//   }
// )

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
  loan_collateral_2:z.string().optional(),
  loan_note:z.string().optional()
})

const validateField = (field: keyof typeof schema.shape) => {
  try {
    schema.shape[field].parse(form[field])
    errors[field] = ""
  } catch (err: any) {
    errors[field] = err.errors?.[0]?.message || ""
  }
}

Object.keys(schema.shape).forEach((field) => {
  watch(
    () => form[field as keyof typeof form],
    () => validateField(field as keyof typeof schema.shape)
  )
})

/* SUBMIT */
  const submitForm = async () => {
    loading.value = true
    errorMsg.value = null
    successMsg.value = null

    // ⭐ set principle start date
    form.loan_startdate_principle = form.loan_startdate


    Object.keys(errors).forEach((k) => (errors[k] = ""))

    try{
      // console.log("FORM BEFORE PARSE:", form)

      // 🔹 Clean numeric fields before validation
      const cleanedForm = { ...form }
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

      numericFields.forEach(field => {
        const value = cleanedForm[field]
        if (typeof value === "string") {
          // Remove commas and parse
          cleanedForm[field] = parseFloat(value.replace(/,/g, '')) || 0
        } else {
          cleanedForm[field] = Number(value) || 0
        }
      })

      const parsed = schema.safeParse(cleanedForm)

      if (!parsed.success) {
        // Populate errors object
        parsed.error.errors.forEach((e) => {
          const path = e.path[0]
          if (typeof path === 'string' || typeof path === 'number') {
            errors[path] = e.message
          }
        })
        errorMsg.value = "Please fix the validation errors before submitting."
        loading.value = false
        return
      }

      const body = parsed.data

      const safeBody = Object.fromEntries(
        Object.entries(body).map(([k, v]) => {
          if (v === "" || v === -1) return [k, null]
          return [k, v]
        })
      )

      const res = await $fetch<{ success: boolean; message: string; id: number }>("/api/admin-secure/loanrecords",{
        method:"POST",
        body: safeBody
      })

      success("Customer created successfully!")

      if (res && res.id) {
        await navigateTo(`/app/dashboard/loanrecords/${res.id}`)
      }

    } catch (err: any) {
      if (err.errors) {
        err.errors.forEach((e: any) => {
          const path = e.path[0]
          if (typeof path === 'string' || typeof path === 'number') {
            errors[path] = e.message
          }
        })
      } else {
        errorMsg.value = "Error while saving loanrecord"
      }
    } finally {
      loading.value = false
    }

  }


  // Filtered options
  const searchInput = ref("")
  const filteredCustomers = computed(() =>
    customerName1.value.filter(c =>
      c.label.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      String(c.id).includes(searchInput.value)
    )
  )



// computed formatted value
// const formattedLastCash = computed(() => {
//   return form.loan_lastcash
//     ? Number(form.loan_lastcash).toLocaleString()
//     : ''
// })

// Computed formatted strings
// const formattedLoanLastCash = computed(() => form.loan_lastcash.toLocaleString())
// const formattedLoanNewCash = computed(() => form.loan_newcash.toLocaleString())
// const formattedLoanTotalCash = computed(() => form.loan_totalcash.toLocaleString())
// const formattedLoanPrinciple = computed(() => form.loan_principle.toLocaleString())
// const formattedLoanOverDraft = computed(() => form.loan_over_draft.toLocaleString())


function onInput<K extends keyof typeof form>(event: Event, field: K) {
  const target = event.target as HTMLInputElement
  if (!target) return

  // Remove commas and parse number
  const numericValue = parseFloat(target.value.replace(/,/g, '')) || 0

  // Update only the target field
  form[field] = numericValue
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
  
<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

  <!-- LEFT -->
  <ComponentCard title="1. General Information">

    <!-- cust_id -->
    <div>
      <div class="flex items-center justify-between">
        <label class="label">Customer<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.cust_id }}</span>
      </div>
      <select v-model.number="form.cust_id" class="input" :class="{ 'input-invalid': errors.cust_id }">
        <option value="-1">Choose ...</option>
        <option v-for="c in customerName1" :key="c.id" :value="c.id">
          {{ String(c.id).padStart(8, '0') }} - {{ c.label }}
        </option>
      </select>
    </div>

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
      <!-- <input v-model.number="form.loan_lastcash" type="text" class="input" /> -->
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
      <!-- <input v-model.number="form.loan_newcash" type="text" class="input" /> -->
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
      <div>
        <label class="label">Comission Customer<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.cust_comission_id }}</span>
        <select v-model.number="form.cust_comission_id" class="input">
          <option value="-1">Choose ...</option>
          <option v-for="c in customerName1" :key="c.id" :value="c.id">
            {{ String(c.id).padStart(8, '0') }} - {{ c.label }}
          </option>
        </select>
      </div>
  
      <!-- cust_comission_interest_rate -->
      <div>
        <label class="label">Comission Interest Rate (%)<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.cust_comission_interest_rate }}</span>
        <input v-model.number="form.cust_comission_interest_rate" type="number" step="0.01" class="input"/>
      </div>

       <!-- cust_loangroup_id -->
       <div>
        <label class="label">Loan Group<span class="text-red-500 text-sm"> *</span></label>
        <span class="text-red-500 text-sm">{{ errors.cust_loangroup_id }}</span>
        <select v-model.number="form.cust_loangroup_id" class="input">
          <option value="-1">Choose ...</option>
          <option v-for="c in customerName1" :key="c.id" :value="c.id">
            {{ String(c.id).padStart(8, '0') }} - {{ c.label }}
          </option>
        </select>
      </div>

      <!-- cust_guarantor_id -->
      <div>
        <label class="label">Guarantor Customer</label>
        <select v-model.number="form.cust_guarantor_id" class="input">
          <option value="-1">Choose ...</option>
          <option v-for="c in customerName1" :key="c.id" :value="c.id">
            {{ String(c.id).padStart(8, '0') }} - {{ c.label }}
          </option>
        </select>
      </div>

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
      <input v-model.number="form.invoice_id" type="number" class="input" readonly/>
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
    <div>
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
<ComponentSubmitCard title="3. Collateral/Note" class="h-full">
  <!-- Collateral 1 -->
  <div>
    <div class="flex items-center justify-between">
      <label class="label">Collateral 1</label>
      <span class="text-red-500 text-sm">{{ errors.loan_collateral_1 }}</span>
    </div>
    <textarea v-model="form.loan_collateral_1" class="input" rows="6"></textarea>
  </div>

  <!-- Collateral 2 -->
  <div>
    <div class="flex items-center justify-between">
      <label class="label">Collateral 2</label>
      <span class="text-red-500 text-sm">{{ errors.loan_collateral_2 }}</span>
    </div>
    <textarea v-model="form.loan_collateral_2" class="input" rows="6"></textarea>
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
    <button
      @click="submitForm"
      :disabled="loading"
      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      {{ loading ? "Saving..." : "Create Loan" }}
    </button>
  </template>
</ComponentSubmitCard>

</div>



</template>

<style scoped>

.label{
display:block;
margin-bottom:4px;
font-size:14px;
color:#555;
}

.input{
width:100%;
border:1px solid #ddd;
border-radius:8px;
padding:8px 12px;
}


</style>