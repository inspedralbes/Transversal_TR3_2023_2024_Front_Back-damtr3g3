<template>
    <div class="sidebar">
      <h2>Sidebar</h2>
      <p>{{ currentDate }}</p>
    </div>
  </template>
  
  <script>
  export default {
      data() {
          return {
              currentDate: ''
          };
      },
      mounted() {
          this.getCurrentDate();
      },
      methods: {
          getCurrentDate() {
              const date = new Date();
              this.currentDate = date.toLocaleDateString();
          }
      }
  };
  </script>
  
  <style scoped>
  .sidebar {
      width: 400px;
      background-color: lightblue;
      padding: 20px;
      height: calc(100vh - 60px); /* Ajusta este valor según la altura de tu NavBar y Footer */
      overflow: auto; /* Asegura que el contenido extra se desplace */
  }
  </style>
  