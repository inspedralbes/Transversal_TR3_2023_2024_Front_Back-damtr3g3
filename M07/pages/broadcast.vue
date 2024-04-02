<template>
  <div class="container">
    <h2>Broadcast</h2>
    <div class="message-box">
      <h3>Título del mensaje</h3>
      <input type="text" v-model="title" placeholder="Escribe aquí" />
    </div>
    <div class="message-box">
      <h3>Mensaje a enviar</h3>
      <textarea v-model="message" placeholder="Escribe aquí" style="height: 100px;"></textarea>
    </div>
    <button class="custom-button" @click="sendBroadcast">Enviar</button>
  </div>
</template>

<script>
import { sendBroadcast } from '../services/communicationsManager';

export default {
  data() {
    return {
      title: '',
      message: ''
    };
  },
  methods: {
    async createProduct() {
    const response = await createProduct(this.newProduct);
    if (response) {
      alert('Producto creado correctamente!');
      this.newProduct = {
        name: '',
        list_price: 0,
        standard_price: 0,
        type: 'product',
        image_1920: null,
      };
    } else {
      alert('Hubo un problema al crear el producto.');
    }
    console.log(response);
    this.dialog = false;
    this.products = await getProducts();  // Actualizar la lista de productos
  },
},
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

.message-box {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f7f7f7;
  border-radius: 10px;
}

h3 {
  font-size: 18px;
  color: #000; /* Cambia el color del texto a negro */
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: none;
  border-radius: 5px;
}

.custom-button {
  background-color: #0056a8; /* Cambia el color del botón a azul */
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
  background-color: #022e57; /* Cambio de color al pasar el mouse a un tono más oscuro de azul */
}
</style>