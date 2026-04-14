<script setup lang="ts">
import { computed, onMounted } from "vue"

// =============================
// Props
// =============================
const props = defineProps<{
  modelValue: Record<string, number>
  data: { id: number; name: string; slug: string }[]
}>()

// =============================
// Emit
// =============================
const emit = defineEmits(["update:modelValue"])

// =============================
// Update single permission
// =============================
const updatePermission = (key: string, value: number) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [key]: value
  })
}

// =============================
// Toggle permission
// =============================
const toggle = (key: string) => {
  const current = props.modelValue?.[key] ?? 0
  updatePermission(key, current === 1 ? 0 : 1)
}

// =============================
// Types
// =============================
type PermissionAction = "view" | "create" | "edit" | "delete"

type ModuleActions = {
  [K in PermissionAction]: boolean
}

watch(() => props.modelValue, () => {
  emit('update:modelValue', props.modelValue)
})

// =============================
// Build modules from role data
// =============================
// const modules = computed(() => {
//   const map: Record<string, { key: string; label: string; actions: ModuleActions }> = {}

//   props.data?.forEach(p => {
//       const [action, module] = p.slug.split("-")
//       if (!module) return

//       if (!map[module]) {
//         map[module] = {
//           key: module,
//           label: module
//             .replace(/-/g, " ")
//             .replace(/\b\w/g, l => l.toUpperCase()),
//           actions: {
//             view: false,
//             create: false,
//             edit: false,
//             delete: false
//           }
//         }
//       }

//       if (action && action in map[module].actions) {
//         map[module].actions[action as PermissionAction] = true
//       }
//     })
//     return Object.values(map)
//   })
const modules = computed(() => {
  const map: Record<string, { key: string; label: string; actions: ModuleActions }> = {}

  props.data?.forEach(p => {
    const parts = p.slug.split("-")
    const module = parts.slice(1).join("-") // support multi word

    if (!module) return

    if (!map[module]) {
      map[module] = {
        key: module,
        label: module
          .replace(/-/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase()),

        // ✅ ALWAYS SHOW ALL
        actions: {
          view: true,
          create: true,
          edit: true,
          delete: true
        }
      }
    }
  })

  return Object.values(map)
})


// =============================
// Init missing permissions on load
// =============================
onMounted(() => {
  const updated = { ...props.modelValue }

  modules.value.forEach((m: any) => {
    if (m.actions.view && updated[`view-${m.key}`] === undefined)
      updated[`view-${m.key}`] = 0

    if (m.actions.create && updated[`create-${m.key}`] === undefined)
      updated[`create-${m.key}`] = 0

    if (m.actions.edit && updated[`edit-${m.key}`] === undefined)
      updated[`edit-${m.key}`] = 0

    if (m.actions.delete && updated[`delete-${m.key}`] === undefined)
      updated[`delete-${m.key}`] = 0
  })

  emit("update:modelValue", updated)
})

import { watch } from "vue"

watch(() => props.data, () => {
  const updated = { ...props.modelValue } // ✅ define here

  const actions = ["view", "create", "edit", "delete"]

  props.data?.forEach(p => {
    const parts = p.slug.split("-")
    const module = parts.slice(1).join("-")

    actions.forEach(action => {
      const key = `${action}-${module}`

      if (updated[key] === undefined) {
        updated[key] = 0
      }
    })
  })

  emit("update:modelValue", updated)
}, { immediate: true })

</script>

<template>
  <div class="overflow-x-auto mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
    <table class="w-full text-sm">

      <thead class="bg-gray-50 dark:bg-gray-800 text-xs uppercase">
        <tr>
          <th class="px-4 py-3 text-left">Module</th>
          <th class="px-4 py-3 text-center">View</th>
          <th class="px-4 py-3 text-center">Create</th>
          <th class="px-4 py-3 text-center">Edit</th>
          <th class="px-4 py-3 text-center">Delete</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="m in modules"
          :key="m.key"
          class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <td class="px-4 py-3 font-medium">
            {{ m.label }}
          </td>

          <!-- VIEW -->
          <td class="text-center">
            <input
              v-if="m.actions.view"
              type="checkbox"
              :checked="props.modelValue[`view-${m.key}`] === 1"
              @change="toggle(`view-${m.key}`)"
              class="w-4 h-4"
            />
          </td>

          <!-- CREATE -->
          <td class="text-center">
            <input
              v-if="m.actions.create"
              type="checkbox"
              :checked="props.modelValue[`create-${m.key}`] === 1"
              @change="toggle(`create-${m.key}`)"
              class="w-4 h-4"
            />
          </td>

          <!-- EDIT -->
          <td class="text-center">
            <input
              v-if="m.actions.edit"
              type="checkbox"
              :checked="props.modelValue[`edit-${m.key}`] === 1"
              @change="toggle(`edit-${m.key}`)"
              class="w-4 h-4"
            />
          </td>

          <!-- DELETE -->
          <td class="text-center">
            <input
              v-if="m.actions.delete"
              type="checkbox"
              :checked="props.modelValue[`delete-${m.key}`] === 1"
              @change="toggle(`delete-${m.key}`)"
              class="w-4 h-4"
            />
          </td>

        </tr>
      </tbody>

    </table>
  </div>
</template>