<template>
  <div class="hidden lg:block">
    <nav aria-label="Breadcrumb">
      <ol class="flex items-center gap-1.5">
        <li>
          <NuxtLink 
            class="text-sm text-gray-500 hover:text-primary dark:text-gray-400" 
            to="/app/dashboard"
          >
            Home
          </NuxtLink>
        </li>
        
        <li v-if="pageTitle" class="flex items-center gap-1.5 text-sm text-gray-800 dark:text-white/90">
          <ChevronRightIcon class="text-gray-400" />
          <span :class="{ 'font-medium': !pageSubTitle }">
            {{ pageTitle }}
          </span>
        </li>

        <li v-if="pageSubTitle" class="flex items-center gap-1.5 text-sm text-gray-800 dark:text-white/90 font-medium">
          <ChevronRightIcon class="text-gray-400" />
          <span>{{ pageSubTitle }}</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">

  interface BreadcrumbProps {
    pageTitle?: string
    pageSubTitle?: string
  }

  defineProps<BreadcrumbProps>()

  const ChevronRightIcon = () => h('svg', {
    class: "stroke-current",
    width: "17",
    height: "16",
    viewBox: "0 0 17 16",
    fill: "none",
  }, [
    h('path', {
      d: "M6.0765 12.667L10.2432 8.50033L6.0765 4.33366",
      stroke: "currentColor",
      'stroke-width': "1.2",
      'stroke-linecap': "round",
      'stroke-linejoin': "round"
    })
  ])
  
</script>