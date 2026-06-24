<template>
  <div
    :class="[
      'rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]',
      className,
    ]"
  >
    <div class="flex items-center justify-between px-6 py-3">
      <div>
        <h3 class="text-base font-medium text-blue-900 dark:text-white/90">
          {{ title }}
        </h3>
        <p v-if="desc" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ desc }}
        </p>
      </div>

      <button
        v-if="hasAdd"
        type="button"
        @click="emit('add')"
        class="inline-flex items-center gap-1.5 rounded-full bg-blue-400 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition"
      >
        <span class="relative d-block w-3 h-3 flex items-center justify-center">
          <span class="absolute w-full h-0.5 bg-white rounded-full"></span>
          <span class="absolute h-full w-0.5 bg-white rounded-full"></span>
        </span>
        Create
      </button>
    </div>

    <div class="p-2 border-t border-gray-100 dark:border-gray-800 sm:p-6">
      <div class="space-y-5">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  className?: string
  desc?: string
  hasAdd?: boolean // Prop to toggle visibility
}

defineProps<Props>()

// Emits an event to the parent when clicked
const emit = defineEmits<{
  (e: 'add'): void
}>()
</script>