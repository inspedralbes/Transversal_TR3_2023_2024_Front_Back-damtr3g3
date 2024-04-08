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

# Obtener todos los usuarios
# Obtener todos los contactos
contact_ids = models.execute_kw(db, uid, password,
    'res.partner', 'search',
    [[]])

# Leer los detalles de los contactos
contacts = models.execute_kw(db, uid, password,
    'res.partner', 'read',
    [contact_ids])

# Para cada contacto
for contact in contacts:
    print("ID: {}, Nombre: {}".format(contact['id'], contact['name']))