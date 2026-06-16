import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";

export const SchedulePatient = () => {
  const navigate = useNavigate();
  const [psychologists, setPsychologists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    psychologistId: "",
    date: "",
    time: "",
    details: ""
  });

  const primaryTeal = "#2C7A7B";

  useEffect(() => {
    const loadPsychologists = async () => {
      try {
        const response = await api.get("/psychologists");
        setPsychologists(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar psicólogos:", error);
        setErrorMsg("Não foi possível carregar a lista de profissionais.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPsychologists();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const ano = new Date(formData.date).getFullYear();
    if (ano < 2026 || ano > 2030) {
       setErrorMsg("Por favor, selecione uma data válida entre 2026 e 2030.");
       return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("@DignaMente:token");
      

      const dataHoraFormatada = `${formData.date}T${formData.time}:00`;

      const payload = {
        psychologistId: formData.psychologistId,
        dateTime: dataHoraFormatada
      };

      await api.post("/appointments", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMsg("Consulta agendada com sucesso!");
      setTimeout(() => navigate("/paciente/dashboard"), 2000);
    } catch  {
      setErrorMsg("Erro ao agendar: Verifique se a data selecionada é válida.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#F0F4F8" }}>
        <Spinner animation="border" style={{ color: primaryTeal }} />
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#F0F4F8", fontFamily: "Inter, sans-serif" }}>
      <Container style={{ maxWidth: "600px" }}>
        <Button 
          variant="link" 
          onClick={() => navigate("/paciente/dashboard")}
          className="text-decoration-none d-flex align-items-center gap-2 p-0 mb-4"
          style={{ color: primaryTeal, fontWeight: "600" }}
        >
          <ArrowLeft size={18} /> Voltar para o Painel
        </Button>

        <Card className="border-0 rounded-4 shadow-sm p-4 bg-white">
          <Card.Body>
            <div className="text-center mb-4">
              <Heart size={36} className="mb-2" style={{ color: primaryTeal }} />
              <h2 className="fw-bold text-dark m-0">Agendar Consulta</h2>
              <p className="text-muted small mt-1">Selecione um dos profissionais cadastrados no nosso sistema</p>
            </div>

            {errorMsg && <Alert variant="danger" className="rounded-3 small text-center">{errorMsg}</Alert>}
            {successMsg && <Alert variant="success" className="rounded-3 small text-center">{successMsg}</Alert>}

            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="fw-bold small text-secondary mb-2">Selecione o Profissional *</Form.Label>
                <Form.Select 
                  name="psychologistId" 
                  value={formData.psychologistId} 
                  onChange={handleChange} 
                  required
                  className="shadow-none p-2.5 rounded-3 fw-medium text-secondary"
                >
                  <option value="">Escolha um psicólogo...</option>
                  {psychologists.map((psy) => (
                    <option key={psy.id} value={psy.id}>
                      {psy.name} {psy.specialty ? `(${psy.specialty})` : ""}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row className="g-3">
                <Col sm={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small text-secondary mb-2">Data *</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleChange} 
                      required
                      className="shadow-none p-2.5 rounded-3"
                    />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small text-secondary mb-2">Horário *</Form.Label>
                    <Form.Control 
                      type="time" 
                      name="time" 
                      value={formData.time} 
                      onChange={handleChange} 
                      required
                      className="shadow-none p-2.5 rounded-3"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group>
                <Form.Label className="fw-bold small text-secondary mb-2">Motivo da Busca / Detalhes</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  name="details" 
                  placeholder="Conte resumidamente o que te traz aqui para ajudar o profissional..."
                  value={formData.details} 
                  onChange={handleChange}
                  className="shadow-none rounded-3"
                  style={{ backgroundColor: "#f8fafc" }}
                />
              </Form.Group>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-100 py-2.5 mt-3 fw-bold border-0 rounded-3 text-white shadow-sm"
                style={{ backgroundColor: primaryTeal }}
              >
                {isSubmitting ? <Spinner size="sm" animation="border" /> : "Solicitar Agendamento"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};