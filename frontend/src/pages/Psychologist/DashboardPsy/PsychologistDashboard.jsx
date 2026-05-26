import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Button as BootstrapButton, Spinner, Toast, ToastContainer, Badge, Modal } from 'react-bootstrap';
import { 
  Heart, CalendarDays, Users, Calendar, Clock, 
  Info, CheckCircle, Video, ClipboardList, UserMinus, AlertCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// --- Componentes ---
import { SettingsMenu } from '../Settings/SettingsMenu';
import { SettingsButton } from '../../../components/ui/SettingsButton';
import { AppointmentRequestCard } from './AppointmentRequestCard';

export const PsychologistDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // --- Estados de Toasters ---
  const [successToast, setSuccessToast] = useState({ show: false, title: '', message: '' });
  const [dangerToast, setDangerToast] = useState({ show: false, title: '', message: '' });
  const [absentToast, setAbsentToast] = useState({ show: false, patientName: '', date: '' });

  // --- Estados do Modal de Ausência ---
  const [showAbsentModal, setShowAbsentModal] = useState(false);
  const [selectedAptForAbsence, setSelectedAptForAbsence] = useState(null);

  const [psychologistInfo, setPsychologistInfo] = useState({ name: '', crp: '' });
  const [stats, setStats] = useState({ patientsToday: 0, weekAppointments: 0, hoursWorked: 0 });
  const [appointments, setAppointments] = useState([]);
  
  // Mariana injetada para testes de recusa/aceite
  const [requests, setRequests] = useState([
    {
      id: 1,
      patientName: 'Mariana Costa',
      requestDate: 'Hoje',
      details: 'Ansiedade excessiva e sintomas de burnout. Primeira vez na terapia.'
    }
  ]);

  // --- Inicialização e Sincronização com o LocalStorage ---
  useEffect(() => {
    // 1. Checa se veio o aviso de sucesso da Sala de Triagem
    if (location.state?.triageSuccess) {
      setSuccessToast({
        show: true,
        title: 'Triagem Finalizada!',
        message: `Os dados de Lúcia Pereira foram salvos no prontuário. Paciente liberado(a).`
      });
      navigate('.', { replace: true, state: {} });
    }

    const loadDashboardData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const storedName = localStorage.getItem('@DignaMente:userName') || 'Dra. Maria';
        const storedCrp = localStorage.getItem('@DignaMente:crp') || 'CRP-06/123456';
        setPsychologistInfo({ name: storedName, crp: storedCrp });

        let storedApts = localStorage.getItem('@DignaMente:mockAppointments');
        
        if (storedApts === null) {
          const initialApts = [
            {
              id: 201, 
              type: 'TRIAGEM', 
              patientName: 'Lúcia Pereira', 
              time: '10:30', 
              sessionNum: null, 
              disabled: false,
              status: 'Aguardando Triagem'
            }
          ];
          localStorage.setItem('@DignaMente:mockAppointments', JSON.stringify(initialApts));
          storedApts = JSON.stringify(initialApts);
        }

        const finalApts = JSON.parse(storedApts);
        setAppointments(finalApts);
        
        setStats({
          patientsToday: finalApts.length, 
          weekAppointments: finalApts.length === 0 ? 0 : 1,
          hoursWorked: 0
        });

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [location, navigate]);

  // --- Handlers ---
  const handleAcceptRequest = (acceptedRequest) => {
    setRequests(prev => prev.filter(req => req.id !== acceptedRequest.id));
    
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDate = now.toLocaleDateString('pt-BR');

    const newAppointment = {
      id: Date.now(), 
      type: 'CONSULTA',
      patientName: acceptedRequest.patientName,
      time: `${currentTime} - ${now.getHours()}:50`, 
      sessionNum: 1,
      disabled: false,
      status: 'Confirmado'
    };

    const updatedApts = [...appointments, newAppointment];
    setAppointments(updatedApts);
    localStorage.setItem('@DignaMente:mockAppointments', JSON.stringify(updatedApts));

    setSuccessToast({ 
      show: true, 
      title: 'Consulta aceita!',
      message: `${acceptedRequest.patientName} foi adicionado(a) à sua agenda em ${currentDate} às ${currentTime}.`
    });

    setStats(prev => ({ 
      ...prev, 
      patientsToday: prev.patientsToday + 1,
      weekAppointments: prev.weekAppointments + 1 
    }));
  };

  const handleDeclineRequest = (requestId, reason, isValidationError) => {
    if (isValidationError) {
      setDangerToast({
        show: true,
        title: 'Informe o motivo',
        message: 'Selecione uma opção ou descreva brevemente o motivo da recusa (mín. 5 caracteres).'
      });
      return;
    }

    setRequests(prev => prev.filter(req => req.id !== requestId));
    
    setDangerToast({
      show: true,
      title: 'Consulta Recusada',
      message: `A solicitação foi cancelada. Motivo registrado: "${reason}".`
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('@DignaMente:token');
    localStorage.removeItem('@DignaMente:role');
    navigate('/login');
  };

  // --- Handlers de Ausência ---
  const handleOpenAbsentModal = (apt) => {
    setSelectedAptForAbsence(apt);
    setShowAbsentModal(true);
  };

  const handleCloseAbsentModal = () => {
    setShowAbsentModal(false);
    setSelectedAptForAbsence(null);
  };

  const handleConfirmAbsence = () => {
    if (!selectedAptForAbsence) return;

    // 1. Remove da lista de agendamentos
    const updatedApts = appointments.filter(apt => apt.id !== selectedAptForAbsence.id);
    setAppointments(updatedApts);
    localStorage.setItem('@DignaMente:mockAppointments', JSON.stringify(updatedApts));

    // 2. Atualiza o contador do painel
    setStats(prev => ({ 
      ...prev, 
      patientsToday: updatedApts.length 
    }));

    // 3. Prepara a data formatada
    const currentDate = new Date().toLocaleDateString('pt-BR');

    // 4. Dispara o Toast de Ausência
    setAbsentToast({
      show: true,
      patientName: selectedAptForAbsence.patientName,
      date: currentDate
    });

    // 5. Fecha o modal
    handleCloseAbsentModal();
  };

  const primaryTeal = '#2C7A7B';
  const actionGreen = '#48BB78';
  const dangerRed = '#EF4444';
  const lightBackground = '#F0F4F8';

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: lightBackground }}>
        <Spinner animation="border" style={{ color: primaryTeal, width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted fw-medium">Sincronizando seus dados...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 pb-5 position-relative" style={{ backgroundColor: lightBackground, color: '#333', fontFamily: 'Inter, sans-serif' }}>
      
      {/* --- Navbar --- */}
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
        
        {/* --- Cabeçalho --- */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h1 className="fw-bold m-0" style={{ fontSize: '2.2rem', color: '#2d3748' }}>Bem-vinda, {psychologistInfo.name}!</h1>
            <p className="m-0 mt-1 fw-medium" style={{ color: primaryTeal }}>{psychologistInfo.crp}</p>
          </div>
          <BootstrapButton 
            onClick={() => navigate('/psicologo/agenda')}
            className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 fw-bold border-0 rounded-3 shadow-sm transition-all"
            style={{ backgroundColor: actionGreen }}
          >
            <CalendarDays size={20} /> Minha Agenda
          </BootstrapButton>
        </div>

        {/* --- Métricas Dinâmicas --- */}
        <Row className="g-4 mb-5">
          <Col md={4}>
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
          <Col md={4}>
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

        {/* --- Solicitações --- */}
        <h5 className="fw-bold mb-3" style={{ color: '#4a5568' }}>Solicitações Pendentes</h5>
        {requests.length === 0 ? (
          <div className="text-center p-5 mb-5 rounded-4 border shadow-sm" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
            <Info size={40} className="text-muted mb-3 opacity-50" />
            <h5 className="text-secondary fw-bold">Nenhuma solicitação pendente</h5>
            <p className="text-muted m-0">Sua fila de avaliações está completamente limpa.</p>
          </div>
        ) : (
          requests.map((request) => (
            <AppointmentRequestCard 
              key={request.id} 
              request={request} 
              onAccept={handleAcceptRequest} 
              onDecline={handleDeclineRequest} 
            />
          ))
        )}

        {/* --- Agenda do Dia --- */}
        <h5 className="fw-bold mb-3" style={{ color: '#4a5568' }}>Agenda de Hoje</h5>
        <div className="d-flex flex-column gap-3">
          {appointments.length === 0 ? (
            <div className="text-center p-5 rounded-4 border shadow-sm bg-white" style={{ borderColor: '#e2e8f0' }}>
              <CalendarDays size={40} className="text-success mb-3 opacity-75" />
              <h5 className="text-dark fw-bold">Tudo limpo por aqui!</h5>
              <p className="text-muted m-0">Você finalizou todos os atendimentos do dia. Bom descanso!</p>
            </div>
          ) : (
            appointments.map((apt) => {
              const isTriage = apt.type === 'TRIAGEM';
              
              return (
                <Card 
                  key={apt.id} 
                  className="border-0 rounded-4 shadow-sm mb-2"
                  style={{ 
                    border: isTriage ? '1px solid #C6F6D5' : '1px solid #E2E8F0', 
                    backgroundColor: isTriage ? '#F0FFF4' : '#fff' 
                  }}
                >
                  <Card.Body className="p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: isTriage ? '#EBF8FF' : '#E6FFFA', color: isTriage ? '#3182ce' : actionGreen }}>
                        <ClipboardList size={20} />
                      </div>

                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h5 className="fw-bold m-0" style={{ color: '#2d3748' }}>
                            {apt.patientName} {isTriage && <span className="text-muted fw-normal fs-6">(Triagem)</span>}
                          </h5>
                          {isTriage && (
                            <Badge bg="info" className="px-2 py-1 text-uppercase fw-bold rounded-pill" style={{ letterSpacing: '0.5px', backgroundColor: '#3182ce !important' }}>
                              TRIAGEM
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted m-0 mt-1 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                          Hoje <span className="text-secondary mx-1">•</span> {apt.time} 
                          {apt.sessionNum && <><span className="text-secondary mx-1">•</span> Sessão {apt.sessionNum}</>}
                          <span className="text-secondary mx-1">•</span> {apt.status || 'Confirmado'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
                      {isTriage ? (
                        <BootstrapButton 
                          onClick={() => navigate(`/psicologo/triagem/${apt.id}`)}
                          className="d-flex align-items-center gap-2 fw-bold border-0 text-white px-4 rounded-3 shadow-sm" 
                          style={{ backgroundColor: '#3182ce' }}
                        >
                          <ClipboardList size={18} /> Iniciar Triagem
                        </BootstrapButton>
                      ) : (
                        <>
                          <BootstrapButton 
                            onClick={() => navigate(`/psicologo/sessao/${apt.id}`)}
                            className="d-flex align-items-center gap-2 fw-bold border-0 text-white px-4 rounded-3" 
                            style={{ backgroundColor: actionGreen }}
                          >
                            <Video size={18} /> Iniciar Sessão
                          </BootstrapButton>
                          <BootstrapButton variant="light" onClick={() => navigate(`/psicologo/prontuario/${apt.id}`)} className="d-flex align-items-center gap-2 fw-medium border text-secondary rounded-3">
                            <ClipboardList size={18} /> Prontuário
                          </BootstrapButton>

                          {/* 🌟 BOTÃO MARCAR AUSENTE LIGADO AO MODAL AQUI 🌟 */}
                          <BootstrapButton 
                            variant="light" 
                            onClick={() => handleOpenAbsentModal(apt)}
                            className="d-flex align-items-center gap-2 fw-medium border text-danger rounded-3"
                          >
                            <UserMinus size={18} /> Marcar Ausente
                          </BootstrapButton>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </div>
        
      </Container>

      {/* --- MODAL DE CONFIRMAÇÃO DE AUSÊNCIA --- */}
      <Modal show={showAbsentModal} onHide={handleCloseAbsentModal} centered backdrop="static" keyboard={false}>
        <Modal.Body className="p-4 p-md-5">
          <h4 className="fw-bold text-dark mb-2" style={{ color: '#2d3748' }}>Marcar como Ausente?</h4>
          <p className="text-muted mb-4 fs-6">
            O paciente será registrado como falta e removido da lista de hoje.
          </p>
          <div className="d-flex justify-content-end gap-3">
            <BootstrapButton variant="light" onClick={handleCloseAbsentModal} className="fw-medium border text-secondary px-4 py-2 rounded-3">
              Cancelar
            </BootstrapButton>
            <BootstrapButton variant="danger" onClick={handleConfirmAbsence} className="fw-bold px-4 py-2 rounded-3" style={{ backgroundColor: dangerRed }}>
              Confirmar Ausência
            </BootstrapButton>
          </div>
        </Modal.Body>
      </Modal>

      {/* --- Container de Toasters --- */}
      <ToastContainer className="p-4" position="bottom-end" style={{ zIndex: 1050, position: 'fixed' }}>
        
        {/*  mensagem rapida - Sucesso */}
        <Toast show={successToast.show} onClose={() => setSuccessToast(prev => ({ ...prev, show: false }))} delay={5000} autohide className="border-0 shadow-lg rounded-4 overflow-hidden mb-3">
          <Toast.Header className="border-0 pb-1 pt-3 px-4 bg-white justify-content-between">
            <strong className="d-flex align-items-center gap-2 fs-6" style={{ color: primaryTeal }}>
              <CheckCircle size={18} style={{ color: actionGreen }} /> {successToast.title}
            </strong>
          </Toast.Header>
          <Toast.Body className="px-4 pb-4 pt-1 bg-white text-dark fw-medium" style={{ fontSize: '0.95rem' }}>
            {successToast.message}
          </Toast.Body>
        </Toast>

        {/*  mensagem rapida - Erro/Recusa */}
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

        {/* MENSAGEM DE AUSENCIA */}
        <Toast show={absentToast.show} onClose={() => setAbsentToast(prev => ({ ...prev, show: false }))} delay={5000} autohide className="border-0 shadow-lg rounded-4 overflow-hidden">
          <Toast.Header className="border-0 pb-1 pt-3 px-4 bg-white justify-content-between">
            <strong className="d-flex align-items-center gap-2 fs-6 text-dark">
              Ausência registrada
            </strong>
          </Toast.Header>
          <Toast.Body className="px-4 pb-4 pt-1 bg-white text-muted" style={{ fontSize: '0.95rem' }}>
            Paciente {absentToast.patientName} não compareceu em {absentToast.date}
          </Toast.Body>
        </Toast>

      </ToastContainer>

      <SettingsMenu show={showSettings} onHide={() => setShowSettings(false)} onLogout={() => navigate('/login')} />
    </div>
  );
};