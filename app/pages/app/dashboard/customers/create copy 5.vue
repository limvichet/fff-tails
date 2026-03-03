<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
    <!-- LEFT 1 Basic -->
    <div class="space-y-4">
      <ComponentCard title="1. Basic">

        <!-- id -->
        <div class="hidden">
          <div class="flex items-center justify-between">
            <label class="label">ID</label><span class="text-red-500 text-sm">{{ errors.id }}</span>
          </div>
          <input v-model="form.id" type="text" class="input" />
        </div>

        <!-- cust_title_1 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Title</label><span class="text-red-500 text-sm">{{ errors.cust_title_1 }}</span>
          </div>
          <select v-model.number="form.cust_title_1" class="input">
            <option value="-1"> Choose one ... </option>
            <option v-for="dd in nameTitles" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
          </select>
        </div>

        <!-- cust_name_1 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Name</label><span class="text-red-500 text-sm">{{ errors.cust_name_1 }}</span>
          </div>
          <input v-model="form.cust_name_1" type="text" class="input" />
        </div>

        <!-- cust_dob_1 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Date of Birth</label><span class="text-red-500 text-sm">{{ errors.cust_dob_1 }}</span>
          </div>
          <input v-model="form.cust_dob_1" type="date" class="input" />
        </div>

          <!-- cust_idcardnum_1 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">ID Card Number</label><span class="text-red-500 text-sm">{{ errors.cust_idcardnum_1 }}</span>
          </div>
          <input v-model="form.cust_idcardnum_1" type="text" class="input" />
        </div>

        <!-- iden_id_1 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Identity Type</label><span class="text-red-500 text-sm">{{ errors.iden_id_1 }}</span>
          </div>
          <select v-model="form.iden_id_1" class="input">
            <option value="-1"> Choose one ... </option>
            <option v-for="dd in identifications" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
          </select>
        </div>
        
        <!-- cust_idcardnum_date_1 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Date Identification</label><span class="text-red-500 text-sm">{{ errors.cust_idcardnum_date_1 }}</span>
          </div>
          <input v-model="form.cust_idcardnum_date_1" type="date" class="input" />
        </div>
        
        <!-- idli_id_1 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Identification Licenses</label><span class="text-red-500 text-sm">{{ errors.idli_id_1 }}</span>
          </div>
          <select v-model="form.idli_id_1" class="input">
            <option value="-1"> Choose one ... </option>
            <option v-for="dd in idLicenses" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
          </select>
        </div>
        
        <!-- occu_id_1 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Occupation</label><span class="text-red-500 text-sm">{{ errors.occu_id_1 }}</span>
          </div>
          <select v-model="form.occu_id_1" class="input">
            <option value="-1"> Choose one ... </option>
            <option v-for="dd in occupations" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
          </select>
        </div>
        
        <!-- cust_phone_1 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Phone</label><span class="text-red-500 text-sm">{{ errors.cust_phone_1 }}</span>
          </div>
          <input v-model="form.cust_phone_1" type="text" maxlength="10" @input="form.cust_phone_1 = form.cust_phone_1.replace(/[^0-9]/g, '').slice(0, 10)" class="input" />
        </div>

      </ComponentCard>
    </div>

    <!-- Miiddle 2 Basic -->
     <div class="space-y-4">
      <ComponentCard title="2. Basic">

        <!-- cust_title_2 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Title</label><span class="text-red-500 text-sm">{{ errors.cust_title_2 }}</span>
          </div>
          <select v-model.number="form.cust_title_2" class="input">
            <option value="-1"> Choose one ... </option>
            <option v-for="dd in nameTitles" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
          </select>
        </div>

        <!-- cust_name_2 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Name</label><span class="text-red-500 text-sm">{{ errors.cust_name_2 }}</span>
          </div>
          <input v-model="form.cust_name_2" type="text" class="input" />
        </div>

        <!-- cust_dob_2 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Date of Birth</label><span class="text-red-500 text-sm">{{ errors.cust_dob_2 }}</span>
          </div>
          <input v-model="form.cust_dob_2" type="date" class="input" />
        </div>

          <!-- cust_idcardnum_2 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">ID Card Number</label><span class="text-red-500 text-sm">{{ errors.cust_idcardnum_2 }}</span>
          </div>
          <input v-model="form.cust_idcardnum_2" type="text" class="input" />
        </div>

        <!-- iden_id_2 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Identity Type</label><span class="text-red-500 text-sm">{{ errors.iden_id_2 }}</span>
          </div>
          <select v-model="form.iden_id_2" class="input">
            <option value="-1"> Choose one ... </option>
            <option v-for="dd in identifications" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
          </select>
        </div>

        <!-- cust_idcardnum_date_2 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Date Identification</label><span class="text-red-500 text-sm">{{ errors.cust_idcardnum_date_2 }}</span>
          </div>
          <input v-model="form.cust_idcardnum_date_2" type="date" class="input" />
        </div>
                
        <!-- idli_id_2 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Identification Licenses</label><span class="text-red-500 text-sm">{{ errors.idli_id_2 }}</span>
          </div>
          <select v-model="form.idli_id_2" class="input">
            <option value="-1"> Choose one ... </option>
            <option v-for="dd in idLicenses" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
          </select>
        </div>
                
        <!-- occu_id_2 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Occupation</label><span class="text-red-500 text-sm">{{ errors.occu_id_2 }}</span>
          </div>
          <select v-model="form.occu_id_2" class="input">
            <option value="-1"> Choose one ... </option>
            <option v-for="dd in occupations" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
          </select>
        </div>
                
        <!-- cust_phone_2 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Phone</label><span class="text-red-500 text-sm">{{ errors.cust_phone_2 }}</span>
          </div>
          <input v-model="form.cust_phone_2" type="text" maxlength="10" @input="form.cust_phone_1 = form.cust_phone_1.replace(/[^0-9]/g, '').slice(0, 10)" class="input" />
        </div>

      </ComponentCard>
     </div>

    <!-- RIGHT 3 Indentification photo-->
    <div class="space-y-4">
      <ComponentCard title="3. Identification Photo">
        
        <!-- img1 -->
        <div>
          <label class="label">ID Card Image 1</label>
          <input type="file" @change="onFileChange1" class="input" />
          <div v-if="form.image_src1" class="mt-4">
            <div class="relative group w-full">
              <a :href="form.image_src1" target="_blank" rel="noopener noreferrer" class="block">
                <img :src="form.image_src1" @click="openImage1"
                  class="w-full h-70 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" />
              </a>
              <div
                class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none">
                <input type="checkbox" v-model="form.check_image1"
                  class="w-4 h-4 text-blue-600 rounded pointer-events-auto" />
                <span class="text-sm text-gray-700">Check</span>
              </div>
            </div>
          </div>
        </div>

        <!-- img2 -->
        <div>
          <label class="label">ID Card Image 2</label>
          <input type="file" @change="onFileChange2" class="input" />
          <div v-if="form.image_src2" class="mt-4">
            <div class="relative group w-full">
              <a :href="form.image_src2" target="_blank" rel="noopener noreferrer" class="block">
                <img :src="form.image_src2" @click="openImage2"
                  class="w-full h-70 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" />
              </a>
              <div
                class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none">
                <input type="checkbox" v-model="form.check_image2"
                  class="w-4 h-4 text-blue-600 rounded pointer-events-auto" />
                <span class="text-sm text-gray-700">Check</span>
              </div>
            </div>
          </div>
        </div>


        
      </ComponentCard>
    </div>


  <!-- Left 4.Bank Information -->
  <div>
    <ComponentCard title="4.Bank Infomation">

        <!-- cust_account_num -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Account Number</label><span class="text-red-500 text-sm">{{ errors.cust_account_num }}</span>
          </div>
          <input v-model="form.cust_account_num" type="text" maxlength="10" @input="form.cust_account_num = form.cust_account_num.replace(/[^0-9]/g, '').slice(0, 10)" class="input" />
        </div>

        <!-- cust_atm_num -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">ATM Number</label><span class="text-red-500 text-sm">{{ errors.cust_atm_num }}</span>
          </div>
          <input v-model="form.cust_atm_num" type="text" @input="form.cust_atm_num = form.cust_atm_num.replace(/[^0-9]/g, '').slice(0, 10)" class="input" />
        </div>

        <!-- cust_facebook -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Facebook</label><span class="text-red-500 text-sm">{{ errors.cust_facebook }}</span>
          </div>
          <input v-model="form.cust_facebook" type="text" class="input" />
        </div>

        <!-- cust_telegram -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Telegram</label><span class="text-red-500 text-sm">{{ errors.cust_telegram }}</span>
          </div>
          <input v-model="form.cust_telegram" type="text" class="input" />
        </div>

    </ComponentCard>
  </div>

  <!-- Right 5.Address Information -->
  <div class="sm:col-span-2">
    <ComponentCard title="5.Address Infomation"> 

      <!-- cust_address -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Address</label><span class="text-red-500 text-sm">{{ errors.cust_address }}</span>
          </div>
          <textarea v-model="form.cust_address" class="input" rows="9" />
        </div>

      <!-- submit -->  
      <div class="flex justify-end mt-4">
        <button
          @click="submitForm"
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {{ loading ? "Saving..." : "Save Customer" }}
        </button>
      </div>

    </ComponentCard>
  </div>

