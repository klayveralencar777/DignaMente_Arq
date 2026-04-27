import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { validateNome, validateData, validateEmail, validateSenha, validateCPF, validateCRP } from '../utils/validators';

export const RegisterPsychologist = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    nome: '', data: '', email: '', senha: '', cpf: '', crp: ''
  });

  const [errors, setErrors] = useState({
    nome: null, data: null, email: null, senha: null, cpf: null, crp: null
  });

  const handleValidation = (field, value) => {
    let error = null;
    switch (field) {
      case 'nome': error = validateNome(value); break;
      case 'data': error = validateData(value); break;
      case 'email': error = validateEmail(value); break;
      case 'senha': error = validateSenha(value); break;
      case 'cpf': error = validateCPF(value); break;
      case 'crp': error = validateCRP(value); break;
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
    } else if (field === 'crp') {
      formattedValue = value.toUpperCase();
      if (formattedValue.length > 3 && !formattedValue.startsWith('CRP-')) {
        formattedValue = 'CRP-' + formattedValue.replace('CRP', '').replace('-', '');
      }
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    handleValidation(field, formattedValue);
  };

  const handleBlur = (field) => handleValidation(field, formData[field]);

  const handleNextStep = (e) => {
    e.preventDefault();
    
    const newErrors = {
      nome: validateNome(formData.nome),
      data: validateData(formData.data),
      email: validateEmail(formData.email),
      senha: validateSenha(formData.senha),
      cpf: validateCPF(formData.cpf),
      crp: validateCRP(formData.crp)
    };

    setErrors(prev => ({ ...prev, ...newErrors }));

    const hasErrors = Object.values(newErrors).some(err => err !== null);
    
    if (hasErrors) {
      // Alert removido!
      return; 
    }
    
    setStep(2);
  };

  const handleSubmitFinal = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    try {
      const payload = new FormData();
      payload.append('name', formData.nome);
      payload.append('email', formData.email);
      payload.append('password', formData.senha);
      payload.append('cpf', formData.cpf.replace(/\D/g, ''));
      payload.append('crp', formData.crp);
      payload.append('birthDate', formData.data);
      payload.append('typeUser', 'Psychologist'); 

      const fileInputs = form.querySelectorAll('input[type="file"]');
      payload.append('selfieFile', fileInputs[0].files[0]);
      payload.append('idFile', fileInputs[1].files[0]);
      payload.append('crpFile', fileInputs[2].files[0]);

      await api.post('/psychologists', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Cadastro profissional realizado!");
      navigate('/login');
    } catch (error) {
      alert("Erro ao enviar documentos.");
    }
  };

  const isValid = (field) => formData[field].length > 0 && errors[field] === null;

  return (
    <Container className="min-vh-100 py-4">
      <div className="mb-4 pt-3">
        <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-2 p-0">
          <ArrowLeft size={20} /> Voltar
        </button>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          {step === 1 ? (
            <Form noValidate onSubmit={handleNextStep} className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light">
              <h2 className="fw-bold text-center mb-4 text-primaria">Dados Pessoais</h2>
              
              <Input 
                label="Nome Completo" placeholder="Ex: Dr. Rafael Santos"
                value={formData.nome} onChange={(e) => handleChange('nome', e.target.value)} onBlur={() => handleBlur('nome')}
                error={errors.nome} isValid={isValid('nome')}
              />
              <Input 
                label="Data de Nascimento" type="date"
                value={formData.data} onChange={(e) => handleChange('data', e.target.value)} onBlur={() => handleBlur('data')}
                error={errors.data} isValid={isValid('data')}
              />
              <Input 
                label="E-mail" type="email" placeholder="rafael@exemplo.com"
                value={formData.email} onChange={(e) => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')}
                error={errors.email} isValid={isValid('email')}
              />
              <Input 
                label="CPF" placeholder="000.000.000-00" maxLength="14"
                value={formData.cpf} onChange={(e) => handleChange('cpf', e.target.value)} onBlur={() => handleBlur('cpf')}
                error={errors.cpf} isValid={isValid('cpf')}
              />
              <Input 
                label="CRP" placeholder="CRP-00/00000" maxLength="12"
                value={formData.crp} onChange={(e) => handleChange('crp', e.target.value)} onBlur={() => handleBlur('crp')}
                error={errors.crp} isValid={isValid('crp')}
              />
              <Input 
                label="Senha" type="password" placeholder="Mínimo 8 caracteres"
                value={formData.senha} onChange={(e) => handleChange('senha', e.target.value)} onBlur={() => handleBlur('senha')}
                error={errors.senha} isValid={isValid('senha')}
              />
              <Button type="submit" className="mt-3">Próximo</Button>
            </Form>
          ) : (
            <Form noValidate onSubmit={handleSubmitFinal} className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light">
              <div className="text-center mb-2 text-primaria"><Upload size={40} /></div>
              <h2 className="fw-bold text-dark text-center mb-2">Verificação</h2>
              <p className="text-muted text-center mb-4">Etapa 2 de 2: envio de documentos</p>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Selfie com documento</Form.Label>
                <Form.Control type="file" required size="lg" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Foto do RG ou CPF</Form.Label>
                <Form.Control type="file" required size="lg" />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Carteira do CRP</Form.Label>
                <Form.Control type="file" required size="lg" />
              </Form.Group>

              <Button type="submit" className="mt-4">Finalizar Cadastro</Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};