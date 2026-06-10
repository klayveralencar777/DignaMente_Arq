import { useState } from "react";
import { Container, Card, Form, Button as BootstrapButton, Spinner, Alert, InputGroup } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";

// --- IMPORTANDO A NOSSA API REAL ---
import { api } from "../../services/api";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mensagem de sucesso caso o usuário venha da tela de cadastro
  const messageFromRegister = location.state?.message || "";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const primaryTeal = "#2C7A7B";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // 1. Faz a requisição pro Java
      const response = await api.post("/auth/login", formData);
      
      // 2. Extrai os dados EXATOS que você configurou no LoginResponseDTO.java
      const { token, typeUser, name, crp } = response.data;

      // 3. GUARDA NA GAVETA (LocalStorage)
      localStorage.setItem("@DignaMente:token", token);
      
      // Salva o nome (se não vier nada por algum erro, salva "Usuário")
      localStorage.setItem("@DignaMente:userName", name || "Usuário");
      
      // Salva o CRP se existir (psicólogo). Se não existir (paciente), limpa a gaveta.
      if (crp) {
        localStorage.setItem("@DignaMente:crp", crp);
      } else {
        localStorage.removeItem("@DignaMente:crp"); 
      }
      
      // 4. Redirecionamento Inteligente baseado no tipo de usuário
      if (typeUser === "PATIENT") {
        navigate("/paciente/dashboard");
      } else if (typeUser === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/psicologo");
      }

    } catch (error) {
      console.error("Erro no login:", error);
      setErrorMsg(
        error.response?.data?.message || 
        error.response?.data || 
        "E-mail ou senha inválidos. Tente novamente."
      );
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
            
            {messageFromRegister && (
              <Alert variant="success" className="rounded-2 fw-medium text-center small mb-4">
                {messageFromRegister}
              </Alert>
            )}

            {errorMsg && (
              <Alert variant="danger" className="rounded-2 fw-medium text-center small mb-4">
                {errorMsg}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              
              <Form.Group>
                <Form.Label className="fw-bold small text-secondary mb-2" style={{ fontSize: '0.85rem' }}>E-mail</Form.Label>
                <Form.Control 
                  type="email" name="email" placeholder="seu@email.com"
                  value={formData.email} onChange={handleChange} required
                  className="shadow-none rounded-1 p-2"
                  style={{ borderColor: '#e2e8f0', color: '#4a5568' }}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="fw-bold small text-secondary mb-2" style={{ fontSize: '0.85rem' }}>Senha</Form.Label>
                <InputGroup className="rounded-1" style={{ border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <Form.Control 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    placeholder="••••••••"
                    value={formData.password} onChange={handleChange} required
                    className="shadow-none border-0 p-2"
                    style={{ color: '#4a5568' }}
                  />
                  <BootstrapButton 
                    variant="light" 
                    className="border-0 bg-white text-muted d-flex align-items-center justify-content-center"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ padding: '0 12px' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </BootstrapButton>
                </InputGroup>
                
                <div className="text-end mt-3">
                  <Link to="/recuperar-senha" className="text-decoration-none" style={{ color: primaryTeal, fontSize: '0.85rem' }}>
                    Esqueceu a senha?
                  </Link>
                </div>
              </Form.Group>

              <BootstrapButton 
                type="submit" disabled={isLoading}
                className="w-100 py-2 mt-2 fw-bold border-0 rounded-2 text-white"
                style={{ backgroundColor: primaryTeal, fontSize: '1rem' }}
              >
                {isLoading ? <Spinner size="sm" animation="border" /> : "Entrar"}
              </BootstrapButton>

            </Form>

            <div className="text-center mt-4 pt-2">
              <p className="text-muted small m-0" style={{ fontSize: '0.9rem' }}>
                Não tem uma conta? <Link to="/cadastro" className="fw-bold text-decoration-none" style={{ color: primaryTeal }}>Criar Nova Conta</Link>
              </p>
            </div>

          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};