<script setup lang="ts">

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Customers", subTitle: "Create" }
})

import { z } from "zod"
import { reactive, ref, onMounted, watch } from "vue"
import ComponentCard from "@/components/common/ComponentCard.vue"
import ComponentSubmitCard from "@/components/common/ComponentSubmitCard.vue"
import type { CustomerFormDataResponse } from "~/types/customer"

const { successMsg, errorMsg, success } = useMessage()
const loading = ref(false)
const errors = reactive<Record<string, string>>({})
const formReady = ref(false)

/* FETCH FORM DATA */
const nameTitles = ref<Array<{ id: number; label: string }>>([])
const identifications = ref<Array<{ id: number; label: string }>>([])
const idLicenses = ref<Array<{ id: number; label: string }>>([])
const occupations = ref<Array<{ id: number; label: string }>>([])

const fetchCustomerFormData = async () => {
  try {
    const data = await $fetch<CustomerFormDataResponse>(
      "/api/admin-secure/customers-form-data"
    )

    const mapOptions = (obj: any) =>
      Object.entries(obj).map(([id, label]) => ({
        id: Number(id),
        label: String(label),
      }))

    nameTitles.value = mapOptions(data.nameTitles)
    identifications.value = mapOptions(data.identifications)
    idLicenses.value = mapOptions(data.idLicenses)
    occupations.value = mapOptions(data.occupations)

    formReady.value = true

  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to load form data"
  }
}

onMounted(fetchCustomerFormData)

/* FORM STATE */
const form = reactive({
  id: null as number | null,

  cust_title_1: -1,
  cust_name_1: "",
  cust_dob_1: "",
  cust_idcardnum_1: "",
  iden_id_1: -1,
  cust_idcardnum_date_1: "",
  idli_id_1: -1,
  occu_id_1: -1,
  cust_phone_1: "",

  cust_title_2: -1,
  cust_name_2: "",
  cust_dob_2: "",
  cust_idcardnum_2: "",
  iden_id_2: -1,
  cust_idcardnum_date_2: "",
  idli_id_2: -1,
  occu_id_2: -1,
  cust_phone_2: "",

  cust_account_num: "",
  cust_atm_num: "",
  cust_facebook: "",
  cust_telegram: "",
  cust_address: "",

  img1: null as File | null,
  img1_src: null as string | null,
  img1_check: false,

  img2: null as File | null,
  img2_src: null as string | null,
  img2_check: false,
})


/* VALIDATION ZOD */
const schema = z.object({
  // Primary ID
  id: z.number().nullable().optional(),

  // ===== Customer 1 (Required) =====
  cust_title_1: z.number().min(0, "Please select"),
  iden_id_1: z.number().min(0, "Please select"),
  idli_id_1: z.number().min(0, "Please select"),
  occu_id_1: z.number().min(0, "Please select"),

  cust_name_1: z.string().nonempty("Required"),
  cust_dob_1: z.string().nonempty("Required"),
  cust_idcardnum_1: z.string().nonempty("Required"),
  cust_idcardnum_date_1: z.string().nonempty("Required"),
  cust_phone_1: z.string().nonempty("Required"),
  cust_address: z.string().nonempty("Required"),

  // ===== Customer 2 (Optional Section) =====
  cust_title_2: z.number().optional(),
  iden_id_2: z.number().optional(),
  idli_id_2: z.number().optional(),
  occu_id_2: z.number().optional(),

  cust_name_2: z.string().optional(),
  cust_dob_2: z.string().optional(),
  cust_idcardnum_2: z.string().optional(),
  cust_idcardnum_date_2: z.string().optional(),
  cust_phone_2: z.string().optional(),

  // ===== Extra Optional Info =====
  cust_account_num: z.string().optional(),
  cust_atm_num: z.string().optional(),
  cust_facebook: z.string().optional(),
  cust_telegram: z.string().optional(),
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

  Object.keys(errors).forEach((k) => (errors[k] = ""))

  try {
    // console.log("FORM BEFORE PARSE:", form)
    const parsed = schema.parse(form)

    // console.log("PARSED FORM:", parsed)
    const fd = new FormData()

    Object.entries(parsed).forEach(([k, v]) => {
      // Convert -1 to null
      if (v === -1 || v === "") {
        fd.append(k, "")
      } else {
        fd.append(k, String(v))
      }
    })

    if (form.img1 && form.img1_check) fd.append("img1", form.img1)
    if (form.img2 && form.img2_check) fd.append("img2", form.img2)
    if (form.img1_check) fd.append("img1_check", "1")
    if (form.img2_check) fd.append("img2_check", "1")


    console.log("FORM DATA ENTRIES:", Array.from(fd.entries())) // debug

    const res =await $fetch<{ success: boolean; message: string; id: number }>("/api/admin-secure/customers", {
      method: "POST",
      body: fd,
    })

    success("Customer created successfully!")

    if (res && res.id) {
      await navigateTo(`/app/dashboard/customers/${res.id}`)
    }


  } catch (err: any) {
    if (err.errors) {
      err.errors.forEach((e: any) => {
        errors[e.path[0]] = e.message
      })
    } else {
      errorMsg.value = "Error while saving customer"
    }
  } finally {
    loading.value = false
  }
}

/* IMAGE HANDLER (Reusable) */
const handleImageChange = (
  event: Event,
  imageKey: "img1" | "img2",
  previewKey: "img1_src" | "img2_src",
  checkKey: "img1_check" | "img2_check"
) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    form[imageKey] = null
    form[previewKey] = null
    form[checkKey] = false
    return
  }

  form[imageKey] = file
  form[checkKey] = true

  const reader = new FileReader()
  reader.onload = () => (form[previewKey] = reader.result as string)
  reader.readAsDataURL(file)
}

