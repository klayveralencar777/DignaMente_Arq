import { useState } from "react";
import { Container, Row, Col, Form, Modal, Spinner } from "react-bootstrap"; // <-- Adicionado Modal e Spinner aqui!
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const Login = () => {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.clear();

    try {
      const response = await api.post("/auth/login", { email, password });
      
      // Capturando os dados do Back-end. 
      // Se o DTO do seu LoginResponse devolver o nome de forma diferente, 
      // você pode ajustar de 'name' para 'nomeUsuario', etc.
      const { id, typeUser, token, name } = response.data;

      localStorage.setItem("@DignaMente:token", token);
      localStorage.setItem("@DignaMente:userId", id);
      
      // Salva o nome real vindo do banco. 
      // Se a variável for nula (back não enviou), ele avisa como "Paciente" temporariamente.
      if (name) {
        localStorage.setItem("@DignaMente:userName", name);
      } else {
         localStorage.setItem("@DignaMente:userName", "Paciente");
      }

      if (typeUser === "ADMIN") {
        navigate("/admin");
        return;
      }
      if (typeUser === "PSYCHOLOGIST") {
        navigate("/psicologo");
        return;
      }
      if (typeUser === "PATIENT") {
       
        navigate("/paciente/dashboard");
        return;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao realizar login. Verifique as suas credenciais.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSendingEmail(true);

    try {
      const payload = { email: forgotEmail };
      await api.post("/auth/forgot-password", payload);

      alert("Se o e-mail existir na nossa base, enviaremos um link de recuperação!");
      setShowForgotModal(false);
      setForgotEmail(""); 
    } catch (error) {
      console.error("Erro ao solicitar recuperação:", error);
      alert("Ocorreu um erro ao tentar enviar o e-mail. Tente novamente.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center vh-100">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold" style={{ color: "var(--cor-primaria)" }}>
              DignaMente
            </h2>
            <p className="text-muted fs-5">Acesse sua conta para continuar</p>
          </div>

          {/* FORMULÁRIO DE LOGIN */}
          <Form onSubmit={handleLogin} className="bg-white p-4 p-md-5 rounded shadow-sm border border-light">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="text-end mb-3">
              <button
                type="button"
                className="btn btn-link text-success p-0 text-decoration-none small"
                onClick={() => setShowForgotModal(true)}
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button type="submit">Entrar</Button>

            <div className="text-center mt-4">
              <span className="text-muted">Não tem uma conta? </span>
              <Link to="/cadastro" className="text-decoration-none fw-bold" style={{ color: "var(--cor-primaria)" }}>
                Criar Nova Conta
              </Link>
            </div>
          </Form>

          {/* MODAL MOVIDO PARA FORA DO FORMULÁRIO PRINCIPAL */}
          <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)} centered>
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title className="fw-bold">Recuperar Senha</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3">
              <p className="text-muted small mb-4">
                Digite o e-mail associado à sua conta. Se ele estiver cadastrado, enviaremos um link para você redefinir sua senha.
              </p>
              <Form onSubmit={handleForgotPassword}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold">E-mail Cadastrado</Form.Label>
                  <Form.Control
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="exemplo@email.com.br"
                    required
                    autoFocus
                  />
                </Form.Group>
                <button
                  type="submit"
                  className="btn w-100 text-white fw-bold py-2 d-flex justify-content-center align-items-center gap-2"
                  style={{ backgroundColor: "#48BB78" }}
                  disabled={isSendingEmail}
                >
                  {isSendingEmail ? (
                    <>
                      <Spinner animation="border" size="sm" /> Enviando...
                    </>
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </button>
              </Form>
            </Modal.Body>
          </Modal>

        </Col>
      </Row>
    </Container>
  );
};  