from flask import Flask
from backend.database import db
from backend.config import LocalDevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore
from flask_cors import CORS


def create_app():
    app = Flask(__name__, template_folder="templates")
    app.config.from_object(LocalDevelopmentConfig)

    db.init_app(app)

    from backend.models import User, Role

    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, user_datastore)

    # Allow CORS from the Vite dev server
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080"]}},
         supports_credentials=True)

    from backend.resources import api
    api.init_app(app)

    with app.app_context():
        db.create_all()

        # Seed default roles
        for name, desc in [
            ("owner", "Restaurant Owner / Admin"),
            ("server", "Waiter / Server"),
            ("customer", "Customer"),
        ]:
            if not user_datastore.find_role(name):
                user_datastore.create_role(name=name, description=desc)
        db.session.commit()

        # Import routes inside the app context so @current_app.route decorators fire correctly
        from backend import routes  # noqa: F401

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
