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

    # Get the id of the invoice report
    report_id = models.execute_kw(db, uid, password, 'ir.actions.report', 'search', [[['report_name', '=', 'Report de la compra']]])[0]

    # Generate the report for the invoice
    report_result, report_format = models.execute_kw(db, uid, password, 'ir.actions.report', 'render_report', [report_id, [invoice_id]])

    # The report file is the binary data of the report_result
    report_file = base64.b64decode(report_result)

    # Create an attachment with the report file
    attachment_id = models.execute_kw(db, uid, password, 'ir.attachment', 'create', [{
        'name': 'Invoice.pdf',
        'datas': base64.b64encode(report_file),
        'res_model': 'account.move',
        'res_id': invoice_id,
        'type': 'binary'
    }])

    # Send the invoice via email with the report file attached
    models.execute_kw(db, uid, password, 'account.move', 'message_post', [invoice_id], {
        'body': "S'ha generat la factura de la compra. La podeu veure a l'apartat de facturació de la vostra compte.",
        'subject': "Factura de la compra",
        'partner_ids': [(4, partner_id)],  # partner_id is the id of the recipient
        'message_type': 'notification',
        'subtype': 'mail.mt_comment',  # or 'mail.mt_note' for a note
        'attachment_ids': [(4, attachment_id)],  # attach the report file
    })



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
