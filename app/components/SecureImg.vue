<template>
  <img v-if="imgSrc" :src="imgSrc" :alt="alt" v-bind="$attrs" />
  <div v-else class="img-placeholder">Loading image securely...</div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Secure Asset'
  }
})

const imgSrc = ref(null)

// Function to fetch the image with your Nuxt authentication headers
const fetchSecureImage = async (url) => {
  if (!url) return

  try {
    // Replace '$useApi' or '$fetch' with whatever Axios/Fetch instance you use that has your Auth Token attached
    const response = await $fetch(url, {
      method: 'GET',
      responseType: 'blob' // 👈 CRITICAL: Tells Nuxt to treat the response as file data, not JSON
    })

    // Revoke old object URL if it exists to prevent memory leaks
    if (imgSrc.value) {
      URL.revokeObjectURL(imgSrc.value)
    }

    // Convert the raw file binary into a local URL the browser <img> tag understands
    imgSrc.value = URL.createObjectURL(response)
  } catch (error) {
    console.error('Failed to load secure image:', error)
  }
}

// Watch for source changes if the customer updates dynamically
watch(() => props.src, (newUrl) => {
  fetchSecureImage(newUrl)
}, { immediate: true })

// Clean up memory when the component unmounts
onUnmounted(() => {
  if (imgSrc.value) {
    URL.revokeObjectURL(imgSrc.value)
  }
})
</script>

<style scoped>
.img-placeholder {
  background: #f3f4f6;
  padding: 20px;
  text-align: center;
  color: #9ca3af;
}
</style>