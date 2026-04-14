from ..models import Table
from flask_security import auth_required, roles_required, roles_accepted
from flask_restful import Resource, reqparse
from . import db

parser = reqparse.RequestParser()
parser.add_argument('capacity', type=int)
parser.add_argument('status')


class TableApi(Resource):

    # getting all tables or a specific table by id
    @auth_required('token')
    @roles_accepted('owner', 'server', 'customer')
    def get(self, table_id=None):
        if table_id:
            table = Table.query.get(table_id)
            if not table:
                return {'message': 'Table not found'}, 404

            return {
                'id': table.id,
                'capacity': table.capacity,
                'status': table.status
            }, 200

        tables = Table.query.all()
        tables_json = []

        for table in tables:
            tables_json.append({
                'id': table.id,
                'capacity': table.capacity,
                'status': table.status
            })

        if tables_json:
            return {'tables': tables_json}, 200

        return {'message': 'No tables found'}, 404


    # creating a new table
    @auth_required('token')
    @roles_required('owner')
    def post(self):
        args = parser.parse_args()

        try:
            table = Table(
                capacity=args['capacity'],
                status=args['status'] or 'available'
            )
            db.session.add(table)
            db.session.commit()

            return {
                'message': 'Table created successfully!',
                'table_id': table.id
            }, 201

        except Exception as e:
            db.session.rollback()
            return {'message': f'Error creating table: {str(e)}'}, 400

    # updating an existing table
    @auth_required('token')
    @roles_accepted('owner', 'server', 'customer')
    def put(self, table_id):
        args = parser.parse_args()
        table = Table.query.get(table_id)

        if not table:
            return {'message': 'Table not found'}, 404

        try:
            if args['capacity']:
                table.capacity = args['capacity']
            if args['status']:
                table.status = args['status']

            db.session.commit()

            return {
                'message': 'Table updated successfully!',
                'table_id': table_id
            }, 200

        except Exception as e:
            db.session.rollback()
            return {'message': f'Error updating table: {str(e)}'}, 400

    # deleting a table
    @auth_required('token')
    @roles_required('owner')
    def delete(self, table_id):
        table = Table.query.get(table_id)

        if not table:
            return {'message': 'Table not found'}, 404

        try:
            db.session.delete(table)
            db.session.commit()

            return {'message': 'Table deleted!'}, 200

        except Exception as e:
            db.session.rollback()
            return {'message': f'Error deleting table: {str(e)}'}, 400