from ..models import Order, OrderItem, MenuItem
from flask_security import auth_required, roles_accepted
from flask_restful import Resource, reqparse
from . import db
from datetime import datetime

order_parser = reqparse.RequestParser()
order_parser.add_argument('table_id', type=int)

item_parser = reqparse.RequestParser()
item_parser.add_argument('order_id', type=int)
item_parser.add_argument('menu_item_id', type=int)
item_parser.add_argument('quantity', type=int)


# -------- ORDER --------
class OrderApi(Resource):

    @auth_required('token')
    def get(self, order_id=None):
        if order_id:
            order = Order.query.get(order_id)
            if not order:
                return {'message': 'Order not found'}, 404
            return {
                'id': order.id,
                'status': order.status,
                'total': order.total_amount,
                'table_id': order.table_id,
            }, 200

        orders = Order.query.all()
        return {'orders': [{
            'id': o.id,
            'status': o.status,
            'total': o.total_amount,
            'table_id': o.table_id,
        } for o in orders]}, 200

    @auth_required('token')
    def post(self):
        args = order_parser.parse_args()
        try:
            order = Order(
                table_id=args['table_id'],
                status='pending',
                created_at=datetime.utcnow()
            )
            db.session.add(order)
            db.session.commit()
            return {'message': 'Order created!', 'order_id': order.id}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

    @auth_required('token')
    @roles_accepted('owner', 'server')
    def put(self, order_id):
        order = Order.query.get(order_id)
        if not order:
            return {'message': 'Order not found'}, 404
        order.status = 'completed'
        db.session.commit()
        return {'message': 'Order updated'}, 200


# -------- ORDER ITEMS --------
class OrderItemApi(Resource):

    @auth_required('token')
    def get(self, order_id):
        items = OrderItem.query.filter_by(order_id=order_id).all()
        return {'items': [{
            'id': i.id,
            'menu_item_id': i.menu_item_id,
            'quantity': i.quantity,
            'price': i.price,
        } for i in items]}, 200

    @auth_required('token')
    def post(self):
        args = item_parser.parse_args()
        try:
            menu_item = MenuItem.query.get(args['menu_item_id'])
            if not menu_item:
                return {'message': 'Menu item not found'}, 404

            item = OrderItem(
                order_id=args['order_id'],
                menu_item_id=args['menu_item_id'],
                quantity=args['quantity'],
                price=menu_item.price,
            )
            db.session.add(item)

            # Update order total
            order = Order.query.get(args['order_id'])
            if order:
                order.total_amount = (order.total_amount or 0) + (menu_item.price * args['quantity'])

            db.session.commit()
            return {'message': 'Item added!'}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

    @auth_required('token')
    def delete(self, item_id):
        item = OrderItem.query.get(item_id)
        if not item:
            return {'message': 'Item not found'}, 404
        try:
            db.session.delete(item)
            db.session.commit()
            return {'message': 'Item removed'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400
