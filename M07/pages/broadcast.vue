<template>
  <div>
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
    async sendBroadcast() {
      const response = await sendBroadcast(this.title, this.message);
      console.log(response);
      if (response === 'Successfully sent message') {
        alert('Mensaje enviado correctamente');
        this.title = '';
        this.message = '';
      }
    }
  }
};
</script>

<style scoped>
h2 {
  font-size: 24px;
}

.message-box {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
}

h3 {
  font-size: 18px;
}

input,
textarea {
  width: 100%;
  padding: 5px;
  margin-top: 5px;
}

.custom-button {
  background-color: #0074d9;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-top: 10px; /* Agrega margen superior */
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #0056a8;
}
</style>
