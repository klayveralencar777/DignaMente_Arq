
import { Container, Row, Col, Card } from 'react-bootstrap';
import { User, Brain, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RegisterChoice = () => {
  const navigate = useNavigate();

  return (
    <Container className="min-vh-100 d-flex flex-column justify-content-center bg-light py-5">
      <div className="mb-5 px-3">
        <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-2 p-0">
          <ArrowLeft size={20} /> Voltar
        </button>
      </div>

      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark">Como deseja se cadastrar?</h2>
        <p className="text-muted fs-5">Escolha o tipo de perfil para continuar.</p>
      </div>

      <Row className="justify-content-center g-4">
        {/* Card Paciente */}
        <Col md={5} lg={4}>
          <Card 
            className="h-100 border-0 shadow-sm text-center p-4 rounded-4" 
            style={{ cursor: 'pointer', transition: '0.2s' }}
            onClick={() => navigate('/cadastro/paciente')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: '#e6f8ec', color: '#50C878' }}>
                <User size={40} />
              </div>
              <h4 className="fw-bold mb-3">Quero me cadastrar como Paciente</h4>
              <p className="text-muted mb-0">Acesso a teleconsultas pelo SUS</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Card Psicólogo */}
        <Col md={5} lg={4}>
          <Card 
            className="h-100 border-0 shadow-sm text-center p-4 rounded-4" 
            style={{ cursor: 'pointer', transition: '0.2s' }}
            onClick={() => navigate('/cadastro/psicologo')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: '#e6f3f8', color: '#38bdf8' }}>
                <Brain size={40} />
              </div>
              <h4 className="fw-bold mb-3">Quero me cadastrar como Psicólogo</h4>
              <p className="text-muted mb-0">Atenda pacientes via plataforma</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};