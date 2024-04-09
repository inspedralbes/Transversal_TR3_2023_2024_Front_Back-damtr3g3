<template>
    <div class="layout">
      <NavBar />
      <div class="main-content">
        <SideBar />
        <div class="container mx-auto p-4 content">
          <slot />
        </div>
      </div>
      <Footer />
    </div>
  </template>
  
  <script>
  export default {
    components: {
      Footer: () => import('@/components/Footer.vue'),
      NavBar: () => import('@/components/NavBar.vue'),
      SideBar: () => import('@/components/SideBar.vue')
    }
  }
  </script>
  
  <style scoped>
  .layout {
    display: flex;
    flex-direction: column;
  }
  
  .main-content {
    display: flex;
  }
  
  .content {
    flex-grow: 1;
  }
  
  /* Añade aquí los estilos para tu barra lateral */
  </style>
  