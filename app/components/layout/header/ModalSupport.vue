<script setup lang="ts">

import { SUPPORT_INFO } from "@/constants/support"

const props = defineProps<{isOpen: boolean}>()
const emit = defineEmits(["close"])
const handleClose = () => emit("close")
const supportInfo = SUPPORT_INFO

</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      @click.self="handleClose"
    >
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <!-- HEADER -->
        <div class="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
          <h2 class="text-xl font-semibold text-blue-800">
            {{ supportInfo.title }}
          </h2>

          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <!-- BODY -->
        <div class="space-y-4 text-gray-700">

          <p class="text-sm text-gray-500">
            {{ supportInfo.description }}
          </p>

          <div>
            <div class="text-sm text-gray-400">Phone</div>
            <div class="font-medium">{{ supportInfo.phone }}</div>
          </div>

          <div>
            <div class="text-sm text-gray-400">Email</div>
            <div class="font-medium">{{ supportInfo.email }}</div>
          </div>

          <div>
            <div class="text-sm text-gray-400">Telegram</div>
            <div class="font-medium">{{ supportInfo.telegram }}</div>
          </div>

          <div>
            <div class="text-sm text-gray-400">Working Hours</div>
            <div class="font-medium">{{ supportInfo.workingHours }}</div>
          </div>

        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>