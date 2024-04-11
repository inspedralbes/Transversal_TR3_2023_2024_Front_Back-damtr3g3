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
export async function actualizarDatos(id, nuevosDatos) {
  const response = await fetch(BASE_URL + '/api/resultados/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevosDatos),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
