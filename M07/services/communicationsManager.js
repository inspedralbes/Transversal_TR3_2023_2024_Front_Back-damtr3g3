
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
