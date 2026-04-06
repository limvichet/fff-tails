<script setup lang="ts">
import { ref } from 'vue'

// 1. Define Props (Correctly receiving from parent)
const props = defineProps<{
  isOpen: boolean
}>()

// 2. Define Emits
const emit = defineEmits(['close'])

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 3. Update Close Logic
const handleClose = () => {
  // Reset form
  form.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  // Tell parent to set isPasswordModalOpen to false
  emit('close')
}

const handleSubmit = () => {
  // API Call logic here
  console.log("Changing password...", form.value)
  handleClose()
}
</script>

<template>
  <Transition name="fade">
    <div v-if="props.isOpen" 
         class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" 
         @click.self="handleClose">
      
      <div class="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-2xl mx-4 relative">
        
        <h2 class="text-3xl text-gray-800 mb-2">Change Password</h2>
        <p class="text-gray-500 mb-6 text-sm">Please enter your old and new password to change it!</p>

        <div class="space-y-5">
          <div>
            <label class="block font-semid-bold text-gray-700 mb-2">Old Password</label>
            <input 
              v-model="form.oldPassword"
              type="password" 
              placeholder="Please enter your old password..." 
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm"
            />
          </div>

          <div>
            <label class="block font-semid-bold text-gray-700 mb-2">New Password</label>
            <input 
              v-model="form.newPassword"
              type="password" 
              placeholder="Please enter your new password..." 
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm"
            />
          </div>

          <div>
            <label class="block font-semid-bold text-gray-700 mb-2">Confirm New Password</label>
            <input 
              v-model="form.confirmPassword"
              type="password" 
              placeholder="Please confirm your new password..." 
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition shadow-sm"
            />
          </div>

          <button 
            @click="handleSubmit"
            class="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-600 text-white text-md font-medium rounded-lg transition shadow-lg active:scale-95"
          >
            Change Password
          </button>
        </div>

        <button @click="handleClose" 
        class="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>