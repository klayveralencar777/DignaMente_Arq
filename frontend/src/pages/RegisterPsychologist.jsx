import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { api } from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const RegisterPsychologist = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [validatedStep1, setValidatedStep1] = useState(false);
  const [validatedStep2, setValidatedStep2] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [crp, setCrp] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const handleNextStep = (event) => {
    event.preventDefault();
    if (event.currentTarget.checkValidity()) setStep(2);
    setValidatedStep1(true);
  };

  // --- MUDANÇA AQUI: Função ajustada para enviar arquivos (FormData) ---
  // --- MUDANÇA AQUI: Função ajustada para enviar arquivos (FormData) ---
  const handleSubmitFinal = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      try {
        const formData = new FormData();
        
        // Adicionando os textos
        formData.append('name', nome);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('cpf', cpf.replace(/\D/g, ''));
        formData.append('crp', crp);
        formData.append('birthDate', dataNascimento);
        
        
        formData.append('typeUser', 'Psychologist'); 

        // Adicionando os arquivos
        const fileInputs = form.querySelectorAll('input[type="file"]');
        formData.append('selfieFile', fileInputs[0].files[0]);
        formData.append('idFile', fileInputs[1].files[0]);
        formData.append('crpFile', fileInputs[2].files[0]);

        // Enviando para a API com o cabeçalho correto para arquivos
        await api.post('/psychologists', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        alert("Cadastro profissional realizado e documentos enviados para análise!");
        navigate('/login');
      } catch (error) {
        console.error("Erro no envio:", error);
        alert("Não foi possível realizar o cadastro profissional. Verifique a conexão ou o tamanho das imagens.");
      }
    } else {
      event.stopPropagation();
    }
    setValidatedStep2(true);
  };

  return (
    <Container className="min-vh-100 d-flex flex-column py-5 bg-light">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-2 p-0 mb-4">
            <ArrowLeft size={20} /> Voltar
          </button>

          {step === 1 ? (
            <Form noValidate validated={validatedStep1} onSubmit={handleNextStep} className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
              <h2 className="fw-bold text-center mb-4">Dados Pessoais</h2>
              <Input label="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
              <Input label="Data de Nascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
              <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary fw-medium">CPF</Form.Label>
                <IMaskInput mask="000.000.000-00" value={cpf} onAccept={(val) => setCpf(val)} required className="form-control form-control-lg border-2 shadow-none" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-secondary fw-medium">CRP</Form.Label>
                <IMaskInput mask="00/000000" value={crp} onAccept={(val) => setCrp(val)} required className="form-control form-control-lg border-2 shadow-none" />
              </Form.Group>

              <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              <Button type="submit" className="mt-3">Próximo</Button>
            </Form>
          ) : (
            
            
            <Form noValidate validated={validatedStep2} onSubmit={handleSubmitFinal} className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
              <div className="text-center mb-2 text-success"><Upload size={40} /></div>
              <h2 className="fw-bold text-dark text-center mb-2">Verificação de Identidade</h2>
              <p className="text-muted text-center mb-4">Etapa 2 de 2: envio de documentos</p>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold"><Upload size={16} className="text-info me-2"/>Selfie segurando o documento</Form.Label>
                <Form.Text className="text-muted d-block mb-2">Foto sua segurando o RG ao lado do rosto.</Form.Text>
                <Form.Control type="file" required size="lg" />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold"><Upload size={16} className="text-info me-2"/>Foto do RG ou CPF</Form.Label>
                <Form.Text className="text-muted d-block mb-2">Documento oficial com foto.</Form.Text>
                <Form.Control type="file" required size="lg" />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold"><Upload size={16} className="text-info me-2"/>Foto da Carteira do CRP</Form.Label>
                <Form.Text className="text-muted d-block mb-2">Frente da carteira profissional.</Form.Text>
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