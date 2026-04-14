from backend.database import db
from backend.models import Category, MenuItem, Table


def seed_menu():

    # Prevent reseeding if categories already exist
    if Category.query.count() == 0:

        starters = Category(name="Starters")
        mains = Category(name="Main Course")
        desserts = Category(name="Desserts")
        beverages = Category(name="Beverages")

        db.session.add_all([starters, mains, desserts, beverages])
        db.session.commit()

        items = [
            MenuItem(name="Paneer Tikka", description="Grilled paneer cubes", price=250, category_id=starters.id),
            MenuItem(name="Veg Spring Rolls", description="Crispy vegetable rolls", price=180, category_id=starters.id),
            MenuItem(name="Butter Chicken", description="Creamy tomato chicken curry", price=350, category_id=mains.id),
            MenuItem(name="Paneer Butter Masala", description="Paneer in rich gravy", price=300, category_id=mains.id),
            MenuItem(name="Gulab Jamun", description="Milk dumplings in syrup", price=120, category_id=desserts.id),
            MenuItem(name="Cold Coffee", description="Chilled coffee drink", price=120, category_id=beverages.id),
        ]

        db.session.add_all(items)

    # Create one demo table if none exists
    if Table.query.count() == 0:
        table = Table(capacity=4, status="available")
        db.session.add(table)

    db.session.commit()

    print("Demo menu and table seeded successfully.")