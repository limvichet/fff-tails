<template>
  <div class="min-h-screen">
    <main>
      <slot></slot>
      <div class="fixed bottom-10 right-10 z-[99]">
        <common-theme-toggler size="lg"/>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts"></script>
