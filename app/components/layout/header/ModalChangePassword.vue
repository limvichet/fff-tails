```vue
<script setup lang="ts">
import { ref } from "vue"
import { useCustomToast } from "~/composables/useCustomToast"

const { showToast } = useCustomToast()

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(["close"])

const loading = ref(false)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
})

const errors = ref({
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
})

const resetForm = () => {
  form.value = {
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  }

  errors.value = {
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  }

  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

const handleClose = () => {
  resetForm()
  emit("close")
}

const validateForm = () => {
  errors.value = {
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  }

  let valid = true

  if (!form.value.current_password) {
    errors.value.current_password = "Required"
    valid = false
  }

  if (!form.value.new_password) {
    errors.value.new_password = "Required"
    valid = false
  } else if (form.value.new_password.length < 8) {
    errors.value.new_password = "Password must be at least 8 characters"
    valid = false
  }

  if (!form.value.new_password_confirmation) {
    errors.value.new_password_confirmation = "Required"
    valid = false
  } else if (
    form.value.new_password !== form.value.new_password_confirmation
  ) {
    errors.value.new_password_confirmation = "Passwords do not match"
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    loading.value = true

    const response = await $fetch<{
      message: string
      code: number
    }>("/api/account/change-password", {
      method: "POST",
      body: form.value,
    })

    showToast(
      "Password changed successfully",
      response.message,
      "success"
    )

    handleClose()
  } catch (error: any) {
    showToast(
      "Failed to change password",
      error?.data?.message ||
      error?.message ||
      "Failed to change password",
      "error"
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Transition name="fade">
    <div v-if="props.isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="handleClose">
      <div class="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-2xl mx-4 relative">
        <h2 class="text-3xl text-blue-800 mb-3">
          Change Password
        </h2>
        <hr class="mb-6 border-gray-200" />

        <div class="space-y-5">
          <!-- Current Password -->
          <div >
            <div class="flex items-center justify-between">
              <label class="block text-gray-700 mb-1">
                Current Password
              </label>

              <span v-if="errors.current_password" class="text-red-500 text-sm">
                {{ errors.current_password }}
              </span>
            </div>

            <div class="relative">
              <input v-model="form.current_password" :type="showCurrentPassword ? 'text' : 'password'"
                placeholder="Please enter your current password..."
                class="w-full px-4 py-2 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm" />

              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                @click="showCurrentPassword = !showCurrentPassword">
                <svg v-if="!showCurrentPassword" class="fill-current" width="20" height="20" viewBox="0 0 20 20"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                    fill="#98A2B3" />
                </svg>

                <svg v-else class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                    fill="#98A2B3" />
                </svg>
              </button>
            </div>
          </div>

          <!-- New Password -->
          <div>
            <div class="flex items-center justify-between">
              <label class="block text-gray-700 mb-1">
                New Password
              </label>

              <span v-if="errors.new_password" class="text-red-500 text-sm">
                {{ errors.new_password }}
              </span>
            </div>

            <div class="relative">
              <input v-model="form.new_password" :type="showNewPassword ? 'text' : 'password'"
                placeholder="Please enter your new password..."
                class="w-full px-4 py-2 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm" />

              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                @click="showNewPassword = !showNewPassword">
                <svg v-if="!showNewPassword" class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                    fill="#98A2B3" />
                </svg>

                <svg v-else class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                    fill="#98A2B3" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <div class="flex items-center justify-between">
              <label class="block text-gray-700 mb-1">
                Confirm New Password
              </label>

              <span v-if="errors.new_password_confirmation" class="text-red-500 text-sm">
                {{ errors.new_password_confirmation }}
              </span>
            </div>

            <div class="relative">
              <input v-model="form.new_password_confirmation" :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Please confirm your new password..."
                class="w-full px-4 py-2 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm" />

              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                @click="showConfirmPassword = !showConfirmPassword">
                <svg v-if="!showConfirmPassword" class="fill-current" width="20" height="20" viewBox="0 0 20 20"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                    fill="#98A2B3" />
                </svg>

                <svg v-else class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                    fill="#98A2B3" />
                </svg>
              </button>
            </div>
          </div>

          <button @click="handleSubmit" :disabled="loading"
            class="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-md font-medium rounded-lg transition shadow-lg active:scale-95">
            {{ loading ? "Changing Password..." : "Change Password" }}
          </button>
        </div>

        <button @click="handleClose" class="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-2xl">
          &times;
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```
