<script setup lang="ts">

const props = withDefaults(defineProps<{
  label: string;
  modelValue: number | null;
  required?: boolean;
  error?: string;
  options?: { id: number; label: string }[];
}>(), {
  options: () => []
})

const emit = defineEmits(["update:modelValue"])

const search = ref("")
const isOpen = ref(false)
const highlightedIndex = ref(0)

// const filtered = computed(() => {
//   if (!search.value) return props.options
//   const term = search.value.toLowerCase()
//   return props.options.filter((c: any) =>
//     String(c.id).includes(term) ||
//     c.label.toLowerCase().includes(term)
//   )
// })

const filtered = computed(() => {
  let list = props.options

  if (search.value) {
    const term = search.value.toLowerCase()
    list = list.filter((c: any) =>
      String(c.id).includes(term) ||
      c.label.toLowerCase().includes(term)
    )
  }

  // ✅ sort DESC
  return [...list].sort((a, b) => b.id - a.id)
})

function selectItem(c: any) {
  emit("update:modelValue", c.id)
  search.value = c.label
  isOpen.value = false
  highlightedIndex.value = 0
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return

  if (e.key === "ArrowDown") {
    highlightedIndex.value =
      (highlightedIndex.value + 1) % filtered.value.length
  } else if (e.key === "ArrowUp") {
    highlightedIndex.value =
      (highlightedIndex.value - 1 + filtered.value.length) %
      filtered.value.length
  } else if (e.key === "Enter") {
    selectItem(filtered.value[highlightedIndex.value])
  } else if (e.key === "Escape") {
    isOpen.value = false
  }
}

watch(() => props.modelValue, (val) => {
  const selected = props.options.find((c: any) => c.id === val)
  if (selected) search.value = selected.label
}, { immediate: true })

function clickOutside(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest(".select-container")) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", clickOutside)
})
</script>

<template>
  <div class="relative select-container">

    <!-- label -->
    <div class="flex items-center justify-between">
        <label class="label">{{ label }}   <span v-if="required" class="text-red-500 text-sm"> *</span>
        </label>
        <span class="text-red-500 text-sm">{{ error }}</span>
    </div>

    <!-- Native select (hidden, just for v-model sync) -->
    <select 
      :value="modelValue"
      class="input w-full" 
      @change="$emit('update:modelValue', Number(($event.target as HTMLSelectElement).value))"      
      @click.prevent="isOpen = true"
    >
        <option disabled value="-1" class="hidden">Choose ...</option>
        <option v-for="c in options" :key="c.id" :value="c.id" class="hidden">
        {{ c.label }}
        </option>
    </select>

    <div v-if="isOpen" class="absolute z-10 w-full mt-1">
        <!-- Search input -->
        <input
          type="text"
          v-model="search"
          @focus="isOpen = true"
          @keydown="onKeydown"
          placeholder="Search..."
          class="input w-full border rounded px-3 py-2 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        <!-- Dropdown -->
        <ul v-if="isOpen && filtered.length"
          class="absolute z-10 w-full bg-white border rounded text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 max-h-60 overflow-y-auto">
          <li v-for="(c, index) in filtered"
              :key="c.id"
              @mousedown.prevent="selectItem(c)"
              @mouseenter="highlightedIndex = index"
              :class="[
                'px-3 py-1 cursor-pointer text-[14px]',
                index === highlightedIndex ? 'bg-blue-500 text-white' : ''
              ]">
            {{ c.id }} - {{ c.label }}
          </li>
        </ul>
    </div>

  </div>
</template>

<style scoped>

.label{
display:block;
margin-bottom:4px;
font-size:14px;
color:#555;
}

.input{
width:100%;
border:1px solid #ddd;
border-radius:8px;
padding:8px 12px;
font-size: 13px;
}


</style>