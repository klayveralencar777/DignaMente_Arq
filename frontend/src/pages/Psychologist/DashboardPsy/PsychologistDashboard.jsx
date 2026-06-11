import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Button as BootstrapButton, Spinner, Modal, Form } from 'react-bootstrap';
import { 
  Heart, CalendarDays, Users, Calendar, 
  Video, ClipboardList, ThumbsUp, ThumbsDown, UserX, CheckCircle
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

  const [psychologistInfo, setPsychologistInfo] = useState({ name: 'Carregando...', crp: 'Verificando...' });
  const [stats, setStats] = useState({ patientsToday: 0, weekAppointments: 0 });
  const [appointments, setAppointments] = useState([]);

  // --- ESTADOS DO MODAL DE RECUSA ---
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // --- ESTADOS DO MODAL DE AUSÊNCIA ---
  const [showAbsentModal, setShowAbsentModal] = useState(false);
  const [absentAppointmentId, setAbsentAppointmentId] = useState(null);
  const [isMarkingAbsent, setIsMarkingAbsent] = useState(false);

  // --- ESTADOS DO NOVO POPUP DE SUCESSO ---
  const [successModal, setSuccessModal] = useState({ show: false, message: '' });

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    try {
      setIsLoading(true);
      
      const storedName = localStorage.getItem('@DignaMente:userName');
      const storedCrp = localStorage.getItem('@DignaMente:crp');
      
      if (storedName && storedName !== 'Psicólogo(a)' && storedName !== 'Profissional') {
        setPsychologistInfo({ name: storedName, crp: storedCrp || 'CRP Cadastrado' });
      }

      const response = await api.get('/appointments/me');
      const dadosConsultas = response.data || [];
      setAppointments(dadosConsultas);
      
      if (dadosConsultas.length > 0) {
        const primeiraConsulta = dadosConsultas[0];
        
        const nomeDoJava = 
          primeiraConsulta.psychologistName || 
          primeiraConsulta.psychologist?.name || 
          primeiraConsulta.nomePsicologo ||
          primeiraConsulta.psychologist?.nome;

        const crpDoJava = 
          primeiraConsulta.psychologistCrp || 
          primeiraConsulta.psychologist?.crp || 
          primeiraConsulta.crpPsicologo;

        if (nomeDoJava) {
          setPsychologistInfo(prev => ({ ...prev, name: nomeDoJava }));
          localStorage.setItem('@DignaMente:userName', nomeDoJava);
        }
        if (crpDoJava) {
          setPsychologistInfo(prev => ({ ...prev, crp: crpDoJava }));
          localStorage.setItem('@DignaMente:crp', crpDoJava);
        }
      } else {
        if (!storedName || storedName === 'Psicólogo(a)' || storedName === 'Profissional') {
          setPsychologistInfo({ 
            name: 'Profissional Cadastrado', 
            crp: storedCrp && storedCrp !== 'CRP Não Informado' ? storedCrp : 'CRP Ativo' 
          });
        }
      }
      
      const hoje = dadosConsultas.filter(apt => apt.status === 'CONFIRMADO' || apt.status === 'PENDING').length;
      setStats({
        patientsToday: hoje,
        weekAppointments: dadosConsultas.length 
      });

    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      alert('Erro de Conexão: Não foi possível carregar os dados do painel.');
    } finally {
      setIsLoading(false);
    }
  };

    const handleStartRealSession = async (appointmentId) => {
    setLoadingMeet(appointmentId);
    try {
      const response = await api.post(`/appointments/${appointmentId}/meet`);
      const linkDoMeet = response.data.meetLink || response.data.link; 
      
      if (linkDoMeet) {
        // Abre o link do Meet em uma nova aba!
        window.open(linkDoMeet, '_blank'); 
      } else {
        setSuccessModal({ show: true, message: 'Sucesso, mas o link do Meet não foi retornado pelo servidor.' });
      }
    } catch (error) {
      console.error(error);
      // USANDO O MODAL BONITÃO NO LUGAR DO ALERT FEIO
      setSuccessModal({ show: true, message: 'Falha de comunicação com o servidor: Não foi possível ler as credenciais do Google Calendar.' });
    } finally {
      setLoadingMeet(null);
    }
  };

  const openRejectModal = (id) => {
    setSelectedAppointmentId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (rejectReason.trim().length < 5) {
      alert('Por favor, descreva o motivo com pelo menos 5 caracteres.');
      return;
    }

    setIsRejecting(true);

    try {
      await api.delete(`/appointments/${selectedAppointmentId}`);
      setShowRejectModal(false);
      // TROCAMOS O ALERT PELO NOVO MODAL BONITÃO
      setSuccessModal({ show: true, message: 'Solicitação recusada com sucesso.' });
      fetchRealData(); 
    } catch (error) {
      alert('Erro: Não foi possível processar a recusa no servidor.');
    } finally {
      setIsRejecting(false);
    }
  };

  const openAbsentModal = (id) => {
    setAbsentAppointmentId(id);
    setShowAbsentModal(true);
  };

  const handleConfirmAbsent = async () => {
    setIsMarkingAbsent(true);
    try {
      await api.delete(`/appointments/${absentAppointmentId}`);
      setShowAbsentModal(false);
      // TROCAMOS O ALERT PELO NOVO MODAL BONITÃO
      setSuccessModal({ show: true, message: 'Ausência registrada! O paciente foi removido da sua agenda de hoje.' });
      fetchRealData(); 
    } catch (error) {
      console.error("Erro ao registrar falta:", error);
      alert("Erro: Não foi possível registrar a falta no servidor.");
    } finally {
      setIsMarkingAbsent(false);
    }
  };

  const primaryTeal = '#2C7A7B';
  const lightBackground = '#F0F4F8';
  const redDanger = '#E53E3E';

  if (isLoading) return <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: lightBackground }}><Spinner animation="border" style={{ color: primaryTeal }} /></div>;

  const pendingRequests = appointments.filter(apt => apt.status === 'PENDING');
  const activeAppointments = appointments.filter(apt => apt.status !== 'PENDING');

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
          <BootstrapButton onClick={() => navigate('/psicologo/agenda')} className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 fw-bold border-0 rounded-3 shadow-sm text-white" style={{ backgroundColor: primaryTeal }}>
            <CalendarDays size={20} /> Minha Agenda
          </BootstrapButton>
        </div>

        <Row className="g-4 mb-5">
          <Col md={6}>
            <Card className="border-0 rounded-4 shadow-sm h-100 p-3">
              <Card.Body className="d-flex align-items-center gap-3 p-0">
                <div className="rounded-4 d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px', backgroundColor: '#E8F3F3', color: primaryTeal }}><Users size={24} /></div>
                <div>
                  <p className="m-0 text-muted fw-medium" style={{ fontSize: '0.9rem' }}>Pacientes Ativos</p>
                  <h3 className="m-0 fw-bold" style={{ color: '#2d3748' }}>{stats.patientsToday} no total</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 rounded-4 shadow-sm h-100 p-3">
              <Card.Body className="d-flex align-items-center gap-3 p-0">
                <div className="rounded-4 d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px', backgroundColor: '#E8F3F3', color: primaryTeal }}><Calendar size={24} /></div>
                <div>
                  <p className="m-0 text-muted fw-medium" style={{ fontSize: '0.9rem' }}>Agendamentos Geral</p>
                  <h3 className="m-0 fw-bold" style={{ color: '#2d3748' }}>{stats.weekAppointments} no banco</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {pendingRequests.length > 0 && (
          <div className="mb-5">
            <h5 className="fw-bold mb-3 text-secondary" style={{ fontSize: '1.1rem' }}>Solicitações de Consulta</h5>
            {pendingRequests.map(req => (
              <Card key={req.id} className="border-0 rounded-4 shadow-sm mb-3" style={{ border: '1px solid #E2E8F0', backgroundColor: '#fff' }}>
                <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between gap-3">
                  <div className="flex-grow-1">
                    <h5 className="fw-bold m-0" style={{ color: '#2d3748' }}>{req.patientName || req.patient?.name}</h5>
                    <p className="text-muted small mt-1">Data/Horário solicitado: {req.date || req.dateTime}</p>
                  </div>
                  <div className="d-flex flex-column gap-2" style={{ minWidth: '185px' }}>
                    <BootstrapButton className="fw-bold border-0 text-white py-2 rounded-3" style={{ backgroundColor: primaryTeal }}><ThumbsUp size={16} className="me-2" /> Aceitar</BootstrapButton>
                    <BootstrapButton variant="outline-danger" onClick={() => openRejectModal(req.id)} className="fw-bold py-2 rounded-3"><ThumbsDown size={16} className="me-2" /> Recusar</BootstrapButton>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#4a5568' }}>
          Pacientes Agendados <span className="text-muted">— Hoje</span>
        </h5>
        
        <div className="d-flex flex-column gap-3">
          {activeAppointments.length === 0 ? (
            <div className="text-center p-5 rounded-4 border shadow-sm bg-white" style={{ borderColor: '#e2e8f0' }}>
              <Calendar size={40} className="text-muted mb-3 opacity-50" />
              <h6 className="text-secondary fw-bold m-0">Nenhum agendamento confirmado para hoje no banco de dados.</h6>
            </div>
          ) : (
            activeAppointments.map((apt) => {
              const aptId = apt.id;
              const pacienteNome = apt.patientName || apt.patient?.name || "Paciente sem nome";
              const dataConsulta = apt.date || apt.dateTime || "Data não informada";

              return (
                <Card key={aptId} className="border-0 rounded-4 shadow-sm mb-2" style={{ border: '1px solid #E2E8F0', backgroundColor: '#fff' }}>
                  <Card.Body className="p-3 px-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '45px', height: '45px', backgroundColor: '#E8F3F3', color: primaryTeal }}>
                        <Users size={20} />
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="fw-bold m-0" style={{ color: '#2d3748', fontSize: '1.1rem' }}>{pacienteNome}</h6>
                        </div>
                        <p className="text-muted m-0 mt-1" style={{ fontSize: '0.85rem' }}>{dataConsulta}</p>
                      </div>
                    </div>
                    
                    <div className="d-flex flex-wrap align-items-center gap-2 mt-2 mt-md-0">
                      <BootstrapButton onClick={() => handleStartRealSession(aptId)} disabled={loadingMeet === aptId} className="d-flex align-items-center gap-2 fw-bold border-0 text-white px-4 py-2 rounded-3" style={{ backgroundColor: primaryTeal }}>
                        {loadingMeet === aptId ? <Spinner size="sm" /> : <Video size={18} />} Iniciar Sessão
                      </BootstrapButton>
                      <BootstrapButton variant="light" onClick={() => navigate(`/psicologo/prontuario/${aptId}`)} className="d-flex align-items-center gap-2 fw-medium border text-secondary px-3 py-2 rounded-3 bg-white">
                        <ClipboardList size={16} /> Prontuário
                      </BootstrapButton>
                      <BootstrapButton variant="light" onClick={() => openAbsentModal(aptId)} className="d-flex align-items-center gap-2 fw-medium border text-danger px-3 py-2 rounded-3 bg-white">
                        <UserX size={16} /> Marcar Ausente
                      </BootstrapButton>
                    </div>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </div>
      </Container>

      {/* MODAL DE RECUSA */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2" style={{ color: '#2d3748' }}>
            <ThumbsDown size={24} color={redDanger} /> Recusar Solicitação
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>Por favor, informe o motivo do cancelamento...</p>
          <Form.Group>
            <Form.Label className="fw-bold text-dark">Motivo do Cancelamento</Form.Label>
            <Form.Control as="textarea" rows={4} value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); }} className="shadow-none rounded-3" style={{ backgroundColor: '#f8fafc', border: '2px solid #e2e8f0' }} />
            <Form.Text className="text-muted small">Mínimo de 5 caracteres.</Form.Text>
          </Form.Group>
          <div className="d-flex justify-content-end gap-2 mt-4 pt-2">
            <BootstrapButton variant="outline-secondary" onClick={() => setShowRejectModal(false)} className="fw-bold px-4 py-2 rounded-3 bg-white">Cancelar</BootstrapButton>
            <BootstrapButton disabled={isRejecting} onClick={handleConfirmReject} className="fw-bold border-0 px-4 py-2 rounded-3 text-white" style={{ backgroundColor: redDanger }}>{isRejecting ? <Spinner size="sm" /> : 'Confirmar Recusa'}</BootstrapButton>
          </div>
        </Modal.Body>
      </Modal>

      {/* MODAL DE CONFIRMAR AUSÊNCIA */}
      <Modal show={showAbsentModal} onHide={() => setShowAbsentModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2" style={{ color: '#2d3748' }}>
            <UserX size={24} color={redDanger} /> Registrar Falta
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <p className="text-muted mb-4" style={{ fontSize: '1rem' }}>
            Tem certeza que deseja registrar a ausência deste paciente? Essa ação vai desmarcar a consulta da sua agenda de hoje.
          </p>
          <div className="d-flex justify-content-end gap-2 mt-4 pt-2">
            <BootstrapButton variant="outline-secondary" onClick={() => setShowAbsentModal(false)} disabled={isMarkingAbsent} className="fw-bold px-4 py-2 rounded-3 bg-white">
              Cancelar
            </BootstrapButton>
            <BootstrapButton disabled={isMarkingAbsent} onClick={handleConfirmAbsent} className="fw-bold border-0 px-4 py-2 rounded-3 text-white" style={{ backgroundColor: redDanger }}>
              {isMarkingAbsent ? <Spinner size="sm" /> : 'Confirmar Ausência'}
            </BootstrapButton>
          </div>
        </Modal.Body>
      </Modal>

      {/* NOVO MODAL DE SUCESSO PADRÃO */}
      <Modal show={successModal.show} onHide={() => setSuccessModal({ show: false, message: '' })} centered>
        <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2" style={{ color: primaryTeal }}>
            <CheckCircle size={28} /> Sucesso!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <p className="text-muted mb-4" style={{ fontSize: '1.05rem' }}>
            {successModal.message}
          </p>
          <div className="d-flex justify-content-end">
            <BootstrapButton onClick={() => setSuccessModal({ show: false, message: '' })} className="fw-bold border-0 px-4 py-2 rounded-3 text-white" style={{ backgroundColor: primaryTeal }}>
              Entendi
            </BootstrapButton>
          </div>
        </Modal.Body>
      </Modal>

      <SettingsMenu show={showSettings} onHide={() => setShowSettings(false)} onLogout={() => navigate('/login')} />
    </div>
  );
};