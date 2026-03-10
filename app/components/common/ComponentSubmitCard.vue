<template>
  <div
    :class="[
      'rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex flex-col h-full',
      className,
    ]"
  >
    <!-- Card Header -->
    <div class="px-6 py-2">
      <h3 class="text-base font-medium text-blue-900 dark:text-white/90">
        {{ title }}
      </h3>
      <p v-if="desc" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ desc }}
      </p>
    </div>

    <!-- Card Body -->
    <div class="p-2 border-t border-gray-100 dark:border-gray-800 sm:p-6 flex-1 flex flex-col">
      <div class="space-y-5 flex-1">
        <slot></slot>
      </div>
      <!-- Button/Footer at bottom -->
      <div class="mt-auto flex justify-end space-x-2">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  className?: string
  desc?: string
}
defineProps<Props>()
</script>