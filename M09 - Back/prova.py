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

# Obtener las listas de precios
price_lists = models.execute_kw(db, uid, password,
    'product.pricelist', 'search_read',
    [[]],
    {'fields': ['name', 'item_ids']})

# Imprimir las listas de precios
for price_list in price_lists:
    print("Lista de precios:", price_list['name'])
    item_ids = price_list['item_ids']
    print("IDs de los elementos:", item_ids)
    
    # Para cada ID de elemento, obtener y imprimir los detalles del elemento
    for item_id in item_ids:
        item_details = models.execute_kw(db, uid, password,
            'product.pricelist.item', 'read',
            [item_id])
        print("Detalles del elemento:", item_details)
