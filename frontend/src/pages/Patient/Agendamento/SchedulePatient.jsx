import { useState } from "react";
import { Container, Card, Navbar, Modal } from "react-bootstrap";
import { 
  ArrowLeft, Phone, Heart, Settings, 
  Sun, Sunset, Moon, CheckCircle2, Hourglass 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CustomCalendar } from "../../../components/ui/CustomCalendar";

export const SchedulePatient = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTurn, setSelectedTurn] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const primaryTeal = "#2C7A7B";
  const inactiveGray = "#9CA3AF";

  const handleNextStep = () => { if (selectedDate) setStep(2); };
  const handlePrevStep = () => { setStep(1); setSelectedTurn(null); };
  const handleConfirm = () => { if (selectedTurn) setShowModal(true); };
  
  const handleFinish = () => {
    setShowModal(false);
    navigate("/paciente/dashboard", { state: { requestSent: true } });
  };

  // Helper para formatar a data que vem do calendário (Date Object -> String dd/mm/yyyy)
  const formattedDate = selectedDate ? selectedDate.toLocaleDateString('pt-BR') : "";

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <Navbar bg="white" className="px-4 py-3 border-bottom shadow-sm">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <h5 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: primaryTeal }}>
            <Heart size={24} /> DignaMente <span className="text-muted fw-normal fs-6 d-none d-sm-inline">— Agendar Consulta</span>
          </h5>
          <button className="btn btn-light d-flex align-items-center gap-2 border">
            <Settings size={18} /> Configurações
          </button>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 pt-4 pb-5 d-flex flex-column align-items-center" style={{ maxWidth: "800px" }}>
        <div className="w-100 mb-4">
          <button onClick={() => navigate("/paciente/dashboard")} className="btn btn-link text-decoration-none p-0 mb-4 d-flex align-items-center gap-2" style={{ color: primaryTeal, fontWeight: "500" }}>
            <ArrowLeft size={18} /> Voltar ao Painel
          </button>

          <div className="d-flex align-items-center justify-content-between position-relative mb-5" style={{ padding: "0 10px" }}>
            <div className="position-absolute w-100 border-top" style={{ zIndex: 0, top: "50%", left: 0, borderColor: "#E2E8F0" }}></div>
            <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill position-relative" style={{ backgroundColor: step >= 1 ? primaryTeal : "white", color: step >= 1 ? "white" : inactiveGray, border: `1px solid ${step >= 1 ? primaryTeal : "#E2E8F0"}`, zIndex: 1, transition: "0.3s" }}>
              <span className="fw-bold">1</span> <span>Data</span>
            </div>
            <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill position-relative" style={{ backgroundColor: step === 2 ? primaryTeal : "white", color: step === 2 ? "white" : inactiveGray, border: `1px solid ${step === 2 ? primaryTeal : "#E2E8F0"}`, zIndex: 1, transition: "0.3s" }}>
              <span className="fw-bold">2</span> <span>Turno</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="w-100 animation-fade-in d-flex flex-column align-items-center">
            <div className="text-start w-100 mb-4">
              <h4 className="fw-bold mb-2 text-dark">Escolha a data</h4>
              <p className="text-muted m-0">Selecione um dia disponível no calendário abaixo.</p>
            </div>
            
            {/*Deixei o calendario inteligente, codigo abaixo */}
            <div className="mb-4 w-100 d-flex justify-content-center">
              <CustomCalendar selectedDate={selectedDate} onSelectDate={(date) => setSelectedDate(date)} />
            </div>

            <div className="w-100 text-end mt-2">
              <button onClick={handleNextStep} disabled={!selectedDate} className="btn rounded-pill px-4 py-2 fw-bold transition-all" style={{ backgroundColor: selectedDate ? primaryTeal : "#94B2B3", color: "white", border: "none", opacity: selectedDate ? 1 : 0.7 }}>Continuar &rarr;</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-100 animation-fade-in">
            <h4 className="fw-bold mb-2 text-dark">Escolha o turno</h4>
            <p className="text-muted mb-4">Para o dia <strong className="text-dark">{formattedDate}</strong></p>
            <div className="d-flex flex-column flex-md-row gap-3 mb-5">
              {['Manhã', 'Tarde', 'Noite'].map((turno) => (
                <Card key={turno} onClick={() => setSelectedTurn(turno)} className="flex-grow-1 border p-4 text-center rounded-4 transition-all" style={{ cursor: "pointer", backgroundColor: selectedTurn === turno ? primaryTeal : "white", borderColor: selectedTurn === turno ? primaryTeal : "#E2E8F0", color: selectedTurn === turno ? "white" : "#1E293B" }}>
                  {turno === 'Manhã' ? <Sun size={32} className="mx-auto mb-3" /> : turno === 'Tarde' ? <Sunset size={32} className="mx-auto mb-3" /> : <Moon size={32} className="mx-auto mb-3" />}
                  <h5 className="fw-bold mb-1">{turno}</h5>
                  <span style={{ fontSize: "0.85rem", opacity: selectedTurn === turno ? 0.9 : 0.5 }}>A partir de {turno === 'Manhã' ? '09:00' : turno === 'Tarde' ? '15:00' : '19:00'}</span>
                </Card>
              ))}
            </div>
            <div className="d-flex gap-3">
              <button onClick={handlePrevStep} className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-medium bg-white">&larr; Voltar</button>
              <button onClick={handleConfirm} disabled={!selectedTurn} className="btn rounded-pill px-4 py-2 fw-bold transition-all" style={{ backgroundColor: selectedTurn ? primaryTeal : "#94B2B3", color: "white", border: "none", opacity: selectedTurn ? 1 : 0.7 }}>Confirmar Agendamento</button>
            </div>
          </div>
        )}
      </Container>

      <button className="btn btn-danger rounded-circle position-fixed bottom-0 end-0 m-4 shadow-lg d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", zIndex: 100 }}><Phone size={26} /></button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="d-flex align-items-center gap-2 fw-bold text-dark"><CheckCircle2 className="text-warning" size={28} /> Solicitação Enviada</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <p className="text-muted mb-4">Sua consulta foi solicitada e está <strong>pendente de aceite do profissional</strong>. Você receberá uma notificação assim que for confirmada.</p>
          <Card className="border-warning bg-warning bg-opacity-10 rounded-3 mb-4 p-3 shadow-sm border-opacity-50">
            <ul className="list-unstyled m-0 text-dark" style={{ fontSize: "0.95rem", lineHeight: "1.8" }}>
              <li><strong>Data:</strong> {formattedDate}</li>
              <li><strong>Turno:</strong> {selectedTurn} <span className="text-muted"> ({selectedTurn === 'Manhã' ? '09:00' : selectedTurn === 'Tarde' ? '15:00' : '19:00'})</span></li>
              <li><strong>Profissional:</strong> Dra. Maria Silva</li>
              <li className="text-warning fw-bold d-flex align-items-center gap-2 mt-2"><Hourglass size={16} /> Aguardando aceite do profissional</li>
            </ul>
          </Card>
          <button onClick={handleFinish} className="btn w-100 py-3 fw-bold rounded-3 text-white shadow-sm" style={{ backgroundColor: primaryTeal }}>Voltar ao Painel</button>
        </Modal.Body>
      </Modal>
    </div>
  );
};