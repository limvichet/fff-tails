<script setup lang="ts">

  definePageMeta({
    layout: "auth",
    requiresAuth: true,
    breadcrumb: { title: "Customers", subTitle: "Detail" },
  })

  useHead({
    title: "Edit customers",
    meta: [{ name: "customers", content: "edit customers" }],
  })

  import { z } from "zod"
  import { useRoute } from "vue-router"
  import ComponentCard from "@/components/common/ComponentCard.vue"
  import ComponentGrowCard from "@/components/common/ComponentGrowCard.vue"
  import type { Customer, CustomerFormDataResponse } from "~/types/customer"
  import { useCustomToast } from '~/composables/useCustomToast';
  const { showToast } = useCustomToast();

  const { successMsg, errorMsg } = useMessage()
  const loading = ref(false)
  const formReady = ref(false)
  const errors = reactive<Record<string, string>>({})

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

  const route = useRoute()
  const id = route.params.id


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
    cust_address_link: "",

    img1: null as File | null,
    img1_src: null as string | null,
    img1_check: false,

    img2: null as File | null,
    img2_src: null as string | null,
    img2_check: false,

    photo1: null as File | null,
    photo1_src: null as string | null,
    photo1_check: false,

    photo2: null as File | null,
    photo2_src: null as string | null,
    photo2_check: false,
  })

  type ApiResponse<T> = {
    success: boolean
    data: T
  }

  const headers = useRequestHeaders(["cookie"]);
  const { data } = await useAsyncData(
    `customer-${id}`,
    () => $fetch<ApiResponse<Customer>>(`/api/admin-secure/customers/${id}`, { headers }),
  )

  const customer = computed(() => data.value?.data ?? null)

  // console.log("Fetched customer:", customer.value)

  /* IMAGE HANDLER (Reusable) */
  const handleImageChange = (
    event: Event,
    imageKey: "img1" | "img2" | "photo1" | "photo2",
    previewKey: "img1_src" | "img2_src" | "photo1_src" | "photo2_src",
    checkKey: "img1_check" | "img2_check" | "photo1_check" | "photo2_check",
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

    // const reader = new FileReader()
    // reader.onload = () => (form[previewKey] = reader.result as string)
    // reader.readAsDataURL(file)
    form[previewKey] = URL.createObjectURL(file)

  }

  const onFileChange1 = (e: Event) =>
    handleImageChange(e, "img1", "img1_src", "img1_check")

  const onFileChange2 = (e: Event) =>
    handleImageChange(e, "img2", "img2_src", "img2_check")

  const onFileChange3 = (e: Event) =>
    handleImageChange(e, "photo1", "photo1_src", "photo1_check")

  const onFileChange4 = (e: Event) =>
    handleImageChange(e, "photo2", "photo2_src", "photo2_check")

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

  const openPhoto2 = () => {
    if (!form.photo2_src) return

    const newTab = window.open()
    if (newTab) {
      newTab.document.write(`
        <html>
          <head><title>Preview</title></head>
          <body style="margin:0">
            <img src="${form.photo2_src}" style="width:100%" />
          </body>
        </html>
      `)
      newTab.document.close()
    }
  }

  const isFacebookValid = computed(() => {
    return form.cust_facebook
  })

  const isTelegramValid = computed(() => {
    return form.cust_telegram
  })

  const isAddressValid = computed(() => {
    return form.cust_address_link
  })

  const openLink = (url: string) => {
    if (!url) return
    window.open(url, '_blank')
  }

  const openTelegram = (username: string) => {
    // return immediately if username is empty or invalid
    if (!username || username.trim().length === 0) return

    // remove @ if present
    const user = username.replace(/^@/, '').trim()
    if (!user) return

    // detect mobile
    const isMobile = /Mobi|Android/i.test(navigator.userAgent)

    // generate URL
    const url = isMobile
      ? `tg://resolve?domain=${user}`       // opens app on mobile
      : `https://web.telegram.org/k/#${user}`  // opens Telegram Web on desktop

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  watch(customer, (c) => {
    if (!c) return

    Object.assign(form, {
      id: c.id ?? null,

      // 1st customer — required fields
      cust_title_1: c.cust_title_1 ?? -1,
      cust_name_1: c.cust_name_1 ?? "",
      cust_dob_1: (c.cust_dob_1 ?? ""),
      cust_idcardnum_1: c.cust_idcardnum_1 ?? "",
      iden_id_1: c.iden_id_1 ?? -1,
      cust_idcardnum_date_1: (c.cust_idcardnum_date_1 ?? ""),
      idli_id_1: c.idli_id_1 ?? -1,
      occu_id_1: c.occu_id_1 ?? -1,
      cust_phone_1: c.cust_phone_1 ?? "",

      // 2nd customer — optional fields
      cust_title_2: c.cust_title_2 ?? -1,
      cust_name_2: c.cust_name_2 ?? "",
      cust_dob_2: (c.cust_dob_2 ?? ""),
      cust_idcardnum_2: c.cust_idcardnum_2 ?? "",
      iden_id_2: c.iden_id_2 ?? -1,
      cust_idcardnum_date_2: (c.cust_idcardnum_date_2 ?? ""),
      idli_id_2: c.idli_id_2 ?? -1,
      occu_id_2: c.occu_id_2 ?? -1,
      cust_phone_2: c.cust_phone_2 ?? "",

      // Bank / Social / Address info
      cust_account_num: c.cust_account_num ?? "",
      cust_atm_num: c.cust_atm_num ?? "",
      cust_facebook: c.cust_facebook ?? "",
      cust_telegram: c.cust_telegram ?? "",
      cust_address: c.cust_address ?? "",
      cust_address_link: c.cust_address_link ?? "",

      // Image preview from backend
      img1_src: c.img1_url ?? null,
      img2_src: c.img2_url ?? null,
      img1_check: !!c.img1_url,
      img2_check: !!c.img2_url,

      // 🔥 ADD THIS (MISSING)
      photo1_src: c.photo1_url ?? null,
      photo2_src: c.photo2_url ?? null,
      photo1_check: !!c.photo1_url,
      photo2_check: !!c.photo2_url,
    })

    formReady.value = true
  }, { immediate: true })



  /* VALIDATION ZOD */
  const MIN_FILE_SIZE = 1.01 * 1024 * 1024       // 1MB
  const schema = z.object({
    // Primary ID
    id: z.number().nullable().optional(),

    // ===== Customer 1 (Required) =====
    cust_title_1: z.number().min(0, "Required"),
    iden_id_1: z.number().min(0, "Required"),
    idli_id_1: z.number().min(0, "Required"),
    occu_id_1: z.number().min(0, "Required"),

    cust_name_1: z.string().nonempty("Required"),
    cust_dob_1: z.string().nonempty("Required"),
    cust_idcardnum_1: z.string().nonempty("Required"),
    cust_idcardnum_date_1: z.string().nonempty("Required"),
    cust_phone_1: z.string().nonempty("Required"),
    cust_address: z.string().nonempty("Required"),
    cust_address_link: z.string().optional(),

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
    img2: z
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
    photo2: z
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

  type ImageKey = 'img1' | 'img2' | 'photo1' | 'photo2';

  type ImageItem  = {
  file: File | null;
  src: string | null;
  check: boolean;
}

  const images: Record<ImageKey, ImageItem> = {
    img1: { file: null, src: null, check: false },
    img2: { file: null, src: null, check: false },
    photo1: { file: null, src: null, check: false },
    photo2: { file: null, src: null, check: false },
  };

  const updateFromBackend = (key: ImageKey, url: string | null) => {
    images[key].file = null;
    images[key].src = url ? '/storage/' + url + '?v=' + Date.now() : null;
    images[key].check = !!url;
  };

  /* UPDATE */
  const updateForm = async () => {
    loading.value = true
    errorMsg.value = ""
    successMsg.value = ""

    // clear old errors
    Object.keys(errors).forEach(k => errors[k] = "")

    // ✅ compress images if larger than 1MB
    const compressIfNeeded = async (file: any) => {
      if (!file) return file;

      const f = file instanceof FileList ? file[0] : file;

      if (f && f.size > 1024 * 1024) {
        return await compressImage(f);
      }

      return f;
    };

    // clone form to avoid mutating original
    const newForm = { ...form };

    // compress
    newForm.img1 = await compressIfNeeded(form.img1);
    newForm.img2 = await compressIfNeeded(form.img2);
    newForm.photo1 = await compressIfNeeded(form.photo1);
    newForm.photo2 = await compressIfNeeded(form.photo2);

    try {
      // console.log("FORM BEFORE PARSE:", form)
      const parsed = schema.safeParse(newForm)

      if (!parsed.success) {
        const errorList: string[] = []
        parsed.error.errors.forEach((e) => {
          const field = e.path.join('.')
          errors[field] = e.message
          errorList.push(`${field}: ${e.message}`)
        })

        // errorMsg.value = errorList.join(' | ')
        errorMsg.value = "Please fill the validation fields."
        loading.value = false
        showToast(
          `Please fill the validation.`,
          `Please fill the validation fields.`,
          `error`
        )
        return
      }

      // console.log("PARSED FORM:", parsed)
      const fd = new FormData()
      const formDataObj = parsed.data
      Object.entries(formDataObj).forEach(([k, v]) => {
        if (v === -1 || v === "") {
          fd.append(k, "")
        } else {
          fd.append(k, String(v))
        }
      })

      // files
      if (newForm.img1 && form.img1_check) fd.append("img1", newForm.img1)
      if (newForm.img2 && form.img2_check) fd.append("img2", newForm.img2)
      if (newForm.photo1 && form.photo1_check) fd.append("photo1", newForm.photo1)
      if (newForm.photo2 && form.photo2_check) fd.append("photo2", newForm.photo2)

      // flags
      if (form.img1_check) fd.append("img1_check", "1")
      if (form.img2_check) fd.append("img2_check", "1")
      if (form.photo1_check) fd.append("photo1_check", "1")
      if (form.photo2_check) fd.append("photo2_check", "1")

      fd.append("_method", "PUT")

      /* ✅ REQUEST */
      await $fetch(`/api/admin-secure/customers/${id}`, {
        method: "POST",
        body: fd,
      })

      successMsg.value = "Customer updated successfully!"

      // ✅ REFRESH IMAGE FROM BACKEND
      const refreshed = await $fetch<{succes:number, data:any}>(`/api/admin-secure/customers/${id}`)
      updateFromBackend("img1", refreshed.data.img1_url)
      updateFromBackend("img2", refreshed.data.img2_url)
      updateFromBackend("photo1", refreshed.data.photo1_url)
      updateFromBackend("photo2", refreshed.data.photo2_url)

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


</script>

<template>
  <!-- Messages -->
  <div v-if="errorMsg" class="mb-3 p-2 rounded bg-red-500/20 text-red-300 text-sm">
    {{ errorMsg }}
  </div>
  <div v-if="successMsg" class="mb-3 p-2 rounded bg-emerald-500/20 text-emerald-300 text-sm">
    {{ successMsg }}
  </div>

  <div v-if="customer" class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">

    <!-- col-span-2 -->
    <div class="lg:col-span-2 grid grid-cols-1 gap-2 sm:grid-cols-1 lg:grid-cols-2">

      <!-- LEFT 1 Basic -->
      <div class="space-y-4">
        <ComponentCard title="1. Basic">

          <!-- cust_title_1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Title <span class="text-red-500 text-sm"> *</span></label><span
                class="text-red-500 text-sm">{{ errors.cust_title_1 }}</span>
            </div>
            <select v-model.number="form.cust_title_1" class="input">
              <option value="-1" disabled> Choose ... </option>
              <option v-for="dd in nameTitles" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
            </select>
          </div>

          <!-- cust_name_1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Name <span class="text-red-500 text-sm"> *</span></label><span
                class="text-red-500 text-sm">{{ errors.cust_name_1 }}</span>
            </div>
            <input v-model="form.cust_name_1" type="text" class="input" />
          </div>

          <!-- cust_dob_1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Date of Birth <span class="text-red-500 text-sm"> *</span></label><span
                class="text-red-500 text-sm">{{ errors.cust_dob_1 }}</span>
            </div>
            <input v-model="form.cust_dob_1" type="date" class="input" />
          </div>

          <!-- cust_idcardnum_1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">ID Card Number <span class="text-red-500 text-sm"> *</span></label><span
                class="text-red-500 text-sm">{{ errors.cust_idcardnum_1 }}</span>
            </div>
            <input v-model="form.cust_idcardnum_1" type="text" class="input" maxlength="9" />
          </div>

          <!-- iden_id_1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Identity Type <span class="text-red-500 text-sm"> *</span></label><span
                class="text-red-500 text-sm">{{ errors.iden_id_1 }}</span>
            </div>
            <select v-model="form.iden_id_1" class="input">
              <option value="-1" disabled> Choose ... </option>
              <option v-for="dd in identifications" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
            </select>
          </div>

          <!-- cust_idcardnum_date_1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Date Identification <span class="text-red-500 text-sm"> *</span></label><span
                class="text-red-500 text-sm">{{ errors.cust_idcardnum_date_1 }}</span>
            </div>
            <input v-model="form.cust_idcardnum_date_1" type="date" class="input" />
          </div>

          <!-- idli_id_1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Identification Licenses <span class="text-red-500 text-sm"> *</span></label><span
                class="text-red-500 text-sm">{{ errors.idli_id_1 }}</span>
            </div>
            <select v-model="form.idli_id_1" class="input">
              <option value="-1" disabled> Choose ... </option>
              <option v-for="dd in idLicenses" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
            </select>
          </div>

          <!-- occu_id_1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Occupation <span class="text-red-500 text-sm"> *</span></label><span
                class="text-red-500 text-sm">{{ errors.occu_id_1 }}</span>
            </div>
            <select v-model="form.occu_id_1" class="input">
              <option value="-1" disabled> Choose ... </option>
              <option v-for="dd in occupations" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
            </select>
          </div>

          <!-- cust_phone_1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Phone <span class="text-red-500 text-sm"> *</span></label><span
                class="text-red-500 text-sm">{{ errors.cust_phone_1 }}</span>
            </div>
            <input v-model="form.cust_phone_1" type="text" maxlength="10"
              @input="form.cust_phone_1 = form.cust_phone_1.replace(/[^0-9]/g, '').slice(0, 10)" class="input" />
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
              <option value="-1"> Choose ... </option>
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
              <label class="label">Date of Birth</label><span class="text-red-500 text-sm">{{ errors.cust_dob_2
                }}</span>
            </div>
            <input v-model="form.cust_dob_2" type="date" class="input" />
          </div>

          <!-- cust_idcardnum_2 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">ID Card Number</label><span class="text-red-500 text-sm">{{ errors.cust_idcardnum_2
                }}</span>
            </div>
            <input v-model="form.cust_idcardnum_2" type="text" class="input" maxlength="9" />
          </div>

          <!-- iden_id_2 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Identity Type</label><span class="text-red-500 text-sm">{{ errors.iden_id_2 }}</span>
            </div>
            <select v-model="form.iden_id_2" class="input">
              <option value="-1"> Choose ... </option>
              <option v-for="dd in identifications" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
            </select>
          </div>

          <!-- cust_idcardnum_date_2 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Date Identification</label><span class="text-red-500 text-sm">{{
                errors.cust_idcardnum_date_2 }}</span>
            </div>
            <input v-model="form.cust_idcardnum_date_2" type="date" class="input" />
          </div>

          <!-- idli_id_2 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Identification Licenses</label><span class="text-red-500 text-sm">{{ errors.idli_id_2
                }}</span>
            </div>
            <select v-model="form.idli_id_2" class="input">
              <option value="-1"> Choose ... </option>
              <option v-for="dd in idLicenses" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
            </select>
          </div>

          <!-- occu_id_2 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Occupation</label><span class="text-red-500 text-sm">{{ errors.occu_id_2 }}</span>
            </div>
            <select v-model="form.occu_id_2" class="input">
              <option value="-1"> Choose ... </option>
              <option v-for="dd in occupations" :key="dd.id" :value="dd.id">{{ dd.label }}</option>
            </select>
          </div>

          <!-- cust_phone_2 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Phone</label><span class="text-red-500 text-sm">{{ errors.cust_phone_2 }}</span>
            </div>
            <input v-model="form.cust_phone_2" type="text" maxlength="10"
              @input="form.cust_phone_1 = form.cust_phone_1.replace(/[^0-9]/g, '').slice(0, 10)" class="input" />
          </div>

        </ComponentCard>
      </div>

      <!-- Left 4.Bank Information -->
      <div>
        <ComponentGrowCard title="4.Bank Infomation">

          <!-- cust_account_num -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Account Number</label><span class="text-red-500 text-sm">{{ errors.cust_account_num
                }}</span>
            </div>
            <input v-model="form.cust_account_num" type="text"
              @input="form.cust_account_num = form.cust_account_num.replace(/[^0-9]/g, '').slice(0, 14)"
              class="input" />
          </div>

          <!-- cust_atm_num -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">ATM Number</label><span class="text-red-500 text-sm">{{ errors.cust_atm_num }}</span>
            </div>
            <input v-model="form.cust_atm_num" type="text"
              @input="form.cust_atm_num = form.cust_atm_num.replace(/[^0-9]/g, '').slice(0, 20)" class="input" />
          </div>

          <!-- cust_facebook -->
          <div>
            <div class="flex items-center justify-between">
              <label :class="[
                'label',
                isFacebookValid ? 'cursor-pointer !text-blue-900' : 'text-gray-400'
              ]" @click="isFacebookValid && openLink(form.cust_facebook)">
                Facebook <span v-if="isFacebookValid"> 🔗</span>
              </label>
            </div>
            <input v-model="form.cust_facebook" type="text" class="input" />
          </div>

          <!-- cust_telegram -->
          <div>
            <div class="flex items-center justify-between">
              <label style="margin-bottom: 4px; font-size: 14px; color: #555;" :class="[
                'inline-flex items-center gap-1 hover:text-blue-700',
                isTelegramValid ? 'cursor-pointer !text-blue-900' : 'text-gray-400'
              ]" @click="isTelegramValid && openTelegram(form.cust_telegram)">
                Telegram
                <svg v-if="isTelegramValid" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
                  fill="currentColor">
                  <path
                    d="M9.5 13.01l-.39 4.44c.56 0 .8-.24 1.1-.52l2.64-2.53 5.48 4.01c1 .53 1.72.25 1.98-.93L23 2.98c.26-1.18-.43-1.65-1.3-1.38L1.74 9.66c-1.17.46-1.15 1.11-.2 1.38l5.5 1.7 12.77-8c.6-.38 1.15-.17.7.25l-10.6 10z" />
                </svg>
              </label>
            </div>
            <input v-model="form.cust_telegram" type="text" class="input" />
          </div>

        </ComponentGrowCard>
      </div>

      <!-- Right 5.Address Information -->
      <div class="space-y-4">
        <ComponentGrowCard title="5.Address Infomation">

          <!-- cust_address -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Address <span class="text-red-500 text-sm"> *</span></label><span
                class="text-red-500 text-sm">{{ errors.cust_address }}</span>
            </div>
            <textarea v-model="form.cust_address" class="input" rows="4" />
          </div>

          <!-- cust_address_link -->
          <div>
            <div class="flex items-center justify-between">
              <label :class="[
                'label',
                isAddressValid ? 'cursor-pointer !text-blue-900' : 'text-gray-400'
              ]" @click="isAddressValid && openLink(form.cust_address_link)">
                Map link
                <span v-if="isAddressValid"> 📌</span>
              </label>
            </div>
            <input v-model="form.cust_address_link" class="input" />
          </div>


        </ComponentGrowCard>
      </div>

    </div>

    <!-- col-span-1 -->
    <div class="lg:col-span-1 grid grid-cols-1">

      <!-- RIGHT 3 Indentification photo-->
      <div class="space-y-4">
        <ComponentGrowCard title="3. Identification Photo">

          <!-- img1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">ID Card Image 1</label><span class="text-red-500 text-sm">{{ errors.img1 }}</span>
            </div>
            <input type="file" @change="onFileChange1" class="input" />
            <div v-if="form.img1_src" class="mt-4">
              <div class="relative group w-full">
                <a :href="form.img1_src" target="_blank" rel="noopener noreferrer" class="block">
                  <img :src="form.img1_src" @click="openImg1" @contextmenu.prevent
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

          <!-- img2 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">ID Card Image 2</label><span class="text-red-500 text-sm">{{ errors.img2 }}</span>
            </div>
            <input type="file" @change="onFileChange2" class="input" />
            <div v-if="form.img2_src" class="mt-4">
              <div class="relative group w-full">
                <a :href="form.img2_src" target="_blank" rel="noopener noreferrer" class="block">
                  <img :src="form.img2_src" @click="openImg2" @contextmenu.prevent
                    class="w-full h-50 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" />
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

          <!-- photo1 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Photo 1</label><span class="text-red-500 text-sm">{{ errors.photo1 }}</span>
            </div>
            <input type="file" @change="onFileChange3" class="input" />
            <div v-if="form.photo1_src" class="mt-4">
              <div class="relative group w-1/2">
                <a :href="form.photo1_src" target="_blank" rel="noopener noreferrer" class="block">
                  <img :src="form.photo1_src" @click="openPhoto1"
                    class="w-full h-52 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" />
                </a>
                <div
                  class="absolute top-1 right-1 bg-white/50 backdrop-blur px-2 py-1 rounded-full shadow flex items-center gap-2 pointer-events-none">
                  <input type="checkbox" v-model="form.photo1_check"
                    class="w-4 h-4 text-blue-600 rounded pointer-events-auto" />
                  <span class="text-sm text-gray-700">Check</span>
                </div>
              </div>
            </div>
          </div>

          <!-- photo2 -->
          <div>
            <div class="flex items-center justify-between">
              <label class="label">Photo 2</label><span class="text-red-500 text-sm">{{ errors.photo2 }}</span>
            </div>
            <input type="file" @change="onFileChange4" class="input" />
            <div v-if="form.photo2_src" class="mt-4">
              <div class="relative group w-1/2">
                <a :href="form.photo2_src" target="_blank" rel="noopener noreferrer" class="block">
                  <img :src="form.photo2_src" @click="openPhoto2" @contextmenu.prevent
                    class="w-full h-52 object-cover rounded-xl border shadow-md transition duration-300 hover:scale-[1.02] cursor-pointer" />
                </a>
                <div
                  class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow flex items-center gap-2 pointer-events-none">
                  <input type="checkbox" v-model="form.photo2_check"
                    class="w-4 h-4 text-blue-600 rounded pointer-events-auto" />
                  <span class="text-sm text-gray-700">Check</span>
                </div>
              </div>
            </div>
          </div>

          <!-- submit -->
          <template #footer>
            <button @click="updateForm" :disabled="loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
              <Icon v-if="loading" name="svg-spinners:180-ring-with-bg" class="text-lg" />
              {{ loading ? "Saving..." : "Save Customer" }}
            </button>
          </template>
        </ComponentGrowCard>
      </div>

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