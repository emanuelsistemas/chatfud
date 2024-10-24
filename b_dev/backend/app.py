import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
from flask_cors import CORS
from src.api.routes.empresa_routes import empresa_bp
import ssl

app = Flask(__name__)
CORS(app)

app.register_blueprint(empresa_bp, url_prefix='/api')

if __name__ == '__main__':
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain('/etc/letsencrypt/live/chatfud.com.br/fullchain.pem', '/etc/letsencrypt/live/chatfud.com.br/privkey.pem')
    app.run(host='0.0.0.0', port=5000, ssl_context=context, debug=False)
