import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import { api } from "../../services/api";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const RedefinirSenha = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  

  const [searchParams] = useSearchParams();
  const tokenDaUrl = searchParams.get("token"); 
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("As senhas não coincidem!");
    }

    try {
      
      await api.post("/auth/reset-password", { 
        token: tokenDaUrl, 
        newPassword: password 
      });
      
      alert("Senha alterada com sucesso! Faça login.");
      navigate("/login");

    } catch (error) {
      console.error(error);
      alert("Erro ao alterar senha. O link pode ter expirado.");
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center vh-100">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h3 className="text-center fw-bold mb-4">Criar Nova Senha</h3>
          
          <Form onSubmit={handleResetPassword} className="bg-white p-4 rounded shadow-sm">
            <Input 
              label="Nova Senha" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <Input 
              label="Confirmar Nova Senha" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <Button type="submit" className="w-100 mt-3">Salvar Senha</Button>
          </Form>

        </Col>
      </Row>
    </Container>
  );
};