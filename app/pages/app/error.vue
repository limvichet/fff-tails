<script setup lang="ts">
definePageMeta({
  layout: false // optional: removes default layout
})

const error = useError()
</script>
<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 px-4 text-center">
    <!-- Status Code -->
    <h1 class="text-6xl font-bold mb-4">{{ error?.statusCode || 'Error' }}</h1>

    <!-- Status Message -->
    <p class="text-xl mb-6 text-gray-400">
      {{ error?.statusMessage || 'Something went wrong' }}
    </p>

    <!-- Optional extra info for 500 -->
    <p v-if="error?.statusCode === 500" class="mb-6 text-gray-500 max-w-md">
      Please try again later or contact support if the problem persists.
    </p>

    <!-- Home Button -->
    <NuxtLink
      to="/"
      class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-semibold transition"
    >
      Go Back Home
    </NuxtLink>
  </div>
</template>

