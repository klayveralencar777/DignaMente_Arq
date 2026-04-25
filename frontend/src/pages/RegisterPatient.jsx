import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { api } from '../services/api'; 
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const RegisterPatient = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);


  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [susCard, setSusCard] = useState('');
  const [dataNascimento, setDataNascimento] = useState(''); // Necessário para o DTO

const handleSubmit = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;

  if (form.checkValidity() === true) {
    try {
      const payload = {
        name: nome,                 // Bate com String name no DTO
        email: email,               // Bate com String email no DTO
        password: password,         // O Back-end vai criptografar
        cpf: cpf.replace(/\D/g, ''), // Limpa a máscara para o banco
        cardSus: susCard.replace(/\D/g, ''), // "cardSus" conforme o seu DTO
        birthDate: dataNascimento,// No formato "YYYY-MM-DD"
        typeUser: 'PATIENT'
      };

      // api.post enviando para o caminho do Controller
      await api.post('/patients', payload);

      alert("Paciente cadastrado com sucesso no DignaMente!");
      navigate('/login');
    } catch (error) {
      console.error("Erro na integração:", error);
      alert("Erro ao salvar: verifique se o Back-end está rodando na porta 8080.");
    }
  }
  setValidated(true);
};
 
  return (
    <Container className="min-vh-100 d-flex flex-column py-5 bg-light">
      <Row className="justify-content-center flex-grow-1">
        <Col md={8} lg={5}>
          <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-2 p-0 mb-4">
            <ArrowLeft size={20} /> Voltar
          </button>

          <h2 className="fw-bold text-dark text-center mb-5">Criar Conta — Paciente</h2>

          <Form noValidate validated={validated} onSubmit={handleSubmit} className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
            <Input label="Nome Completo" placeholder="Seu nome completo" required value={nome} onChange={(e) => setNome(e.target.value)} />
            
            <Input label="Data de Nascimento" type="date" required value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />

            <Form.Group className="mb-3">
              <Form.Label className="fs-6 fw-medium text-secondary">CPF</Form.Label>
              <IMaskInput required minLength={14} mask="000.000.000-00" value={cpf} onAccept={(val) => setCpf(val)} className="form-control form-control-lg border-2 shadow-none" placeholder="000.000.000-00" />
            </Form.Group>

            <Input label="E-mail" type="email" placeholder="fulano@gmail.com" required value={email} onChange={(e) => setEmail(e.target.value)} />

            <Form.Group className="mb-3">
              <Form.Label className="fs-6 fw-medium text-secondary">Nº Cartão SUS</Form.Label>
              <IMaskInput required minLength={18} mask="0000 0000 0000 000" value={susCard} onAccept={(val) => setSusCard(val)} className="form-control form-control-lg border-2 shadow-none" placeholder="0000 0000 0000 000" />
            </Form.Group>

            <Input label="Crie sua Senha" type="password" placeholder="Mínimo 6 caracteres" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" className="mt-4">Criar Conta</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};