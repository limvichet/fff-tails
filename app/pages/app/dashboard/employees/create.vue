<script setup lang="ts">

  definePageMeta({
    layout: "auth",
    requiresAuth: true,
    breadcrumb: { title: "Employees", subTitle: "Create" }
  })

  useHead({
    title: "Create employees",
    meta: [{ name: "employees", content: "create employees" }],
  })

  import { z } from "zod"
  import { reactive, onMounted, watch } from "vue"
  import ComponentCard from "@/components/common/ComponentCard.vue"

  import ComponentGrowCard from "@/components/common/ComponentGrowCard.vue"
  import EducationTable from "@/components/forms/EducationTable.vue"
  import WorkHistoryTable from "@/components/forms/WorkHistoryTable.vue"

  const { successMsg, errorMsg, success } = useMessage()
  const errors = reactive<Record<string,string>>({})
  const loading = ref(false)
  errorMsg.value = null
  successMsg.value = null

  type APIResponse = {
      genders: Array<{ id: number; label: string }>;
      roles: Array<{ id: number; label: string }>;
      maritalStatuses: Array<{ id: number; label: string }>;
      statuses: Array<{ id: number; label: string }>;
      educations: string[];
      occupations: string[];
  }

  // 👉 form state
  const form = reactive({
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

  // 👉 metadata
  const genders = ref<any[]>([])
  const roles = ref<any[]>([])
  const maritalStatuses = ref<any[]>([])
  const occupations = ref<any[]>([])
  const statuses = ref<any[]>([])
  const educations = ref<any[]>([])

  // 👉 fetch metadata
  const fetchFormData = async () => {
    const res = await $fetch<APIResponse>("/admin-secure/employees-form-data")
    const map = (obj:any)=>
      Object.entries(obj).map(([id,label])=>({
          id:Number(id),
          label:String(label)
    }))
    genders.value = map(res.genders)
    roles.value = map(res.roles)
    maritalStatuses.value = map(res.maritalStatuses)
    statuses.value = map(res.statuses)
    educations.value = res.educations
    occupations.value = res.occupations
  }

  onMounted(fetchFormData)


  /* VALIDATION ZOD */
  // Replace your existing tableRowSchema with this:
  const tableEducationRowSchema = z.object({
    id: z.number().optional(),
    description: z.string().optional(),
    date: z.string().optional(),
  })
  const tableWorkHistoryRowSchema = z.object({
    id: z.number().optional(),
    description: z.string().optional(),
    date: z.string().optional(),
    end_date: z.string().optional()
  })
  const MIN_FILE_SIZE = 1.01 * 1024 * 1024       // 1MB
  const schema = z.object({
    surname: z.string().min(1, "Required"),
    first_name: z.string().min(1, "Required"),
    gender_id: z.number().min(0, "Required"),
    role_id: z.number().min(0, "Required"),
    dob: z.string().min(1, "Required"),
    hire_date: z.string().min(1, "Required"),
    leave_date: z.string().optional(),
    marital_status_id: z.number().min(0, "Required"),
    spouse_name: z.string().optional(),
    spouse_job: z.string().optional(),
    father_name: z.string().optional(),
    father_job: z.string().optional(),
    mother_name: z.string().optional(),
    mother_job: z.string().optional(),
    phone: z.string().min(1, "Required"),
    telegram: z.string().min(1, "Required"),
    facebook: z.string().min(1, "Required"),
    current_address: z.string().min(1, "Required"),
    note: z.string().optional(),
    guarantor_name: z.string().min(1, "Required"),
    guarantor_job: z.string().optional(),
    guarantor_working_place: z.string().optional(),
    guarantor_address: z.string().optional(),
    guarantor_phone: z.string().optional(),
    status_id: z.number().min(0, "Required"),
    education: z.array(tableEducationRowSchema).optional(),
    work_histories: z.array(tableWorkHistoryRowSchema).optional(),

    // Image Customer 1 (Optional)
    img1: z
      .any()
      .optional()
      .refine((file) => {
        if (!file) return true
        const f = file instanceof File ? file : file?.[0]
        if (!f) return true
        return f.size <= MIN_FILE_SIZE
      }, { message: 'Size must be less than 1MB' }),
    photo1: z
      .any()
      .optional()
      .refine((file) => {
        if (!file) return true
        const f = file instanceof File ? file : file?.[0]
        if (!f) return true
        return f.size <= MIN_FILE_SIZE
      }, { message: 'Size must be less than 1MB' }),
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




  // compressImage
  const compressImage = (file: File, maxSizeMB = 1): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        const scale = Math.sqrt((maxSizeMB * 1024 * 1024) / file.size);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              resolve(file); // fallback
            }
          },
          file.type,
          0.7 // quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const submitForm = async () => {
    loading.value = true
    errorMsg.value = null
    successMsg.value = null

    Object.keys(errors).forEach((k) => (errors[k] = ""))

    try {

      // ✅ compress images if larger than 1MB
      const compressIfNeeded = async (file: any) => {
        if (!file) return file;

        const f = file instanceof FileList ? file[0] : file;

        if (f && f.size > 1024 * 1024) {
          return await compressImage(f);
        }

        return f;
      };

      // 1. Log the raw form state before any processing
      console.log("Raw Form State:", JSON.parse(JSON.stringify(form)))

      // clone form to avoid mutating original
      // const newForm = { ...form };
      const newForm = JSON.parse(JSON.stringify(form));
      newForm.education = (form.education || []).filter(item => item.description && item.description.trim() !== "");
      newForm.work_histories = (form.work_histories || []).filter(item => item.description && item.description.trim() !== "");
      
      const numericFields: (keyof typeof form)[] = [
        "gender_id",
        "role_id",
        "marital_status_id",
        "status_id",
      ]

      numericFields.forEach(field => {
        const value = newForm[field]
        if (typeof value === "string") {
          // Remove commas and parse
          (newForm as any)[field] = parseFloat(value.replace(/,/g, '')) || 0
        } else {
          (newForm as any)[field] = Number(value) || 0
        }
      })

      // 2. Log processed object before Zod validation
      console.log("Processed Object (Pre-Validation):", newForm)

      newForm.img1 = await compressIfNeeded(form.img1);
      newForm.photo1 = await compressIfNeeded(form.photo1);

      const parsed = schema.safeParse(newForm)

      if (!parsed.success) {
        const errorList: string[] = []
        parsed.error.errors.forEach((e) => {
          const field = e.path.join('.')
          errors[field] = e.message
          errorList.push(`${field}: ${e.message}`)
        })

        errorMsg.value = errorList.join(' | ')
        // errorMsg.value = "Please fix the validation errors."
        return
      }

      const fd = new FormData()

      const formDataObj = parsed.data

      Object.entries(formDataObj).forEach(([k, v]) => {
        // Skip files, we handle them manually below
        if (k === 'img1' || k === 'photo1') return

        if (v === -1 || v === "" || v === null) {
          fd.append(k, "")
        } else if (Array.isArray(v)) {
          // If the array is empty, send an empty string. 
          // If it has data, stringify it.
          if (v.length === 0) {
            fd.append(k, "") 
          } else {
            fd.append(k, JSON.stringify(v))
          }
        } else {
          fd.append(k, String(v))
        }
      })


      // files
      if (newForm.img1 && form.img1_check) fd.append("img1", newForm.img1)
      if (newForm.photo1 && form.photo1_check) fd.append("photo1", newForm.photo1)

      // flags
      if (form.img1_check) fd.append("img1_check", "1")
      if (form.photo1_check) fd.append("photo1_check", "1")


      // 3. IMPORTANT: Log the actual FormData content
      // You cannot just console.log(fd). You must loop through it:
      console.log("--- Final FormData Sent to API ---")
      fd.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`${key}: [File] ${value.name} (${value.size} bytes)`)
        } else {
          console.log(`${key}:`, value)
        }
      })

      const res = await $fetch("/admin-secure/employees", {
        headers: {
          Accept: "application/json",
        },
        method: "POST",
        body: fd,
      })

      success("Employee created successfully!")

      if (res?.id) {
        await navigateTo(`/app/dashboard/employees/${res.id}`)
      }

    } catch (err: any) {
      if (err?.data?.errors) {
        const backendErrors = err.data.errors

        Object.entries(backendErrors).forEach(([field, messages]) => {
          errors[field] = (messages as string[])[0] || ""
        })

        // ✅ custom cases
        if (backendErrors.img1) {
          errorMsg.value = "Image 1 is invalid"
        } else if (backendErrors.cust_telegram) {
          errorMsg.value = "Telegram username is not valid"
        } else {
          errorMsg.value = Object.values(errors).find(e => e) || "Please fix the errors."
        }

      } else {
        errorMsg.value = err?.data?.message || "Error while saving customer"
      }
    } finally {
      loading.value = false
    }
  }


  /* IMAGE HANDLER (Reusable) */
  const handleImageChange = (
    event: Event,
    imageKey: "img1" | "photo1",
    previewKey: "img1_src" | "photo1_src",
    checkKey: "img1_check" | "photo1_check",
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

  const onFileChange3 = (e: Event) =>
    handleImageChange(e, "photo1", "photo1_src", "photo1_check")

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


  const openPhoto1 = () => {
    if (!form.photo1_src) return

    const newTab = window.open()
    if (newTab) {
      newTab.document.write(`
        <html>
          <head><title>Preview</title></head>
          <body style="margin:0">
            <img src="${form.photo1_src}" style="width:100%" />
          </body>
        </html>
      `)
      newTab.document.close()
    }
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

  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">

        <!-- 1. General -->
        <ComponentCard title="1. General">
            <!-- surname -->
            <div>
                <div class="flex items-center justify-between">
                    <label class="label">Surname<span class="text-red-500 text-sm"> *</span></label>
                    <span class="text-red-500 text-sm">{{ errors.surname }}</span>
                </div>
                <input type="text" class="input" v-model="form.surname" />
            </div>
            <!-- first_name -->
            <div>
                <div class="flex items-center justify-between">
                    <label class="label">First Name<span class="text-red-500 text-sm"> *</span></label>
                    <span class="text-red-500 text-sm">{{ errors.first_name }}</span>
                </div>
                <input type="text" class="input" v-model="form.first_name" />
            </div>
            <!-- gender_id -->
            <div>
                <div class="flex items-center justify-between">
                    <label class="label">Gender <span class="text-red-500 text-sm"> *</span></label><span
                        class="text-red-500 text-sm">{{ errors.gender_id }}</span>
                </div>
                <select v-model.number="form.gender_id" class="input">
                    <option value="-1" disabled> Choose ... </option>
                    <option v-for="dd in genders" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
                </select>
            </div>
            <!-- role_id as position -->
            <div>
                <div class="flex items-center justify-between">
                    <label class="label">Position <span class="text-red-500 text-sm"> *</span></label><span
                        class="text-red-500 text-sm">{{ errors.role_id }}</span>
                </div>
                <select v-model.number="form.role_id" class="input">
                    <option value="-1" disabled> Choose ... </option>
                    <option v-for="dd in roles" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
                </select>
            </div>
            <!-- dob -->
            <div>
                <div class="flex items-center justify-between">
                    <label class="label">Date of Birth <span class="text-red-500 text-sm"> *</span></label><span
                        class="text-red-500 text-sm">{{ errors.dob }}</span>
                </div>
                <input v-model="form.dob" type="date" class="input" />
            </div>
            <!-- hire_date -->
            <div>
                <div class="flex items-center justify-between">
                    <label class="label">Hire Date <span class="text-red-500 text-sm"> *</span></label><span
                        class="text-red-500 text-sm">{{ errors.hire_date }}</span>
                </div>
                <input v-model="form.hire_date" type="date" class="input" />
            </div>
            <!-- leave_date -->
            <div>
              <label class="label">Leave Date </label>
              <input v-model="form.leave_date" type="date" class="input" />
            </div>
        </ComponentCard>

        <!-- 2. Family -->
        <ComponentCard title="2. Family">

          <!-- marital_status_id -->
          <div>
              <div class="flex items-center justify-between">
                <label class="label">Marital <span class="text-red-500 text-sm"> *</span></label><span
                        class="text-red-500 text-sm">{{ errors.marital_status_id }}</span>
              </div>
              <select v-model="form.marital_status_id" class="input">
                <option value="-1">Choose ... </option>
                <option v-for="m in maritalStatuses" :key="m.id" :value="m.id">{{ m.label }}</option>
              </select>
          </div>
          <!-- spouse_name -->
          <div>
              <label class="label">Spouse</label>
              <input type="text" class="input" v-model="form.spouse_name" />
          </div>
          <!-- spouse_job -->
          <div>
              <label class="label">Spouse Job</label>
              <input type="text" class="input" v-model="form.spouse_job" />
          </div>
          <!-- father_name -->
          <div>
              <label class="label">Father</label>
              <input type="text" class="input" v-model="form.father_name" />
          </div>
          <!-- father_job -->
          <div>
              <label class="label">Father Job</label>
              <input type="text" class="input" v-model="form.father_job" />
          </div>
          <!-- mother_name -->
          <div>
              <label class="label">Mother</label>
              <input type="text" class="input" v-model="form.mother_name" />
          </div>
          <!-- mother_job -->
          <div>
              <label class="label">Mother Job</label>
              <input type="text" class="input" v-model="form.mother_job" />
          </div>

        </ComponentCard>

        <!-- 3. Contact -->
        <ComponentCard title="3. Contact">

            <!-- phone -->
            <div>
                <div class="flex items-center justify-between">
                    <label class="label">Phone<span class="text-red-500 text-sm"> *</span></label>
                    <span class="text-red-500 text-sm">{{ errors.phone }}</span>
                </div>
                <input type="text" class="input" v-model="form.phone" />
            </div>
            <!-- telegram -->
            <div>
                <div class="flex items-center justify-between">
                    <label class="label">Telegram<span class="text-red-500 text-sm"> *</span></label>
                    <span class="text-red-500 text-sm">{{ errors.telegram }}</span>
                </div>
                <input type="text" class="input" v-model="form.telegram" />
            </div>
            <!-- facebook -->
            <div>
                <div class="flex items-center justify-between">
                    <label class="label">Facebook<span class="text-red-500 text-sm"> *</span></label>
                    <span class="text-red-500 text-sm">{{ errors.facebook }}</span>
                </div>
                <input type="text" class="input" v-model="form.facebook" />
            </div>
            <!-- current_address -->
            <div>
              <div class="flex items-center justify-between">
                <label class="label">Address <span class="text-red-500 text-sm"> *</span></label><span
                  class="text-red-500 text-sm">{{ errors.current_address }}</span>
              </div>
              <textarea v-model="form.current_address" class="input" rows="2" />
            </div>
            <!-- note -->
            <div>
              <label class="label">Note </label>
              <textarea v-model="form.note" class="input" rows="3" />
            </div>

        </ComponentCard>

        <!-- 4. Guarantor -->
        <div>
          <ComponentCard title="4. Guarantor">
              <!-- guarantor_name -->
              <div>
                  <div class="flex items-center justify-between">
                      <label class="label">Name<span class="text-red-500 text-sm"> *</span></label>
                      <span class="text-red-500 text-sm">{{ errors.guarantor_name }}</span>
                  </div>
                  <input type="text" class="input" v-model="form.guarantor_name" />
              </div>
              <!-- guarantor_job -->
              <div>
                  <div class="flex items-center justify-between">
                      <label class="label">Job<span class="text-red-500 text-sm"> *</span></label>
                      <span class="text-red-500 text-sm">{{ errors.guarantor_job }}</span>
                  </div>
                  <input type="text" class="input" v-model="form.guarantor_job" />
              </div>
              <!-- guarantor_working_place -->
              <div>
                  <div class="flex items-center justify-between">
                      <label class="label">Working Place<span class="text-red-500 text-sm"> *</span></label>
                      <span class="text-red-500 text-sm">{{ errors.guarantor_working_place }}</span>
                  </div>
                  <input type="text" class="input" v-model="form.guarantor_working_place" />
              </div>
              <!-- guarantor_address -->
              <div>
                  <div class="flex items-center justify-between">
                      <label class="label">Address<span class="text-red-500 text-sm"> *</span></label>
                      <span class="text-red-500 text-sm">{{ errors.guarantor_address }}</span>
                  </div>
                  <input type="text" class="input" v-model="form.guarantor_address" />
              </div>
              <!-- guarantor_phone -->
              <div>
                  <div class="flex items-center justify-between">
                      <label class="label">Phone<span class="text-red-500 text-sm"> *</span></label>
                      <span class="text-red-500 text-sm">{{ errors.guarantor_phone }}</span>
                  </div>
                  <input type="text" class="input" v-model="form.guarantor_phone" />
              </div>
          </ComponentCard>

          <!-- 5. Status -->
          <ComponentCard title="5. Status" class="!mt-2">
              <!-- status_id -->
              <div>
                  <div class="flex items-center justify-between">
                    <label class="label">Status <span class="text-red-500 text-sm"> *</span></label><span
                            class="text-red-500 text-sm">{{ errors.status_id }}</span>
                  </div>
                  <select v-model="form.status_id" class="input">
                    <option value="-1">Choose ... </option>
                    <option v-for="m in statuses" :key="m.id" :value="m.id">{{ m.label }}</option>
                  </select>
              </div>
          </ComponentCard>

        </div>

    <!-- 6. Education -->
    <div class="col-span-1 sm:col-span-2 lg:col-span-2">

      <ComponentGrowCard title="6. Education & Work History">

        <EducationTable v-model="form.education" />
        <WorkHistoryTable v-model="form.work_histories" />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <!-- img1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">ID Card Image 1</label><span class="text-red-500 text-sm">{{ errors.img1 }}</span>
            </div>
            <input type="file" @change="onFileChange1" class="input" />
            <div v-if="form.img1_src" class="mt-4">
              <div class="relative group w-full">
                <a :href="form.img1_src" target="_blank" rel="noopener noreferrer" class="block">
                  <img :src="form.img1_src" @click="openImg1"
                    class="w-full h-50 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" />
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

          <!-- photo1 -->
          <div class="w-1/2">
            <div class="flex items-center justify-between">
              <label class="label">Photo 1</label><span class="text-red-500 text-sm">{{ errors.photo1 }}</span>
            </div>
            <input type="file" @change="onFileChange3" class="input" />
            <div v-if="form.photo1_src" class="mt-4">
              <div class="relative group w-full">
                <a :href="form.photo1_src" target="_blank" rel="noopener noreferrer" class="block">
                  <img :src="form.photo1_src" @click="openPhoto1"
                    class="w-full h-50 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" />
                </a>
                <div
                  class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none">
                  <input type="checkbox" v-model="form.photo1_check"
                    class="w-4 h-4 text-blue-600 rounded pointer-events-auto" />
                  <span class="text-sm text-gray-700">Check</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- submit -->
        <template #footer>
          <button @click="submitForm" :disabled="loading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
            <Icon v-if="loading" name="svg-spinners:180-ring-with-bg" class="text-lg" />
            {{ loading ? "Saving..." : "Save Employee" }}
          </button>
        </template>

      </ComponentGrowCard>

    </div>




  </div>

</template>

<style scoped>
.label { display: block; margin-bottom: 4px; font-size: 14px; color: #555; }
.dark .label { color: #ccc; }
.input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 8px 12px; }
/* Fix date input */
input[type="date"] { appearance: none; -webkit-appearance: none;}
.text-red-500 { color: #f56565; }
.text-sm { font-size: 12px; }
</style>
