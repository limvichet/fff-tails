<script setup lang="ts">
import { ref, watch } from "vue"

interface WorkHistory {
  id: number
  description: string
  date: string
  end_date: string
}

// v-model
const props = defineProps<{
  modelValue: WorkHistory[]
}>()

const emit = defineEmits(["update:modelValue"])

const maxRow = 5
let counter = 1

const workHistories = ref<WorkHistory[]>([])

// init from parent
watch(
  () => props.modelValue,
  (val) => {
    workHistories.value = val?.length
      ? [...val]
      : [
          {
            id: 1,
            description: "",
            date: "",
            end_date: ""
          }
        ]

    counter = workHistories.value.length
  },
  { immediate: true }
)

// emit to parent
watch(
  workHistories,
  (val) => emit("update:modelValue", val),
  { deep: true }
)

// ➕ Add row
const addRow = () => {
  if (workHistories.value.length >= maxRow) return

  counter++

  workHistories.value.push({
    id: counter,
    description: "",
    date: "",
    end_date: ""
  })
}

// ❌ Remove row
const removeRow = (index: number) => {
  workHistories.value.splice(index, 1)
}

// date formatter (dd-mm-yyyy)
const formatDate = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{2})(\d{4})/, "$1-$2-$3")
}
</script>

<template>
  <div>
    <h1 class="text-md font-semibold mb-3">
      <span class="mr-1">Work History</span>
    </h1>

    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200">
        <thead class="bg-gray-100 text-sm">
          <tr>
            <th class="w-[60%] text-left px-3 py-2">Description</th>
            <th class="w-[20%] text-left px-1 py-2">Start Date</th>
            <th class="w-[20%] text-left px-1 py-2">End Date</th>
            <th class="text-center px-1 py-2">
              <button
                type="button"
                @click="addRow"
                class="bg-blue-500 text-white px-2 py-1 rounded"
              >
                +
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in workHistories"
            :key="item.id"
            class="border-t"
          >
            <!-- Description -->
            <td class="px-3 py-1">
              <input
                v-model="item.description"
                type="text"
                class="w-full border rounded px-2 py-1"
                placeholder="Work description"
              />
            </td>

            <!-- Start Date -->
            <td class="px-1 py-2">
              <input
                v-model="item.date"
                type="text"
                maxlength="10"
                @input="item.date = formatDate(item.date)"
                class="w-full border rounded px-2 py-1"
                placeholder="dd-mm-yyyy"
              />
            </td>

            <!-- End Date -->
            <td class="px-1 py-2">
              <input
                v-model="item.end_date"
                type="text"
                maxlength="10"
                @input="item.end_date = formatDate(item.end_date)"
                class="w-full border rounded px-2 py-1"
                placeholder="dd-mm-yyyy"
              />
            </td>

            <!-- Remove -->
            <td class="text-center px-1 py-2">
              <button
                type="button"
                @click="removeRow(index)"
                class="bg-red-500 text-white px-2 py-1 rounded"
              >
                -
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>