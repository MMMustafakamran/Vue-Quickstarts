<script setup lang="ts">
import { CopilotKitProvider, CopilotChat } from "@copilotkit/vue/v2";
</script>

<template>
  <!-- HARNESS: runtime port 8160 (doc: 8200; server.ts honours PORT, App.vue hardcodes the URL) -->
  <CopilotKitProvider
    runtime-url="http://localhost:8160/api/copilotkit"
  >
    <div style="height: 100vh">
      <CopilotChat />
    </div>
  </CopilotKitProvider>
</template>
