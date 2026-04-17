<script setup lang="ts">
import { z } from "zod"
import { reactive, onMounted, watch, computed } from "vue"
import ComponentCard from "@/components/common/ComponentCard.vue"
import ComponentGrowCard from "@/components/common/ComponentGrowCard.vue"
import EducationTable from "@/components/forms/EducationTable.vue"
import WorkHistoryTable from "@/components/forms/WorkHistoryTable.vue"

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "Employees", subTitle: "Detail" }
})


useHead({
  title: "Edit Employees",
  meta: [{ name: "loanrecords", content: "edit employees" }],
})


const route = useRoute()
const id = route.params.id

useHead({
  title: "Employee Detail",
})

const { successMsg, errorMsg, success } = useMessage()
const loading = ref(false)
const formReady = ref(false)
const errors = reactive<Record<string, string>>({})

/* --- 1. METADATA & DATA FETCHING --- */
const genders = ref<any[]>([])
const roles = ref<any[]>([])
const maritalStatuses = ref<any[]>([])
const statuses = ref<any[]>([])

const fetchInitialData = async () => {
  try {
    const [meta, empRes] = await Promise.all([
      $fetch<any>("/api/admin-secure/employees-form-data"),
      $fetch<any>(`/api/admin-secure/employees/${id}`)
    ])

    const map = (obj: any) => Object.entries(obj).map(([id, label]) => ({ id: Number(id), label: String(label) }))
    
    genders.value = map(meta.genders)
    roles.value = map(meta.roles)
    maritalStatuses.value = map(meta.maritalStatuses)
    statuses.value = map(meta.statuses)

    // Fill form with employee data
    const emp = empRes.data || empRes
    syncFormWithData(emp)
    
    formReady.value = true
  } catch (err: any) {
    errorMsg.value = "Failed to load employee data"
  }
}

onMounted(fetchInitialData)

/* --- 2. FORM STATE --- */
const form = reactive({
  id: null as number | null,
  surname: "",
  first_name: "",
  gender_id: -1,
  role_id: -1,
  dob: "",
  hire_date: "",
  leave_date: "",
  marital_status_id: -1,
  spouse_name: "",
  spouse_job: "",
  father_name: "",
  father_job: "",
  mother_name: "",
  mother_job: "",
  phone: "",
  telegram: "",
  facebook: "",
  current_address: "",
  note: "",
  guarantor_name: "",
  guarantor_job: "",
  guarantor_working_place: "",
  guarantor_address: "",
  guarantor_phone: "",
  status_id: -1,
  education: [] as any[],
  work_histories: [] as any[],

  img1: null as File | null,
  img1_src: null as string | null,
  img1_check: false,
  photo1: null as File | null,
  photo1_src: null as string | null,
  photo1_check: false,
})

/* --- 3. HELPERS & SYNC --- */
function formatDateForInput(date: string | null) {
  if (!date) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
  const parts = date.split("-")
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : date
}

const syncFormWithData = (data: any) => {
  Object.assign(form, {
    ...data,
    dob: formatDateForInput(data.dob),
    hire_date: formatDateForInput(data.hire_date),
    leave_date: formatDateForInput(data.leave_date),
    img1_src: data.img1_url ?? null,
    photo1_src: data.photo1_url ?? null,
    img1_check: !!data.img1_url,
    photo1_check: !!data.photo1_url,
    education: data.education || [],
    work_histories: data.work_histories || []
  })
}

/* --- 4. IMAGE HANDLING --- */
const handleImageChange = (event: Event, imageKey: 'img1'|'photo1', previewKey: 'img1_src'|'photo1_src', checkKey: 'img1_check'|'photo1_check') => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  form[imageKey] = file
  form[checkKey] = true
  form[previewKey] = URL.createObjectURL(file)
}

const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    img.onload = () => {
      const scale = Math.sqrt((1024 * 1024) / file.size);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob ? new File([blob], file.name, { type: file.type }) : file), file.type, 0.7);
    };
    img.src = URL.createObjectURL(file);
  });
};

