<template>
  <div class="container">
    <header>
      <h1>Vue 3 + Vite + TS</h1>
      <nav>
        <RouterLink to="/">Q10: Products List (Seen In)</RouterLink>
        <span> | </span>
        <RouterLink to="/blogs">Q12: Blogs</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
  max-width: 880px;
  margin: 40px auto;
  padding: 0 16px;
}
header {
  margin-bottom: 24px;
}
nav a {
  color: #42b883;
}
</style>
