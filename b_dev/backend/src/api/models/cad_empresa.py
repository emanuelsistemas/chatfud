from ..extensions import db
from datetime import datetime

class CadEmpresa(db.Model):
    __tablename__ = 'cad_empresa'

    id = db.Column(db.Integer, primary_key=True)
    segmento = db.Column(db.String(100), nullable=False)
    tipo_documento = db.Column(db.String(4), nullable=False)  # CNPJ ou CPF
    documento = db.Column(db.String(14), unique=True, nullable=False)  # CNPJ ou CPF
    razao_social = db.Column(db.String(200), nullable=False)
    nome_fantasia = db.Column(db.String(200), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    data_cadastramento = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(10), default='Ativo')
    codigo_chatfud = db.Column(db.String(5), unique=True, nullable=False)

    def __repr__(self):
        return f'<CadEmpresa {self.nome_fantasia}>'