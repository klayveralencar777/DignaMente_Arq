import { Container, Card, Navbar } from "react-bootstrap";
import { Heart, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WaitingRoomTriage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <Navbar bg="white" className="px-4 py-3 border-bottom shadow-sm">
        <Container fluid>
          <h5 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: "#2C7A7B" }}>
            <Heart size={24} /> DignaMente <span className="text-muted fw-normal fs-6">— Sala de Espera da Triagem</span>
          </h5>
        </Container>
      </Navbar>

      <Container className="pt-5 pb-5 d-flex justify-content-center">
        <Card className="border-0 shadow-sm rounded-4 p-5 text-center" style={{ maxWidth: "600px", width: "100%" }}>
          <div className="mx-auto bg-success bg-opacity-10 text-success rounded-circle d-flex justify-content-center align-items-center mb-4" style={{ width: "80px", height: "80px" }}>
            <Video size={36} />
          </div>
          
          <h2 className="fw-bold mb-3" style={{ color: "#1E293B" }}>Você está na sala de espera 💚</h2>
          <p className="text-muted mb-4 fs-5">
            O profissional será notificado e iniciará sua avaliação inicial em instantes. Respire fundo, este é um espaço seguro.
          </p>

          <Card className="border-0 rounded-4 text-start p-4 mb-5" style={{ backgroundColor: "#F8FAFC" }}>
            <h6 className="fw-bold text-muted mb-3" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>ENQUANTO AGUARDA</h6>
            <ul className="list-unstyled m-0 text-secondary d-flex flex-column gap-2">
              <li>🌿 Procure um lugar tranquilo e bem iluminado.</li>
              <li>🎧 Use fones de ouvido se possível, para mais privacidade.</li>
              <li>💧 Tenha um copo de água por perto.</li>
              <li>🗣️ Não há respostas certas ou erradas — fale com calma.</li>
            </ul>
          </Card>

          <div className="d-flex gap-3 justify-content-center">
            <button onClick={() => navigate("/paciente/triagem")} className="btn btn-light border px-4 py-3 fw-bold rounded-3 text-secondary">
              Voltar ao Painel
            </button>
            <button onClick={() => navigate("/teleconsulta-triagem")} className="btn px-5 py-3 fw-bold rounded-3 d-flex align-items-center gap-2 shadow-sm text-white" style={{ backgroundColor: "#2C7A7B" }}>
              <Video size={20} /> Entrar na Chamada
            </button>
          </div>
        </Card>
      </Container>
    </div>
  );
};