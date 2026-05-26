import { Container, Card } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HistoryPatient = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <Container className="pt-5 pb-5" style={{ maxWidth: "800px" }}>
        
        {/* BOTÃO DE VOLTAR */}
        <button 
          onClick={() => navigate("/paciente/dashboard")} 
          className="btn btn-link text-decoration-none p-0 mb-4 d-flex align-items-center gap-2" 
          style={{ color: "#2C7A7B", fontWeight: "500" }}
        >
          <ArrowLeft size={18} /> Voltar ao Painel
        </button>

        <h3 className="fw-bold mb-4" style={{ color: "#1E293B" }}>Histórico de Consultas</h3>

        <div className="d-flex flex-column gap-3">
          
          {/* CARD 1 - PENDENTE DE ACEITE */}
          <Card className="border rounded-4 shadow-sm" style={{ borderColor: "#E2E8F0" }}>
            <Card.Body className="d-flex justify-content-between align-items-center p-4">
              <div>
                <h5 className="fw-bold m-0" style={{ color: "#1E293B" }}>Dra. Maria Silva</h5>
                <p className="text-muted m-0 mt-1" style={{ fontSize: "0.95rem" }}>
                  30/05/2026 às 19:00
                </p>
              </div>
              <div>
                <span 
                  className="badge rounded-pill px-3 py-2" 
                  style={{ backgroundColor: "#FEF3C7", color: "#D97706", fontWeight: "600", fontSize: "0.85rem" }}
                >
                  Pendente de Aceite
                </span>
              </div>
            </Card.Body>
          </Card>

          {/* CARD 2 - CANCELADO */}
          <Card className="border rounded-4 shadow-sm" style={{ borderColor: "#E2E8F0" }}>
            <Card.Body className="d-flex justify-content-between align-items-center p-4">
              <div>
                <h5 className="fw-bold m-0" style={{ color: "#1E293B" }}>Dra. Maria Silva</h5>
                <p className="text-muted m-0 mt-1" style={{ fontSize: "0.95rem" }}>
                  28/05/2026 às 09:00
                </p>
              </div>
              <div>
                <span 
                  className="badge rounded-pill px-3 py-2" 
                  style={{ backgroundColor: "#FEE2E2", color: "#DC2626", fontWeight: "600", fontSize: "0.85rem" }}
                >
                  Cancelado
                </span>
              </div>
            </Card.Body>
          </Card>

        </div>
      </Container>
    </div>
  );
};