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

  const handleSubmitFinal = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      setValidatedStep2(true);
      return;
    }

    try {
      const dadosPsicologo = {
        name: nome,
        email: email,
        password: password,
        cpf: cpf.replace(/\D/g, ''),
        crp: crp,
        birthDate: dataNascimento
      };

      await api.post('/psychologists', dadosPsicologo);
      alert("Perfil enviado para análise!");
      navigate('/login');
    } catch  {
      alert("Erro ao enviar cadastro do profissional.");
    }
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
              <h2 className="fw-bold text-center mb-4 text-success">Documentos</h2>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold"><Upload size={16} className="me-2"/>Foto do documento</Form.Label>
                <Form.Control type="file" required size="lg" />
              </Form.Group>
              <Button type="submit">Finalizar Cadastro</Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};