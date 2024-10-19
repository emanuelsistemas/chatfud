from ..extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128))
    tipo_usuario = db.Column(db.String(20), nullable=False)  # Administrador ou Usuario
    codigo_chatfud = db.Column(db.String(5), db.ForeignKey('cad_empresa.codigo_chatfud'), nullable=False)
    
    empresa = db.relationship('CadEmpresa', backref=db.backref('usuarios', lazy=True))

    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)

    def check_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)

    def __repr__(self):
        return f'<Usuario {self.nome}>'