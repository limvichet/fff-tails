<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator :height="3" color="#1C398E" :duration="3000" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>