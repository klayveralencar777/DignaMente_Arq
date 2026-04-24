
import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { api } from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, role } = response.data;
      
      localStorage.setItem('@DignaMente:token', token);
      localStorage.setItem('@DignaMente:role', role);

      if (role === 'ADMIN') window.location.href = '/admin';
      else if (role === 'PSICOLOGO') window.location.href = '/psicologo';
      else window.location.href = '/paciente';
    } catch {
      alert("E-mail ou senha incorretos.");
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center vh-100 bg-light">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold" style={{ color: '#50C878' }}>DignaMente</h2>
            <p className="text-muted fs-5">Acesse sua conta para continuar</p>
          </div>

          <Form onSubmit={handleLogin} className="bg-white p-4 p-md-5 rounded shadow-sm">
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
              <a href="#" className="text-decoration-none fw-medium" style={{ color: '#50C878' }}>
                Esqueceu a senha?
              </a>
            </div>

            <Button type="submit">Entrar</Button>
            
            <div className="text-center mt-4">
              <span className="text-muted">Não tem uma conta? </span>
              <a href="/cadastro" className="text-decoration-none fw-bold" style={{ color: '#50C878' }}>
                Criar Nova Conta
              </a>
            </div>
          </Form>

        </Col>
      </Row>
    </Container>
  );
};