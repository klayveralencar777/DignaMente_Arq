import { useState } from "react";
import { Container, Row, Col, Form, Spinner, Alert } from "react-bootstrap";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!token) {
      setErrorMsg(
        "Link de recuperação inválido ou expirado. Tente solicitar um novo e-mail.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("As senhas não coincidem. Digite novamente.");
      return;
    }

    setIsSubmitting(true);

    try {
      
      const payload = {
        token: token,
        newPassword: newPassword,
      };

      await api.post("/auth/reset-password", payload);

      setSuccess(true);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      setErrorMsg(
        error.response?.data?.message ||
          "Ocorreu um erro ao redefinir sua senha. O token pode ter expirado.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center vh-100">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <div className="text-center mb-4">
            <h2
              className="display-5 fw-bold"
              style={{ color: "var(--cor-primaria)" }}
            >
              DignaMente
            </h2>
            <p className="text-muted fs-5">Crie sua nova senha de acesso</p>
          </div>

          <div className="bg-white p-4 p-md-5 rounded shadow-sm border border-light">
            {success ? (
              <div className="text-center">
                <Alert variant="success" className="mb-4">
                  <h5 className="fw-bold m-0">Senha alterada com sucesso!</h5>
                  <p className="small m-0 mt-2">
                    Você já pode acessar sua conta com a nova senha.
                  </p>
                </Alert>
                <Button onClick={() => navigate("/login")} className="w-100">
                  Voltar para o Login
                </Button>
              </div>
            ) : (
              <Form onSubmit={handleResetPassword}>
                {errorMsg && (
                  <Alert variant="danger" className="small py-2">
                    {errorMsg}
                  </Alert>
                )}

                <p className="text-muted small mb-4 text-center">
                  Sua nova senha deve ter no mínimo 6 caracteres.
                </p>

                <Input
                  label="Nova Senha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />

                <Input
                  label="Confirmar Nova Senha"
                  type="password"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />

                <Button type="submit" disabled={isSubmitting || !token}>
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />{" "}
                      Salvando...
                    </>
                  ) : (
                    "Redefinir Senha"
                  )}
                </Button>

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-muted text-decoration-none small"
                  >
                    Cancelar e voltar ao login
                  </Link>
                </div>
              </Form>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
