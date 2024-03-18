<template>
  <div class="dark:bg-slate-900">
    <NavBar />
    <div class="container mx-auto p-4, dark:text-white">
      <slot />
    </div>
    <Footer/>
  </div>
</template>



<script>
export default {
  components: {
    Footer: () => import('@/components/Footer.vue'),
    NavBar: () => import('@/components/NavBar.vue')
  }
}

</script>
