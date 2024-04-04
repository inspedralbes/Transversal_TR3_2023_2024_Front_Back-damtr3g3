<template>
  <div class="flex justify-center">
    <section class="border rounded p-4 m-2">
      <h2 class="text-center">Procesos Iniciats</h2>
      <button 
        v-if="!processRunning" 
        @click="startDockerContainer" 
        class="px-4 py-2 mt-4 rounded text-white bg-green-500 w-full"
      >
        Iniciar process
      </button>
    </section>

    <section class="border rounded p-4 m-2">
      <h2 class="text-center">Procesos Aturats</h2>
      <button 
        v-if="processRunning" 
        @click="stopDockerContainer" 
        class="px-4 py-2 mt-4 rounded text-white bg-red-500 w-full"
      >
        Aturar process
      </button>
    </section>
  </div>
</template>

<script>
import { startContainer, stopContainer } from '../services/communicationsManager';

export default {
  data() {
    return {
      processRunning: false
    };
  },
  methods: {
    async startDockerContainer() {
      const response = await startContainer();
      console.log(response);
      if (response === 'Starting container') {
        this.processRunning = true;
      }
    },
    async stopDockerContainer() {
      const response = await stopContainer();
      console.log(response);
      if (response === 'Shutting down container') {
        this.processRunning = false;
      }
    }
  }
};
</script>

<style scoped>
h2 {
  font-size: 24px;
}
</style>
