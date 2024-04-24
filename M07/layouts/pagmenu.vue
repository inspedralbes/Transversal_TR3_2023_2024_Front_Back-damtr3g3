<template>
    <div class="main-layout">
      <NavBar />
    </div>
    <Footer />
  </template>
  
  <script>
  export default {
    components: {
      Footer: () => import('@/components/Footer.vue'),
      NavBar: () => import('@/components/NavBar.vue')
    }
  }
  </script>
  
  <style>
.main-layout {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-image: url('../assets/fons5.png');
  background-size: 1930px 955px;
  background-repeat: no-repeat;
}
</style>
  