from flask_restful import Api
from ..models import *

from .table_api import TableApi
from .menu_api import MenuApi, CategoryApi
from .order_api import OrderApi, OrderItemApi
from .feedback_api import FeedbackApi
from .suggestion_api import SuggestionAPI

api = Api()


# Table Management APIs
api.add_resource(TableApi,
                 '/api/tables',
                 '/api/tables/<int:table_id>'
                 )


# Category APIs
api.add_resource(CategoryApi,
                 '/api/categories',
                 '/api/categories/<int:category_id>'
                 )


# Menu APIs
api.add_resource(MenuApi,
                 '/api/menu',
                 '/api/menu/<int:menu_item_id>'
                 )


# Order APIs
api.add_resource(OrderApi,
                 '/api/orders',
                 '/api/orders/<int:order_id>',
                 '/api/orders/table/<int:table_id>'
                 )


# Order Items APIs
api.add_resource(OrderItemApi,
                 '/api/order_items/<int:order_id>',      # GET items of order
                 '/api/order_items',                     # POST (add item)
                 '/api/order_items/<int:item_id>'        # PUT / DELETE
                 )


# Feedback APIs
api.add_resource(FeedbackApi,
                 '/api/feedback',
                 '/api/feedback/<int:feedback_id>'
                 )

# Suggestion API
api.add_resource(SuggestionAPI, "/api/suggestions")