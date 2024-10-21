import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import './CriarEmpresa.css';

const CriarEmpresa: React.FC = () => {
  const [formData, setFormData] = useState({
    segmento: '',
    tipo_documento: '',
    documento: '',
    razao_social: '',
    nome_fantasia: '',
    telefone: '',
    email: '',
    codigo_chatfud: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/empresas', formData);
      setMessage(`Empresa criada com sucesso! ID: ${response.data.id}`);
    } catch (error) {
      setMessage('Erro ao criar empresa. Por favor, tente novamente.');
    }
  };

  return (
    <Box className="criar-empresa-form">
      <Typography variant="h4" component="h2" gutterBottom>
        Criar Nova Empresa
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="filled"
          label="Segmento"
          name="segmento"
          value={formData.segmento}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Tipo de Documento"
          name="tipo_documento"
          value={formData.tipo_documento}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Documento"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Razão Social"
          name="razao_social"
          value={formData.razao_social}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Nome Fantasia"
          name="nome_fantasia"
          value={formData.nome_fantasia}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Código ChatFud"
          name="codigo_chatfud"
          value={formData.codigo_chatfud}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Criar Empresa
        </Button>
      </form>
      {message && (
        <Typography color="primary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default CriarEmpresa;
