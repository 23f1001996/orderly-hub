from flask import Flask
from backend.database import db
from backend.config import LocalDevelopmentConfig
from backend.models import User, Role
from flask_security import Security, SQLAlchemyUserDatastore
from flask_cors import CORS
from werkzeug.security import generate_password_hash


def create_app():
    app = Flask(__name__, template_folder="templates")
    app.config.from_object(LocalDevelopmentConfig)

    # Initialize database
    db.init_app(app)

    # Setup Flask-Security
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, user_datastore)

    # Enable CORS for frontend (Vite / Vue)
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:8080",
                    "http://127.0.0.1:8080"
                ]
            }
        },
        supports_credentials=True
    )

    # Initialize API resources
    from backend.resources import api
    api.init_app(app)

    with app.app_context():

        # Create tables
        db.create_all()

        # Seed default roles
        roles = [
            ("owner", "Restaurant Owner / Admin"),
            ("server", "Waiter / Server"),
            ("customer", "Customer"),
        ]

        for name, desc in roles:
            if not user_datastore.find_role(name):
                user_datastore.create_role(name=name, description=desc)

        db.session.commit()

        # Create default owner user
        if not user_datastore.find_user(email="owner@gmail.com"):
            user_datastore.create_user(
                email="owner@gmail.com",
                password=generate_password_hash("1234"),
                roles=["owner"],
                name="Owner"
            )
            db.session.commit()

        # Import routes so decorators register
        from backend import routes  # noqa: F401

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)