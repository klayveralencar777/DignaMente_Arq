import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      
      const token = response.data;
    
      localStorage.setItem("@DignaMente:token", token);

      try {
        const pacientesResponse = await api.get("/patients");

        const pacienteLogado = pacientesResponse.data.find(
          (p) => p.email === email,
        );

        if (pacienteLogado) {
          const nomeCompleto =
            pacienteLogado.name || pacienteLogado.nome || "Paciente";

          const primeiroNome = nomeCompleto.split(" ")[0];

          localStorage.setItem("@DignaMente:userName", primeiroNome);
          
          
          localStorage.setItem("@DignaMente:patientId", pacienteLogado.id);
        }
      } catch (err) {
        console.error("Erro ao buscar o nome do paciente:", err);
      }
    
      alert("Login realizado com sucesso!");

      window.location.href = "/paciente";
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("E-mail ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center vh-100">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <div className="text-center mb-5">
            <h2
              className="display-5 fw-bold"
              style={{ color: "var(--cor-primaria)" }}
            >
              DignaMente
            </h2>
            <p className="text-muted fs-5">Acesse sua conta para continuar</p>
          </div>

          <Form
            onSubmit={handleLogin}
            className="bg-white p-4 p-md-5 rounded shadow-sm border border-light"
          >
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              errorMessage="Por favor, preencha um e-mail válido (deve conter '@')."
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              errorMessage="Por favor, introduza a sua senha."
            />

            <div className="text-end mb-4">
              <a
                href="#"
                className="text-decoration-none fw-medium"
                style={{ color: "var(--cor-primaria)" }}
              >
                Esqueceu a senha?
              </a>
            </div>

            <Button type="submit">Entrar</Button>

            <div className="text-center mt-4">
              <span className="text-muted">Não tem uma conta? </span>
              <a
                href="/cadastro"
                className="text-decoration-none fw-bold"
                style={{ color: "var(--cor-primaria)" }}
              >
                Criar Nova Conta
              </a>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};