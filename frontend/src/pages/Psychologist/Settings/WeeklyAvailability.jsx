import { useState } from 'react';
import { Container, Card, Navbar, Button as BootstrapButton, Form, InputGroup, Spinner } from 'react-bootstrap';
import { Heart, ArrowLeft, Clock, Save, CalendarCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Componentes ---
import { SettingsMenu } from './SettingsMenu';
import { SettingsButton } from '../../../components/ui/SettingsButton';

export const WeeklyAvailability = () => {
  const navigate = useNavigate();

  // --- Estados ---
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [availability, setAvailability] = useState({
    monday: { label: 'Seg', active: true, start: '08:00', end: '17:00' },
    tuesday: { label: 'Ter', active: true, start: '08:00', end: '17:00' },
    wednesday: { label: 'Qua', active: true, start: '08:00', end: '17:00' },
    thursday: { label: 'Qui', active: true, start: '08:00', end: '17:00' },
    friday: { label: 'Sex', active: true, start: '08:00', end: '16:00' }, 
  });

  // --- Cores ---
  const primaryTeal = '#2C7A7B';
  const actionGreen = '#48BB78';
  const lightBackground = '#F0F4F8';

  // --- Handlers ---
  const handleToggle = (dayKey) => {
    setAvailability((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], active: !prev[dayKey].active }
    }));
  };

  const handleTimeChange = (dayKey, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      alert('Sua disponibilidade semanal foi atualizada com sucesso!');
    } catch {
      alert('Erro ao salvar os horários. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('@DignaMente:token');
    localStorage.removeItem('@DignaMente:role');
    navigate('/login');
  };

  // --- Layout ---
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: lightBackground, color: '#333', fontFamily: 'Inter, sans-serif' }}>
      
      {/* --- Header Fixo --- */}
      <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom shadow-sm fixed-top">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: primaryTeal }}>
              <Heart size={26} strokeWidth={2.5} />
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline" style={{ fontSize: '1.1rem'}}> — Minha Agenda</span>
            </h4>
          </div>
          
          {/* Nosso Botão Universal aqui! */}
          <SettingsButton onClick={() => setShowSettings(true)} />

        </Container>
      </Navbar>

      <div style={{ height: '90px' }}></div>

      <Container className="pt-4 pb-5 flex-grow-1" style={{ maxWidth: '800px' }}>
        
        {/* Botão Voltar */}
        <button 
          onClick={() => navigate('/psicologo')} 
          className="btn btn-link text-decoration-none p-0 mb-4 d-flex align-items-center gap-2 fw-medium transition-all"
          style={{ color: primaryTeal }}
        >
          <ArrowLeft size={20} /> Voltar ao Painel
        </button>

        {/* Card Principal */}
        <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5">
          <div className="mb-4 d-flex align-items-center gap-3">
            <div className="d-flex justify-content-center align-items-center rounded-circle" style={{ width: '48px', height: '48px', backgroundColor: '#E8F3F3', color: primaryTeal }}>
              <CalendarCheck size={24} />
            </div>
            <div>
              <h2 className="fw-bold text-dark m-0 fs-3">Disponibilidade Semanal</h2>
              <p className="text-muted m-0 fs-6 mt-1">Defina os dias e horários em que você atende na plataforma.</p>
            </div>
          </div>

          <hr className="text-secondary opacity-25 mb-4" />

          {/* Lista de Dias */}
          <div className="d-flex flex-column gap-3 mb-5">
            {Object.entries(availability).map(([dayKey, dayData]) => (
              <div 
                key={dayKey} 
                className={`d-flex flex-column flex-md-row align-items-md-center justify-content-between p-3 rounded-4 border transition-all ${dayData.active ? 'bg-white border-light shadow-sm' : 'bg-light border-light text-muted'}`}
                style={{ opacity: dayData.active ? 1 : 0.6 }}
              >
                <div className="d-flex align-items-center gap-3 mb-3 mb-md-0" style={{ minWidth: '120px' }}>
                  <Form.Check 
                    type="switch"
                    id={`switch-${dayKey}`}
                    checked={dayData.active}
                    onChange={() => handleToggle(dayKey)}
                    className="fs-5 m-0"
                    style={{ cursor: 'pointer' }}
                  />
                  <span className="fw-bold fs-5" style={{ color: dayData.active ? primaryTeal : '#a0aec0' }}>
                    {dayData.label}
                  </span>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3 flex-grow-1 ms-md-4">
                  <div className="flex-grow-1">
                    <Form.Label className="fw-medium mb-1" style={{ fontSize: '0.85rem', color: '#718096' }}>Horário de Início</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white border-end-0 text-muted">
                        <Clock size={16} />
                      </InputGroup.Text>
                      <Form.Control 
                        type="time" 
                        value={dayData.start}
                        disabled={!dayData.active}
                        onChange={(e) => handleTimeChange(dayKey, 'start', e.target.value)}
                        className="border-start-0 shadow-none fw-medium"
                        style={{ color: '#2d3748' }}
                      />
                    </InputGroup>
                  </div>

                  <div className="d-none d-sm-flex align-items-center mt-3 text-muted">até</div>

                  <div className="flex-grow-1">
                    <Form.Label className="fw-medium mb-1" style={{ fontSize: '0.85rem', color: '#718096' }}>Horário de Término</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white border-end-0 text-muted">
                        <Clock size={16} />
                      </InputGroup.Text>
                      <Form.Control 
                        type="time" 
                        value={dayData.end}
                        disabled={!dayData.active}
                        onChange={(e) => handleTimeChange(dayKey, 'end', e.target.value)}
                        className="border-start-0 shadow-none fw-medium"
                        style={{ color: '#2d3748' }}
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Salvar */}
          <div className="d-flex justify-content-end">
            <BootstrapButton 
              onClick={handleSave}
              disabled={isSaving}
              className="d-flex align-items-center gap-2 px-4 py-2 fw-bold border-0 text-white rounded-3 shadow-sm transition-all"
              style={{ backgroundColor: actionGreen, minWidth: '160px', justifyContent: 'center' }}
            >
              {isSaving ? (
                <><Spinner size="sm" animation="border" /> Salvando...</>
              ) : (
                <><Save size={20} /> Salvar Agenda</>
              )}
            </BootstrapButton>
          </div>
        </Card>
      </Container>

      {/* --- Menu Lateral --- */}
      <SettingsMenu 
        show={showSettings} 
        onHide={() => setShowSettings(false)} 
        onLogout={handleLogout} 
      />

    </div>
  );
};