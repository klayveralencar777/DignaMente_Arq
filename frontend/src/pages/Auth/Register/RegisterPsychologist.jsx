import { useState } from "react";
import { Container, Card, Form, Button, Spinner, Modal } from "react-bootstrap";
import { User, Mail, Calendar, FileText, Briefcase, Star, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../../services/api";

export const RegisterPsychologist = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthDate: "",
    cpf: "",
    crp: "",
    specialty: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // 👇 NOVO ESTADO PARA O POPUP DE SUCESSO 👇
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const primaryColor = "#2C7A7B";
  const lightBackground = "#F0F4F8";

  // --- MÁSCARAS AUTOMÁTICAS ---
  const handleCPFChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); 
    if (value.length > 11) value = value.slice(0, 11);
    
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    
    setFormData({ ...formData, cpf: value });
  };

  const handleCRPChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); 
    if (value.length > 7) value = value.slice(0, 7); 
    
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, "$1/$2");
    }
    
    setFormData({ ...formData, crp: value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  // --- VALIDAÇÃO E ENVIO ---
  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "O nome é obrigatório.";
    
    if (!formData.email.trim()) {
      newErrors.email = "O e-mail é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Por favor, insira um e-mail válido.";
    }

    if (!formData.birthDate) newErrors.birthDate = "A data de nascimento é obrigatória.";
    if (formData.cpf.length < 14) newErrors.cpf = "CPF inválido.";
    if (formData.crp.length < 4) newErrors.crp = "CRP inválido.";
    if (!formData.specialty.trim()) newErrors.specialty = "A especialidade é obrigatória.";
    
    if (!formData.password) {
      newErrors.password = "A senha é obrigatória.";
    } else if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    setErrors(newErrors);

    // Se não tiver erros, envia para o Back-end
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const payload = {
          ...formData,
          cpf: formData.cpf.replace(/\D/g, "")
        };

        await api.post('/psychologists', payload);
        
        // 👇 TIRA O ALERT VELHO E CHAMA O MODAL LINDO 👇
        setShowSuccessModal(true);

      } catch (error) {
        console.error("Erro ao cadastrar psicólogo:", error);
        setErrors({ form: error.response?.data?.message || "Erro ao cadastrar. Verifique os dados e tente novamente." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-5" style={{ backgroundColor: lightBackground, fontFamily: "Inter, sans-serif" }}>
      
      <div className="text-center mb-4">
        <h2 className="fw-bold" style={{ color: "#2d3748" }}>Cadastro de Psicólogo</h2>
        <p className="text-muted fs-5">Crie sua conta profissional</p>
      </div>

      <Container style={{ maxWidth: "500px" }}>
        <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5">
          
          <button 
            className="btn btn-link text-decoration-none text-muted p-0 mb-4 d-flex align-items-center gap-2"
            onClick={() => navigate("/cadastro")}
          >
            <ArrowLeft size={18} /> Voltar para seleção
          </button>

          <Form>
            {/* MENSAGEM DE ERRO INLINE (MUITO MAIS ELEGANTE QUE ALERT) */}
            {errors.form && (
              <div className="alert alert-danger p-3 small text-center rounded-3 fw-medium">
                {errors.form}
              </div>
            )}

            {/* NOME COMPLETO */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-secondary small mb-1">Nome Completo</Form.Label>
              <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 border border-light">
                <User size={20} className="text-muted me-2 flex-shrink-0" />
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-0 bg-transparent shadow-none p-0 text-dark"
                  placeholder="Ex: Dra. Maria Silva"
                />
              </div>
              {errors.name && <small className="text-danger mt-1 d-block">{errors.name}</small>}
            </Form.Group>

            {/* E-MAIL */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-secondary small mb-1">E-mail Profissional</Form.Label>
              <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 border border-light">
                <Mail size={20} className="text-muted me-2 flex-shrink-0" />
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-0 bg-transparent shadow-none p-0 text-dark"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && <small className="text-danger mt-1 d-block">{errors.email}</small>}
            </Form.Group>

            {/* DATA DE NASCIMENTO */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-secondary small mb-1">Data de Nascimento</Form.Label>
              <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 border border-light">
                <Calendar size={20} className="text-muted me-2 flex-shrink-0" />
                <Form.Control
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="border-0 bg-transparent shadow-none p-0 text-dark"
                />
              </div>
              {errors.birthDate && <small className="text-danger mt-1 d-block">{errors.birthDate}</small>}
            </Form.Group>

            {/* CPF */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-secondary small mb-1">CPF</Form.Label>
              <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 border border-light">
                <FileText size={20} className="text-muted me-2 flex-shrink-0" />
                <Form.Control
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  className="border-0 bg-transparent shadow-none p-0 text-dark"
                  placeholder="000.000.000-00"
                />
              </div>
              {errors.cpf && <small className="text-danger mt-1 d-block">{errors.cpf}</small>}
            </Form.Group>

            {/* CRP */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-secondary small mb-1">CRP</Form.Label>
              <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 border border-light">
                <Briefcase size={20} className="text-muted me-2 flex-shrink-0" />
                <Form.Control
                  type="text"
                  name="crp"
                  value={formData.crp}
                  onChange={handleCRPChange}
                  className="border-0 bg-transparent shadow-none p-0 text-dark"
                  placeholder="06/12345"
                />
              </div>
              {errors.crp && <small className="text-danger mt-1 d-block">{errors.crp}</small>}
            </Form.Group>

            {/* ESPECIALIDADE */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-secondary small mb-1">Especialidade Principal</Form.Label>
              <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 border border-light">
                <Star size={20} className="text-muted me-2 flex-shrink-0" />
                <Form.Control
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="border-0 bg-transparent shadow-none p-0 text-dark"
                  placeholder="Ex: TCC, Psicanálise..."
                />
              </div>
              {errors.specialty && <small className="text-danger mt-1 d-block">{errors.specialty}</small>}
            </Form.Group>

            {/* SENHA */}
            <Form.Group className="mb-5">
              <Form.Label className="fw-bold text-secondary small mb-1">Senha</Form.Label>
              <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 border border-light">
                <Lock size={20} className="text-muted me-2 flex-shrink-0" />
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-0 bg-transparent shadow-none p-0 text-dark"
                  placeholder="Crie uma senha forte"
                />
              </div>
              {errors.password && <small className="text-danger mt-1 d-block">{errors.password}</small>}
            </Form.Group>

            <Button 
              className="w-100 fw-bold py-3 rounded-3 shadow-sm border-0 d-flex justify-content-center align-items-center gap-2"
              style={{ backgroundColor: primaryColor }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" />
                  Cadastrando...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>

          </Form>

          <hr className="my-4 text-muted" />

          <div className="text-center">
            <span className="text-muted">Já tem uma conta? </span>
            <Link to="/login" className="fw-bold text-decoration-none" style={{ color: primaryColor }}>
              Fazer Login
            </Link>
          </div>

        </Card>
      </Container>

      
      <Modal 
        show={showSuccessModal} 
        centered 
        backdrop="static" 
        keyboard={false} 
        contentClassName="border-0 rounded-4 shadow-lg"
      >
        <Modal.Body className="text-center p-5">
          <CheckCircle size={70} color={primaryColor} className="mb-4" />
          <h3 className="fw-bold mb-3" style={{ color: "#2d3748" }}>Cadastro Concluído!</h3>
          <p className="text-muted fs-5 mb-4">Sua conta de psicólogo foi criada com sucesso e já está pronta para uso.</p>
          <Button
            className="w-100 fw-bold py-3 rounded-3 shadow-sm border-0"
            style={{ backgroundColor: primaryColor, fontSize: "1.1rem" }}
            onClick={() => navigate("/login")}
          >
            Ir para o Login
          </Button>
        </Modal.Body>
      </Modal>
      

    </div>
  );
};