import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios, { CancelTokenSource } from 'axios';
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
  IconButton,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CriarEmpresa.css';

const segmentos = [
  'Alimentação',
  'Vestuário',
  'Eletrônicos',
  'Saúde',
  'Educação',
  'Serviços',
  'Outros'
];

const CriarEmpresa: React.FC = () => {
  const [formData, setFormData] = useState({
    segmento: '',
    tipo_documento: 'CNPJ',
    documento: '',
    razao_social: '',
    nome_fantasia: '',
    email: '',
    telefone: '',
    nome_usuario: '',
    senha: '',
    confirmar_senha: ''
  });

  const [errors, setErrors] = useState({
    documento: '',
    email: '',
    telefone: '',
    nome_usuario: '',
    senha: '',
    confirmar_senha: ''
  });

  const [message, setMessage] = useState('');
  const isMounted = useRef(true);
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    if (numbers.length > 0) {
      formatted = `(${numbers.slice(0, 2)}`;
      if (numbers.length > 2) {
        formatted += `) ${numbers.slice(2, 3)}`;
        if (numbers.length > 3) {
          formatted += ` ${numbers.slice(3, 7)}`;
          if (numbers.length > 7) {
            formatted += `-${numbers.slice(7, 11)}`;
          }
        }
      }
    }
    return formatted;
  };

  const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const formattedValue = formatTelefone(value);
    setFormData(prev => ({ ...prev, telefone: formattedValue }));
  };

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    let formattedValue = numericValue;
    
    if (formData.tipo_documento === 'CNPJ') {
      if (numericValue.length > 2) formattedValue = `${numericValue.slice(0, 2)}.${numericValue.slice(2)}`;
      if (numericValue.length > 5) formattedValue = `${formattedValue.slice(0, 6)}.${formattedValue.slice(6)}`;
      if (numericValue.length > 8) formattedValue = `${formattedValue.slice(0, 10)}/${formattedValue.slice(10)}`;
      if (numericValue.length > 12) formattedValue = `${formattedValue.slice(0, 15)}-${formattedValue.slice(15)}`;
    } else {
      if (numericValue.length > 3) formattedValue = `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
      if (numericValue.length > 6) formattedValue = `${formattedValue.slice(0, 7)}.${formattedValue.slice(7)}`;
      if (numericValue.length > 9) formattedValue = `${formattedValue.slice(0, 11)}-${formattedValue.slice(11)}`;
    }

    setFormData(prev => ({ ...prev, documento: formattedValue }));
  };

  const handleSearchCNPJ = async () => {
    if (formData.tipo_documento !== 'CNPJ' || formData.documento.length !== 18) {
      toast.error('Por favor, insira um CNPJ válido.');
      return;
    }

    setIsLoading(true);

    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('New request initiated');
    }
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      const response = await axios.get(`/api/cnpj/${formData.documento.replace(/\D/g, '')}`, {
        cancelToken: cancelTokenRef.current.token
      });
      
      if (isMounted.current) {
        const { razao_social, nome_fantasia, telefone, email } = response.data;
        setFormData(prev => ({ 
          ...prev, 
          razao_social, 
          nome_fantasia, 
          telefone: formatTelefone(telefone),
          email
        }));
        toast.success('Informações da empresa carregadas com sucesso!');
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else if (isMounted.current) {
        toast.error('Erro ao buscar informações do CNPJ. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmar_senha) {
      setErrors(prev => ({ ...prev, confirmar_senha: 'As senhas não coincidem' }));
      return;
    }
    const submissionData = {
      ...formData,
      telefone: formData.telefone.replace(/\D/g, ''),
      documento: formData.documento.replace(/\D/g, '')
    };

    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('New request initiated');
    }
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      const response = await axios.post('/api/empresas', submissionData, {
        cancelToken: cancelTokenRef.current.token
      });
      if (isMounted.current) {
        setMessage('Empresa criada com sucesso!');
        console.log('Código ChatFud gerado:', response.data.codigo_chatfud);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else if (isMounted.current) {
        setMessage('Erro ao criar empresa. Por favor, tente novamente.');
      }
    }
  };

  return (
    <Box className="criar-empresa-form">
      <ToastContainer position="top-right" autoClose={5000} />
      <Typography variant="h5" component="h2" gutterBottom>
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

        <TextField
          fullWidth
          label="CNPJ"
          value={formData.documento}
          onChange={(e) => setFormData(prev => ({ ...prev, documento: e.target.value }))}
          margin="normal"
        />

        <Button
          onClick={handleSearchCNPJ}
          disabled={formData.documento.length !== 18 || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Buscando...' : 'Buscar CNPJ'}
        </Button>

        <TextField
          fullWidth
          label="Razão Social"
          name="razao_social"
          value={formData.razao_social}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Nome Fantasia"
          name="nome_fantasia"
          value={formData.nome_fantasia}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="E-mail"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleTelefoneChange}
          error={!!errors.telefone}
          helperText={errors.telefone}
          required
          margin="normal"
          inputProps={{
            maxLength: 16,
          }}
        />

        <TextField
          fullWidth
          label="Nome de Usuário"
          name="nome_usuario"
          value={formData.nome_usuario}
          onChange={handleChange}
          error={!!errors.nome_usuario}
          helperText={errors.nome_usuario}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Senha"
          name="senha"
          type="password"
          value={formData.senha}
          onChange={handleChange}
          error={!!errors.senha}
          helperText={errors.senha}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Confirmar Senha"
          name="confirmar_senha"
          type="password"
          value={formData.confirmar_senha}
          onChange={handleChange}
          error={!!errors.confirmar_senha}
          helperText={errors.confirmar_senha}
          required
          margin="normal"
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
