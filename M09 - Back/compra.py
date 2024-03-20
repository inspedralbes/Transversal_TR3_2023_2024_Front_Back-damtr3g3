import xmlrpc.client

# Configuración de la conexión
url = 'http://141.147.8.58:8069'
db = 'grup3'
username = 'a22jonmarqui@inspedralbes.cat'
password = 'Pedralbes24-'

# Iniciar la conexión
common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
uid = common.authenticate(db, username, password, {})

models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))

# Buscar el producto con default_code 2
product_id = models.execute_kw(db, uid, password,
    'product.product', 'search',
    [[['default_code', '=', '2']]])

if product_id:
    # Crear un pedido de venta para el producto
    order_id = models.execute_kw(db, uid, password,
        'sale.order', 'create',
        [{
            'partner_id': 1,  # ID del cliente
            'order_line': [(0, 0, {
                'product_id': product_id[0],
                'product_uom_qty': 2,
            })],
        }])
    
    # Confirmar el pedido de venta
    models.execute_kw(db, uid, password,
        'sale.order', 'action_confirm',
        [order_id])
    
    print("Pedido de venta creado y confirmado con éxito.")
else:
    print("No se encontró ningún producto con default_code 2.")
