<template>
  <router-link to="/" class="lg:hidden">
    <img class="dark:hidden" src="/imgs/logo.svg" alt="Logo" />
    <img class="hidden dark:block " src="/imgs/logo.svg" alt="Logo" />
  </router-link>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
