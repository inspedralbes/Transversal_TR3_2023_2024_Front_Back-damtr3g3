<template>
  <div>
    <h2>Configuración</h2>
    <div>
      <label for="velocidad-tronco">Velocidad del tronco:</label>
      <input type="range" id="velocidad-tronco" min="0" max="100" step="1" style="background-color: #0074d9;" @input="updateVelocidadTronco">
      <span id="valor-velocidad-tronco">{{ velocidadTronco }}</span>
    </div>
    <div>
      <label for="empuje-tronco">Empuje del tronco:</label>
      <input type="number" id="empuje-tronco">
    </div>
    <div>
      <label for="salto">Salto:</label>
      <input type="number" id="salto">
    </div>
    <div>
      <label for="velocidad-personaje">Velocidad del personaje:</label>
      <input type="number" id="velocidad-personaje">
    </div>
    <button class="custom-button">Enviar</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      velocidadTronco: 0 // Inicializamos la velocidad del tronco en 0
    };
  },
  methods: {
    updateVelocidadTronco(event) {
      // Actualizamos la velocidad del tronco con el valor actual del rango
      this.velocidadTronco = event.target.value;
    }
  }
};
</script>

<style scoped>
h2 {
  font-size: 24px;
}

label {
  font-size: 16px;
}

input[type="range"],
input[type="number"] {
  width: 100%;
  padding: 5px;
  margin-top: 5px;
}

.custom-button {
  background-color: #0074d9;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #0056a8;
}
</style>