</div>

</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { ref, reactive, onMounted } from 'vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import type { CustomerFormDataResponse } from '~/types/customer'

const { successMsg, errorMsg } = useMessage()

// --- Form Data & Select Options ---
const customerFormData = ref<CustomerFormDataResponse | null>(null)
const nameTitles = ref<Array<{ id: number; label: string }>>([])
const identifications = ref<Array<{ id: number; label: string }>>([])
const idLicenses = ref<Array<{ id: number; label: string }>>([])
const occupations = ref<Array<{ id: number; label: string }>>([])

const fetchCustomerFormData = async () => {
  try {
    const data = await $fetch('/api/admin-secure/customers-form-data')
    customerFormData.value = {
      ...data,
      nameTitles: Object.entries(data.nameTitles).map(([id, label]) => ({ id: Number(id), label: String(label) })),
      identifications: Object.entries(data.identifications).map(([id, label]) => ({ id: Number(id), label: String(label) })),
      idLicenses: Object.entries(data.idLicenses).map(([id, label]) => ({ id: Number(id), label: String(label) })),
      occupations: Object.entries(data.occupations).map(([id, label]) => ({ id: Number(id), label: String(label) })),
    }
    nameTitles.value = customerFormData.value.nameTitles
    identifications.value = customerFormData.value.identifications
    idLicenses.value = customerFormData.value.idLicenses
    occupations.value = customerFormData.value.occupations
  } catch (err: any) {
    errorMsg.value = err?.statusMessage || 'Failed to load customer form data'
  }
}

