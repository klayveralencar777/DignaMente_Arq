import { useState } from "react";
import { Container, Card, Form, Button as BootstrapButton, Spinner, Alert, InputGroup } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "../../services/api";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const messageFromRegister = location.state?.message || "";
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const primaryTeal = "#2C7A7B";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/auth/login", formData);
      const { token, typeUser, name, crp } = response.data;

      localStorage.setItem("@DignaMente:token", token);
      localStorage.setItem("@DignaMente:userName", name || "Usuário");
      
      if (crp) {
        localStorage.setItem("@DignaMente:crp", crp);
      }

      // ---LÓGICA DE TRIAGEM PACIENTE---
      if (typeUser === "PATIENT") {
        navigate("/paciente/triagem");
      } else if (typeUser === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/psicologo");
      }

    } catch (error) {
      console.error("Erro no login:", error);
      setErrorMsg(error.response?.data?.message || "E-mail ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#F0F4F8", fontFamily: "Inter, sans-serif" }}>
      <Container style={{ maxWidth: "420px" }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold m-0" style={{ color: primaryTeal, fontSize: '2.5rem' }}>DignaMente</h1>
          <p className="text-muted mt-2" style={{ fontSize: '1.05rem' }}>Acesse sua conta para continuar</p>
        </div>

        <Card className="border-0 rounded-2 shadow-sm bg-white p-4">
          <Card.Body className="p-1">
            {messageFromRegister && <Alert variant="success" className="small text-center mb-4">{messageFromRegister}</Alert>}
            {errorMsg && <Alert variant="danger" className="small text-center mb-4">{errorMsg}</Alert>}

            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="fw-bold small text-secondary mb-2">E-mail</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required className="shadow-none rounded-1 p-2" />
              </Form.Group>

              <Form.Group>
                <Form.Label className="fw-bold small text-secondary mb-2">Senha</Form.Label>
                <InputGroup className="rounded-1" style={{ border: '1px solid #e2e8f0' }}>
                  <Form.Control type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="shadow-none border-0 p-2" />
                  <BootstrapButton variant="light" className="border-0 bg-white" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </BootstrapButton>
                </InputGroup>
              </Form.Group>

              <BootstrapButton type="submit" disabled={isLoading} className="w-100 py-2 mt-2 fw-bold border-0 text-white" style={{ backgroundColor: primaryTeal }}>
                {isLoading ? <Spinner size="sm" animation="border" /> : "Entrar"}
              </BootstrapButton>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};