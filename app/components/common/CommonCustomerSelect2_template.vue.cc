<script setup lang="ts">


/* Native select2 */
// Search input
const search = ref("")
const isOpen = ref(false)
const highlightedIndex = ref(0)

// 0.1 - filteredCustomers
const filteredCustomers = computed(() => {
  if (!search.value) return customerName1.value
  const term = search.value.toLowerCase()
  return customerName1.value.filter(c =>
    String(c.id).includes(term) || c.label.toLowerCase().includes(term)
  )
})

// 0.2 - selectCustomer
function selectCustomer(c: { id: number; label: string }) {
  form.cust_id = c.id
  search.value = c.label
  isOpen.value = false
  highlightedIndex.value = 0
}

// 0.3 - filteredCustomers
function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === "ArrowDown") {
    highlightedIndex.value =
      (highlightedIndex.value + 1) % filteredCustomers.value.length
    e.preventDefault()
  } else if (e.key === "ArrowUp") {
    highlightedIndex.value =
      (highlightedIndex.value - 1 + filteredCustomers.value.length) %
      filteredCustomers.value.length
    e.preventDefault()
  } else if (e.key === "Enter") {
    selectCustomer(filteredCustomers.value[highlightedIndex.value])
    e.preventDefault()
  } else if (e.key === "Escape") {
    isOpen.value = false
  }
}



// Click outside to close dropdown
function clickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest(".select-container")) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", clickOutside)
})

// Keep <select> in sync with custom input
watch(form, () => {
  const selected = customerName1.value.find(c => c.id === form.cust_id)
  if (selected) search.value = selected.label
})

/*  end Native select2 */
</script>

<template>
      <!-- Native select2 cust_id-->
      <div class="relative select-container">
        <div class="flex items-center justify-between">
          <label class="label">Customer<span class="text-red-500 text-sm"> *</span></label>
          <span class="text-red-500 text-sm">{{ errors.cust_id }}</span>
        </div>

        <!-- Native select (hidden, just for v-model sync) -->
        <select v-model.number="form.cust_id" class="input w-full" @click.prevent="isOpen = true">
          <option disabled value="-1" class="hidden">Choose ...</option>
          <option v-for="c in customerName1" :key="c.id" :value="c.id" class="hidden">
            {{ c.label }}
          </option>
        </select>

        <!-- Search input -->
        <div v-if="isOpen" class="absolute z-10 w-full mt-1">
          <input 
            type="text" 
            v-model="search" 
            @keydown="onKeydown" 
            placeholder="Search ..."
            class="input w-full border rounded px-3 py-2 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            autocomplete="off" 
          />

          <!-- Dropdown -->
          <ul v-if="filteredCustomers.length"
            class="absolute z-10 w-full mt-1 max-h-40 overflow-auto border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700">
            <li v-for="(c, index) in filteredCustomers" :key="c.id" @mousedown.prevent="selectCustomer(c)"
              @mouseenter="highlightedIndex = index" :class="[
                'px-3 py-1 cursor-pointer transition-colors',
                index === highlightedIndex
                  ? 'bg-blue-500 text-white dark:bg-blue-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
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
}


</style>