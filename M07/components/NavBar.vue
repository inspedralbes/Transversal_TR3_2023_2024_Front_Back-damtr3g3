<template>
    <header class="shadow-sm bg-white">
      <nav class="container mx-auto p-4 flex justify-between">
        <NuxtLink to="/"><img src="../public/favicon.ico" alt="Inici" class="font-bold" width="50px"/></NuxtLink>
        <ul class="flex gap-4">
          <li><NuxtLink to="/">Inici</NuxtLink></li>
          <li><NuxtLink to="/processos">Processos</NuxtLink></li>
          <li><NuxtLink to="/sprites">Sprites</NuxtLink></li>
          <li><NuxtLink to="/broadcast">Broadcast</NuxtLink></li>
          <li><NuxtLink to="/settings">Settings</NuxtLink></li>
          <li><NuxtLink to="/stats">Estadístiques</NuxtLink></li>
        </ul>
      </nav>
    </header>
  </template>

  
<style scoped>
.router-link-exact-active {
  color: #12b488;
}
nav{
  font-size: 20px;
}
</style>
