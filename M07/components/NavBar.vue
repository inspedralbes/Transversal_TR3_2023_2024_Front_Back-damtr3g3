<template>
  <header :class="{'bg-white': $colorMode.value === 'light', 'bg-gray-900': $colorMode.value === 'dark'}" class="shadow-sm">
    <nav class="container mx-auto p-4 flex justify-between">
      <NuxtLink to="/" class="font-bold">Inici</NuxtLink>
      <ul class="flex gap-4">
        <li><NuxtLink to="/">Inici</NuxtLink></li>
        <li><NuxtLink to="/processos">Processos</NuxtLink></li>
        <li><NuxtLink to="/sprites">Sprites</NuxtLink></li>
        <li><NuxtLink to="/stats">Stats</NuxtLink></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.router-link-exact-active {
  color: #12b488;
}
nav {
  font-size: 20px;
}
</style>
