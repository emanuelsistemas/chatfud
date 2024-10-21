from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from src.api.extensions import db
from src.api.models.cad_empresa import CadEmpresa
from src.api.models.usuarios import Usuario
from src.api.schemas import empresa_schema, empresas_schema
from werkzeug.security import generate_password_hash
import secrets
from sqlalchemy.exc import IntegrityError
import logging

empresa_bp = Blueprint('empresa', __name__)

@empresa_bp.route('/empresas', methods=['POST'])
def criar_empresa():
    try:
        data = empresa_schema.load(request.json)
        
        # Verificar se já existe uma empresa com o mesmo documento
        empresa_existente = CadEmpresa.query.filter_by(documento=data['documento']).first()
        if empresa_existente:
            return jsonify({"message": "Já existe uma empresa cadastrada com este documento."}), 409

        nova_empresa = CadEmpresa(**data)
        db.session.add(nova_empresa)
        
        # Gerar uma senha temporária para o usuário administrador
        senha_temp = secrets.token_urlsafe(10)
        
        # Criar um usuário administrador para a empresa
        novo_usuario = Usuario(
            nome=f"Admin {nova_empresa.nome_fantasia}",
            email=data['email'],  # Usando o email da empresa para o admin
            tipo_usuario='Administrador',  # Definindo explicitamente como Administrador
            codigo_chatfud=nova_empresa.codigo_chatfud
        )
        novo_usuario.set_senha(senha_temp)
        db.session.add(novo_usuario)
        
        db.session.commit()
        
        resposta = empresa_schema.dump(nova_empresa)
        resposta['admin_email'] = novo_usuario.email
        resposta['admin_senha_temporaria'] = senha_temp
        resposta['admin_tipo_usuario'] = novo_usuario.tipo_usuario  # Adicionando à resposta
        
        return jsonify(resposta), 201
    except ValidationError as err:
        current_app.logger.error(f"Erro de validação: {err.messages}")
        return jsonify(err.messages), 400
    except IntegrityError as e:
        db.session.rollback()
        current_app.logger.error(f"Erro de integridade: {str(e)}")
        return jsonify({"message": "Erro de integridade. Verifique se todos os campos únicos são realmente únicos."}), 409
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Erro não esperado: {str(e)}", exc_info=True)
        return jsonify({"message": "Ocorreu um erro ao criar a empresa."}), 500

@empresa_bp.route('/empresas', methods=['GET'])
@jwt_required()
def listar_empresas():
    empresas = CadEmpresa.query.filter_by(status='Ativo').all()
    return jsonify(empresas_schema.dump(empresas)), 200

@empresa_bp.route('/empresas/<int:id>', methods=['GET'])
@jwt_required()
def obter_empresa(id):
    empresa = CadEmpresa.query.get_or_404(id)
    return jsonify(empresa_schema.dump(empresa)), 200

@empresa_bp.route('/empresas/<int:id>', methods=['PUT'])
@jwt_required()
def atualizar_empresa(id):
    empresa = CadEmpresa.query.get_or_404(id)
    try:
        data = empresa_schema.load(request.json, partial=True)
        for key, value in data.items():
            setattr(empresa, key, value)
        db.session.commit()
        return jsonify(empresa_schema.dump(empresa)), 200
    except ValidationError as err:
        return jsonify(err.messages), 400

@empresa_bp.route('/empresas/<int:id>/inativar', methods=['PUT'])
@jwt_required()
def inativar_empresa(id):
    empresa = CadEmpresa.query.get_or_404(id)
    empresa.status = 'Inativo'
    db.session.commit()
    return jsonify({"message": "Empresa inativada com sucesso"}), 200
