import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const RecuperarSenha = () => {
  const [email, setEmail] = useState("");

  const handleRecover = (e) => {
    e.preventDefault();
  
    alert(`Instruções de recuperação enviadas para: ${email}\n\n`);
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
            />

            <Button type="submit" className="w-100 mt-3">Enviar Link de Recuperação</Button>
            
            <div className="text-center mt-4">
              <a href="/login" className="text-decoration-none fw-bold text-muted">
                Voltar para o Login
              </a>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};