onMounted(fetchCustomerFormData)

// --- Form State ---
const form = reactive({
  id: '',
  cust_title_1: -1,
  cust_name_1: '',
  cust_dob_1: '',
  cust_idcardnum_1: '',
  iden_id_1: -1,
  cust_idcardnum_date_1: '',
  idli_id_1: -1,
  occu_id_1: -1,
  cust_phone_1: '',

  cust_title_2: '',
  cust_name_2: '',
  cust_dob_2: '',
  cust_idcardnum_2: '',
  iden_id_2: -1,
  cust_idcardnum_date_2: -1,
  idli_id_2: -1,
  occu_id_2: -1,
  cust_phone_2: '',

  cust_account_num: '',
  cust_atm_num: '',
  cust_facebook: '',
  cust_telegram: '',

  cust_address: '',

  active: '1',
  check_image1: false,
  image1: null as File | null,
  image_src1: null as string | null,

  check_image2: false,
  image2: null as File | null,
  image_src2: null as string | null,
})

const img1 = ref<File | null>(null)
const loading = ref(false)
const errors = reactive<Record<string, string>>({})

//  schema
const customerSchema = z.object({
  id: z.string().nonempty('Input is required'),
  cust_title_1: z.number().min(0, 'Please select one'),
  iden_id_1: z.number().min(0, 'Please select one'),
  idli_id_1: z.number().min(0, 'Please select one'),
  occu_id_1: z.number().min(0, 'Please select one'),
  cust_name_1: z.string().nonempty('Input is required'),
  cust_dob_1: z.string().nonempty('Input is required'),
  // iden_id_1: z.string().nonempty('Identity type is required'),
  cust_idcardnum_1: z.string().nonempty('Input is required'),
  cust_idcardnum_date_1: z.string().nonempty('Input is required'),
  // idli_id_1: z.string().nonempty('Issue place is required'),
  // occu_id_1: z.string().nonempty('Occupation is required'),
  cust_phone_1: z.string().nonempty('Input is required'),
  cust_address: z.string().nonempty('Input is required'),
  // active: z.enum(['0', '1']),
  // check_image1: z.boolean(),
})

