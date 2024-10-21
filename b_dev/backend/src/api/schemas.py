from marshmallow import Schema, fields, validate

class EmpresaSchema(Schema):
    id = fields.Int(dump_only=True)
    segmento = fields.Str(required=True, validate=validate.Length(max=100))
    tipo_documento = fields.Str(required=True, validate=validate.OneOf(['CNPJ', 'CPF']))
    documento = fields.Str(required=True, validate=validate.Length(min=11, max=14))
    razao_social = fields.Str(required=True, validate=validate.Length(max=200))
    nome_fantasia = fields.Str(required=True, validate=validate.Length(max=200))
    telefone = fields.Str(required=True, validate=validate.Length(max=20))
    email = fields.Email(required=True)
    data_cadastramento = fields.DateTime(dump_only=True)
    status = fields.Str(dump_only=True)
    codigo_chatfud = fields.Str(required=True, validate=[
        validate.Length(equal=5),
        validate.Regexp('^[0-9]{5}$', error='Deve conter exatamente 5 dígitos numéricos')
    ])
    admin_tipo_usuario = fields.Str(dump_only=True)  # Adicionando este campo

class UsuarioSchema(Schema):
    id = fields.Int(dump_only=True)
    nome = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True)
    senha = fields.Str(required=True, load_only=True, validate=validate.Length(min=6))
    tipo_usuario = fields.Str(required=True, validate=validate.OneOf(['Administrador', 'Usuario']))
    codigo_chatfud = fields.Str(required=True, validate=validate.Length(equal=5))

empresa_schema = EmpresaSchema()
empresas_schema = EmpresaSchema(many=True)
usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)
