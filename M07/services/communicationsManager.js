export async function getProducts() {
  const response = await fetch('http://localhost:3327/api/products');
  const data = await response.json();
  return data;
}