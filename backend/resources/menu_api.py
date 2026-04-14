from ..models import MenuItem, Category
from flask_security import auth_required, roles_required, roles_accepted
from flask_restful import Resource, reqparse
from . import db

# -------- CATEGORY --------
category_parser = reqparse.RequestParser()
category_parser.add_argument('name')


class CategoryApi(Resource):

    @auth_required('token')
    def get(self, category_id=None):
        if category_id:
            category = Category.query.get(category_id)
            if not category:
                return {'message': 'Category not found'}, 404

            return {
                'id': category.id,
                'name': category.name
            }, 200

        categories = Category.query.all()
        return {'categories': [{'id': c.id, 'name': c.name} for c in categories]}, 200


    @auth_required('token')
    @roles_required('owner')
    def post(self):
        args = category_parser.parse_args()

        try:
            category = Category(name=args['name'])
            db.session.add(category)
            db.session.commit()
            return {'message': 'Category created!', 'id': category.id}, 201

        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400


    @auth_required('token')
    @roles_required('owner')
    def put(self, category_id):
        args = category_parser.parse_args()
        category = Category.query.get(category_id)

        if not category:
            return {'message': 'Category not found'}, 404

        try:
            category.name = args['name']
            db.session.commit()
            return {'message': 'Updated!'}, 200

        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400


    @auth_required('token')
    @roles_required('owner')
    def delete(self, category_id):
        category = Category.query.get(category_id)

        if not category:
            return {'message': 'Category not found'}, 404

        try:
            db.session.delete(category)
            db.session.commit()
            return {'message': 'Deleted!'}, 200

        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400


# -------- MENU ITEM --------
menu_parser = reqparse.RequestParser()
menu_parser.add_argument('name')
menu_parser.add_argument('description')
menu_parser.add_argument('price', type=float)
menu_parser.add_argument('category_id', type=int)
menu_parser.add_argument('is_available', type=bool)


class MenuApi(Resource):

    @auth_required('token')
    def get(self, menu_item_id=None):
        if menu_item_id:
            item = MenuItem.query.get(menu_item_id)
            if not item:
                return {'message': 'Item not found'}, 404

            return {
                'id': item.id,
                'name': item.name,
                'price': item.price,
                'available': item.is_available
            }, 200

        items = MenuItem.query.all()
        return {
            'menu': [{
                'id': i.id,
                'name': i.name,
                'price': i.price,
                'available': i.is_available
            } for i in items]
        }, 200


    @auth_required('token')
    @roles_required('owner')
    def post(self):
        args = menu_parser.parse_args()

        try:
            item = MenuItem(
                name=args['name'],
                description=args['description'],
                price=args['price'],
                category_id=args['category_id'],
                is_available=args['is_available']
            )
            db.session.add(item)
            db.session.commit()
            return {'message': 'Item added!', 'id': item.id}, 201

        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400


    @auth_required('token')
    @roles_required('owner')
    def put(self, menu_item_id):
        args = menu_parser.parse_args()
        item = MenuItem.query.get(menu_item_id)

        if not item:
            return {'message': 'Item not found'}, 404

        try:
            for key, value in args.items():
                if value is not None:
                    setattr(item, key, value)

            db.session.commit()
            return {'message': 'Item updated!'}, 200

        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400


    @auth_required('token')
    @roles_required('owner')
    def delete(self, menu_item_id):
        item = MenuItem.query.get(menu_item_id)

        if not item:
            return {'message': 'Item not found'}, 404

        try:
            db.session.delete(item)
            db.session.commit()
            return {'message': 'Deleted!'}, 200

        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400