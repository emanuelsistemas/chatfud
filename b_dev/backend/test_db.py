from src.api.app import create_app, db
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

app = create_app()

def test_db_connection():
    try:
        with app.app_context():
            # Tenta executar uma query simples
            result = db.session.execute(text('SELECT 1'))
            print("Conexão com o banco de dados bem-sucedida!")
            print(f"Resultado da query: {result.scalar()}")
    except SQLAlchemyError as e:
        print(f"Erro ao conectar ao banco de dados: {e}")

if __name__ == "__main__":
    test_db_connection()