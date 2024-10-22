import React, { useState } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  SelectChangeEvent,
  InputAdornment,
  IconButton
} from '@mui/material';
import './CriarEmpresa.css';

// Componente de ícone de lupa personalizado
const SearchIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const segmentos = [
  'Supermercados',
  'Lojas de departamentos',
  'Lojas de conveniência',
  'Lojas de roupas',
  'Lojas de eletrônicos',
  'Farmácias',
  'Lojas de materiais de construção',
  'Lojas de móveis',
  'Distribuidores de alimentos',
  'Distribuidores de bebidas',
  'Distribuidores de produtos de limpeza',
  'Distribuidores de produtos farmacêuticos',
  'Distribuidores de eletrônicos',
  'Distribuidores de materiais de construção',
  'Atacados de alimentos',
  'Atacados de bebidas',
  'Atacados de produtos diversos'
];

const CriarEmpresa: React.FC = () => {
  const [formData, setFormData] = useState({
    segmento: '',
    tipo_documento: 'CNPJ',
    documento: '',
    razao_social: '',
    nome_fantasia: '',
    telefone: '',
    email: '',
    codigo_chatfud: ''
  });

  const [errors, setErrors] = useState({
    documento: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      ...(name === 'tipo_documento' ? { documento: '', razao_social: '' } : {})
    }));

    if (name === 'documento') {
      handleDocumentoChange(e as React.ChangeEvent<HTMLInputElement>);
    }

    if (name === 'tipo_documento') {
      setErrors(prev => ({ ...prev, documento: '' }));
    }
  };

  const applyMask = (value: string, tipo: 'CNPJ' | 'CPF'): string => {
    const numbers = value.replace(/\D/g, '');
    if (tipo === 'CNPJ') {
      return numbers.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5'
      );
    } else {
      return numbers.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
        '$1.$2.$3-$4'
      );
    }
  };

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numbers = value.replace(/\D/g, '');
    const tipo = formData.tipo_documento as 'CNPJ' | 'CPF';
    const maxLength = tipo === 'CNPJ' ? 14 : 11;

    if (numbers.length <= maxLength) {
      const maskedValue = applyMask(numbers, tipo);
      setFormData(prevData => ({
        ...prevData,
        documento: maskedValue
      }));
      validateDocumento(numbers);
    }
  };

  const validateDocumento = (value: string) => {
    if (formData.tipo_documento === 'CNPJ') {
      const cnpjRegex = /^\d{14}$/;
      if (!cnpjRegex.test(value)) {
        setErrors(prev => ({ ...prev, documento: 'CNPJ inválido' }));
      } else {
        setErrors(prev => ({ ...prev, documento: '' }));
      }
    } else {
      const cpfRegex = /^\d{11}$/;
      if (!cpfRegex.test(value)) {
        setErrors(prev => ({ ...prev, documento: 'CPF inválido' }));
      } else {
        setErrors(prev => ({ ...prev, documento: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errors.documento) {
      setMessage('Por favor, corrija os erros antes de enviar.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/empresas', formData);
      setMessage(`Empresa criada com sucesso! ID: ${response.data.id}`);
    } catch (error) {
      setMessage('Erro ao criar empresa. Por favor, tente novamente.');
    }
  };

  const handleSearchCNPJ = () => {
    // Implemente a lógica de busca do CNPJ aqui
    console.log('Buscar CNPJ:', formData.documento);
  };

  return (
    <Box className="criar-empresa-form">
        <Typography variant="h5" component="h3" gutterBottom>
        Cadastro de Empresa
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="segmento-label">Segmento</InputLabel>
          <Select
            labelId="segmento-label"
            name="segmento"
            value={formData.segmento}
            onChange={handleChange}
            required
          >
            {segmentos.map((segmento) => (
              <MenuItem key={segmento} value={segmento}>
                {segmento}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <RadioGroup
            row
            aria-labelledby="tipo-documento-label"
            name="tipo_documento"
            value={formData.tipo_documento}
            onChange={handleChange}
          >
            <FormControlLabel value="CNPJ" control={<Radio />} label="CNPJ" />
            <FormControlLabel value="CPF" control={<Radio />} label="CPF" />
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          label={formData.tipo_documento === 'CNPJ' ? 'CNPJ' : 'CPF'}
          name="documento"
          value={formData.documento}
          onChange={handleDocumentoChange}
          error={!!errors.documento}
          helperText={errors.documento}
          required
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: formData.tipo_documento === 'CNPJ' && (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={handleSearchCNPJ}
                  aria-label="buscar CNPJ"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{
            maxLength: formData.tipo_documento === 'CNPJ' ? 18 : 14
          }}
        />

        {formData.tipo_documento === 'CNPJ' && (
          <TextField
            fullWidth
            label="Razão Social"
            name="razao_social"
            value={formData.razao_social}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
          />
        )}

        <TextField
          fullWidth
          label="Nome Fantasia"
          name="nome_fantasia"
          value={formData.nome_fantasia}
          onChange={handleChange}
          margin="normal"
          required
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          margin="normal"
          required
          variant="outlined"
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
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Código C:hatFüd"
          name="codigo_chatfud"
          value={formData.codigo_chatfud}
          onChange={handleChange}
          margin="normal"
          required
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth className="submit-button">
          Criar Empresa
        </Button>
      </form>
      {message && (
        <Typography className="message">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default CriarEmpresa;
