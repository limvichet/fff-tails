<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <!-- LEFT -->
    <div class="space-y-6">
      <ComponentCard title="Customer Info">
        <div>
          <div class="flex items-center justify-between">
            <label class="label">ID</label><span class="text-red-500 text-sm">{{ errors.id }}</span>
          </div>
          <input v-model="form.id" type="text" class="input" />
          
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label class="label">Title</label><span class="text-red-500 text-sm">{{ errors.cust_title_1 }}</span>
          </div>
          <select v-model.number="form.cust_title_1" class="input">
            <option value="-1">-- Select title --</option>
            <option v-for="c in nameTitles" :key="c.id" :value="c.id">{{ c.label }}</option>
          </select>
        </div>

        <div>
          <label class="label">Name</label>
          <input v-model="form.cust_name_1" type="text" class="input" />
          <span class="text-red-500 text-sm">{{ errors.cust_name_1 }}</span>
        </div>

        <div>
          <label class="label">Identity Type</label>
          <select v-model="form.iden_id_1" class="input">
            <option value="">Select</option>
            <option value="1">National ID</option>
            <option value="2">Passport</option>
          </select>
          <span class="text-red-500 text-sm">{{ errors.iden_id_1 }}</span>
        </div>

        <div>
          <label class="label">ID Card Number</label>
          <input v-model="form.cust_idcardnum_1" type="text" class="input" />
          <span class="text-red-500 text-sm">{{ errors.cust_idcardnum_1 }}</span>
        </div>

        <div>
          <label class="label">ID Card Date</label>
          <input v-model="form.cust_idcardnum_date_1" type="date" class="input" />
          <span class="text-red-500 text-sm">{{ errors.cust_idcardnum_date_1 }}</span>
        </div>
      </ComponentCard>
    </div>

    <!-- RIGHT -->
    <div class="space-y-6">
      <ComponentCard title="More Info">
        <div>
          <label class="label">Issue Place</label>
          <select v-model="form.idli_id_1" class="input">
            <option value="">Select</option>
            <option value="1">Phnom Penh</option>
            <option value="2">Province</option>
          </select>
          <span class="text-red-500 text-sm">{{ errors.idli_id_1 }}</span>
        </div>

        <div>
          <label class="label">Occupation</label>
          <select v-model="form.occu_id_1" class="input">
            <option value="">Select</option>
            <option value="1">Worker</option>
            <option value="8">Farmer</option>
          </select>
          <span class="text-red-500 text-sm">{{ errors.occu_id_1 }}</span>
        </div>

        <div>
          <label class="label">Phone</label>
          <input v-model="form.cust_phone_1" type="text" class="input" />
          <span class="text-red-500 text-sm">{{ errors.cust_phone_1 }}</span>
        </div>

        <div>
          <label class="label">Address</label>
          <textarea v-model="form.cust_address" rows="3" class="input"></textarea>
          <span class="text-red-500 text-sm">{{ errors.cust_address }}</span>
        </div>

        <div>
          <label class="label">Active</label>
          <select v-model="form.active" class="input">
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <span class="text-red-500 text-sm">{{ errors.active }}</span>
        </div>

        <!-- <div>
          <label class="label">ID Card Image</label>
          <input type="file" @change="onFileChange" class="input" />
           <p v-if="form.image_src1"><img :src="form.image_src1" height="100"></p>
        </div> -->

        <div class="space-y-4">

    <!-- Upload Area -->
    <div class="flex flex-col items-center justify-center w-full">
      <label
        class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer
               bg-gray-50 hover:bg-gray-100 transition"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <span class="text-sm text-gray-500">
            Click to upload image
          </span>
        </div>

        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        />
      </label>
    </div>

    <!-- Image Preview -->
    <div v-if="form.image_src1" class="flex justify-center">
      <div class="relative group">
        <img
          :src="form.image_src1"
          class="h-32 w-32 object-cover rounded-xl border shadow-md transition duration-300 group-hover:scale-105"
        />

        <!-- Check Badge -->
        <div
          class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow"
        >
          ✓ Checked
        </div>
      </div>
    </div>

  </div>


        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="form.check_image1" />
          <label>Check Image</label>
        </div>

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

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { z } from 'zod'
import ComponentCard from '@/components/common/ComponentCard.vue'
import DropzoneImage from '~/components/forms/FormElements/DropzoneImage.vue'
import type { CustomerFormDataResponse } from '~/types/customer'

const { successMsg, errorMsg } = useMessage()

// --- Form Data & Select Options ---
const customerFormData = ref<CustomerFormDataResponse | null>(null)
const nameTitles = ref<Array<{ id: number; label: string }>>([])

const fetchCustomerFormData = async () => {
  try {
    const data = await $fetch('/api/admin-secure/customers-form-data')
    customerFormData.value = {
      ...data,
      nameTitles: Object.entries(data.nameTitles).map(([id, label]) => ({ id: Number(id), label: String(label) })),
    }
    nameTitles.value = customerFormData.value.nameTitles
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
  iden_id_1: '',
  cust_idcardnum_1: '',
  cust_idcardnum_date_1: '',
  idli_id_1: '',
  occu_id_1: '',
  cust_phone_1: '',
  cust_address: '',
  active: '1',

  check_image1: false,
  image1: null as File | null,
  image_src1: null as string | null,
})

const img1 = ref<File | null>(null)
const loading = ref(false)
const errors = reactive<Record<string, string>>({})

// --- Validation Schema ---
const customerSchema = z.object({
  id: z.string().nonempty('ID is required'),
  cust_title_1: z.number().min(0, 'Please select a title'),
  cust_name_1: z.string().nonempty('Name is required'),
  iden_id_1: z.string().nonempty('Identity type is required'),
  cust_idcardnum_1: z.string().nonempty('ID card number is required'),
  cust_idcardnum_date_1: z.string().nonempty('ID card date is required'),
  idli_id_1: z.string().nonempty('Issue place is required'),
  occu_id_1: z.string().nonempty('Occupation is required'),
  cust_phone_1: z.string().nonempty('Phone is required'),
  cust_address: z.string().nonempty('Address is required'),
  active: z.enum(['0', '1']),
  check_image1: z.boolean(),
})

// --- File Handler ---
const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
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
}

// --- Submit Form ---
const submitForm = async () => {
  loading.value = true
  Object.keys(errors).forEach(k => errors[k] = '')

  try {
    const parsed = customerSchema.parse(form)
    const fd = new FormData()
    Object.entries(parsed).forEach(([k, v]) => fd.append(k, String(v)))
    if (img1.value) fd.append('img1', img1.value)

    await $fetch('/api/customers', { method: 'POST', body: fd })
    successMsg.value = 'Customer created successfully!'
  } catch (err: any) {
    if (err.errors) err.errors.forEach((e: any) => errors[e.path[0]] = e.message)
    else { errorMsg.value = 'Error while saving customer'; console.error(err) }
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
  const files = (event.target as HTMLInputElement).files;
  if (files && files[0]) {
    img1.value = files[0];
    imgPreview1.value = URL.createObjectURL(files[0]);
    checkImage1.value = 1;
  }
};

// Remove image
const removeImage1 = () => {
  img1.value = null;
  imgPreview1.value = '/imgs/CardPhoto.png';
  checkImage1.value = 0;
};

</script>

<style scoped>
.label { display: block; margin-bottom: 4px; font-size: 14px; color: #555; }
.input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 8px 12px; }
.text-red-500 { color: #f56565; }
.text-sm { font-size: 12px; }
</style>
