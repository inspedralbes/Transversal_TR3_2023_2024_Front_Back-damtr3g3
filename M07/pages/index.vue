<template >
    <div class="container, h-screen dark:bg-slate-900">
        <br>
        <h3>Inici</h3> 
    </div>
</template>

<script setup>


</script>

<style scoped>

h3 {
    font-size: 24px;
}
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.content {
  max-width: 100%;
  max-height: 100%;
  overflow: auto; /* Si el contenido es más grande que el espacio disponible, permite el desplazamiento */
}
</style>