<template>
  <div class="studio-fullscreen">
    <div class="studio-floating-tools">
      <StudioLanguageSwitcher compact />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import StudioLanguageSwitcher from '~/components/StudioLanguageSwitcher.vue'
</script>

<style scoped>
.studio-fullscreen { height: 100vh; display: flex; flex-direction: column; overflow: hidden; background: var(--bg-base); }
.studio-floating-tools {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 40;
}
</style>
