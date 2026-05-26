import { Container, Navbar } from "react-bootstrap";
import { Heart, Video, Mic, PhoneOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TeleconsultaTriage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const navigate = useNavigate();

  const handleHangUp = () => {
    // Ao desligar, mandamos para o Dashboard Principal passando o estado de sucesso
    navigate("/paciente/dashboard", { state: { triageCompleted: true } });
  };

  return (
    <div className="vh-100 d-flex flex-column" style={{ backgroundColor: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <Navbar bg="white" className="px-4 py-3 border-bottom shadow-sm">
        <Container fluid>
          <h5 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: "#2C7A7B" }}>
            <Heart size={24} /> DignaMente <span className="text-muted fw-normal fs-6">— Triagem em Andamento</span>
          </h5>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="w-100 bg-white border rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden" style={{ maxWidth: "800px", height: "60vh" }}>
          <div className="position-absolute top-0 start-0 m-3">
            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#2C7A7B" }}>AVALIAÇÃO INICIAL</span>
          </div>
          <div className="text-center" style={{ color: "#2C7A7B" }}>
            <Video size={64} className="mb-3 opacity-75" />
            <h4 className="fw-bold m-0">Triagem em andamento</h4>
            <p className="text-muted m-0">Psicólogo de plantão</p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-4 mt-5">
          <button className="btn btn-outline-secondary rounded-circle d-flex justify-content-center align-items-center p-3 bg-white shadow-sm"><Mic size={24} /></button>
          <button className="btn btn-outline-secondary rounded-circle d-flex justify-content-center align-items-center p-3 bg-white shadow-sm"><Video size={24} /></button>
          <button onClick={handleHangUp} className="btn btn-danger rounded-circle d-flex justify-content-center align-items-center p-3 shadow" style={{ width: "64px", height: "64px" }}><PhoneOff size={28} /></button>
        </div>
        <p className="text-muted mt-3" style={{ fontSize: "0.85rem" }}>Ao encerrar a chamada, sua triagem será concluída.</p>
      </Container>
    </div>
  );
};