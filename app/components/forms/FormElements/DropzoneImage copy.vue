<template>
  <div class="w-full max-w-md mx-auto p-4">
    <div
      :id="dropzoneId"
      class="dropzone group relative flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-400 bg-white transition-all hover:bg-slate-50 cursor-pointer overflow-hidden"
    >
      <div v-if="!fileName" class="dz-message m-0 flex flex-col items-center">
        <div class="mb-4 text-blue-500 opacity-60">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <p class="text-blue-400 font-medium text-sm text-center leading-tight">
          Brows File to upload!
        </p>
      </div>

      <div id="preview-slot" class="w-full h-full flex items-center justify-center p-4"></div>
    </div>

    <div 
      class="mt-3 flex items-center justify-between rounded-2xl p-3 text-slate-800 border transition-all shadow-sm"
      :class="fileName ? 'bg-[#b3d4fc] border-blue-300' : 'bg-blue-50 border-blue-100'"
    >
      <div class="flex items-center gap-3 overflow-hidden">
        <div :class="fileName ? 'text-blue-600' : 'text-blue-400'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <rect x="8" y="13" width="8" height="5" rx="1"></rect>
            <circle cx="10.5" cy="15.5" r="0.5"></circle>
            <path d="M16 18l-2-2-2 2"></path>
          </svg>
        </div>
        <span class="truncate text-sm tracking-tight">
          {{ fileName || 'Not selected file' }}
        </span>
      </div>
      
      <button v-if="fileName" @click.stop="clearFile" class="hover:scale-110 transition-transform shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#f34141]" viewBox="0 0 18 18" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </button>

      <div v-else class="text-slate-900 opacity-60">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 18 18" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'

const props = defineProps({
  uploadUrl: { type: String, default: '/upload' },
})

const fileName = ref('')
const dropzoneId = `dz-${Math.random().toString(36).slice(2, 7)}`
let dropzoneInstance = null

const clearFile = () => {
  if (dropzoneInstance) {
    dropzoneInstance.removeAllFiles(true)
    fileName.value = ''
  }
}

onMounted(() => {
  Dropzone.autoDiscover = false

  dropzoneInstance = new Dropzone(`#${dropzoneId}`, {
    url: props.uploadUrl,
    maxFiles: 1,
    acceptedFiles: 'image/*',
    previewsContainer: '#preview-slot',
    thumbnailWidth: 1000,
    thumbnailHeight: null,
    previewTemplate: `
      <div class="dz-preview dz-image-preview w-full h-full flex items-center justify-center">
        <div class="dz-image w-full h-full flex justify-center items-center overflow-hidden rounded-xl">
          <img data-dz-thumbnail class="max-h-[260px] max-w-full object-contain transition-transform duration-300 ease-in-out hover:scale-110 cursor-zoom-in" />
        </div>
      </div>
    `,
    init: function () {
      this.on('addedfile', (file) => {
        if (this.files.length > 1) this.removeFile(this.files[0])
        fileName.value = file.name

        // Click to preview in new page logic
        file.previewElement.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          if (file.dataURL) {
            const newWindow = window.open()
            newWindow.document.write(`<img src="${file.dataURL}" style="max-width:100%">`)
          }
        })
      })
      this.on('removedfile', () => {
        fileName.value = ''
      })
    },
  })
})

onBeforeUnmount(() => {
  if (dropzoneInstance) dropzoneInstance.destroy()
})
</script>

<style scoped>
:deep(.dz-preview), 
:deep(.dz-image), 
:deep(.dz-image img) {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
  opacity: 1 !important;
}

/* Hover Resize specific styling */
:deep(.dz-image img) {
  transition: transform 0.3s ease;
}

:deep(.dz-details), :deep(.dz-progress), :deep(.dz-error-message), 
:deep(.dz-success-mark), :deep(.dz-error-mark) {
  display: none !important;
}

:deep(.dz-preview) { margin: 0 !important; }
</style>