<template>
  <div>
    <h2>Sprites</h2>
    <div class="grid-container">
      <div class="grid-item" v-for="product in products" :key="product.id">
        <h3>{{ product.name }}</h3>
        <img v-if="product.image_1920" :src="product.image_1920" alt="Imagen del producto" />
        <p>Precio de venta: {{ product.list_price }}</p>
        <p>Precio de coste: {{ product.standard_price }}</p>
        <p>Cantidad de pedidos: {{ product.orderCount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getProducts } from '../services/communicationsManager';

export default {
  data() {
    return {
      products: []
    };
  },
  async mounted() {
    this.products = await getProducts();
  }
};
</script>

<style scoped>
h2 {
  font-size: 24px;
}
h3 {
  font-size: 20px;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.grid-item {
  border: 1px solid #ccc;
  padding: 20px;
  box-shadow: 2px 2px 6px 0px  rgba(0,0,0,0.20);
}
</style>
