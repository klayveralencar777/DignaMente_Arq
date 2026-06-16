import { useState, useEffect } from "react";
import { Container, Card, Spinner, Navbar, Alert } from "react-bootstrap";
import { Video, Heart, Phone, ArrowLeft, Clock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { SettingsMenu } from "../Settings/SettingsMenu";
import { CrisisModal } from "../../../components/ui/CrisisModal";
import { SettingsButton } from "../../../components/ui/SettingsButton";
import { api } from "../../../services/api";

export const WaitingRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;
  const [showSettings, setShowSettings] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [meetLink, setMeetLink] = useState(null);
  const handleShowSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);
  const handleLogout = () => {

    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    
    if (!appointment) {
      navigate("/paciente/dashboard");
      return;
    }
    
    const checkLink = async () => {
      try {
        const token = localStorage.getItem("@DignaMente:token");
        const response = await api.get(`/appointments/${appointment.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.meetingLink) {
          setMeetLink(response.data.meetingLink);
        }
      } catch (error) {
        console.error("Erro ao verificar link do Jitsi:", error);
      }
    };

    checkLink(); 
    const interval = setInterval(checkLink, 5000); 

    return () => clearInterval(interval); 
  }, [appointment, navigate]);

  const primaryColor = "#2C7A7B";
  const lightBackground = "#F0F4F8";

  return (
    <div className="min-vh-100 position-relative" style={{ backgroundColor: lightBackground, fontFamily: "Inter, sans-serif" }}>
      
      
      <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom shadow-sm fixed-top">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: primaryColor }}>
              <Heart size={26} strokeWidth={2.5} />
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline" style={{ fontSize: "1.1rem" }}> — Sala de Espera</span>
            </h4>
          </div>
          
          
          <SettingsButton onClick={handleShowSettings} />
        </Container>
      </Navbar>

      <div style={{ height: "100px" }}></div>

      
      <Container className="d-flex flex-column align-items-center pb-5" style={{ maxWidth: "600px" }}>
        
        <div className="w-100 mb-4 text-start">
          <button onClick={() => navigate("/paciente/dashboard")} className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 transition-all hover-opacity" style={{ color: primaryColor, fontWeight: "500" }}>
            <ArrowLeft size={18} /> Voltar ao Painel
          </button>
        </div>

        <Card className="border-0 rounded-4 shadow-sm w-100 text-center p-4 p-md-5 bg-white">
          <Card.Body className="d-flex flex-column align-items-center p-0">
            <div className="rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: "80px", height: "80px", backgroundColor: "#E6FFFA", color: primaryColor }}>
              <Video size={40} />
            </div>
            
            <h3 className="fw-bold text-dark mb-2">Sala de Espera Virtual</h3>
            <p className="text-muted mb-4">
              Sua consulta com <strong>{appointment?.psychologistName || "o profissional"}</strong> está quase começando.
            </p>

            <div className="w-100 p-3 rounded-3 mb-5" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <div className="d-flex align-items-center justify-content-center gap-2 text-secondary fw-medium">
                <Clock size={18} />
                <span>
                  {appointment?.dateTime ? new Date(appointment.dateTime).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : "Data não informada"}
                </span>
              </div>
            </div>

            
            {meetLink ? (
              <div className="w-100 animation-fade-in">
                <Alert variant="success" className="border-0 shadow-sm rounded-3 fw-bold text-success mb-3" style={{ backgroundColor: "#D1FAE5" }}>
                  O profissional abriu a sala!
                </Alert>
                <button 
                  className="btn w-100 py-3 fw-bold rounded-3 text-white shadow-sm d-flex justify-content-center align-items-center gap-2 transition-all" 
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => window.open(meetLink, "_blank")}
                  onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.9)'}
                  onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  <Video size={20} /> Entrar na Sessão
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center mt-2 p-4 w-100 rounded-4" style={{ backgroundColor: "#F8FAFC", border: "1px dashed #CBD5E1" }}>
                <Spinner animation="border" style={{ color: primaryColor, width: '2.5rem', height: '2.5rem' }} className="mb-3" />
                <p className="text-dark fw-bold m-0 mb-1">Aguardando o psicólogo...</p>
                <small className="text-muted text-center" style={{ lineHeight: "1.5" }}>Assim que ele gerar o link da videoconferência,<br/>o botão aparecerá aqui automaticamente.</small>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
      
      
      <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: "1000" }}>
        <button className="btn rounded-circle d-flex align-items-center justify-content-center shadow-lg border-0 bg-danger transition-all" style={{ width: "64px", height: "64px" }} onClick={() => setShowCrisisModal(true)} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <Phone size={28} className="text-white" />
        </button>
      </div>

      
      <SettingsMenu show={showSettings} onHide={handleCloseSettings} onLogout={handleLogout} />
      <CrisisModal show={showCrisisModal} onHide={() => setShowCrisisModal(false)} />
      
    </div>
  );
};