const fieldsToValidate = [
  "cust_name_1",
  "cust_phone_1",
  "cust_address",
  "cust_idcardnum_1"
] as const

type LiveField = typeof fieldsToValidate[number] // "cust_name_1" | "cust_phone_1" | "cust_address" | "cust_idcardnum_1"

const validateField = (field: LiveField) => {
  try {
    const schemaForField = customerSchema.shape[field]
    schemaForField.parse(form[field])
    errors[field] = ""
  } catch (err: any) {
    errors[field] = err.errors?.[0]?.message || ""
  }
}


fieldsToValidate.forEach((field) => {
  watch(
    () => form[field],
    () => validateField(field)
  )
})






const openImage1 = () => {
  if (!form.image_src1) return

  const newTab = window.open()
  if (newTab) {
    newTab.document.write(`
      <html>
        <head><title>Preview</title></head>
        <body style="margin:0">
          <img src="${form.image_src1}" style="width:100%" />
        </body>
      </html>
    `)
    newTab.document.close()
  }
}

const openImage2 = () => {
  if (!form.image_src2) return

  const newTab = window.open()
  if (newTab) {
    newTab.document.write(`
      <html>
        <head><title>Preview</title></head>
        <body style="margin:0">
          <img src="${form.image_src2}" style="width:100%" />
        </body>
      </html>
    `)
    newTab.document.close()
  }
}


// --- Submit Form ---
const submitForm = async () => {
  loading.value = true
  Object.keys(errors).forEach(k => (errors[k] = ""))

  try {
    const parsed = customerSchema.parse(form) // validate entire form
    const fd = new FormData()
    Object.entries(parsed).forEach(([k, v]) => fd.append(k, String(v)))
    if (img1.value) fd.append("img1", img1.value)
    if (form.image2) fd.append("img2", form.image2)

    await $fetch("/api/admin-secure/customers", { method: "POST", body: fd })
    successMsg.value = "Customer created successfully!"
  } catch (err: any) {
    if (err.errors) err.errors.forEach((e: any) => (errors[e.path[0]] = e.message))
    else {
      errorMsg.value = "Error while saving customer"
      console.error(err)
    }
  } finally {
    loading.value = false
  }
}


// --- Page Meta ---
definePageMeta({
  layout: 'auth',
  requiresAuth: true,
  breadcrumb: { title: 'Customers', subTitle: 'Create' },
})


// img1
const props = defineProps<{ customer: any }>();

// Compute initial preview URL
const imgPreview1 = ref(
  props.customer
    ? `/storage/imgs/indentification/1/${props.customer.id}.jpg`
    : '/imgs/CardPhoto.png'
);

// Check if image exists (backend logic can prefill)
const checkImage1 = ref(
  props.customer ? 1 : 0
);

// Handle file change
const onFileChange1 = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length) {
    const file1 = target.files?.[0]
  if (!file1) {
    form.image1 = null
    form.check_image1 = false
    form.image_src1 = null
    return
  }

  form.image1 = file1
  form.check_image1 = true   // ✅ auto check here

  const reader = new FileReader()
  reader.onload = () => {
    form.image_src1 = reader.result as string
  }
  reader.readAsDataURL(file1)
  }
};

const onFileChange2 = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length) {
    const file2 = target.files?.[0]
  if (!file2) {
    form.image2 = null
    form.check_image2 = false
    form.image_src2 = null
    return
  }

  form.image2 = file2
  form.check_image2 = true   // ✅ auto check here

  const reader = new FileReader()
  reader.onload = () => {
    form.image_src2 = reader.result as string
  }
  reader.readAsDataURL(file2)
  }
};


// Remove image
// const removeImage1 = () => {
//   img1.value = null;
//   imgPreview1.value = '/imgs/CardPhoto.png';
//   checkImage1.value = 0;
// };

</script>

<style scoped>
.label { display: block; margin-bottom: 4px; font-size: 14px; color: #555; }
.input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 8px 12px; }
.text-red-500 { color: #f56565; }
.text-sm { font-size: 12px; }
</style>
