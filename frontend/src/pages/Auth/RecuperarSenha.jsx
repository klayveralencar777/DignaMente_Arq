import { useState } from "react";
import { Container, Row, Col, Form, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { api } from "../../services/api";
import { CheckCircle } from "lucide-react"; 

export const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  
  const navigate = useNavigate();

  const handleRecover = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      
      setEmail(""); 
      setShowModal(true); 
      
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert(error.response?.data?.message || "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center vh-100">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold" style={{ color: "var(--cor-primaria)" }}>DignaMente</h2>
            <p className="text-muted fs-5">Recuperação de Acesso</p>
          </div>
          <Form onSubmit={handleRecover} className="bg-white p-4 p-md-5 rounded shadow-sm border border-light">
            
            <p className="text-muted mb-4 text-center">
              Digite o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
            </p>

            <Input 
              label="E-mail" 
              type="email" 
              placeholder="seu@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={isLoading}
            />

            <Button type="submit" className="w-100 mt-3" disabled={isLoading}>
              {isLoading ? (
                <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Enviando...</>
              ) : (
                "Enviar Link de Recuperação"
              )}
            </Button>
            
            <div className="text-center mt-4">
              <a href="/login" className="text-decoration-none fw-bold text-muted">
                Voltar para o Login
              </a>
            </div>
          </Form>
        </Col>
      </Row>

      {}
      <Modal show={showModal} onHide={() => navigate("/login")} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center p-5">
          <CheckCircle size={64} color="var(--cor-primaria)" className="mb-4" />
          <h4 className="fw-bold mb-3" style={{ color: "var(--cor-primaria)" }}>E-mail Enviado!</h4>
          <p className="text-muted mb-4">
            As instruções de recuperação foram enviadas com sucesso. Por favor, verifique sua caixa de entrada e também a pasta de Spam/Lixo Eletrônico.
          </p>
          <Button onClick={() => navigate("/login")} className="w-100 py-2">
            Voltar para o Login
          </Button>
        </Modal.Body>
      </Modal>

    </Container>
  );
};