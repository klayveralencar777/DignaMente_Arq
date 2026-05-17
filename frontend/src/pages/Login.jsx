import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { jwtDecode } from "jwt-decode";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. Limpeza de sessão anterior
    localStorage.clear();

    try {
      // 2. Recebe o Token atualizado do Back-end
      const response = await api.post("/auth/login", { email, password });
      const token = response.data;
      localStorage.setItem("@DignaMente:token", token);

      // 3. Lê o "crachá" (Agora com a Mágica do Back-end funcionando!)
      const decoded = jwtDecode(token);
      const userRole = decoded.role; // Puxa exatamente o nome do claim que ele colocou no Java

      // 4. Roteamento limpo e dinâmico
      if (userRole === "ADMIN") {
        localStorage.setItem("@DignaMente:userName", "Administrador");
        window.location.href = "/admin";
        return;
      }

      if (userRole === "PSYCHOLOGIST") {
        localStorage.setItem("@DignaMente:userName", "Psicólogo");
        window.location.href = "/psicologo";
        return;
      }

      // 5. Fluxo do Paciente (Se não for Admin nem Psicólogo)
      try {
        const pacientesResponse = await api.get("/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const emailDigitado = email.toLowerCase().trim();
        const pacienteLogado = pacientesResponse.data.find(
          (p) => p.email.toLowerCase().trim() === emailDigitado,
        );

        if (pacienteLogado) {
          const nomeCompleto =
            pacienteLogado.name || pacienteLogado.nome || "Paciente";
          localStorage.setItem(
            "@DignaMente:userName",
            nomeCompleto.split(" ")[0],
          );
          localStorage.setItem("@DignaMente:patientId", pacienteLogado.id);
        }
      } catch (err) {
        console.error("Erro ao buscar dados do paciente", err);
      }

      window.location.href = "/paciente";
    } catch (error) {
      console.error(error);
      alert("Erro ao realizar login. Verifique as suas credenciais.");
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
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="text-end mb-4">
              <a
                href="/recuperar-senha"
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
