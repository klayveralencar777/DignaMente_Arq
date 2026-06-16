import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Button as BootstrapButton, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { 
  Heart, CalendarDays, Users, Calendar, 
  CheckCircle, Video, ClipboardList, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { api } from '../../../services/api';
import { SettingsMenu } from '../Settings/SettingsMenu';
import { SettingsButton } from '../../../components/ui/SettingsButton';

export const PsychologistDashboard = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [loadingMeet, setLoadingMeet] = useState(null); 
  
  const [successToast, setSuccessToast] = useState({ show: false, title: '', message: '' });
  const [dangerToast, setDangerToast] = useState({ show: false, title: '', message: '' });

  const [psychologistInfo, setPsychologistInfo] = useState({ name: 'Carregando...', crp: '...' });
  const [stats, setStats] = useState({ patientsToday: 0, weekAppointments: 0 });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setIsLoading(true);

        let agendamentosReais = [];
        try {
          const response = await api.get('/appointments/me');
          agendamentosReais = Array.isArray(response.data) ? response.data : [];
          setAppointments(agendamentosReais);
          
          setStats({
            patientsToday: agendamentosReais.length,
            weekAppointments: agendamentosReais.length 
          });
        } catch (err) {
          console.error("Erro na agenda:", err);
        }

        let psyName = localStorage.getItem('@DignaMente:userName') || 'Psicólogo(a)';
        let psyCrp = localStorage.getItem('@DignaMente:crp') || 'CRP Não Informado';
        const userId = localStorage.getItem('@DignaMente:userId') || localStorage.getItem('userId'); 

        if (userId && userId !== 'null' && userId !== 'undefined') {
          try {
            const profileResponse = await api.get(`/psychologists/${userId}`);
            if (profileResponse.data) {
              psyName = profileResponse.data.name || psyName;
              psyCrp = profileResponse.data.crp || psyCrp;
              
              localStorage.setItem('@DignaMente:userName', psyName);
              localStorage.setItem('@DignaMente:crp', psyCrp);
            }
          } catch (err) {
            console.error("Ignorando Erro 404 do Perfil", err);
          }
        } else if (agendamentosReais.length > 0) {
          const primeira = agendamentosReais[0];
          psyName = primeira.psychologistName || primeira.psychologist?.name || psyName;
          psyCrp = primeira.psychologistCrp || primeira.psychologist?.crp || psyCrp;
        }

        setPsychologistInfo({ name: psyName, crp: psyCrp });

      } catch (error) {
        console.error("Erro fatal evitado:", error);
        setDangerToast({ show: true, title: 'Erro', message: 'Alguns dados podem não ter sido carregados.'});
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  const handleStartRealSession = async (appointmentId) => {
    setLoadingMeet(appointmentId);
    try {
      const response = await api.post(`/appointments/${appointmentId}/meet`);
      
      // Lê o link com o nome correto enviado pelo Java
      const linkDoMeet = response.data.meetingLink; 

      if (linkDoMeet) {
        window.open(linkDoMeet, '_blank'); 
      } else {
        setDangerToast({ show: true, title: 'Ops!', message: 'O link do Meet não foi retornado pelo servidor.' });
      }
    } catch (error) {
      console.error(error);
      setDangerToast({ show: true, title: 'Erro', message: 'Falha ao criar o link do Google Meet.' });
    } finally {
      setLoadingMeet(null);
    }
  };

  const primaryTeal = '#2C7A7B';
  const lightBackground = '#F0F4F8';

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: lightBackground }}>
        <Spinner animation="border" style={{ color: primaryTeal, width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted fw-medium">Conectando ao servidor...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 pb-5 position-relative" style={{ backgroundColor: lightBackground, color: '#333', fontFamily: 'Inter, sans-serif' }}>
      
      <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom shadow-sm fixed-top">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: primaryTeal }}>
              <Heart size={26} strokeWidth={2.5} />
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline" style={{ fontSize: '1.1rem'}}> — Painel do Psicólogo</span>
            </h4>
          </div>
          <SettingsButton onClick={() => setShowSettings(true)} />
        </Container>
      </Navbar>

      <div style={{ height: '90px' }}></div>

      <Container className="pt-3 px-md-4" style={{ maxWidth: '1000px' }}>
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h1 className="fw-bold m-0" style={{ fontSize: '2.2rem', color: '#2d3748' }}>Bem-vindo(a), {psychologistInfo.name}!</h1>
            <p className="m-0 mt-1 fw-medium" style={{ color: primaryTeal }}>{psychologistInfo.crp}</p>
          </div>
          
          <BootstrapButton 
            onClick={() => navigate('/psicologo/agenda')}
            className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 fw-bold border-0 rounded-3 shadow-sm transition-all"
            style={{ backgroundColor: primaryTeal }}
          >
            <CalendarDays size={20} /> Minha Agenda
          </BootstrapButton>
        </div>

        <Row className="g-4 mb-5">
          <Col md={6}>
            <Card className="border-0 rounded-4 shadow-sm h-100 p-3">
              <Card.Body className="d-flex align-items-center gap-3 p-0">
                <div className="rounded-4 d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px', backgroundColor: '#E8F3F3', color: primaryTeal }}>
                  <Users size={24} />
                </div>
                <div>
                  <p className="m-0 text-muted fw-medium" style={{ fontSize: '0.9rem' }}>Pacientes Hoje</p>
                  <h3 className="m-0 fw-bold" style={{ color: '#2d3748' }}>{stats.patientsToday} agendados</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 rounded-4 shadow-sm h-100 p-3">
              <Card.Body className="d-flex align-items-center gap-3 p-0">
                <div className="rounded-4 d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px', backgroundColor: '#E8F3F3', color: primaryTeal }}>
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="m-0 text-muted fw-medium" style={{ fontSize: '0.9rem' }}>Esta Semana</p>
                  <h3 className="m-0 fw-bold" style={{ color: '#2d3748' }}>{stats.weekAppointments} consultas</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h5 className="fw-bold mb-3" style={{ color: '#4a5568' }}>Seus Agendamentos</h5>
        <div className="d-flex flex-column gap-3">
          {appointments.length === 0 ? (
            <div className="text-center p-5 rounded-4 border shadow-sm bg-white" style={{ borderColor: '#e2e8f0' }}>
              <Calendar size={40} className="text-success mb-3 opacity-75" />
              <h5 className="text-dark fw-bold">Tudo limpo por aqui!</h5>
              <p className="text-muted m-0">Você não tem agendamentos no momento.</p>
            </div>
          ) : (
            appointments.map((apt) => {
              const aptId = apt.id;
              const pacienteNome = apt.patientName || apt.patient?.name || "Paciente sem nome";
              const dataConsulta = apt.date || apt.dateTime || "Data não informada";
              
              let statusTraduzido = "Agendado";
              let corStatus = "#0284C7"; 
              
              if (apt.status === 'SCHEDULED') {
                 statusTraduzido = "Agendado";
                 corStatus = "#0284C7"; 
              } else if (apt.status === 'COMPLETED') {
                 statusTraduzido = "Concluído";
                 corStatus = "#059669"; 
              } else if (apt.status === 'CANCELED') {
                 statusTraduzido = "Cancelado";
                 corStatus = "#E11D48"; 
              }
              
              return (
                <Card 
                  key={aptId} 
                  className="border-0 rounded-4 shadow-sm mb-2"
                  style={{ border: '1px solid #E2E8F0', backgroundColor: '#fff' }}
                >
                  <Card.Body className="p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: '#E6FFFA', color: primaryTeal }}>
                        <ClipboardList size={20} />
                      </div>

                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h5 className="fw-bold m-0" style={{ color: '#2d3748' }}>{pacienteNome}</h5>
                        </div>
                        <p className="text-muted m-0 mt-1 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                          <span className="text-secondary mx-1">•</span> {dataConsulta} 
                          <span className="text-secondary mx-1">•</span> 
                          <strong style={{ color: corStatus }}>{statusTraduzido}</strong>
                        </p>
                      </div>
                    </div>
                    
                    <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
                      <BootstrapButton 
                        onClick={() => handleStartRealSession(aptId)}
                        disabled={loadingMeet === aptId}
                        className="d-flex align-items-center gap-2 fw-bold border-0 text-white px-4 rounded-3" 
                        style={{ backgroundColor: primaryTeal }}
                      >
                        {loadingMeet === aptId ? <Spinner size="sm" /> : <Video size={18} />} 
                        {loadingMeet === aptId ? 'Gerando Link...' : 'Criar Link do Meet'}
                      </BootstrapButton>
                      
                      <BootstrapButton variant="light" onClick={() => navigate(`/psicologo/prontuario/${aptId}`)} className="d-flex align-items-center gap-2 fw-medium border text-secondary rounded-3">
                        <ClipboardList size={18} /> Prontuário
                      </BootstrapButton>
                    </div>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </div>
      </Container>

      <ToastContainer className="p-4" position="bottom-end" style={{ zIndex: 1050, position: 'fixed' }}>
        <Toast show={successToast.show} onClose={() => setSuccessToast(prev => ({ ...prev, show: false }))} delay={5000} autohide className="border-0 shadow-lg rounded-4 overflow-hidden mb-3">
          <Toast.Header className="border-0 pb-1 pt-3 px-4 bg-white justify-content-between">
            <strong className="d-flex align-items-center gap-2 fs-6" style={{ color: primaryTeal }}>
              <CheckCircle size={18} style={{ color: primaryTeal }} /> {successToast.title}
            </strong>
          </Toast.Header>
          <Toast.Body className="px-4 pb-4 pt-1 bg-white text-dark fw-medium" style={{ fontSize: '0.95rem' }}>
            {successToast.message}
          </Toast.Body>
        </Toast>

        <Toast show={dangerToast.show} onClose={() => setDangerToast(prev => ({ ...prev, show: false }))} delay={5000} autohide className="border-0 shadow-lg rounded-4 overflow-hidden bg-danger text-white mb-3">
          <Toast.Header className="border-0 pb-1 pt-3 px-4 bg-danger text-white justify-content-between" style={{ borderBottom: 'none' }}>
            <strong className="d-flex align-items-center gap-2 fs-6 text-white">
              <AlertCircle size={18} /> {dangerToast.title}
            </strong>
          </Toast.Header>
          <Toast.Body className="px-4 pb-4 pt-1 text-white text-opacity-90 fw-medium" style={{ fontSize: '0.95rem' }}>
            {dangerToast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <SettingsMenu show={showSettings} onHide={() => setShowSettings(false)} onLogout={() => navigate('/login')} />
    </div>
  );
};