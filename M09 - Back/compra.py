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
# Obtener todos los productos
products = models.execute_kw(db, uid, password,
    'product.product', 'search_read',
    [[]],
    {'fields': ['id', 'name', 'default_code']})  # fields to return

# Imprimir los productos y sus IDs
for product in products:
    print("ID: {}, Name: {}, Default Code: {}".format(product['id'], product['name'], product['default_code']))