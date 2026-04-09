<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      // Use replace: true to prevent the 'index' page from staying in browser history
      return navigateTo('/app/dashboard', { redirectCode: 301 })
    },
  ],
});
</script>

<!-- <script setup lang="ts">
import { onMounted } from "vue"

onMounted(() => {
  navigateTo("/app/signin", { replace: true })
})

</script>

<template>
  <div class="p-4 text-center text-gray-500">
    Redirecting...
  </div>
</template> -->