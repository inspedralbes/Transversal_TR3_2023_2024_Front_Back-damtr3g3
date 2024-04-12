const BASE_URL = "http://localhost:3327";

export async function getProducts() {
  const response = await fetch(BASE_URL + '/api/products');
  const data = await response.json();
  return data;
}
export async function sendBroadcast(title,message) {
  const response = await fetch(BASE_URL + '/sendBroadcast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify({ title,message }),
  });
  const data = await response.text();
  return data;
}
export async function sendImageToServer(base64Image,productId) {
  const response = await fetch(BASE_URL + '/api/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64Image, productId: productId }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Image sent successfully:', data);
    return data;
  } else {
    throw new Error(`Error sending the image: ${response.status}`);
  }
}

export async function createProduct(product) {
  const response = await fetch(BASE_URL + '/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  return data;
}
export async function deleteProduct(id) {
  const response = await fetch(BASE_URL + '/api/products/' + id, {
    method: 'DELETE',
  });
  const data = await response.json();
  return data;
}
export async function stopContainer() {
  const response = await fetch(BASE_URL + '/api/stop', { method: 'POST' });
  const data = await response.text();
  return data;
}
export async function startContainer() {
  const response = await fetch(BASE_URL + '/api/start', { method: 'POST' });
  const data = await response.text();
  return data;
}

export async function getStats() {
  const response = await fetch(BASE_URL + '/getStats');
  const data = await response.json();
  return data;
}

export async function enviarDatosAlServidor(aceleracionTronco, danoPersonaje, velocidadPersonaje) {
  try {
    // Haces una solicitud POST al servidor con los datos
    const response = await fetch(BASE_URL + '/ruta/datos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aceleracionTronco,
        danoPersonaje,
        velocidadPersonaje
      }),
    });

    // Verificas si la solicitud fue exitosa
    if (response.ok) {
      const data = await response.json();
      console.log('Datos enviados exitosamente:', data);
      return data;
    } else {
      throw new Error(`Error al enviar los datos: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    throw error;
  }
}
