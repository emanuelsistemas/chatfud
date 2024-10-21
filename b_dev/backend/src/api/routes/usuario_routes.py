from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from src.api.extensions import db
from src.api.models.usuarios import Usuario
from src.api.schemas import usuario_schema, usuarios_schema

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/usuarios', methods=['POST'])
@jwt_required()
def criar_usuario():
    try:
        data = usuario_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400
    
    novo_usuario = Usuario(
        nome=data['nome'],
        email=data['email'],
        tipo_usuario=data['tipo_usuario'],
        codigo_chatfud=data['codigo_chatfud']
    )
    novo_usuario.set_senha(data['senha'])
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify(usuario_schema.dump(novo_usuario)), 201

@usuario_bp.route('/usuarios', methods=['GET'])
@jwt_required()
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify(usuarios_schema.dump(usuarios)), 200

@usuario_bp.route('/usuarios/<int:id>', methods=['GET'])
@jwt_required()
def obter_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    return jsonify(usuario_schema.dump(usuario)), 200

@usuario_bp.route('/usuarios/<int:id>', methods=['PUT'])
@jwt_required()
def atualizar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    try:
        data = usuario_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400
    
    for key, value in data.items():
        if key == 'senha':
            usuario.set_senha(value)
        else:
            setattr(usuario, key, value)
    db.session.commit()
    return jsonify(usuario_schema.dump(usuario)), 200

@usuario_bp.route('/usuarios/<int:id>', methods=['DELETE'])
@jwt_required()
def deletar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({"message": "Usuário deletado com sucesso"}), 200

@usuario_bp.route('/registro', methods=['POST'])
def registrar_usuario():
    try:
        data = usuario_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400
    
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email já está em uso"}), 400
    
    novo_usuario = Usuario(
        nome=data['nome'],
        email=data['email'],
        tipo_usuario='Usuario',  # Define o tipo padrão como 'Usuario'
        codigo_chatfud=data['codigo_chatfud']
    )
    novo_usuario.set_senha(data['senha'])
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify(usuario_schema.dump(novo_usuario)), 201