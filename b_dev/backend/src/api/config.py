import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'você-nunca-adivinhará'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://chatfud_user:Vs949207234@localhost/chatfud'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CHATFUD_NOME = "ChatFud"
    CHATFUD_LOGO_URL = "/static/images/chatfud_logo.png"