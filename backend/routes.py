from flask import current_app as app, jsonify, request, render_template, send_from_directory
from flask_security import auth_required,roles_required, roles_accepted, current_user,hash_password,login_user,logout_user
from backend.database import db
from backend.models import User, Role, UserRoles, Category, MenuItem, Table

from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime 


@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static', 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route("/")
def index():
    return render_template('index.html')

from flask import jsonify
from flask_security import auth_required, current_user

@app.route('/api/user', methods=['GET'])
@auth_required('token')
@roles_accepted('owner','customer','server')
def get_user():
    user = current_user
    return jsonify({
        "name": user.name,
        "email": user.email,
        "role": user.roles[0].name,
    })


@app.route('/api/login', methods=['POST'])
def user_login():
    body = request.get_json()
    email = body['email']
    password = body['password']
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    user = app.security.datastore.find_user(email=email)
    if user:
        if check_password_hash(user.password, password):
            login_user(user)
            return jsonify({
                'message': 'Logged in successfully',
                "id": user.id,
                "email": user.email,
                "role": user.roles[0].name,
                "auth-token": user.get_auth_token()
            })
        else:
            return jsonify({'message': 'Invalid password'}), 400
    else:
        return jsonify({'message': 'User not found'}), 404

@app.route('/api/logout', methods = ['POST'])
@auth_required('token')
def user_logout():
    user = current_user
    logout_user()
    return jsonify({
        "message": "User logged out"
    })
    


@app.route('/api/register', methods=['POST'])
def create_user():
    credentials = request.get_json()

    # Check if user already exists
    if app.security.datastore.find_user(email=credentials["email"]):
        return jsonify({"message": "User already exists!"}), 400
    
    required_fields = ["email", "name", "password", "role"]
    if not all(credentials.get(field) for field in required_fields):
        return jsonify({"message": "All fields are required!"}), 400
        

    # Create new user
    app.security.datastore.create_user(
        email=credentials["email"],
        name=credentials["name"],
        password=generate_password_hash(credentials["password"]),
        roles=[credentials["role"]]
    )
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

@app.route('/api/users', methods=['GET'])
@auth_required('token')
@roles_required('owner')
def get_users():
    role_filter = request.args.get('role')  # e.g. ?role=customer or ?role=server
    users = User.query.all()
    result = []
    for u in users:
        role_names = [r.name for r in u.roles]
        if role_filter and role_filter not in role_names:
            continue
        result.append({
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'roles': role_names,
            'active': u.active,
        })
    return jsonify({'users': result})
