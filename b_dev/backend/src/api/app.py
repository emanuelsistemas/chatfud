from flask import Flask
from flask_restful import Api
from .extensions import db
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    
    api = Api(app)
    
    from .models import cad_empresa, usuarios
    
    @app.route('/')
    def hello():
        return {"message": "Bem-vindo ao sistema de delivery com IA!"}
    
    return app