from src.api.extensions import db
from datetime import datetime
from sqlalchemy.orm import validates
import re

class CadEmpresa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    segmento = db.Column(db.String(100), nullable=False)
    tipo_documento = db.Column(db.String(4), nullable=False)
    documento = db.Column(db.String(14), unique=True, nullable=False)
    razao_social = db.Column(db.String(200), nullable=False)
    nome_fantasia = db.Column(db.String(200), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    data_cadastramento = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(10), default='Ativo')
    codigo_chatfud = db.Column(db.String(5), unique=True, nullable=False)

    @validates('codigo_chatfud')
    def validate_codigo_chatfud(self, key, codigo_chatfud):
        if not re.match('^[0-9]{5}$', codigo_chatfud):
            raise ValueError('codigo_chatfud deve conter exatamente 5 dígitos numéricos')
        return codigo_chatfud

    def __repr__(self):
        return f'<Empresa {self.nome_fantasia}>'
