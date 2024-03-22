import xmlrpc.client
import base64

# Configuración de la conexión
url = 'http://141.147.8.58:8069'
db = 'grup3'
username = 'a22jonmarqui@inspedralbes.cat'
password = 'Pedralbes24-'

# Iniciar la conexión
common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
uid = common.authenticate(db, username, password, {})

models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))

# Datos del nuevo producto
nombre_producto = "Nombre del nuevo producto"  # Nombre del nuevo producto
precio_venta = 10.0  # Precio de venta del nuevo producto
precio_coste = 0.0  # Precio de coste del nuevo producto

# Crear un nuevo producto
producto_id = models.execute_kw(db, uid, password, 'product.product', 'create', [{
    'name': nombre_producto,
    'list_price': precio_venta,
    'standard_price': precio_coste,
    'type': 'service',  # Tipo de producto ('product' para productos almacenables, 'consu' para consumibles, 'service' para servicios)
}])

# Leer la imagen y codificarla en base64
with open("sprite.png", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

# Añadir la imagen al producto
models.execute_kw(db, uid, password, 'product.product', 'write', [[producto_id], {
    'image_1920': encoded_string,
}])

print("Producto creado con éxito! ID del producto:", producto_id)
