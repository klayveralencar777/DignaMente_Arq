import { useState } from 'react';
import { Container, Row, Col, Card, Navbar, Form, Button as BootstrapButton, Toast, ToastContainer } from 'react-bootstrap';
import { Heart, ClipboardList, Save, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SchedulePsychologist = () => {
  const navigate = useNavigate();
  const primaryTeal = '#2C7A7B';
  const lightBackground = '#F0F4F8';

  const [showToast, setShowToast] = useState(false);


  const [schedule, setSchedule] = useState({
    Segunda: { active: true, start: '08:00', end: '18:00' },
    Terca: { active: true, start: '08:00', end: '18:00' },
    Quarta: { active: true, start: '08:00', end: '18:00' },
    Quinta: { active: true, start: '08:00', end: '18:00' },
    Sexta: { active: false, start: '08:00', end: '12:00' },
  });

  const handleToggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSaveSettings = () => {
   
    localStorage.setItem('@DignaMente:disponibilidade', JSON.stringify(schedule));
    setShowToast(true);
  };

  return (
    <div className="min-vh-100 pb-5 position-relative" style={{ backgroundColor: lightBackground, color: '#333', fontFamily: 'Inter, sans-serif' }}>
      
      {/* --- Navbar --- */}
      <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom shadow-sm fixed-top">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: primaryTeal }}>
              <Heart size={26} strokeWidth={2.5} />
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline" style={{ fontSize: '1.1rem'}}> — Meus Horários</span>
            </h4>
          </div>
        </Container>
      </Navbar>

      <div style={{ height: '90px' }}></div>

      <Container className="pt-3 px-md-4" style={{ maxWidth: '800px' }}>
        
        {/* --- Cabecalho da pagina --- */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h1 className="fw-bold m-0" style={{ fontSize: '2.2rem', color: '#2d3748' }}>Meus Horários de Atendimento</h1>
            <p className="m-0 mt-1 text-muted">Gerencie os dias e os intervalos de horas que você estará disponível</p>
          </div>
          
          <BootstrapButton 
            onClick={() => navigate('/psicologo')}
            className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 fw-bold border-0 rounded-3 shadow-sm transition-all"
            style={{ backgroundColor: primaryTeal }}
          >
            <ClipboardList size={20} /> Voltar ao Painel
          </BootstrapButton>
        </div>

        {/* --- Card de Configuração --- */}
        <Card className="border-0 rounded-4 shadow-sm p-4 bg-white">
          <Card.Body className="p-0">
            <h5 className="fw-bold mb-4" style={{ color: '#2d3748' }}>Disponibilidade Semanal</h5>
            
            <div className="d-flex flex-column gap-3">
              {Object.keys(schedule).map((day) => (
                <Row key={day} className="align-items-center p-3 rounded-3 border g-2 bg-light bg-opacity-50">
                  
                  {/* Checkbox para ativar/desativar o dia */}
                  <Col xs={12} sm={4}>
                    <Form.Check 
                      type="checkbox"
                      id={`day-${day}`}
                      label={day === 'Terca' ? 'Terça-feira' : `${day}-feira`}
                      checked={schedule[day].active}
                      onChange={() => handleToggleDay(day)}
                      className="fw-bold text-dark shadow-none"
                      style={{ cursor: 'pointer' }}
                    />
                  </Col>
                  
                  {/* Horario de Inicio */}
                  <Col xs={6} sm={4}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted small fw-medium">Das</span>
                      <Form.Control 
                        type="time" 
                        disabled={!schedule[day].active}
                        value={schedule[day].start}
                        onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                        className="shadow-none rounded-3 text-center fw-semibold text-secondary"
                      />
                    </div>
                  </Col>
                  
                  {/* Horario de Termino */}
                  <Col xs={6} sm={4}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted small fw-medium">Até às</span>
                      <Form.Control 
                        type="time" 
                        disabled={!schedule[day].active}
                        value={schedule[day].end}
                        onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                        className="shadow-none rounded-3 text-center fw-semibold text-secondary"
                      />
                    </div>
                  </Col>

                </Row>
              ))}
            </div>

            {/* Botao de Acao principal */}
            <div className="d-flex justify-content-end mt-5">
              <BootstrapButton 
                onClick={handleSaveSettings}
                className="d-flex align-items-center gap-2 px-5 py-2.5 fw-bold border-0 rounded-3 shadow-sm transition-all"
                style={{ backgroundColor: primaryTeal }}
              >
                <Save size={20} /> Salvar Horários
              </BootstrapButton>
            </div>

          </Card.Body>
        </Card>
      </Container>

      {/* --- Toaster de Confirmacao --- */}
      <ToastContainer className="p-4" position="bottom-end" style={{ zIndex: 1050, position: 'fixed' }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={4000} autohide className="border-0 shadow-lg rounded-4 overflow-hidden">
          <Toast.Header className="border-0 pb-1 pt-3 px-4 bg-white justify-content-between">
            <strong className="d-flex align-items-center gap-2 fs-6" style={{ color: primaryTeal }}>
              <CheckCircle size={18} style={{ color: primaryTeal }} /> Sucesso!
            </strong>
          </Toast.Header>
          <Toast.Body className="px-4 pb-4 pt-1 bg-white text-dark fw-medium" style={{ fontSize: '0.95rem' }}>
            Sua nova grade de horários foi salva.
          </Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
};
