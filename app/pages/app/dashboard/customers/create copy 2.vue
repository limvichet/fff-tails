<script setup lang="ts">
import { ref, reactive } from "vue"

import ComponentCard from "@/components/common/ComponentCard.vue"

import type { CustomerFormDataResponse } from "~/types/customer";
const { successMsg, errorMsg } = useMessage();

const customerFormData = ref<CustomerFormDataResponse | null>(null)

const nameTitles = ref<Array<{ id: number; label: string }>>([])



const fetchCustomerFormData = async () => {
  try {
    const data = await $fetch("/api/admin-secure/customers-form-data");

    customerFormData.value = {
      ...data,
      // Convert maps into arrays
      nameTitles: Object.entries(data.nameTitles).map(([id, label]) => ({
        id: Number(id),
        label: String(label),
      })),
      identifications: Object.entries(data.identifications).map(([id, label]) => ({
        id: Number(id),
        label: String(label),
      })),
      idLicenses: Object.entries(data.idLicenses).map(([id, label]) => ({
        id: Number(id),
        label: String(label),
      })),
      occupations: Object.entries(data.occupations).map(([id, label]) => ({
        id: Number(id),
        label: String(label),
      })),
      loanStatuses: Object.entries(data.loanStatuses).map(([id, label]) => ({
        id: Number(id),
        label: String(label),
      })),
    };

    // Optional: assign nameTitles to a separate reactive array for your select
    nameTitles.value = customerFormData.value.nameTitles;

  } catch (err: any) {
    errorMsg.value = err?.statusMessage || "Failed to load customer form data";
  }
};



onMounted(() => {
  fetchCustomerFormData()
  console.log(customerFormData)
})

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  breadcrumb: {
    title: "Customers", 
    subTitle: "Create",
  },
})

// form state
const form = reactive({
  id: "",
  cust_title_1: -1,
  cust_name_1: "",
  iden_id_1: "",
  cust_idcardnum_1: "",
  cust_idcardnum_date_1: "",
  idli_id_1: "",
  occu_id_1: "",
  cust_phone_1: "",
  cust_address: "",
  active: "1",
  check_image1: false,
})

const img1 = ref<File | null>(null as File | null)

const loading = ref(false)

// handle file change
const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file) {
      img1.value = file
    }
  }
}

// submit
const submitForm = async () => {
  loading.value = true
  try {
    const fd = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      fd.append(key, String(value))
    })
    if (img1.value) {
      fd.append("img1", img1.value)
    }

    // example API call
    await $fetch("/api/customers", {
      method: "POST",
      body: fd,
    })

    alert("Customer created successfully!")
  } catch (err) {
    console.error(err)
    alert("Error while saving customer")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <!-- LEFT -->
    <div class="space-y-6">
      <ComponentCard title="Customer Info">
        <!-- ID -->
        <div>
          <label class="label">ID</label>
          <input v-model="form.id" type="text" class="input" />
        </div>

<!-- Title -->
<div>
  <label class="label">Title</label>
  <select v-model.number="form.cust_title_1" class="input">
    <option value="-1">-- Select title --</option>
    <option v-for="c in nameTitles || []" :key="c.id" :value="c.id">
      {{ c.label }}
    </option>
  </select>
</div>


        <!-- Name -->
        <div>
          <label class="label">Name</label>
          <input v-model="form.cust_name_1" type="text" class="input" />
        </div>

        <!-- Identity Type -->
        <div>
          <label class="label">Identity Type</label>
          <select v-model="form.iden_id_1" class="input">
            <option value="">Select</option>
            <option value="1">National ID</option>
            <option value="2">Passport</option>
          </select>
        </div>

        <!-- ID Card Number -->
        <div>
          <label class="label">ID Card Number</label>
          <input v-model="form.cust_idcardnum_1" type="text" class="input" />
        </div>

        <!-- ID Card Date -->
        <div>
          <label class="label">ID Card Date</label>
          <input 
            v-model="form.cust_idcardnum_date_1" 
            type="date" 
            class="input"
          />
        </div>
      </ComponentCard>
    </div>

    <!-- RIGHT -->
    <div class="space-y-6">
      <ComponentCard title="More Info">
        <!-- Issue Place -->
        <div>
          <label class="label">Issue Place</label>
          <select v-model="form.idli_id_1" class="input">
            <option value="">Select</option>
            <option value="1">Phnom Penh</option>
            <option value="2">Province</option>
          </select>
        </div>

        <!-- Occupation -->
        <div>
          <label class="label">Occupation</label>
          <select v-model="form.occu_id_1" class="input">
            <option value="">Select</option>
            <option value="1">Worker</option>
            <option value="8">Farmer</option>
          </select>
        </div>

        <!-- Phone -->
        <div>
          <label class="label">Phone</label>
          <input v-model="form.cust_phone_1" type="text" class="input" />
        </div>

        <!-- Address -->
        <div>
          <label class="label">Address</label>
          <textarea v-model="form.cust_address" rows="3" class="input"></textarea>
        </div>

        <!-- Active -->
        <div>
          <label class="label">Active</label>
          <select v-model="form.active" class="input">
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <!-- Image -->
        <div>
          <label class="label">ID Card Image</label>
          <input type="file" @change="onFileChange" class="input" />
        </div>

        <!-- Check Image -->
        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="form.check_image1" />
          <label>Check Image</label>
        </div>

        <!-- Submit -->
        <div>
          <button
            @click="submitForm"
            :disabled="loading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            {{ loading ? "Saving..." : "Save Customer" }}
          </button>
        </div>
      </ComponentCard>
    </div>
  </div>
</template>

<style scoped>
.label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #555;
}
.input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
}
</style>
