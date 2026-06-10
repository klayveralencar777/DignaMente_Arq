import { useState, useRef } from "react";
import { Container, Card, Form, Button as BootstrapButton, Spinner, Alert } from "react-bootstrap";
import { Heart, User, Mail, Lock, FileText, ArrowLeft, Briefcase, Calendar, Star, Upload, Clock, CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

import { api } from "../../../services/api"; 

export const RegisterPsychologist = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    crp: "",
    specialty: "", 
    password: "",
    birthDate: "", 
  });

  const [files, setFiles] = useState({
    selfie: null,
    rgCpf: null,
    carteiraCrp: null
  });

  const primaryTeal = "#2C7A7B";

  const handleChange = (e) => {
    let { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      let numbersOnly = value.replace(/\D/g, '').substring(0, 11);
      formattedValue = numbersOnly
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } 
    else if (name === 'crp') {
      formattedValue = value.toUpperCase();
      if (formattedValue.length > 0 && !formattedValue.startsWith('CRP-')) {
        formattedValue = 'CRP-' + formattedValue.replace('CRP', '').replace('-', '');
      }
      if (formattedValue.length > 12) {
        formattedValue = formattedValue.substring(0, 12);
      }
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleFileChange = (e, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [fieldName]: e.target.files[0] });
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmitFinal = async (e) => {
    e.preventDefault();
    
    if (!files.selfie || !files.rgCpf || !files.carteiraCrp) {
      setErrorMsg("Você precisa anexar os três documentos para prosseguir.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const uploadFileToBackend = async (file) => {
        const payload = new FormData();
        payload.append("file", file);
        return await api.post("/files/upload", payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      };

      await Promise.all([
        uploadFileToBackend(files.selfie),
        uploadFileToBackend(files.rgCpf),
        uploadFileToBackend(files.carteiraCrp)
      ]);

      const payloadParaOJava = {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''), 
        crp: formData.crp,
        specialty: formData.specialty,
        password: formData.password,
        birthDate: formData.birthDate,
        typeUser: "PSYCHOLOGIST" 
      };

      await api.post("/psychologists", payloadParaOJava);
      
      // EM VEZ DE IR PRO LOGIN, AVANÇA PARA A TELA DE ANÁLISE (STEP 3)
      setStep(3);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Erro na integração:", error);
      setErrorMsg(error.response?.data?.message || error.response?.data || "Ocorreu um erro ao enviar os dados para o servidor. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: "#F0F4F8", fontFamily: "Inter, sans-serif" }}>
      <Container style={{ maxWidth: "550px" }}>
        
        {step !== 3 && (
          <div className="text-center mb-4">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <Heart size={36} style={{ color: primaryTeal }} strokeWidth={2.5} />
              <h1 className="m-0 fw-bold" style={{ color: primaryTeal, fontSize: '2.5rem' }}>DignaMente</h1>
            </div>
            <h4 className="fw-bold text-dark">Cadastro de Psicólogo</h4>
            <p className="text-muted">
              {step === 1 ? "Etapa 1 de 2: Seus dados profissionais" : "Etapa 2 de 2: Envio de documentos"}
            </p>
          </div>
        )}

        <Card className="border-0 rounded-4 shadow-lg bg-white p-4 p-md-5">
          <Card.Body className="p-0">
            
            {step !== 3 && (
              <BootstrapButton 
                variant="link" 
                onClick={() => step === 1 ? navigate('/cadastro') : setStep(1)}
                className="p-0 text-secondary text-decoration-none d-flex align-items-center gap-2 mb-4 fw-medium shadow-none"
              >
                <ArrowLeft size={18} /> {step === 1 ? "Voltar para seleção" : "Voltar"}
              </BootstrapButton>
            )}

            {errorMsg && <Alert variant="danger" className="rounded-3 fw-medium">{errorMsg}</Alert>}

            {/* --- ETAPA 1: DADOS --- */}
            {step === 1 && (
              <Form onSubmit={handleNextStep} className="d-flex flex-column gap-3">
                <Form.Group>
                  <Form.Label className="fw-bold small text-secondary">Nome Completo</Form.Label>
                  <div className="position-relative">
                    <User size={18} className="position-absolute text-muted" style={{ top: '14px', left: '14px' }} />
                    <Form.Control 
                      type="text" name="name" placeholder="Ex: Dra. Maria Silva"
                      value={formData.name} onChange={handleChange} required
                      className="shadow-none rounded-3 bg-light border-0" style={{ padding: '12px 12px 12px 40px' }}
                    />
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="fw-bold small text-secondary">E-mail Profissional</Form.Label>
                  <div className="position-relative">
                    <Mail size={18} className="position-absolute text-muted" style={{ top: '14px', left: '14px' }} />
                    <Form.Control 
                      type="email" name="email" placeholder="seu@email.com"
                      value={formData.email} onChange={handleChange} required
                      className="shadow-none rounded-3 bg-light border-0" style={{ padding: '12px 12px 12px 40px' }}
                    />
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="fw-bold small text-secondary">Data de Nascimento</Form.Label>
                  <div className="position-relative">
                    <Calendar size={18} className="position-absolute text-muted" style={{ top: '14px', left: '14px' }} />
                    <Form.Control 
                      type="date" name="birthDate"
                      value={formData.birthDate} onChange={handleChange} required
                      className="shadow-none rounded-3 bg-light border-0 text-secondary" style={{ padding: '12px 12px 12px 40px' }}
                    />
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="fw-bold small text-secondary">CPF</Form.Label>
                  <div className="position-relative">
                    <FileText size={18} className="position-absolute text-muted" style={{ top: '14px', left: '14px' }} />
                    <Form.Control 
                      type="text" name="cpf" placeholder="000.000.000-00"
                      value={formData.cpf} onChange={handleChange} required
                      className="shadow-none rounded-3 bg-light border-0" style={{ padding: '12px 12px 12px 40px' }}
                    />
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="fw-bold small text-secondary">CRP</Form.Label>
                  <div className="position-relative">
                    <Briefcase size={18} className="position-absolute text-muted" style={{ top: '14px', left: '14px' }} />
                    <Form.Control 
                      type="text" name="crp" placeholder="CRP-XX/XXXXX"
                      value={formData.crp} onChange={handleChange} required
                      className="shadow-none rounded-3 bg-light border-0" style={{ padding: '12px 12px 12px 40px' }}
                    />
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="fw-bold small text-secondary">Especialidade Principal</Form.Label>
                  <div className="position-relative">
                    <Star size={18} className="position-absolute text-muted" style={{ top: '14px', left: '14px' }} />
                    <Form.Control 
                      type="text" name="specialty" placeholder="Ex: TCC, Psicanálise..."
                      value={formData.specialty} onChange={handleChange} required
                      className="shadow-none rounded-3 bg-light border-0" style={{ padding: '12px 12px 12px 40px' }}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold small text-secondary">Senha</Form.Label>
                  <div className="position-relative">
                    <Lock size={18} className="position-absolute text-muted" style={{ top: '14px', left: '14px' }} />
                    <Form.Control 
                      type="password" name="password" placeholder="Crie uma senha forte"
                      value={formData.password} onChange={handleChange} required minLength={6}
                      className="shadow-none rounded-3 bg-light border-0" style={{ padding: '12px 12px 12px 40px' }}
                    />
                  </div>
                </Form.Group>

                <BootstrapButton 
                  type="submit" 
                  className="w-100 py-3 fw-bold border-0 rounded-3 shadow-sm"
                  style={{ backgroundColor: primaryTeal, fontSize: '1.1rem' }}
                >
                  Próximo
                </BootstrapButton>
                
                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted m-0">Já tem uma conta?</p>
                  <Link to="/login" className="fw-bold text-decoration-none" style={{ color: primaryTeal }}>
                    Fazer Login
                  </Link>
                </div>
              </Form>
            )}

            {/* --- ETAPA 2: UPLOAD --- */}
            {step === 2 && (
              <Form onSubmit={handleSubmitFinal} className="d-flex flex-column gap-3">
                <div className="text-center mb-4">
                  <Upload size={40} style={{ color: primaryTeal }} className="mb-2" />
                  <h2 className="fw-bold text-dark">Verificação</h2>
                  <p className="text-muted small">Etapa 2 de 2: envio de documentos</p>
                </div>

                <Form.Group>
                  <Form.Label className="fw-bold small text-dark d-flex justify-content-between">
                    Selfie com documento
                    {files.selfie && <CheckCircle size={16} className="text-success" />}
                  </Form.Label>
                  <Form.Control type="file" required accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'selfie')} className="shadow-none rounded-2" />
                </Form.Group>

                <Form.Group>
                  <Form.Label className="fw-bold small text-dark d-flex justify-content-between">
                    Foto do RG ou CPF
                    {files.rgCpf && <CheckCircle size={16} className="text-success" />}
                  </Form.Label>
                  <Form.Control type="file" required accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'rgCpf')} className="shadow-none rounded-2" />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold small text-dark d-flex justify-content-between">
                    Carteira do CRP
                    {files.carteiraCrp && <CheckCircle size={16} className="text-success" />}
                  </Form.Label>
                  <Form.Control type="file" required accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'carteiraCrp')} className="shadow-none rounded-2" />
                </Form.Group>

                <BootstrapButton type="submit" disabled={isLoading} className="w-100 py-3 fw-bold border-0 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: primaryTeal, fontSize: '1.1rem' }}>
                  {isLoading ? <Spinner size="sm" animation="border" /> : "Finalizar Cadastro"}
                </BootstrapButton>
              </Form>
            )}

            {/* --- ETAPA 3: SUCESSO / EM ANÁLISE --- */}
            {step === 3 && (
              <div className="text-center py-4">
                <div className="d-inline-flex p-4 rounded-circle mb-4 shadow-sm" style={{ backgroundColor: '#E8F3F3' }}>
                  <Clock size={50} style={{ color: primaryTeal }} />
                </div>
                <h2 className="fw-bold text-dark mb-3">Cadastro em Análise!</h2>
                <p className="text-muted mb-4 px-2" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Seus dados e documentos foram enviados com sucesso para a nossa equipe. 
                  O processo de verificação da identidade profissional leva <strong>até 48 horas úteis</strong>.
                </p>
                <div className="bg-light p-3 rounded-3 mb-5 border">
                  <p className="small text-secondary m-0">
                    Assim que seu perfil for aprovado pelo administrador, você estará liberado para acessar o painel e iniciar seus atendimentos.
                  </p>
                </div>
                
                <BootstrapButton 
                  onClick={() => navigate('/login')}
                  className="w-100 py-3 fw-bold border-0 rounded-3 shadow-sm"
                  style={{ backgroundColor: primaryTeal, fontSize: '1.1rem' }}
                >
                  Voltar para o Início
                </BootstrapButton>
              </div>
            )}

          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};