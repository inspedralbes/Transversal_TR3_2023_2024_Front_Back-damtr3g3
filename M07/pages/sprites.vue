<template>
  <div class="main-content">
    <h2>Sprites</h2><br>
    <v-btn @click="dialog = true">Crear producte</v-btn>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Crear producte</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="newProduct.name" label="Nom del producte"></v-text-field>
          <v-text-field v-model="newProduct.list_price" label="Preu de venda" type="number"></v-text-field>
          <v-text-field v-model="newProduct.standard_price" label="Preu de cost" type="number"></v-text-field>
          <v-text-field v-model="newProduct.default_code" label="Referencia interna" type="text"></v-text-field> <!-- Nuevo campo para referencia interna -->
          <v-file-input v-model="newProduct.image_1920" label="Imatge del producte"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="createProduct">Crear</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="product in products" :key="product.id">
        <div class="grid-item">
          <h3>{{ product.name }}</h3>
          <img v-if="product.image_1920" :src="product.image_1920" alt="Imagen del producto" />
          <p>Preu de venta: {{ product.list_price }}</p>
          <v-btn color="red darken-1" text @click="deleteProduct(product.id)">Eliminar</v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getProducts, createProduct, deleteProduct,sendImageToServer   } from '../services/communicationsManager';

export default {
  data() {
    return {
      products: [],
      dialog: false,
      newProduct: {
        name: '',
        list_price: 0,
        standard_price: 0,
        type: 'service',
        image_1920: null,
        default_code: '', // Nuevo campo para referencia interna
      },
    };
  },
  async mounted() {
    this.products = await getProducts();
  },
  methods: {
    readFileAsDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    },
    async createProduct() {
  let image = null;
  if (this.newProduct.image_1920) {
    const file = this.newProduct.image_1920[0];
    image = await this.readFileAsDataURL(file);
  }



  const product = {
    ...this.newProduct,
    image_1920: image,  // Usa la imagen en base64
  };

  const response = await createProduct(product);

  if (response && response.success) {
    const imageResponse = await sendImageToServer(image, response.product_id);
    const imageId = imageResponse.imageId;
    alert('Producto creado correctamente!');
    this.newProduct = {
      name: '',
      list_price: 0,
      standard_price: 0,
      type: 'service',
      image_1920: null,
    };
  } else {
    alert('Hubo un problema al crear el producto.');
  }

  this.dialog = false;
  this.products = await getProducts();
},

async deleteProduct(default_code) {
  console.log(`Deleting product with default code: ${default_code}`);

  const response = await deleteProduct(default_code);
  if (response && response.success) {
    alert('Producto eliminado correctamente!');
    this.products = await getProducts();  // Actualizar la lista de productos
  } else {
    alert('Hubo un problema al eliminar el producto.');
  }
}

},

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
  .main-content {
    margin-bottom: 100px;  /* Ajusta este valor según el tamaño de tu footer */
  }

</style>

