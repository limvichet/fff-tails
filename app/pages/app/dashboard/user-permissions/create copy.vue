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

type Permission = { id: number; name: string; slug: string };

type RolePermission = {
  id: number;
  name: string;
  slug: string;
  permissions: Permission[];
}

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
  password: "",
  active: true,
  identifier_token: "",
  permissions: {} as Record<string, number>,
})

// 👉 metadata
const employees = ref<{ id: number; label: string }[]>([])
const roles = ref<{ id: number; label: string }[]>([])
const rolePermissionsData = ref<RolePermission[]>([])

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
    rolePermissionsData.value = res.role_permissions
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


// 👉 Logic to auto-check permissions based on role
watch(() => form.role_id, (newRoleId) => {
  if (newRoleId === -1) return

  // 1. Reset current permissions to 0
  Object.keys(form.permissions).forEach(key => {
    form.permissions[key] = 0
  })

  // 2. Find the selected role's permission list
  const selectedRole = rolePermissionsData.value.find(r => r.id === newRoleId)

  if (selectedRole) {
    // 3. Set matching permissions to 1
    selectedRole.permissions.forEach(p => {
      // The slug from your API is 'view-customer', 
      // which matches your PermissionTable keys
      form.permissions[p.slug] = 1
    })
  }
})

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
    fd.append("default_password", "")
    fd.append("active", form.active ? "1" : "0")
    fd.append("identifier_token", form.identifier_token || "")

    // 2. Append Permissions dynamically
    // This loops through form.permissions and adds "view-customer": "1", etc.
    Object.entries(form.permissions).forEach(([key, value]) => {
      fd.append(key, String(value))
    })
// console.log("Payload to send:", Object.fromEntries(fd.entries()))    
await $fetch("/api/admin-secure/user-permissions", {
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