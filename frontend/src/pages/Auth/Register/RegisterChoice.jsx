import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { User, Brain, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RegisterChoice = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* CSS para animações de Hover nos Cards */}
      <style>
        {`
          .choice-card {
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
          }
          .choice-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(44, 122, 123, 0.1) !important;
            border-color: var(--cor-primaria);
          }
          .choice-card .action-arrow {
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.3s ease;
          }
          .choice-card:hover .action-arrow {
            opacity: 1;
            transform: translateX(0);
          }
          .icon-wrapper {
            transition: all 0.3s ease;
          }
          .choice-card:hover .icon-wrapper {
            background-color: var(--cor-primaria) !important;
            color: white !important;
          }
        `}
      </style>

      <Container className="min-vh-100 d-flex flex-column py-4">
        {/* Botão Voltar no Topo */}
        <div className="mb-2 pt-2">
          <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-2 p-0">
            <ArrowLeft size={20} /> Voltar
          </button>
        </div>

        {/* Conteúdo Centralizado */}
        <div className="flex-grow-1 d-flex flex-column justify-content-center pb-5">
          
          {/* Cabeçalho da Página */}
          <div className="text-center mb-5">
            <h1 className="h5 fw-bold mb-4" style={{ color: 'var(--cor-primaria)' }}>DignaMente</h1>
            <h2 className="fw-bold text-dark display-6 mb-3">Bem-vindo! Como deseja se cadastrar?</h2>
            <p className="text-muted fs-5">Escolha o seu perfil abaixo para criarmos a sua conta.</p>
          </div>

          <Row className="justify-content-center g-4 px-2">
            {/* ---------------- CARD PACIENTE ---------------- */}
            <Col md={6} lg={5} xl={4}>
              <Card 
                className="h-100 shadow-sm text-center p-4 rounded-4 choice-card bg-white" 
                onClick={() => navigate('/cadastro/paciente')}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-between p-2">
                  <div className="d-flex flex-column align-items-center">
                    <Badge bg="light" text="secondary" className="mb-4 px-3 py-2 rounded-pill border">
                      Para usuários do SUS
                    </Badge>
                    
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center mb-4 icon-wrapper" 
                      style={{ width: '90px', height: '90px', backgroundColor: 'rgba(44, 122, 123, 0.1)', color: 'var(--cor-primaria)' }}
                    >
                      <User size={45} strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="fw-bold h4 mb-3 text-dark">Paciente</h3>
                    <p className="text-muted px-2" style={{ fontSize: '0.95rem' }}>
                      Agende teleconsultas gratuitas, acesse seu histórico e receba atendimento psicológico de onde estiver.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 w-100 border-top d-flex align-items-center justify-content-center gap-2 text-primaria fw-bold">
                    <span>Criar conta de paciente</span>
                    <ArrowRight size={18} className="action-arrow" />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* ---------------- CARD PSICÓLOGO ---------------- */}
            <Col md={6} lg={5} xl={4}>
              <Card 
                className="h-100 shadow-sm text-center p-4 rounded-4 choice-card bg-white" 
                onClick={() => navigate('/cadastro/psicologo')}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-between p-2">
                  <div className="d-flex flex-column align-items-center">
                    <Badge bg="light" text="secondary" className="mb-4 px-3 py-2 rounded-pill border">
                      Para profissionais
                    </Badge>

                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center mb-4 icon-wrapper" 
                      style={{ width: '90px', height: '90px', backgroundColor: 'rgba(44, 122, 123, 0.1)', color: 'var(--cor-primaria)' }}
                    >
                      <Brain size={45} strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="fw-bold h4 mb-3 text-dark">Psicólogo</h3>
                    <p className="text-muted px-2" style={{ fontSize: '0.95rem' }}>
                      Atenda pacientes da rede pública, gerencie sua agenda e faça a diferença com segurança e ética.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 w-100 border-top d-flex align-items-center justify-content-center gap-2 text-primaria fw-bold">
                    <span>Criar conta de profissional</span>
                    <ArrowRight size={18} className="action-arrow" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

        </div>
      </Container>
    </>
  );
};