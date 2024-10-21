from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from src.api.models.usuarios import Usuario

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    senha = request.json.get('senha', None)
    
    usuario = Usuario.query.filter_by(email=email).first()
    if not usuario or not usuario.check_senha(senha):
        return jsonify({"msg": "Email ou senha incorretos"}), 401

    access_token = create_access_token(identity=usuario.id)
    return jsonify(access_token=access_token), 200
