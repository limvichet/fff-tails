<script setup lang="ts">
import { ref, watch } from "vue"

interface Education {
  id: number
  description: string
  date: string
}

// props (v-model)
const props = defineProps<{
  modelValue: Education[]
}>()

const emit = defineEmits(["update:modelValue"])

const maxRow = 5
let counter = 1

// local state
const educations = ref<Education[]>([])

// init from parent
watch(
  () => props.modelValue,
  (val) => {
    educations.value = val?.length ? [...val] : [
      { id: 1, description: "", date: "" }
    ]
    counter = educations.value.length
  },
  { immediate: true }
)

// emit to parent
watch(
  educations,
  (val) => emit("update:modelValue", val),
  { deep: true }
)

// ➕ Add row
const addRow = () => {
  if (educations.value.length >= maxRow) return
  counter++

  educations.value.push({
    id: counter,
    description: "",
    date: ""
  })
}

// ❌ Remove row
const removeRow = (index: number) => {
  educations.value.splice(index, 1)
}

// simple date format
const formatDate = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{2})(\d{4})/, "$1-$2-$3")
}
</script>

<template>
  <div>
    <h1 class="text-md font-semibold mb-3">
      <span class="mr-1"></span> Education Info
    </h1>

    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200">
        <thead class="bg-gray-100 text-sm">
          <tr>
            <th class="w-[70%] text-left px-3 py-2">Description</th>
            <th class="w-[30%] text-left px-3 py-2">Date</th>
            <th class="text-center px-3 py-2">
            <button type="button" @click="addRow"
            class="bg-blue-500 text-white px-2 py-1 rounded">
            +
            </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in educations"
            :key="item.id"
            class="border-t"
          >
            <!-- Description -->
            <td class="px-3 py-2">
              <input
                v-model="item.description"
                type="text"
                class="w-full border rounded px-2 py-1 focus:outline-none focus:ring"
                placeholder="Description"
              />
            </td>

            <!-- Date -->
            <td class="px-3 py-2">
              <input
                v-model="item.date"
                type="text"
                maxlength="10"
                @input="item.date = formatDate(item.date)"
                class="w-full border rounded px-2 py-1 focus:outline-none focus:ring"
                placeholder="dd-mm-yyyy"
              />
            </td>

            <!-- Remove -->
            <td class="text-center px-3 py-2">
            <!-- REMOVE -->
            <button type="button" @click="removeRow(index)"
            class="bg-red-500 text-white px-2 py-1 rounded">
            -
            </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>