import { useState } from "react";
import { Container, Row, Col, Card, Navbar, Button as BootstrapButton, Modal, Toast, ToastContainer } from "react-bootstrap";
import { Settings, CalendarDays, Phone, Heart, ClipboardCheck, AlertCircle, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SettingsMenu } from "../Settings/SettingsMenu";
import { CrisisModal } from "../../../components/ui/CrisisModal";

export const TriageDashboard = () => {
  const navigate = useNavigate();
  const [userName] = useState(() => localStorage.getItem("@DignaMente:userName") || "Paciente");
  const [showSettings, setShowSettings] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  // Estado do Modal de Termos e do Toast de Sucesso (Aparecem juntos na primeira vez)
  const isFirstTime = localStorage.getItem("@DignaMente:termsAccepted") !== "true";
  const [showTermsModal, setShowTermsModal] = useState(isFirstTime);
  const [showSuccessToast, setShowSuccessToast] = useState(isFirstTime);

  const handleShowSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Função para aceitar e fechar os termos
  const handleAcceptTerms = () => {
    localStorage.setItem("@DignaMente:termsAccepted", "true");
    setShowTermsModal(false);
  };

  const primaryColor = "#2C7A7B";
  const lightBackground = "#F0F4F8";
  const paleTeal = "#E8F3F3";
  const borderTeal = "#C4E1E1";

  return (
    <>
      <div className="min-vh-100" style={{ backgroundColor: lightBackground, color: "#333", fontFamily: "Inter, sans-serif" }}>
        
        {/* TOAST DE SUCESSO FLUTUANTE */}
        <ToastContainer position="top-end" className="p-4" style={{ zIndex: 1060, position: 'fixed' }}>
          <Toast 
            show={showSuccessToast} 
            onClose={() => setShowSuccessToast(false)} 
            delay={4000} 
            autohide
            className="border-0 shadow-sm rounded-3"
            style={{ backgroundColor: '#F8FAFC', border: `1px solid ${borderTeal}` }}
          >
            <Toast.Body className="fw-medium text-dark px-4 py-3" style={{ fontSize: "0.95rem" }}>
              Conta criada com sucesso!
            </Toast.Body>
          </Toast>
        </ToastContainer>

        <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom shadow-sm fixed-top">
          <Container fluid className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <h4 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: primaryColor }}>
                <Heart size={26} strokeWidth={2.5} />
                <span>DignaMente</span>
                <span className="text-muted fw-normal ms-2 d-none d-sm-inline" style={{ fontSize: "1.1rem" }}> — Triagem</span>
              </h4>
            </div>
            <BootstrapButton 
                variant="light" 
                onClick={handleShowSettings} 
                className="d-flex align-items-center gap-2 px-4 py-2 fw-bold border-0 rounded-pill transition-all"
                style={{ backgroundColor: "#E8F3F3", color: "#2C7A7B", fontSize: "0.95rem" }}
                onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
                onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
              >
          <Settings size={18} /> Configurações
          </BootstrapButton>
          </Container>
        </Navbar>

        <div style={{ height: "80px" }}></div>

        <Container className="pt-4 px-md-5 pb-5" style={{ maxWidth: "900px" }}>
          <div className="mb-4">
            <h1 className="fw-bold m-0" style={{ fontSize: "2.2rem", color: "#2d3748" }}>Olá, {userName}! 👋</h1>
            <p className="fs-5 m-0 mt-1" style={{ color: "#718096" }}>Bem-vindo ao seu espaço de cuidado.</p>
          </div>

          {/* BOTÃO EXCLUSIVO DE TRIAGEM */}
          <Card
            className="border-0 rounded-4 p-4 shadow-sm text-white mb-3 position-relative overflow-hidden"
            style={{ backgroundColor: primaryColor, cursor: "pointer", transition: "transform 0.2s" }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            onClick={() => navigate("/sala-de-espera-triagem")}
          >
            <Card.Body className="p-0 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", backgroundColor: "rgba(255, 255, 255, 0.15)", borderRadius: "16px" }}>
                  <ClipboardCheck size={30} />
                </div>
                <div>
                  <h3 className="m-0 fw-bold" style={{ fontSize: "1.6rem" }}>Agendar Triagem</h3>
                  <p className="m-0 text-white fw-medium" style={{ opacity: 0.85, fontSize: "1rem" }}>Faça sua avaliação inicial para liberar consultas</p>
                </div>
              </div>
              <div className="d-none d-md-block" style={{ opacity: 0.15 }}><CalendarDays size={60} /></div>
            </Card.Body>
          </Card>

          {/* AVISO DE TRIAGEM */}
          <div className="d-flex align-items-center gap-3 p-3 rounded-4 mb-4 border" style={{ backgroundColor: paleTeal, borderColor: borderTeal }}>
            <AlertCircle size={24} style={{ color: primaryColor, minWidth: "24px" }} />
            <div>
              <h6 className="m-0 fw-bold" style={{ color: "#2d3748", fontSize: "0.95rem" }}>Aguardando avaliação inicial</h6>
              <p className="m-0" style={{ color: "#4a5568", fontSize: "0.85rem" }}>Após sua triagem, seu painel completo será liberado.</p>
            </div>
          </div>

          <Row className="g-4 mb-5">
            <Col md={6}>
              <Card className="border-0 rounded-4 shadow-sm p-4 h-100 opacity-75">
                <Card.Body className="d-flex flex-column p-0 gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-4" style={{ width: "50px", height: "50px", backgroundColor: paleTeal, color: primaryColor }}><CalendarDays size={24} /></div>
                    <p className="m-0 fw-medium" style={{ color: "#718096" }}>Próxima Consulta</p>
                  </div>
                  <div className="mt-2"><h5 className="m-0 fw-bold" style={{ color: "#2d3748", opacity: 0.8 }}>Bloqueado</h5></div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 rounded-4 shadow-sm p-4 h-100 opacity-75">
                <Card.Body className="d-flex flex-column p-0 gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-4" style={{ width: "50px", height: "50px", backgroundColor: paleTeal, color: primaryColor }}><ClipboardList size={24} /></div>
                    <p className="m-0 fw-medium" style={{ color: "#718096" }}>Meu Histórico</p>
                  </div>
                  <div className="mt-2"><h4 className="m-0 fw-bold mb-1" style={{ color: "#2d3748" }}>0 consultas</h4></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: "1000" }}>
          <button 
            className="btn rounded-circle d-flex align-items-center justify-content-center shadow-lg border-0 bg-danger" 
            style={{ width: "64px", height: "64px", transition: "transform 0.2s" }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={() => setShowCrisisModal(true)}
          >
            <Phone size={28} className="text-white" />
          </button>
        </div>

        <SettingsMenu show={showSettings} onHide={handleCloseSettings} onLogout={handleLogout} />
        <CrisisModal show={showCrisisModal} onHide={() => setShowCrisisModal(false)} />
      </div>

      {/* MODAL DE TERMOS DE USO */}
      <Modal show={showTermsModal} backdrop="static" keyboard={false} centered style={{ zIndex: 1050 }}>
        <Modal.Header className="border-0 pb-0 d-flex justify-content-between align-items-start">
          <div>
            <Modal.Title className="fw-bold d-flex align-items-center gap-2" style={{ color: "#2d3748" }}>
              Bem-vindo ao DignaMente 💚
            </Modal.Title>
            <p className="text-muted mt-1 mb-0" style={{ fontSize: "0.95rem" }}>
              Seu espaço seguro de cuidado em saúde mental pelo SUS.
            </p>
          </div>
        </Modal.Header>
        
        <Modal.Body className="pt-4 pb-4">
          <div className="p-3 rounded-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", maxHeight: "250px", overflowY: "auto" }}>
            <h6 className="fw-bold mb-3" style={{ color: "#1E293B" }}>Termos de Privacidade e Uso</h6>
            <ul className="list-unstyled mb-0" style={{ color: "#475569", fontSize: "0.9rem", lineHeight: "1.7" }}>
              <li className="mb-2">1. Seus dados pessoais são protegidos conforme a LGPD (Lei 13.709/2018).</li>
              <li className="mb-2">2. As teleconsultas são criptografadas ponta-a-ponta.</li>
              <li className="mb-2">3. Nenhuma gravação será feita sem seu consentimento expresso.</li>
              <li className="mb-2">4. Você pode solicitar a exclusão dos seus dados a qualquer momento.</li>
              <li className="mb-2">5. Informações clínicas são acessíveis apenas ao seu profissional de saúde designado.</li>
              <li className="mb-0">6. O uso do sistema é gratuito e integrado ao SUS.</li>
            </ul>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <button 
            onClick={handleAcceptTerms} 
            className="btn w-100 py-3 fw-bold rounded-3 text-white shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            Li e Aceito os Termos
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};