import sys
import os

# Adicione o diretório raiz do projeto ao PYTHONPATH
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.append(project_root)

from src.api.app import create_app
from src.api.extensions import db
from src.api.models.cad_empresa import CadEmpresa
from src.api.models.usuarios import Usuario

def create_tables():
    app = create_app()
    
    with app.app_context():
        # Cria todas as tabelas
        db.create_all()
        
        # Verifica as tabelas criadas
        inspector = db.inspect(db.engine)
        existing_tables = inspector.get_table_names()
        print(f"Tabelas existentes no banco de dados: {existing_tables}")
        
        # Verifica se as tabelas específicas foram criadas
        if 'cad_empresa' in existing_tables and 'usuarios' in existing_tables:
            print("As tabelas 'cad_empresa' e 'usuarios' foram criadas com sucesso!")
        else:
            print("Erro: Algumas tabelas não foram criadas.")
            
        # Tenta inserir um registro de teste
        try:
            test_empresa = CadEmpresa(
                segmento='Test',
                tipo_documento='CNPJ',
                documento='12345678901234',
                razao_social='Empresa Teste',
                nome_fantasia='Teste Fantasia',
                telefone='1234567890',
                email='teste@empresa.com',
                codigo_chatfud='TEST1'
            )
            db.session.add(test_empresa)
            db.session.commit()
            print("Registro de teste inserido com sucesso!")
        except Exception as e:
            print(f"Erro ao inserir registro de teste: {e}")
            db.session.rollback()

if __name__ == '__main__':
    create_tables()