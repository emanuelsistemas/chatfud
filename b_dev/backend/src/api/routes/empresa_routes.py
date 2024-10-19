from flask import Blueprint, request, jsonify
from src.api.extensions import db
from src.api.models.cad_empresa import CadEmpresa

empresa_bp = Blueprint('empresa', __name__)

@empresa_bp.route('/empresas', methods=['POST'])
def criar_empresa():
    data = request.json
    nova_empresa = CadEmpresa(
        segmento=data['segmento'],
        tipo_documento=data['tipo_documento'],
        documento=data['documento'],
        razao_social=data['razao_social'],
        nome_fantasia=data['nome_fantasia'],
        telefone=data['telefone'],
        email=data['email'],
        codigo_chatfud=data['codigo_chatfud']
    )
    db.session.add(nova_empresa)
    db.session.commit()
    return jsonify({"message": "Empresa criada com sucesso", "id": nova_empresa.id}), 201

@empresa_bp.route('/empresas', methods=['GET'])
def listar_empresas():
    empresas = CadEmpresa.query.all()
    return jsonify([{
        "id": e.id,
        "nome_fantasia": e.nome_fantasia,
        "email": e.email,
        "codigo_chatfud": e.codigo_chatfud
    } for e in empresas]), 200

@empresa_bp.route('/empresas/<int:id>', methods=['GET'])
def obter_empresa(id):
    empresa = CadEmpresa.query.get_or_404(id)
    return jsonify({
        "id": empresa.id,
        "segmento": empresa.segmento,
        "tipo_documento": empresa.tipo_documento,
        "documento": empresa.documento,
        "razao_social": empresa.razao_social,
        "nome_fantasia": empresa.nome_fantasia,
        "telefone": empresa.telefone,
        "email": empresa.email,
        "codigo_chatfud": empresa.codigo_chatfud
    }), 200

@empresa_bp.route('/empresas/<int:id>', methods=['PUT'])
def atualizar_empresa(id):
    empresa = CadEmpresa.query.get_or_404(id)
    data = request.json
    for key, value in data.items():
        setattr(empresa, key, value)
    db.session.commit()
    return jsonify({"message": "Empresa atualizada com sucesso"}), 200

@empresa_bp.route('/empresas/<int:id>', methods=['DELETE'])
def deletar_empresa(id):
    empresa = CadEmpresa.query.get_or_404(id)
    db.session.delete(empresa)
    db.session.commit()
    return jsonify({"message": "Empresa deletada com sucesso"}), 200
