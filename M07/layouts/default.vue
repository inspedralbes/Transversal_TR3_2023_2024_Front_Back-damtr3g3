<template>
  <div>
    <NavBar />
    <div class="container mx-auto p-4">
      <slot />
    </div>
    
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

