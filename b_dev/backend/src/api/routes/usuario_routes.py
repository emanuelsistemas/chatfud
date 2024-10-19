from flask import Blueprint, request, jsonify
from src.api.extensions import db
from src.api.models.usuarios import Usuario

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/usuarios', methods=['POST'])
def criar_usuario():
    data = request.json
    novo_usuario = Usuario(
        nome=data['nome'],
        email=data['email'],
        tipo_usuario=data['tipo_usuario'],
        codigo_chatfud=data['codigo_chatfud']
    )
    novo_usuario.set_senha(data['senha'])
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({"message": "Usuário criado com sucesso", "id": novo_usuario.id}), 201

@usuario_bp.route('/usuarios', methods=['GET'])
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([{
        "id": u.id,
        "nome": u.nome,
        "email": u.email,
        "tipo_usuario": u.tipo_usuario,
        "codigo_chatfud": u.codigo_chatfud
    } for u in usuarios]), 200

@usuario_bp.route('/usuarios/<int:id>', methods=['GET'])
def obter_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    return jsonify({
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "tipo_usuario": usuario.tipo_usuario,
        "codigo_chatfud": usuario.codigo_chatfud
    }), 200

@usuario_bp.route('/usuarios/<int:id>', methods=['PUT'])
def atualizar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    data = request.json
    for key, value in data.items():
        if key == 'senha':
            usuario.set_senha(value)
        else:
            setattr(usuario, key, value)
    db.session.commit()
    return jsonify({"message": "Usuário atualizado com sucesso"}), 200

@usuario_bp.route('/usuarios/<int:id>', methods=['DELETE'])
def deletar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({"message": "Usuário deletado com sucesso"}), 200
