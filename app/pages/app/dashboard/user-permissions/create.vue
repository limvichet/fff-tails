<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "User Permissions", subTitle: "Create" }
})

useHead({
  title: "Create User",
  meta: [{ name: "user-permissions", content: "create user permissions" }],
})

import { z } from "zod"
import { reactive, onMounted, watch, ref } from "vue"
import ComponentCard from "@/components/common/ComponentCard.vue"
import PermissionTable from "@/components/forms/PermissionTable.vue"

const { successMsg, errorMsg, success } = useMessage()
const errors = reactive<Record<string, string>>({})
const loading = ref(false)

type APIResponse = {
  employees: Record<string, string>;
  roles: Record<string, string>;
}

// 👉 form state
const form = reactive({
  emp_id: -1,
  role_id: -1,
  email: "",
  password: "",
  active: true,
  identifier_token: "",
  permissions: {} as Record<string, number>,
  
  photo: null as File | null,
  photo_src: null as string | null,
  photo_check: false,
})

// 👉 metadata
const employees = ref<{ id: number; label: string }[]>([])
const roles = ref<{ id: number; label: string }[]>([])

// 👉 fetch metadata
const fetchFormData = async () => {
  try {
    const res = await $fetch<APIResponse>("/api/admin-secure/user-permissions-form-data")
    
    // Mapping object {"6": "Name"} to [{id: 6, label: "Name"}]
    const map = (obj: Record<string, string>) =>
      Object.entries(obj).map(([id, label]) => ({
        id: Number(id),
        label: String(label)
      }))

    employees.value = map(res.employees)
    roles.value = map(res.roles)
  } catch (err) {
    errorMsg.value = "Failed to load form data"
  }
}

onMounted(fetchFormData)

/* VALIDATION ZOD */
const schema = z.object({
  emp_id: z.number().min(1, "Please select an employee"),
  role_id: z.number().min(1, "Please select a role"),
  email: z.string().email("Invalid email address").min(1, "Required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  active: z.boolean(),
  identifier_token: z.string().optional(),
  permissions: z.record(z.string(), z.number()).optional()
})

const validateField = (field: keyof typeof schema.shape) => {
  try {
    const part = schema.pick({ [field]: true } as any)
    part.parse({ [field]: form[field as keyof typeof form] })
    errors[field as string] = ""
  } catch (err: any) {
    errors[field as string] = err.errors?.[0]?.message || ""
  }
}

// Watchers for real-time validation
watch(() => form.email, () => validateField("email"))
watch(() => form.password, () => validateField("password"))
watch(() => form.emp_id, () => validateField("emp_id"))
watch(() => form.role_id, () => validateField("role_id"))

const submitForm = async () => {
  loading.value = true
  errorMsg.value = null
  successMsg.value = null

  // Clear previous errors
  Object.keys(errors).forEach((k) => (errors[k] = ""))

  const parsed = schema.safeParse(form)

  if (!parsed.success) {
    parsed.error.errors.forEach((e) => {
      const field = e.path[0] as string
      errors[field] = e.message
    })
    errorMsg.value = "Please fix validation errors."
    loading.value = false
    return
  }

  try {
    const fd = new FormData()
    
    // Append fields
    fd.append("emp_id", String(form.emp_id))
    fd.append("role_id", String(form.role_id))
    fd.append("email", form.email)
    fd.append("password", form.password)
    fd.append("active", form.active ? "1" : "0")
    fd.append("identifier_token", form.identifier_token || "")

    if (form.photo && form.photo_check) {
      fd.append("photo", form.photo)
    }

    await $fetch("/api/admin-secure/users", {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" }
    })

    success("User created successfully!")
    await navigateTo("/app/dashboard/user-permissions")

  } catch (err: any) {
    if (err?.data?.errors) {
      Object.entries(err.data.errors).forEach(([field, messages]) => {
        errors[field] = (messages as string[])[0] || ""
      })
      errorMsg.value = "Backend validation failed."
    } else {
      errorMsg.value = err?.data?.message || "Error saving user"
    }
  } finally {
    loading.value = false
  }
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  form.photo = file
  form.photo_check = true
  const reader = new FileReader()
  reader.onload = () => (form.photo_src = reader.result as string)
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm">
      {{ errorMsg }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <ComponentCard title="Account Credentials">
        <div>
          <div class="flex items-center justify-between">
            <label class="label">Employee Name<span class="text-red-500">*</span></label>
            <span class="text-red-500 text-sm">{{ errors.emp_id }}</span>
          </div>
          <select v-model.number="form.emp_id" class="input">
            <option value="-1" disabled>Choose ...</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.label }}
            </option>
          </select>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label class="label">System Role<span class="text-red-500">*</span></label>
            <span class="text-red-500 text-sm">{{ errors.role_id }}</span>
          </div>
          <select v-model.number="form.role_id" class="input">
            <option value="-1" disabled>Choose ...</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.label }}
            </option>
          </select>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label class="label">Email Address<span class="text-red-500">*</span></label>
            <span class="text-red-500 text-sm">{{ errors.email }}</span>
          </div>
          <input type="email" v-model="form.email" class="input" placeholder="user@example.com" />
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label class="label">Password<span class="text-red-500">*</span></label>
            <span class="text-red-500 text-sm">{{ errors.password }}</span>
          </div>
          <input type="password" v-model="form.password" class="input" />
        </div>
      </ComponentCard>

      <ComponentCard title="Settings & Identity">
        <div>
          <label class="label">Identifier Token</label>
          <input type="text" v-model="form.identifier_token" class="input" />
        </div>

        <div class="flex items-center gap-2 mt-6">
          <input type="checkbox" id="user_active" v-model="form.active" class="w-4 h-4 text-blue-600" />
          <label for="user_active" class="label !mb-0">Active Account</label>
        </div>

        <div class="mt-4">
          <label class="label">Profile Photo</label>
          <input type="file" @change="onFileChange" class="input" />
          <div v-if="form.photo_src" class="mt-2 relative group w-32">
            <img :src="form.photo_src" class="w-32 h-32 object-cover rounded-lg border shadow-sm" />
            <div class="absolute top-1 right-1">
              <input type="checkbox" v-model="form.photo_check" class="w-4 h-4" />
            </div>
          </div>
        </div>
      </ComponentCard>

    </div>

    <div class="col-span-full">
    <ComponentCard title="6. User Permissions">
      <PermissionTable v-model="form.permissions" />
    </ComponentCard>
  </div>

    <div class="mt-6 flex justify-end gap-3">
      <button 
        @click="navigateTo('/app/dashboard/user-permissions')" 
        class="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 transition"
      >
        Cancel
      </button>
      <button 
        @click="submitForm"
        :disabled="loading"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center gap-2"
      >
        <Icon v-if="loading" name="svg-spinners:180-ring-with-bg" />
        {{ loading ? "Saving..." : "Save User" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.label { display: block; margin-bottom: 4px; font-size: 14px; color: #555; font-weight: 500; }
.dark .label { color: #ccc; }
.input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 8px 12px; background: transparent; transition: border 0.2s; }
.dark .input { border-color: #444; color: white; }
.input:focus { border-color: #3b82f6; outline: none; }
.text-red-500 { color: #ef4444; }
.text-sm { font-size: 12px; }
</style>