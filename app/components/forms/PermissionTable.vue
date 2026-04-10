<script setup lang="ts">
// Defined as a model so the parent can access the state easily
const model = defineModel<Record<string, number>>({ default: () => ({}) })

interface PermissionModule {
  key: string;
  label: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

const modules = ref<PermissionModule[]>([
  { key: 'customer', label: 'Customers', canView: true, canCreate: true, canEdit: true, canDelete: true },
  { key: 'loan', label: 'Loans', canView: true, canCreate: true, canEdit: true, canDelete: true },
  { key: 'schedule', label: 'Schedules', canView: true, canCreate: true, canEdit: true, canDelete: true },
  { key: 'payment', label: 'Payments', canView: true, canCreate: true, canEdit: true, canDelete: true },
  { key: 'administrative-tool', label: 'Administrative Tools', canView: true, canCreate: true, canEdit: true, canDelete: true },
])

// Initialize keys in model if they don't exist
onMounted(() => {
  modules.value.forEach(m => {
    if (model.value[`view-${m.key}`] === undefined) model.value[`view-${m.key}`] = 0
    if (model.value[`create-${m.key}`] === undefined) model.value[`create-${m.key}`] = 0
    if (model.value[`edit-${m.key}`] === undefined) model.value[`edit-${m.key}`] = 0
    if (model.value[`delete-${m.key}`] === undefined) model.value[`delete-${m.key}`] = 0
  })
})

const toggle = (key: string) => {
  model.value[key] = model.value[key] === 1 ? 0 : 1
}
</script>

<template>
  <div class="overflow-x-auto mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
        <tr>
          <th class="px-4 py-3">Module Name</th>
          <th class="px-4 py-3 text-center">Read</th>
          <th class="px-4 py-3 text-center">Create</th>
          <th class="px-4 py-3 text-center">Update</th>
          <th class="px-4 py-3 text-center">Delete</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="m in modules" :key="m.key" class="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
          <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
            {{ m.label }}
          </td>
          
          <td class="px-4 py-3 text-center">
            <input type="checkbox" :checked="model[`view-${m.key}`] === 1" @change="toggle(`view-${m.key}`)"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
          </td>

          <td class="px-4 py-3 text-center">
            <input type="checkbox" :checked="model[`create-${m.key}`] === 1" @change="toggle(`create-${m.key}`)"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
          </td>

          <td class="px-4 py-3 text-center">
            <input type="checkbox" :checked="model[`edit-${m.key}`] === 1" @change="toggle(`edit-${m.key}`)"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
          </td>

          <td class="px-4 py-3 text-center">
            <input type="checkbox" :checked="model[`delete-${m.key}`] === 1" @change="toggle(`delete-${m.key}`)"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>