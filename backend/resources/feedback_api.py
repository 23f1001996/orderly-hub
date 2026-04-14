from ..models import Feedback
from flask_security import auth_required
from flask_restful import Resource, reqparse
from . import db

parser = reqparse.RequestParser()
parser.add_argument('user_id', type=int)
parser.add_argument('menu_item_id', type=int)
parser.add_argument('rating', type=int)
parser.add_argument('comment')


class FeedbackApi(Resource):

    @auth_required('token')
    def get(self):
        feedbacks = Feedback.query.all()

        return {
            'feedback': [{
                'rating': f.rating,
                'comment': f.comment
            } for f in feedbacks]
        }, 200


    @auth_required('token')
    def post(self):
        args = parser.parse_args()

        try:
            fb = Feedback(
                user_id=args['user_id'],
                menu_item_id=args['menu_item_id'],
                rating=args['rating'],
                comment=args['comment']
            )
            db.session.add(fb)
            db.session.commit()

            return {'message': 'Feedback added!'}, 201

        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400