import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Navbar, Modal, Toast, ToastContainer } from "react-bootstrap";
import { CalendarDays, Phone, Heart, CalendarPlus, ClipboardList, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SettingsMenu } from "../Settings/SettingsMenu";
import { CancelModal } from "./CancelModal";
import { CrisisModal } from "../../../components/ui/CrisisModal";
import { SettingsButton } from "../../../components/ui/SettingsButton";
import { api } from "../../../services/api";

export const PatientDashboard = () => {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState(() => localStorage.getItem("@DignaMente:userName") || "Paciente");
  
  const [nextAppointment, setNextAppointment] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const [showLGPD, setShowLGPD] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("@DignaMente:termsAccepted");
    if (hasAccepted !== "true") {
      setTimeout(() => {
        setShowLGPD(true);
        setShowSuccessToast(true);
      }, 500);
    }

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("@DignaMente:token");
        const response = await api.get('/appointments/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const appointments = response.data;
        setHistoryCount(appointments.length);
        
        const next = appointments.find(app => app.status !== "CANCELLED" && app.status !== "COMPLETED");
        if (next) {
          setNextAppointment(next);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do paciente", error);
        if (error.response?.status === 401) handleLogout();
      }
    };

    fetchDashboardData();
  }, []);

  const handleAcceptLGPD = () => {
    localStorage.setItem("@DignaMente:termsAccepted", "true");
    setShowLGPD(false);
  };

  const handleShowSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleConfirmCancel = async () => {
    try {
      const token = localStorage.getItem("@DignaMente:token");
      await api.delete(`/appointments/${nextAppointment.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCancelModal(false);
      setNextAppointment(null);
      alert("Consulta cancelada com sucesso.");
    } catch (error) {
      alert("Erro ao cancelar a consulta.");
    }
  };

  const primaryColor = "#2C7A7B";
  const lightBackground = "#F0F4F8";
  const paleTeal = "#E8F3F3";

  return (
    <div className="min-vh-100" style={{ backgroundColor: lightBackground, color: "#333", fontFamily: "Inter, sans-serif" }}>
      
      <ToastContainer position="top-end" className="p-4" style={{ zIndex: 1060, position: 'fixed' }}>
        <Toast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={4000} autohide className="border-0 shadow-sm rounded-3">
          <Toast.Body className="fw-medium text-dark px-4 py-3">Logado com sucesso!</Toast.Body>
        </Toast>
      </ToastContainer>

      <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom shadow-sm fixed-top">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: primaryColor }}>
              <Heart size={26} strokeWidth={2.5} />
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline" style={{ fontSize: "1.1rem" }}> — Painel do Paciente</span>
            </h4>
          </div>
          
          <SettingsButton onClick={handleShowSettings} />
          
        </Container>
      </Navbar>

      <div style={{ height: "80px" }}></div>

      <Container className="pt-4 px-md-5 pb-5" style={{ maxWidth: "900px" }}>
        <div className="mb-4">
          <h1 className="fw-bold m-0" style={{ fontSize: "2.2rem", color: "#2d3748" }}>Olá, {userName}! 👋</h1>
          <p className="fs-5 m-0 mt-1" style={{ color: "#718096" }}>Bem-vindo ao seu espaço de cuidado.</p>
        </div>

        <Card
          className="border-0 rounded-4 p-4 shadow-sm text-white mb-4 position-relative overflow-hidden"
          style={{ backgroundColor: primaryColor, cursor: "pointer", transition: "transform 0.2s" }}
          onClick={() => navigate("/paciente/agendar-consulta")}
        >
          <Card.Body className="p-0 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", backgroundColor: "rgba(255, 255, 255, 0.15)", borderRadius: "16px" }}>
                <CalendarPlus size={30} />
              </div>
              <div>
                <h3 className="m-0 fw-bold" style={{ fontSize: "1.6rem" }}>Agendar Consulta</h3>
                <p className="m-0 text-white fw-medium" style={{ opacity: 0.85, fontSize: "1rem" }}>Escolha dia e horário com profissional disponível</p>
              </div>
            </div>
            <div className="d-none d-md-block" style={{ opacity: 0.15 }}><Clock size={60} /></div>
          </Card.Body>
        </Card>

        <Row className="g-4 mb-5">
          <Col md={6}>
            <Card className="border-0 rounded-4 shadow-sm p-4 h-100">
              <Card.Body className="d-flex flex-column p-0 gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-4" style={{ width: "50px", height: "50px", backgroundColor: paleTeal, color: primaryColor }}>
                    <CalendarDays size={24} />
                  </div>
                  <p className="m-0 fw-medium" style={{ color: "#718096" }}>Próxima Consulta</p>
                </div>
                <div className="mt-2">
                  {nextAppointment ? (
                    <>
                      <h4 className="m-0 fw-bold text-dark">
                        {new Date(nextAppointment.dateTime).toLocaleDateString('pt-BR')} às {new Date(nextAppointment.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </h4>
                      <p className="m-0 text-muted mt-1">{nextAppointment.psychologistName || "Profissional Designado"}</p>
                      
                      <div className="d-flex gap-2 mt-3">
                        <button 
                          className="btn btn-sm text-white fw-bold px-3 rounded-pill shadow-sm" 
                          style={{ backgroundColor: primaryColor }}
                          onClick={() => navigate("/sala-de-espera", { state: { appointment: nextAppointment } })}
                        >
                          Ir para Sala
                        </button>
                        <button className="btn btn-sm btn-outline-danger fw-bold px-3 rounded-pill" onClick={() => setShowCancelModal(true)}>
                          Cancelar
                        </button>
                      </div>
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
                  <div className="d-flex align-items-center justify-content-center rounded-4" style={{ width: "50px", height: "50px", backgroundColor: paleTeal, color: primaryColor }}>
                    <ClipboardList size={24} />
                  </div>
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

      <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: "1000" }}>
        <button className="btn rounded-circle d-flex align-items-center justify-content-center shadow-lg border-0 bg-danger" style={{ width: "64px", height: "64px" }} onClick={() => setShowCrisisModal(true)}>
          <Phone size={28} className="text-white" />
        </button>
      </div>

      <Modal show={showLGPD} backdrop="static" keyboard={false} centered style={{ zIndex: 1050 }}>
        <Modal.Header className="border-0 pb-0 d-flex justify-content-between align-items-start">
          <div>
            <Modal.Title className="fw-bold d-flex align-items-center gap-2" style={{ color: "#2d3748" }}>Bem-vindo ao DignaMente 💚</Modal.Title>
            <p className="text-muted mt-1 mb-0" style={{ fontSize: "0.95rem" }}>Seu espaço seguro de cuidado em saúde mental pelo SUS.</p>
          </div>
        </Modal.Header>
        <Modal.Body className="pt-4 pb-4">
          <div className="p-3 rounded-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", maxHeight: "250px", overflowY: "auto" }}>
            <h6 className="fw-bold mb-3" style={{ color: "#1E293B" }}>Termos de Privacidade e Uso</h6>
            <ul className="list-unstyled mb-0" style={{ color: "#475569", fontSize: "0.9rem", lineHeight: "1.7" }}>
              <li className="mb-2">1. Seus dados pessoais são protegidos conforme a LGPD.</li>
              <li className="mb-2">2. As teleconsultas utilizam a plataforma segura do Google Meet.</li>
              <li className="mb-2">3. Nenhuma gravação será feita sem seu consentimento.</li>
              <li className="mb-0">4. O uso do sistema é gratuito e integrado ao SUS.</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <button onClick={handleAcceptLGPD} className="btn w-100 py-3 fw-bold rounded-3 text-white shadow-sm" style={{ backgroundColor: primaryColor }}>Li e Aceito os Termos</button>
        </Modal.Footer>
      </Modal>

      <CancelModal show={showCancelModal} onHide={() => setShowCancelModal(false)} cancelReason={cancelReason} setCancelReason={setCancelReason} onConfirm={handleConfirmCancel} />
      <SettingsMenu show={showSettings} onHide={handleCloseSettings} onLogout={handleLogout} />
      <CrisisModal show={showCrisisModal} onHide={() => setShowCrisisModal(false)} />
    </div>
  );
};