<template>
  <div class="container">
    <h2>Configuración</h2>
    <div class="input-container">
      <label for="aceleracion-tronco">Aceleración del tronco:</label>
      <input type="range" id="aceleracion-tronco" min="0.1" max="50" step="0.1" v-model="aceleracionTronco">
      <span id="valor-aceleracion-tronco">{{ aceleracionTronco }}</span>
    </div>
    <div class="input-container">
      <label for="dano-personaje">Daño recibido del personaje:</label>
      <input type="number" id="dano-personaje" v-model="danoPersonaje">
    </div>
    <div class="input-container">
      <label for="velocidad-personaje">Velocidad del personaje:</label>
      <input type="number" id="velocidad-personaje" v-model="velocidadPersonaje">
    </div>
    <button class="custom-button" @click="enviarDatos">Enviar</button>
  </div>
</template>

<script>
import { enviarDatosAlServidor } from '../services/communicationsManager';

export default {
  data() {
    return {
      aceleracionTronco: 0,
      danoPersonaje: 0,
      velocidadPersonaje: 0
    };
  },
  methods: {
    async enviarDatos() {
      try {
        // Convertir aceleracionTronco a string con "f" al final
        const aceleracionTroncoString = parseFloat(this.aceleracionTronco).toFixed(1) + 'f';

        // Llamas a la función para enviar los datos al servidor, pasando la aceleracionTronco con "f"
        await enviarDatosAlServidor(aceleracionTroncoString, this.danoPersonaje, this.velocidadPersonaje);
        // Aquí puedes hacer algo después de enviar los datos, como mostrar un mensaje de éxito
      } catch (error) {
        // Manejas cualquier error que pueda ocurrir durante el envío de datos
        console.error('Error al enviar los datos desde el componente:', error);
        // Aquí puedes mostrar un mensaje de error al usuario si es necesario
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.input-container {
  margin-bottom: 15px;
}

label {
  font-size: 16px;
  display: block;
  margin-bottom: 5px;
}

input[type="range"],
input[type="number"] {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.custom-button {
  background-color: #0056a8; /* Color naranja vibrante */
  color: #fff;
  border: none;
  padding: 15px 30px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  display: block;
  margin: 0 auto;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #022e57; /* Cambio de color al pasar el mouse */
}
</style>
