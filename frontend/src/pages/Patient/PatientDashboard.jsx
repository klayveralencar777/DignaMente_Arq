import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Button as BootstrapButton,
} from "react-bootstrap";
import {
  Settings,
  CalendarDays,
  XCircle,
  Video,
  History,
  MessageSquareDot,
  Phone,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { CancelModal } from "./CancelModal";
import { SettingsMenu } from "./SettingsMenu";

export const PatientDashboard = () => {
  const navigate = useNavigate();

  // Puxa o nome salvo no bolso do navegador. Se não achar, chama de "Paciente"
  const [userName] = useState(
    () => localStorage.getItem("@DignaMente:userName") || "Paciente",
  );

  // Estados do Modal de Cancelamento
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Estados do Menu de Configurações
  const [showSettings, setShowSettings] = useState(false);
  const handleShowSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);

  // Funções do Modal de Cancelar
  const handleShowCancelModal = () => setShowCancelModal(true);
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason("");
  };
  const handleConfirmCancel = () => {
    if (!cancelReason) {
      alert("Por favor, selecione um motivo para cancelar.");
      return;
    }
    console.log("Consulta cancelada pelo motivo:", cancelReason);
    alert("Consulta cancelada com sucesso!");
    handleCloseCancelModal();
  };

  const handleLogout = () => {
    localStorage.removeItem("@DignaMente:token");
    localStorage.removeItem("@DignaMente:role");
    localStorage.removeItem("@DignaMente:userName"); // Limpa o nome ao sair também
    window.location.href = "/login";
  };

  const primaryGreen = "#50C878";
  const lightBackground = "#f8f9fa";

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: lightBackground,
        color: "#333",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Navbar
        bg="white"
        expand="lg"
        className="px-4 py-2 border-bottom shadow-sm"
      >
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2">
              <span style={{ color: primaryGreen, fontSize: "1.4rem" }}>
                <Heart
                  size={24}
                  style={{
                    border: "2px solid",
                    borderRadius: "5px",
                    padding: "3px",
                  }}
                />
              </span>
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline">
                {" "}
                — Painel do Paciente
              </span>
            </h4>
          </div>
          <BootstrapButton
            variant="outline-secondary"
            onClick={handleShowSettings}
            className="d-flex align-items-center gap-2 text-capitalize px-3 py-1 fw-medium"
            style={{ fontSize: "0.9rem" }}
          >
            <Settings size={18} /> Configurações
          </BootstrapButton>
        </Container>
      </Navbar>

      <Container className="pt-5 px-md-5">
        <div className="mb-5 ms-md-4">
          <h1 className="fw-bold m-0" style={{ fontSize: "2.5rem" }}>
            Olá, {userName}! 👋
          </h1>
          <p className="text-muted fs-5 m-0 mt-1">
            Bem-vindo ao seu espaço de cuidado.
          </p>
        </div>

        <Card
          className="border-0 rounded-4 p-4 shadow-sm text-white mb-4 position-relative overflow-hidden"
          style={{
            backgroundColor: primaryGreen,
            minHeight: "120px",
            cursor: "pointer",
          }}
        >
          <Card.Body className="p-0 d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "15px",
              }}
            >
              <CalendarDays size={32} />
            </div>
            <div className="flex-grow-1">
              <h3 className="m-0 fw-bold" style={{ fontSize: "1.6rem" }}>
                Agendar Consulta
              </h3>
              <p className="m-0 text-white-50 fw-medium">
                Escolha data e turno em poucos toques
              </p>
            </div>
            <div
              className="position-absolute end-0 top-0 d-none d-md-flex align-items-center justify-content-center p-3 text-white-50"
              style={{ height: "100%", opacity: "0.2" }}
            >
              <CalendarDays size={80} strokeWidth={1} />
            </div>
          </Card.Body>
        </Card>

        <Row className="g-4 mb-5 ms-md-1 me-md-1">
          <Col md={6}>
            <Card className="border-0 rounded-4 shadow-sm p-3 h-100">
              <Card.Body className="d-flex flex-column p-0 gap-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="bg-success-subtle p-2 rounded-circle">
                    <CalendarDays size={20} className="text-success" />
                  </div>
                  <h6
                    className="m-0 fw-bold text-uppercase text-muted"
                    style={{ fontSize: "0.8rem", letterSpacing: "1px" }}
                  >
                    Próxima Consulta
                  </h6>
                </div>
                <div>
                  <h2 className="m-0 fw-bold">22/04/2026 — 14:00</h2>
                  <p className="m-0 text-muted fs-6 mt-1">
                    Dra. Maria Silva — Psicologia
                  </p>
                </div>
                <BootstrapButton
                  variant="danger"
                  onClick={handleShowCancelModal}
                  className="w-100 d-flex align-items-center justify-content-center gap-2 mt-auto text-capitalize fw-bold py-2 border-0"
                  style={{ fontSize: "0.9rem" }}
                >
                  <XCircle size={18} /> Cancelar Consulta
                </BootstrapButton>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card
              className="border-0 rounded-4 shadow-sm p-3 h-100"
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              onClick={() => navigate("/sala-de-espera")}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <Card.Body className="d-flex flex-column p-0 gap-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="bg-primary-subtle p-2 rounded-circle">
                    <Video size={20} className="text-primary" />
                  </div>
                  <h6
                    className="m-0 fw-bold text-uppercase text-muted"
                    style={{ fontSize: "0.8rem", letterSpacing: "1px" }}
                  >
                    Iniciar Teleconsulta
                  </h6>
                </div>
                <div>
                  <h2 className="m-0 fw-bold">Sala disponível</h2>
                  <p className="m-0 text-muted fs-6 mt-1">
                    Clique para entrar na sala virtual
                  </p>
                </div>
                <div className="mt-auto py-2"></div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 rounded-4 shadow-sm p-3 h-100">
              <Card.Body className="d-flex flex-column p-0 gap-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="bg-info-subtle p-2 rounded-circle">
                    <History size={20} className="text-info" />
                  </div>
                  <h6
                    className="m-0 fw-bold text-uppercase text-muted"
                    style={{ fontSize: "0.8rem", letterSpacing: "1px" }}
                  >
                    Meu Histórico
                  </h6>
                </div>
                <div>
                  <h2 className="m-0 fw-bold">3 consultas</h2>
                  <p className="m-0 text-muted fs-6 mt-1">
                    Clique para ver detalhes
                  </p>
                </div>
                <div className="mt-auto py-2"></div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 rounded-4 shadow-sm p-3 h-100 position-relative">
              <div className="position-absolute top-0 end-0 p-3">
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: primaryGreen,
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
              <Card.Body className="d-flex flex-column p-0 gap-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="bg-success-subtle p-2 rounded-circle">
                    <MessageSquareDot size={20} className="text-success" />
                  </div>
                  <h6
                    className="m-0 fw-bold text-uppercase text-muted"
                    style={{ fontSize: "0.8rem", letterSpacing: "1px" }}
                  >
                    Notificação WhatsApp
                  </h6>
                </div>
                <div>
                  <h2 className="m-0 fw-bold">Consulta em 15 min!</h2>
                  <p className="m-0 text-muted fs-6 mt-1">
                    Dra. Maria Silva enviou o link de acesso
                  </p>
                </div>
                <Button
                  className="w-100 d-flex align-items-center justify-content-center gap-2 mt-auto text-capitalize fw-bold py-2 border-0"
                  style={{ fontSize: "0.9rem" }}
                  onClick={() => navigate("/sala-de-espera")}
                >
                  <MessageSquareDot size={18} /> Entrar Direto
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <div
        className="position-fixed bottom-0 end-0 p-4"
        style={{ zIndex: "1000" }}
      >
        <BootstrapButton
          variant="danger"
          className="rounded-circle d-flex align-items-center justify-content-center shadow border-0"
          style={{ width: "56px", height: "56px", backgroundColor: "#e74c3c" }}
        >
          <Phone size={24} className="text-white" />
        </BootstrapButton>
      </div>

      <CancelModal
        show={showCancelModal}
        onHide={handleCloseCancelModal}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        onConfirm={handleConfirmCancel}
      />

      <SettingsMenu
        show={showSettings}
        onHide={handleCloseSettings}
        onLogout={handleLogout}
      />
    </div>
  );
};