const onFileChange1 = (e: Event) =>
  handleImageChange(e, "img1", "img1_src", "img1_check")

const onFileChange2 = (e: Event) =>
  handleImageChange(e, "img2", "img2_src", "img2_check")



const openImg1 = () => {
  if (!form.img1_src) return

  const newTab = window.open()
  if (newTab) {
    newTab.document.write(`
      <html>
        <head><title>Preview</title></head>
        <body style="margin:0">
          <img src="${form.img1_src}" style="width:100%" />
        </body>
      </html>
    `)
    newTab.document.close()
  }
}

const openImg2 = () => {
  if (!form.img2_src) return

  const newTab = window.open()
  if (newTab) {
    newTab.document.write(`
      <html>
        <head><title>Preview</title></head>
        <body style="margin:0">
          <img src="${form.img2_src}" style="width:100%" />
        </body>
      </html>
    `)
    newTab.document.close()
  }
}
</script>


<template>
  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
    <!-- LEFT 1 Basic -->
    <div class="space-y-4">
      <ComponentCard title="1. Basic">

        <!-- id -->
        <!-- <div class="" v-if="formReady">
          <div class="flex items-center justify-between">
            <label class="label">ID</label><span class="text-red-500 text-sm">{{ errors.id }}</span>
          </div>
          <input v-model="form.id" type="number" class="input"/>
        </div> -->

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
          <div v-if="form.img1_src" class="mt-4">
            <div class="relative group w-full">
              <a :href="form.img1_src" target="_blank" rel="noopener noreferrer" class="block">
                <img :src="form.img1_src" @click="openImg1"
                  class="w-full h-70 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" />
              </a>
              <div
                class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none">
                <input type="checkbox" v-model="form.img1_check"
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
          <div v-if="form.img2_src" class="mt-4">
            <div class="relative group w-full">
              <a :href="form.img2_src" target="_blank" rel="noopener noreferrer" class="block">
                <img :src="form.img2_src" @click="openImg2"
                  class="w-full h-70 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" />
              </a>
              <div
                class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none">
                <input type="checkbox" v-model="form.img2_check"
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
    <ComponentSubmitCard title="5.Address Infomation"> 

      <!-- cust_address -->
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Address</label><span class="text-red-500 text-sm">{{ errors.cust_address }}</span>
          </div>
          <textarea v-model="form.cust_address" class="input" rows="6" />
        </div>

      <!-- submit -->  
      <template #footer>
        <button
          @click="submitForm"
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {{ loading ? "Saving..." : "Save Customer" }}
        </button>
      </template>

    </ComponentSubmitCard>
  </div>

</div>

</template>



<style scoped>
.label { display: block; margin-bottom: 4px; font-size: 14px; color: #555; }
.input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 8px 12px; }
.text-red-500 { color: #f56565; }
.text-sm { font-size: 12px; }
</style>
