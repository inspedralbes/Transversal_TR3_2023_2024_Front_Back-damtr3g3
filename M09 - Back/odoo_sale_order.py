import xmlrpc.client
import sys
import base64
import requests

def create_sale_order(url, db, username, password, product_id, name, list_price):
    print(sys.argv)
    common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
    uid = common.authenticate(db, username, password, {})

    if uid is False:
        print("Authentication failed.")
        sys.exit(1)

    models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))

    partner_ids = models.execute_kw(db, uid, password, 'res.partner', 'search', [[['name', '=', name]]])

    if not partner_ids:
        print("No partner found with the given name.")
        sys.exit(1)

    partner_id = partner_ids[0]

    partner = models.execute_kw(db, uid, password, 'res.partner', 'read', [partner_id], {'fields': ['email']})
    partner_email = partner[0]['email']

    sale_order_id = models.execute_kw(db, uid, password, 'sale.order', 'create', [{
        'partner_id': partner_id,
        'order_line': [(0, 0, {
            'product_id': product_id,
            'name': name,
            'price_unit': list_price,
        })],
    }])

    print("Created sale order with ID:", sale_order_id)

    # Confirm the sale order
    models.execute_kw(db, uid, password, 'sale.order', 'action_confirm', [sale_order_id])

    delivery_order_ids = models.execute_kw(db, uid, password, 'stock.picking', 'search', [[['sale_id', '=', sale_order_id]]])
    if delivery_order_ids:
        # Confirm the delivery order (send the products)
        models.execute_kw(db, uid, password, 'stock.picking', 'action_confirm', delivery_order_ids)
        # Validate the delivery order
        models.execute_kw(db, uid, password, 'stock.picking', 'button_validate', delivery_order_ids)

    # Create the invoice
    invoice_lines = []
    for line in models.execute_kw(db, uid, password, 'sale.order.line', 'search', [[['order_id', '=', sale_order_id]]]):
        line_data = models.execute_kw(db, uid, password, 'sale.order.line', 'read', [line])[0]
        invoice_lines.append((0, 0, {
            'name': line_data['name'],
            'quantity': line_data['product_uom_qty'],
            'product_id': line_data['product_id'][0],
            'price_unit': line_data['price_unit'],
            'product_uom_id': line_data['product_uom'][0],
            'tax_ids': [(6, 0, line_data['tax_id'])],
        }))
    invoice_id = models.execute_kw(db, uid, password, 'account.move', 'create', [{
        'move_type': 'out_invoice',
        'partner_id': partner_id,
        'invoice_line_ids': invoice_lines,
    }])

    # Confirm the invoice
    models.execute_kw(db, uid, password, 'account.move', 'action_post', [invoice_id])

    # Create a new mail.message record
    mail_id = models.execute_kw(db, uid, password, 'mail.mail', 'create', [{
        'subject': 'Compra al joc',
        'body_html': 'Gràcies per comprar al joc! Si vols veure la factura pots veure-la al teu compte de Odoo.',
        'email_from': 'a22rubsersot@inspedralbes.cat',
        'recipient_ids': [(6, 0, [partner_id])],  # replace partner_id with the ID of the partner
    }])

    # Finally, send the email
    models.execute_kw(db, uid, password, 'mail.mail', 'send', [[mail_id]])

    print("Sent email to partner.")

if __name__ == "__main__":
    url = "http://141.147.8.58:8069"
    db = "grup3"
    username = "a22jonmarqui@inspedralbes.cat"
    password = "Pedralbes24-"
    product_id = int(sys.argv[1])
    name = sys.argv[2]
    list_price = float(sys.argv[3])

    create_sale_order(url, db, username, password, product_id, name, list_price)
