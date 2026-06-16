import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { api } from "../../services/api";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const RedefinirSenha = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const tokenDaUrl = searchParams.get("token"); 
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!tokenDaUrl) {
      return alert("Link inválido ou sem token de verificação!");
    }

    if (password !== confirmPassword) {
      return alert("As senhas não coincidem!");
    }

    setIsLoading(true);

    try {
      await api.post("/auth/reset-password", { 
        token: tokenDaUrl, 
        newPassword: password 
      });
      
      alert("Senha alterada com sucesso! Faça o login com sua nova senha.");
      navigate("/login");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao alterar senha. O link pode ter expirado ou é inválido.");
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
            <p className="text-muted fs-5">Criar Nova Senha</p>
          </div>
          
          <Form onSubmit={handleResetPassword} className="bg-white p-4 p-md-5 rounded shadow-sm border border-light">
            
            <p className="text-muted mb-4 text-center">
              Digite sua nova senha abaixo. Certifique-se de usar uma senha forte e segura.
            </p>

            <Input 
              label="Nova Senha" 
              type="password" 
              placeholder="Mínimo 6 caracteres"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6}
              disabled={isLoading}
            />
            
            <div className="mt-3">
              <Input 
                label="Confirmar Nova Senha" 
                type="password" 
                placeholder="Repita a nova senha"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-100 mt-4" disabled={isLoading || !tokenDaUrl}>
              {isLoading ? (
                <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Salvando...</>
              ) : (
                "Salvar Nova Senha"
              )}
            </Button>

            {!tokenDaUrl && (
               <div className="text-center mt-3 text-danger small fw-bold">
                 ⚠️ Token não encontrado na URL. O link pode estar quebrado.
               </div>
            )}
            
          </Form>

        </Col>
      </Row>
    </Container>
  );
};