import xmlrpc.client

# Configuración de la conexión
url = 'http://141.147.8.58:8069'
db = 'grup3'
username = 'a22jonmarqui@inspedralbes.cat'
password = 'Pedralbes24-'

# Iniciar la conexión
# Iniciar la conexión
common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
uid = common.authenticate(db, username, password, {})

models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))

# Obtener todos los contactos
partner_ids = models.execute_kw(db, uid, password,
    'res.partner', 'search',
    [[]])

# Para cada contacto, simular una compra de un producto
for partner_id in partner_ids:
    if partner_id == 52:  # Solo ejecutar para el contacto número 52
        # Crear un pedido de compra para el producto
        order_id = models.execute_kw(db, uid, password,
            'purchase.order', 'create',
            [{
                'partner_id': partner_id,  # ID del contacto
                'order_line': [(0, 0, {
                    'product_id': 1,  # ID del producto
                    'product_qty': 1,
                    'name': 'Skin 1',  # Descripción del producto
                    'price_unit': 10.0,  # Precio unitario fijo
                })],
            }])
        
        print("Pedido de compra simulado con éxito para el contacto {}.".format(partner_id))
        break  # Salir del bucle después de procesar el contacto 52