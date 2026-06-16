import { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";

export const HistoryPatient = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("@DignaMente:token");
        
        
        const response = await api.get('/appointments/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        
        const sortedList = response.data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        
        setHistoryList(sortedList); 
      } catch (error) {
        console.error("Erro ao buscar histórico", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED': 
        return { bg: "#E0F2FE", color: "#0284C7", label: "Agendado" };
      case 'PENDING':
        return { bg: "#FEF3C7", color: "#D97706", label: "Pendente" };
      case 'CONFIRMED':
        return { bg: "#DBEAFE", color: "#1D4ED8", label: "Confirmado" };
      case 'CANCELLED':
        return { bg: "#FEE2E2", color: "#DC2626", label: "Cancelado" };
      case 'COMPLETED':
        return { bg: "#D1FAE5", color: "#059669", label: "Concluído" };
      default:
        return { bg: "#F1F5F9", color: "#475569", label: status || "Indefinido" };
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
              
              
              const dataFormatada = appointment.dateTime 
                ? new Date(appointment.dateTime).toLocaleDateString('pt-BR') 
                : "Data Indefinida";
                
              const horaFormatada = appointment.dateTime 
                ? new Date(appointment.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
                : "--:--";

              return (
                <Card key={appointment.id} className="border rounded-4 shadow-sm" style={{ borderColor: "#E2E8F0" }}>
                  <Card.Body className="d-flex justify-content-between align-items-center p-4">
                    <div>
                      <h5 className="fw-bold m-0" style={{ color: "#1E293B" }}>
                        {appointment.psychologistName || "Profissional Designado"}
                      </h5>
                      <p className="text-muted m-0 mt-1" style={{ fontSize: "0.95rem" }}>
                        {dataFormatada} às {horaFormatada}
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