/* --- 5. SUBMIT --- */
const updateForm = async () => {
  loading.value = true
  errorMsg.value = ""
  
  try {
    const fd = new FormData()
    
    // Process standard fields
    Object.entries(form).forEach(([k, v]) => {
      if (['img1', 'photo1', 'img1_src', 'photo1_src', 'education', 'work_histories'].includes(k)) return
      fd.append(k, v === null || v === -1 ? "" : String(v))
    })

    // Process Tables
    fd.append("education", JSON.stringify(form.education.filter(i => i.description)))
    fd.append("work_histories", JSON.stringify(form.work_histories.filter(i => i.description)))

    // Process Files
    if (form.img1 && form.img1_check) {
        const file = form.img1.size > 1024 * 1024 ? await compressImage(form.img1) : form.img1
        fd.append("img1", file)
    }
    if (form.photo1 && form.photo1_check) {
        const file = form.photo1.size > 1024 * 1024 ? await compressImage(form.photo1) : form.photo1
        fd.append("photo1", file)
    }

    fd.append("img1_check", form.img1_check ? "1" : "0")
    fd.append("photo1_check", form.photo1_check ? "1" : "0")
    fd.append("_method", "PUT")

    await $fetch(`/api/admin-secure/employees/${id}`, { method: "POST", body: fd })
    
    success("Employee updated successfully!")
    const refreshed = await $fetch<any>(`/api/admin-secure/employees/${id}`)
    syncFormWithData(refreshed.data || refreshed)
    
  } catch (err: any) {
    errorMsg.value = err?.data?.message || "Error updating employee"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm">{{ errorMsg }}</div>
  <div v-if="successMsg" class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm">{{ successMsg }}</div>

  <div v-if="formReady" class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
    
    <div class="lg:col-span-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
      
      <ComponentCard title="1. Personal Info">
        <div>
          <label class="label">Surname *</label>
          <input v-model="form.surname" type="text" class="input" />
        </div>
        <div>
          <label class="label">First Name *</label>
          <input v-model="form.first_name" type="text" class="input" />
        </div>
        <div>
          <label class="label">Gender *</label>
          <select v-model.number="form.gender_id" class="input">
            <option v-for="g in genders" :key="g.id" :value="g.id">{{ g.label }}</option>
          </select>
        </div>
        <div>
          <label class="label">Position *</label>
          <select v-model.number="form.role_id" class="input">
            <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.label }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div><label class="label">DOB</label><input v-model="form.dob" type="date" class="input" /></div>
            <div><label class="label">Hire Date</label><input v-model="form.hire_date" type="date" class="input" /></div>
        </div>
      </ComponentCard>

      <ComponentCard title="2. Family & Contact">
        <div>
          <label class="label">Marital Status</label>
          <select v-model="form.marital_status_id" class="input">
            <option v-for="m in maritalStatuses" :key="m.id" :value="m.id">{{ m.label }}</option>
          </select>
        </div>
        <div><label class="label">Phone *</label><input v-model="form.phone" type="text" class="input" /></div>
        <div><label class="label">Telegram</label><input v-model="form.telegram" type="text" class="input" /></div>
        <div><label class="label">Address</label><textarea v-model="form.current_address" class="input" rows="2" /></div>
      </ComponentCard>

      <div class="lg:col-span-2">
        <ComponentGrowCard title="3. Education & Work History">
          <EducationTable v-model="form.education" />
          <WorkHistoryTable v-model="form.work_histories" />
        </ComponentGrowCard>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <ComponentCard title="4. Guarantor">
        <div><label class="label">Guarantor Name</label><input v-model="form.guarantor_name" type="text" class="input" /></div>
        <div><label class="label">Guarantor Phone</label><input v-model="form.guarantor_phone" type="text" class="input" /></div>
        <div><label class="label">Status</label>
          <select v-model="form.status_id" class="input">
            <option v-for="s in statuses" :key="s.id" :value="s.id">{{ s.label }}</option>
          </select>
        </div>
      </ComponentCard>

      <ComponentGrowCard title="5. Media">
        <div>
          <label class="label">ID Card Image</label>
          <input type="file" @change="e => handleImageChange(e, 'img1', 'img1_src', 'img1_check')" class="input" />
          <div v-if="form.img1_src" class="mt-2 relative">
            <img :src="form.img1_src" class="w-full h-32 object-cover rounded border" />
            <div class="absolute top-1 right-1 bg-white/80 p-1 rounded text-xs">
              <input type="checkbox" v-model="form.img1_check" /> Keep
            </div>
          </div>
        </div>
        <div class="mt-4">
          <label class="label">Photo</label>
          <input type="file" @change="e => handleImageChange(e, 'photo1', 'photo1_src', 'photo1_check')" class="input" />
          <div v-if="form.photo1_src" class="mt-2 relative">
            <img :src="form.photo1_src" class="w-full h-32 object-cover rounded border" />
            <div class="absolute top-1 right-1 bg-white/80 p-1 rounded text-xs">
              <input type="checkbox" v-model="form.photo1_check" /> Keep
            </div>
          </div>
        </div>

        <template #footer>
          <button @click="updateForm" :disabled="loading" class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
            {{ loading ? 'Saving...' : 'Update Employee' }}
          </button>
        </template>
      </ComponentGrowCard>
    </div>

  </div>
</template>

<style scoped>
.label { display: block; margin-bottom: 4px; font-size: 14px; color: #555; font-weight: 500; }
.input { width: 100%; border: 1px solid #ddd; border-radius: 6px; padding: 6px 10px; background: transparent; }
/* Fix date input */
input[type="date"] { appearance: none; -webkit-appearance: none;}
.dark .label { color: #ccc; }
.dark .input { border-color: #444; }
</style>