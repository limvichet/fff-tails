<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  // This can now handle the messy API object or a clean array
  err: string[] | Record<string, string[]> | null | undefined;
}>();

const errorMessage = computed(() => {
  if (!props.err) return "";

  // 1. If it's an array ["Message"], take the first item
  if (Array.isArray(props.err)) {
    return props.err[0];
  }

  // 2. If it's an object { "email": ["Message"] }, 
  // extract the values, flatten them, and take the first string found.
  const values = Object.values(props.err).flat();
  return values.length > 0 ? values[0] : "";
});
</script>

<template>
  <div 
    v-if="errorMessage" 
    class="w-full rounded-md border border-red-200 bg-red-50 p-3"
  >
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 shrink-0">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      
      <p class="text-sm font-medium text-red-800">
        {{ errorMessage }}
      </p>
    </div>
  </div>
  <div 
    v-else="errorMessage" 
    class="w-full rounded-md border border-red-200 bg-red-50 p-3"
  >
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 shrink-0">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      
      <p class="text-sm font-medium text-red-800">
      </p>
    </div>
  </div>
</template>