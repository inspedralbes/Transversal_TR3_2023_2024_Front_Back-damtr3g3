<template>
  <div class="container, h-screen dark:bg-slate-900">
    <br>  
  <div class="flex justify-center">
    <section class="border rounded p-4 m-2">
      <h2 class="text-center">Procesos Iniciats</h2>
      <button 
        v-if="!processRunning" 
        @click="toggleProcess" 
        class="px-4 py-2 mt-4 rounded text-white bg-green-500 w-full"
      >
        Iniciar process
      </button>
    </section>

    <section class="border rounded p-4 m-2">
      <h2 class="text-center">Procesos Aturats</h2>
      <button 
        v-if="processRunning" 
        @click="toggleProcess" 
        class="px-4 py-2 mt-4 rounded text-white bg-red-500 w-full"
      >
        Aturar process
      </button>
    </section>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      processRunning: false
    };
  },
  methods: {
    toggleProcess() {
      this.processRunning = !this.processRunning;
    }
  }
};
</script>

<style scoped>
h2 {
  font-size: 24px;
}
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
