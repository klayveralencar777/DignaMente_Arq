import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Navbar, Button as BootstrapButton, Modal } from "react-bootstrap";
import { Settings, CalendarDays, Phone, Heart, CalendarPlus, ClipboardList, Clock, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SettingsMenu } from "../Settings/SettingsMenu";
import { CancelModal } from "./CancelModal";
import { CrisisModal } from "../../../components/ui/CrisisModal";

export const PatientDashboard = () => {
  const navigate = useNavigate();
  
  // Estados inteligentes baseados nas flags do fluxo
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("@DignaMente:userName") || "Nome Vindo do Banco";
  });
  
  const [hasCompletedTriage, setHasCompletedTriage] = useState(() => {
    return localStorage.getItem("@DignaMente:hasCompletedTriage") === "true";
  });

  const [showLGPD, setShowLGPD] = useState(() => {
    return localStorage.getItem("@DignaMente:showLGPD") === "true";
  });

  const [nextAppointment, setNextAppointment] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Quando seu back-end estiver integrado completamente:
        // const response = await api.get('/patients/me');
        // setUserName(response.data.name);
        
        // Se já tiver completado a triagem, simula o histórico com consultas antigas
        if (hasCompletedTriage) {
          setHistoryCount(3);
        } else {
          setHistoryCount(0); // Novo usuário começa com 0
        }
        
      } catch (error) {
        console.error("Erro ao buscar dados do paciente", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchDashboardData();
  }, [hasCompletedTriage]);

  const handleCloseLGPD = () => {
    setShowLGPD(false);
    localStorage.removeItem("@DignaMente:showLGPD");
  };

  const handleShowSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const primaryColor = "#2C7A7B";
  const lightBackground = "#F0F4F8";
  const paleTeal = "#E8F3F3";

  return (
    <div className="min-vh-100" style={{ backgroundColor: lightBackground, color: "#333", fontFamily: "Inter, sans-serif" }}>
      <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom shadow-sm fixed-top">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: primaryColor }}>
              <Heart size={26} strokeWidth={2.5} />
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline" style={{ fontSize: "1.1rem" }}> — Painel do Paciente</span>
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

        {/* Card Principal Dinâmico (Triagem vs Consulta) */}
        <Card
          className="border-0 rounded-4 p-4 shadow-sm text-white mb-4 position-relative overflow-hidden"
          style={{ backgroundColor: primaryColor, cursor: "pointer", transition: "transform 0.2s" }}
          onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          onClick={() => navigate(hasCompletedTriage ? "/paciente/agendar-consulta" : "/paciente/triagem")}
        >
          <Card.Body className="p-0 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", backgroundColor: "rgba(255, 255, 255, 0.15)", borderRadius: "16px" }}>
                <CalendarPlus size={30} />
              </div>
              <div>
                <h3 className="m-0 fw-bold" style={{ fontSize: "1.6rem" }}>
                  {hasCompletedTriage ? "Agendar Consulta" : "Agendar Triagem"}
                </h3>
                <p className="m-0 text-white fw-medium" style={{ opacity: 0.85, fontSize: "1rem" }}>
                  {hasCompletedTriage ? "Escolha dia e horário com profissional disponível" : "Faça sua avaliação inicial para liberar consultas"}
                </p>
              </div>
            </div>
            <div className="d-none d-md-block" style={{ opacity: 0.15 }}><Clock size={60} /></div>
          </Card.Body>
        </Card>

        {/* Caixa de Informativo da Triagem Pendente */}
        {!hasCompletedTriage && (
          <div className="d-flex align-items-center gap-3 p-3 mb-4 rounded-4 border shadow-sm bg-white" style={{ borderColor: "#E2E8F0" }}>
            <div style={{ color: primaryColor }}><Info size={24} /></div>
            <div>
              <strong className="d-block text-dark" style={{ fontSize: "1rem" }}>Aguardando avaliação inicial</strong>
              <span className="text-muted" style={{ fontSize: "0.9rem" }}>Após sua triagem, o botão acima muda para "Agendar Consulta" e libera consultas regulares.</span>
            </div>
          </div>
        )}

        <Row className="g-4 mb-5">
          <Col md={6}>
            <Card className="border-0 rounded-4 shadow-sm p-4 h-100">
              <Card.Body className="d-flex flex-column p-0 gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-4" style={{ width: "50px", height: "50px", backgroundColor: paleTeal, color: primaryColor }}><CalendarDays size={24} /></div>
                  <p className="m-0 fw-medium" style={{ color: "#718096" }}>Próxima Consulta</p>
                </div>
                <div className="mt-2">
                  {nextAppointment ? (
                    <>
                      <h4 className="m-0 fw-bold text-dark">{nextAppointment.date} — {nextAppointment.time}</h4>
                      <p className="m-0 text-muted mt-1">{nextAppointment.doctor}</p>
                      <button className="btn btn-sm btn-outline-danger mt-3 fw-bold px-3 rounded-pill" onClick={() => setShowCancelModal(true)}>Cancelar Consulta</button>
                    </>
                  ) : (
                    <p className="text-muted m-0 mt-2">Nenhuma consulta agendada.</p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 rounded-4 shadow-sm p-4 h-100" style={{ cursor: "pointer" }} onClick={() => navigate("/paciente/historico")}>
              <Card.Body className="d-flex flex-column p-0 gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-4" style={{ width: "50px", height: "50px", backgroundColor: paleTeal, color: primaryColor }}><ClipboardList size={24} /></div>
                  <p className="m-0 fw-medium" style={{ color: "#718096" }}>Meu Histórico</p>
                </div>
                <div className="mt-2">
                  <h4 className="m-0 fw-bold mb-1" style={{ color: "#2d3748" }}>{historyCount} consultas</h4>
                  <p className="m-0" style={{ color: "#718096", fontSize: "0.9rem" }}>Clique para ver detalhes</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Botão Flutuante de Emergência */}
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

      {/* MODAL DE TERMOS LGPD NATIVO */}
      <Modal show={showLGPD} onHide={handleCloseLGPD} centered backdrop="static" size="md">
        <Modal.Header closeButton className="border-0 pt-4 px-4">
          <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
            <span>Bem-vindo ao DignaMente 💚</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>Seu espaço seguro de cuidado em saúde mental pelo SUS.</p>
          
          <div className="p-3 bg-light rounded-3 border overflow-auto" style={{ maxHeight: "220px", fontSize: "0.9rem", color: "#4a5568" }}>
            <h6 className="fw-bold text-dark mb-2">Termos de Privacidade e Uso</h6>
            <ol className="ps-3 d-flex flex-column gap-2 m-0">
              <li>Seus dados pessoais são protegidos conforme a LGPD (Lei 13.709/2018).</li>
              <li>As teleconsultas são criptografadas ponta-a-ponta.</li>
              <li>Nenhuma gravação será feita sem seu consentimento expresso.</li>
              <li>Você pode solicitar a exclusão dos seus dados a qualquer momento.</li>
              <li>Informações clínicas são acessíveis apenas ao seu profissional designado.</li>
            </ol>
          </div>
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            <BootstrapButton variant="light" className="fw-bold rounded-pill px-3" onClick={handleCloseLGPD}>
              Pular Introdução
            </BootstrapButton>
            <BootstrapButton style={{ backgroundColor: primaryColor, borderColor: primaryColor }} className="fw-bold rounded-pill px-4" onClick={handleCloseLGPD}>
              Li e Aceito os Termos
            </BootstrapButton>
          </div>
        </Modal.Body>
      </Modal>

      <CancelModal show={showCancelModal} onHide={() => setShowCancelModal(false)} cancelReason={cancelReason} setCancelReason={setCancelReason} onConfirm={() => setShowCancelModal(false)} />
      <SettingsMenu show={showSettings} onHide={handleCloseSettings} onLogout={handleLogout} />
      <CrisisModal show={showCrisisModal} onHide={() => setShowCrisisModal(false)} />
    </div>
  );
};