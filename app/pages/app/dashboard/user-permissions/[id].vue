<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: { title: "User Permissions", subTitle: "Edit" }
})

import { z } from "zod"
import { reactive, onMounted, watch, ref } from "vue"
import ComponentCard from "@/components/common/ComponentCard.vue"
import PermissionTable from "@/components/forms/PermissionTable.vue"

const route = useRoute()
const userId = route.params.id

const { successMsg, errorMsg, success } = useMessage()
const errors = reactive<Record<string, string>>({})
const loading = ref(false)

// Types
type Permission = { id: number; name: string; slug: string };
type RolePermission = { id: number; name: string; slug: string; permissions: Permission[]; }
type APIResponse = {
  employees: Record<string, string>;
  roles: Record<string, string>;
  role_permissions: RolePermission[];
}

// 👉 form state
const form = reactive({
  emp_id: -1,
  role_id: -1,
  email: "",
  password: "", // Keep empty if not changing
  active: true,
  identifier_token: "",
  permissions: {} as Record<string, number>,
})

// 👉 metadata
const employees = ref<{ id: number; label: string }[]>([])
const roles = ref<{ id: number; label: string }[]>([])
const rolePermissionsData = ref<RolePermission[]>([])

// 👉 Fetch form metadata AND existing user data
const initPage = async () => {
  try {
    // 1. Fetch Dropdown options and Role Permissions
    const meta = await $fetch<APIResponse>("/api/admin-secure/user-permissions-form-data")
    
    const map = (obj: Record<string, string>) =>
      Object.entries(obj).map(([id, label]) => ({
        id: Number(id),
        label: String(label)
      }))

    employees.value = map(meta.employees)
    roles.value = map(meta.roles)
    rolePermissionsData.value = meta.role_permissions

    // 2. Fetch existing User record
    const user = await $fetch<any>(`/api/admin-secure/user-permissions/${userId}`)
    
    // Populate form
    form.emp_id = Number(user.emp_id)
    form.role_id = Number(user.role_id)
    form.email = user.email
    form.active = Boolean(Number(user.active))
    form.identifier_token = user.identifier_token || ""
    
    // Populate permissions from the user record
    // We assume the user object contains keys like 'view-customer': 1
    if (user.permissions) {
       form.permissions = { ...user.permissions }
    } else {
       // fallback if permissions are flattened in the user object
       Object.keys(form.permissions).forEach(key => {
         if (user[key] !== undefined) form.permissions[key] = Number(user[key])
       })
    }

  } catch (err) {
    errorMsg.value = "Failed to load user data"
  }
}

onMounted(initPage)

/* VALIDATION ZOD */
const schema = z.object({
  emp_id: z.number().min(1, "Please select an employee"),
  role_id: z.number().min(1, "Please select a role"),
  email: z.string().email("Invalid email address").min(1, "Required"),
  password: z.string().optional(), // Optional on edit
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

watch(() => form.email, () => validateField("email"))
watch(() => form.emp_id, () => validateField("emp_id"))
watch(() => form.role_id, () => validateField("role_id"))

const submitForm = async () => {
  loading.value = true
  errorMsg.value = null
  successMsg.value = null

  const parsed = schema.safeParse(form)
  if (!parsed.success) {
    parsed.error.errors.forEach((e) => { errors[e.path[0] as string] = e.message })
    errorMsg.value = "Please fix validation errors."
    loading.value = false
    return
  }

  try {
    const fd = new FormData()
    fd.append("_method", "PUT") // Laravel often requires this for spoofing PUT in FormData
    fd.append("emp_id", String(form.emp_id))
    fd.append("role_id", String(form.role_id))
    fd.append("email", form.email)
    if (form.password) fd.append("password", form.password)
    fd.append("active", form.active ? "1" : "0")
    fd.append("identifier_token", form.identifier_token || "")
    fd.append("default_password", "")

    Object.entries(form.permissions).forEach(([key, value]) => {
      fd.append(key, String(value))
    })

    await $fetch(`/api/admin-secure/user-permissions/${userId}`, {
      method: "POST", // Using POST + _method: PUT for FormData compatibility
      body: fd,
      headers: { Accept: "application/json" }
    })

    success("User updated successfully!")
    await navigateTo("/app/dashboard/user-permissions")

  } catch (err: any) {
    if (err?.data?.errors) {
      Object.entries(err.data.errors).forEach(([field, messages]) => {
        errors[field] = (messages as string[])[0] || ""
      })
      errorMsg.value = "Backend validation failed."
    } else {
      errorMsg.value = err?.data?.message || "Error updating user"
    }
  } finally {
    loading.value = false
  }
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
          <label class="label">Employee Name*</label>
          <select v-model.number="form.emp_id" class="input">
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.label }}</option>
          </select>
          <span class="text-red-500 text-xs">{{ errors.emp_id }}</span>
        </div>

        <div>
          <label class="label">System Role*</label>
          <select v-model.number="form.role_id" class="input">
            <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.label }}</option>
          </select>
          <span class="text-red-500 text-xs">{{ errors.role_id }}</span>
        </div>

        <div>
          <label class="label">Email Address*</label>
          <input type="email" v-model="form.email" class="input" />
          <span class="text-red-500 text-xs">{{ errors.email }}</span>
        </div>

        <div>
          <label class="label">New Password (leave blank to keep current)</label>
          <input type="password" v-model="form.password" class="input" />
        </div>
      </ComponentCard>

      <ComponentCard title="Settings & Identity">
        <div>
          <label class="label">Identifier Token</label>
          <input type="text" v-model="form.identifier_token" class="input" />
        </div>

        <div class="flex items-center gap-2 mt-6">
          <input type="checkbox" id="user_active" v-model="form.active" class="w-4 h-4" />
          <label for="user_active" class="label !mb-0">Active Account</label>
        </div>
      </ComponentCard>
    </div>

    <div class="col-span-full mt-4">
      <ComponentCard title="6. User Permissions">
        <PermissionTable v-model="form.permissions" />
      </ComponentCard>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <button @click="navigateTo('/app/dashboard/user-permissions')" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">Cancel</button>
      <button @click="submitForm" :disabled="loading" class="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
        <Icon v-if="loading" name="svg-spinners:180-ring-with-bg" />
        {{ loading ? "Updating..." : "Update User" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.label { display: block; margin-bottom: 4px; font-size: 14px; color: #555; font-weight: 500; }
.dark .label { color: #ccc; }
.input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 8px 12px; background: transparent; }
.dark .input { border-color: #444; color: white; }
.text-red-500 { color: #ef4444; }
</style>