<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1>Lezkorp</h1>
    <nav>
      <RouterLink to="/">Productos</RouterLink>
      <RouterLink to="/ventas">Ventas</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView /> 
  </main>
</template>