import { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// import api from "../../../services/api";

export const HistoryPatient = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Exemplo da chamada real:
        // const response = await api.get('/patients/me/appointments');
        // setHistoryList(response.data);

        // Simulando a lista vazia que virá do banco de dados inicialmente
        // ou você pode colocar os dados antigos aqui dentro como um array temporário para testar o map
        setHistoryList([]); 
      } catch (error) {
        console.error("Erro ao buscar histórico", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Função auxiliar para definir as cores das badges baseado no status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: "#FEF3C7", color: "#D97706", label: "Pendente de Aceite" };
      case 'CANCELLED':
        return { bg: "#FEE2E2", color: "#DC2626", label: "Cancelado" };
      case 'COMPLETED':
        return { bg: "#D1FAE5", color: "#059669", label: "Concluído" };
      default:
        return { bg: "#F1F5F9", color: "#475569", label: status };
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <Container className="pt-5 pb-5" style={{ maxWidth: "800px" }}>
        
        <button 
          onClick={() => navigate("/paciente/dashboard")} 
          className="btn btn-link text-decoration-none p-0 mb-4 d-flex align-items-center gap-2" 
          style={{ color: "#2C7A7B", fontWeight: "500" }}
        >
          <ArrowLeft size={18} /> Voltar ao Painel
        </button>

        <h3 className="fw-bold mb-4" style={{ color: "#1E293B" }}>Histórico de Consultas</h3>

        <div className="d-flex flex-column gap-3">
          {isLoading ? (
            <p className="text-muted">Carregando histórico...</p>
          ) : historyList.length === 0 ? (
            <p className="text-muted">Você ainda não possui consultas no seu histórico.</p>
          ) : (
            historyList.map((appointment) => {
              const badgeStyle = getStatusBadge(appointment.status);
              return (
                <Card key={appointment.id} className="border rounded-4 shadow-sm" style={{ borderColor: "#E2E8F0" }}>
                  <Card.Body className="d-flex justify-content-between align-items-center p-4">
                    <div>
                      <h5 className="fw-bold m-0" style={{ color: "#1E293B" }}>{appointment.doctorName}</h5>
                      <p className="text-muted m-0 mt-1" style={{ fontSize: "0.95rem" }}>
                        {appointment.date} às {appointment.time}
                      </p>
                    </div>
                    <div>
                      <span 
                        className="badge rounded-pill px-3 py-2" 
                        style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.color, fontWeight: "600", fontSize: "0.85rem" }}
                      >
                        {badgeStyle.label}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </div>
      </Container>
    </div>
  );
};