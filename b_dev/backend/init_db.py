from src.api.app import create_app, db
import os

app = create_app()

with app.app_context():
    db.create_all()
    print(f"Banco de dados inicializado com sucesso em: {os.path.abspath(app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', ''))}")