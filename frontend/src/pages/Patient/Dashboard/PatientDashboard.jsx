import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Navbar, Button as BootstrapButton } from "react-bootstrap";
import { Settings, CalendarDays, Phone, Heart, CalendarPlus, ClipboardList, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SettingsMenu } from "../Settings/SettingsMenu";
import { CancelModal } from "./CancelModal";
import { CrisisModal } from "../../../components/ui/CrisisModal";

// IMPORTANTE: Aqui você importará o seu configurador do Axios (ex: api.js)
// import api from "../../../services/api";

export const PatientDashboard = () => {
  const navigate = useNavigate();
  
  // 1. Estados vazios aguardando os dados reais do back-end
  const [userName, setUserName] = useState("Carregando...");
  const [nextAppointment, setNextAppointment] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  // 2. useEffect para buscar os dados assim que a tela carregar
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Exemplo de como será a chamada real pro seu Spring Boot:
        // const response = await api.get('/patients/me');
        // setUserName(response.data.name);
        
        // Simulação temporária até você me passar a rota exata:
        setUserName("Nome Vindo do Banco");
        setHistoryCount(3); // Isso virá do tamanho da lista de histórico do back-end
        
      } catch (error) {
        console.error("Erro ao buscar dados do paciente", error);
        // Se o token estiver expirado (Erro 401), chuta para o login
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchDashboardData();
  }, []);

  const handleShowSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);
  
  const handleLogout = () => {
    // 3. Jeito correto de deslogar (remove só a segurança, mantém preferências)
    localStorage.removeItem("@DignaMente:token");
    localStorage.removeItem("@DignaMente:role");
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

        <Card
          className="border-0 rounded-4 p-4 shadow-sm text-white mb-4 position-relative overflow-hidden"
          style={{ backgroundColor: primaryColor, cursor: "pointer", transition: "transform 0.2s" }}
          onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
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

      <CancelModal show={showCancelModal} onHide={() => setShowCancelModal(false)} cancelReason={cancelReason} setCancelReason={setCancelReason} onConfirm={() => setShowCancelModal(false)} />
      <SettingsMenu show={showSettings} onHide={handleCloseSettings} onLogout={handleLogout} />
      <CrisisModal show={showCrisisModal} onHide={() => setShowCrisisModal(false)} />
    </div>
  );
};