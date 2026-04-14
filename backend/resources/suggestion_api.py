from flask_restful import Resource
from flask import request
from backend.models import MenuItem

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class SuggestionAPI(Resource):
    def post(self):
        data = request.get_json()
        item_id = data.get("itemId")

        # ✅ Get selected item
        selected_item = MenuItem.query.get(item_id)
        if not selected_item:
            return {"error": "Item not found"}, 404

        # ✅ Get other items
        all_items = MenuItem.query.filter(MenuItem.id != item_id).all()
        if not all_items:
            return {"suggestions": []}

        # ✅ Convert to text
        def text(item):
            return f"{item.name} {item.description} {item.category}"

        corpus = [text(selected_item)] + [text(i) for i in all_items]

        # ✅ Cosine similarity
        vectors = TfidfVectorizer().fit_transform(corpus)
        scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

        # ✅ Rank
        ranked = sorted(zip(all_items, scores), key=lambda x: x[1], reverse=True)

        suggestions = [
            {"id": i.id, "name": i.name}
            for i, _ in ranked[:2]
        ]

        return {
            "itemId": item_id,
            "suggestions": suggestions
        }