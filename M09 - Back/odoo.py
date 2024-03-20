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

# Obtener los productos
products = models.execute_kw(db, uid, password,
    'product.product', 'search_read',
    [[]],
    {'fields': ['name', 'default_code']})

# Para cada producto, contar el número de pedidos de venta que lo incluyen
for product in products:
    order_count = models.execute_kw(db, uid, password,
        'sale.order.line', 'search_count',
        [[['product_id', '=', product['id']]]])
    print("Producto:", product['name'])
    print("Código por defecto:", product['default_code'])
    print("Número de pedidos:", order_count)
