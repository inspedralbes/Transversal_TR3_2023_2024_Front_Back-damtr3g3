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

# Obtener todas las listas de precios
price_list_ids = models.execute_kw(db, uid, password,
    'product.pricelist', 'search',
    [[]])

# Leer los detalles de las listas de precios
price_lists = models.execute_kw(db, uid, password,
    'product.pricelist', 'read',
    [price_list_ids])

# Para cada lista de precios
for price_list in price_lists:
    print("ID: {}, Nombre: {}".format(price_list['id'], price_list['name']))

    # Obtener los ítems de la lista de precios
    price_list_item_ids = models.execute_kw(db, uid, password,
        'product.pricelist.item', 'search',
        [[['pricelist_id', '=', price_list['id']]]])

    # Leer los detalles de los ítems de la lista de precios
    price_list_items = models.execute_kw(db, uid, password,
        'product.pricelist.item', 'read',
        [price_list_item_ids])

    # Imprimir los ítems de la lista de precios
    for item in price_list_items:
        print("Producto: {}, Precio: {}".format(item['product_id'][1], item['fixed_price']))