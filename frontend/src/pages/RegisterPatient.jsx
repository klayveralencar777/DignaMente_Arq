import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { validateNome, validateData, validateEmail, validateSenha, validateCPF, validateSUS } from '../utils/validators';

export const RegisterPatient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '', data: '', email: '', senha: '', cpf: '', sus: ''
  });

  const [errors, setErrors] = useState({
    nome: null, data: null, email: null, senha: null, cpf: null, sus: null
  });

  const handleValidation = (field, value) => {
    let error = null;
    switch (field) {
      case 'nome': error = validateNome(value); break;
      case 'data': error = validateData(value); break;
      case 'email': error = validateEmail(value); break;
      case 'senha': error = validateSenha(value); break;
      case 'cpf': error = validateCPF(value); break;
      case 'sus': error = validateSUS(value); break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    let formattedValue = value;

    if (field === 'cpf') {
      formattedValue = value.replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else if (field === 'sus') {
      formattedValue = value.replace(/\D/g, '').substring(0, 15);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    handleValidation(field, formattedValue);
  };

  const handleBlur = (field) => {
    handleValidation(field, formData[field]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      nome: validateNome(formData.nome),
      data: validateData(formData.data),
      email: validateEmail(formData.email),
      senha: validateSenha(formData.senha),
      cpf: validateCPF(formData.cpf),
      sus: validateSUS(formData.sus)
    };

    setErrors(prev => ({ ...prev, ...newErrors }));

    const hasErrors = Object.values(newErrors).some(err => err !== null);

    if (hasErrors) {
      // Alert removido! Agora o sistema só trava o envio e mostra as mensagens vermelhas.
      return; 
    }

    try {
      await api.post('/patients', {
        name: formData.nome,
        birthDate: formData.data,
        email: formData.email,
        password: formData.senha,
        cpf: formData.cpf.replace(/\D/g, ''),
        cardSus: formData.sus,
        typeUser: 'PATIENT'
      });
      alert("Cadastro realizado com sucesso!");
      navigate('/login');
    } catch (error) {
      alert("Erro ao salvar. Verifique sua conexão.");
    }
  };

  const isValid = (field) => formData[field].length > 0 && errors[field] === null;

  return (
    <Container className="min-vh-100 py-4">
      <div className="mb-4 pt-3">
        <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-2 p-0">
          <ArrowLeft size={20} /> Voltar
        </button>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <h2 className="fw-bold text-dark text-center mb-4">Criar Conta — Paciente</h2>

          <Form noValidate onSubmit={handleSubmit} className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light">
            <Input 
              label="Nome Completo" placeholder="Ex: Rafael Santos"
              value={formData.nome} 
              onChange={(e) => handleChange('nome', e.target.value)}
              onBlur={() => handleBlur('nome')}
              error={errors.nome} isValid={isValid('nome')}
            />
            
            <Input 
              label="Data de Nascimento" type="date"
              value={formData.data} 
              onChange={(e) => handleChange('data', e.target.value)}
              onBlur={() => handleBlur('data')}
              error={errors.data} isValid={isValid('data')}
            />

            <Input 
              label="CPF" placeholder="000.000.000-00" maxLength="14"
              value={formData.cpf} 
              onChange={(e) => handleChange('cpf', e.target.value)}
              onBlur={() => handleBlur('cpf')}
              error={errors.cpf} isValid={isValid('cpf')}
            />

            <Input 
              label="E-mail" type="email" placeholder="seu@email.com"
              value={formData.email} 
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={errors.email} isValid={isValid('email')}
            />

            <Input 
              label="Nº Cartão SUS" placeholder="15 dígitos" maxLength="15"
              value={formData.sus} 
              onChange={(e) => handleChange('sus', e.target.value)}
              onBlur={() => handleBlur('sus')}
              error={errors.sus} isValid={isValid('sus')}
            />

            <Input 
              label="Crie sua Senha" type="password" placeholder="Mínimo 8 caracteres"
              value={formData.senha} 
              onChange={(e) => handleChange('senha', e.target.value)}
              onBlur={() => handleBlur('senha')}
              error={errors.senha} isValid={isValid('senha')}
            />

            <Button type="submit" className="mt-4">Criar Conta</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};