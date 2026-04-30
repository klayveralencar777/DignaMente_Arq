import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Button as BootstrapButton, Spinner } from 'react-bootstrap';
import { 
  Settings, 
  Heart, 
  Phone, 
  ClipboardCheck, 
  CalendarDays, 
  AlertCircle, 
  ClipboardList,
  CalendarPlus,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CancelModal } from './CancelModal';
import { SettingsMenu } from './SettingsMenu';

export const PatientDashboard = () => {
  const navigate = useNavigate();

  // ==========================================
  // DADOS DINÂMICOS (Simulando vindos da API)
  // ==========================================
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  
  // Controle de Triagem: mude para 'true' para ver o botão virar "Agendar Consulta"
  const [hasCompletedTriage, setHasCompletedTriage] = useState(false); 
  
  // Controle de Consultas (Se null, mostra vazio. Se tiver objeto, mostra a data)
  const [nextAppointment, setNextAppointment] = useState(null); 
  
  const [totalAppointments, setTotalAppointments] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const storedName = localStorage.getItem('@DignaMente:userName') || 'Fulano';
      setUserName(storedName);
      setIsLoading(false);
    }, 800); 
  }, []);

  // ==========================================
  // ESTADOS DOS COMPONENTES VISUAIS
  // ==========================================
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleShowSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason('');
  };
  
  const handleConfirmCancel = () => {
    if (!cancelReason) return alert('Por favor, selecione um motivo para cancelar.');
    alert('Consulta cancelada com sucesso!');
    setNextAppointment(null); 
    handleCloseCancelModal();
  };

  const handleLogout = () => {
    localStorage.removeItem('@DignaMente:token');
    localStorage.removeItem('@DignaMente:role');
    window.location.href = '/login';
  };

  // ==========================================
  // NOVA IDENTIDADE VISUAL DO DIGNAMENTE
  // ==========================================
  const primaryColor = '#2C7A7B'; // Verde Teal/Petróleo das imagens
  const lightBackground = '#F0F4F8'; // Fundo suave azulado das imagens
  const paleTeal = '#E8F3F3'; // Fundo clarinho para ícones e avisos
  const borderTeal = '#C4E1E1'; // Borda suave para o aviso

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: lightBackground }}>
        <Spinner animation="border" style={{ color: primaryColor, width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted fw-medium">Carregando seu painel...</p>
      </div>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO DA TELA
  // ==========================================
  return (
    <div className="min-vh-100" style={{ backgroundColor: lightBackground, color: '#333', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER SUPERIOR */}
      <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom shadow-sm fixed-top">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: primaryColor }}>
              <Heart size={26} strokeWidth={2.5} />
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline" style={{ fontSize: '1.1rem'}}> — Painel do Paciente</span>
            </h4>
          </div>
          <BootstrapButton 
            variant="light" 
            onClick={handleShowSettings}
            className="d-flex align-items-center gap-2 px-3 py-2 fw-medium border shadow-sm rounded-3 transition-all" 
            style={{ fontSize: '0.95rem', backgroundColor: '#fff', color: '#4a5568' }}
            onMouseOver={(e) => e.currentTarget.style.color = primaryColor}
            onMouseOut={(e) => e.currentTarget.style.color = '#4a5568'}
          >
            <Settings size={18} /> Configurações
          </BootstrapButton>
        </Container>
      </Navbar>

      {/* Espaçamento para o Header fixo */}
      <div style={{ height: '80px' }}></div>

      <Container className="pt-4 px-md-5 pb-5" style={{ maxWidth: '900px' }}>
        
        {/* ÁREA DE SAUDAÇÃO */}
        <div className="mb-4">
          <h1 className="fw-bold m-0" style={{ fontSize: '2.2rem', color: '#2d3748' }}>Olá, {userName}! 👋</h1>
          <p className="fs-5 m-0 mt-1" style={{ color: '#718096' }}>Bem-vindo ao seu espaço de cuidado.</p>
        </div>

        {/* CARD PRINCIPAL (DINÂMICO: Triagem vs Consulta) */}
        <Card 
          className="border-0 rounded-4 p-4 shadow-sm text-white mb-3 position-relative overflow-hidden" 
          style={{ 
            backgroundColor: primaryColor, // Usa a cor principal para a ação de maior destaque
            cursor: 'pointer', 
            transition: 'transform 0.2s, filter 0.2s' 
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.filter = 'brightness(1.05)'; // Clareia levemente no hover
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.filter = 'brightness(1)';
          }}
          onClick={() => alert(hasCompletedTriage ? "Redirecionando para agendamento..." : "Redirecionando para triagem...")}
        >
          <Card.Body className="p-0 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '16px'}}>
                 {hasCompletedTriage ? <CalendarPlus size={30} /> : <ClipboardCheck size={30} />}
              </div>
              <div>
                <h3 className="m-0 fw-bold" style={{ fontSize: '1.6rem'}}>
                  {hasCompletedTriage ? "Agendar Consulta" : "Agendar Triagem"}
                </h3>
                <p className="m-0 text-white fw-medium" style={{ opacity: 0.85, fontSize: '1rem' }}>
                  {hasCompletedTriage ? "Escolha dia e horário com profissional disponível" : "Faça sua avaliação inicial para liberar consultas"}
                </p>
              </div>
            </div>
            <div className="d-none d-md-block" style={{ opacity: 0.15 }}>
               {hasCompletedTriage ? <Clock size={60} /> : <CalendarDays size={60} />}
            </div>
          </Card.Body>
        </Card>

        {/* AVISO: Mostra apenas se ainda não fez triagem */}
        {!hasCompletedTriage && (
          <div 
            className="d-flex align-items-center gap-3 p-3 rounded-4 mb-4 border" 
            style={{ backgroundColor: paleTeal, borderColor: borderTeal, transition: '0.3s' }}
          >
             <AlertCircle size={24} style={{ color: primaryColor, minWidth: '24px' }} />
             <div>
                <h6 className="m-0 fw-bold" style={{ color: '#2d3748', fontSize: '0.95rem' }}>Aguardando avaliação inicial</h6>
                <p className="m-0" style={{ color: '#4a5568', fontSize: '0.85rem' }}>Após sua triagem, o botão acima muda para "Agendar Consulta" e libera consultas regulares.</p>
             </div>
          </div>
        )}

        {/* CARDS INFERIORES: STATUS */}
        <Row className="g-4 mb-5">
          
          {/* Card: Próxima Consulta */}
          <Col md={6}>
            <Card className="border-0 rounded-4 shadow-sm p-4 h-100" style={{ transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <Card.Body className="d-flex flex-column p-0 gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-4" style={{ width: '50px', height: '50px', backgroundColor: paleTeal, color: primaryColor }}>
                    <CalendarDays size={24} />
                  </div>
                  <p className="m-0 fw-medium" style={{ color: '#718096', fontSize: '0.95rem' }}>Próxima Consulta</p>
                </div>

                <div className="mt-2">
                  {!nextAppointment ? (
                    <h5 className="m-0 fw-bold" style={{ color: '#2d3748', opacity: 0.8 }}>Nenhuma agendada</h5>
                  ) : (
                    <>
                      <h4 className="m-0 fw-bold text-dark">{nextAppointment.date} — {nextAppointment.time}</h4>
                      <p className="m-0 text-muted mt-1">{nextAppointment.doctor}</p>
                      <button className="btn btn-sm btn-outline-danger mt-3 fw-bold px-3 rounded-pill" onClick={() => setShowCancelModal(true)}>
                        Cancelar Consulta
                      </button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Card: Meu Histórico */}
          <Col md={6}>
            <Card 
              className="border-0 rounded-4 shadow-sm p-4 h-100" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => alert("Redirecionando para a página de histórico...")}
            >
              <Card.Body className="d-flex flex-column p-0 gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-4" style={{ width: '50px', height: '50px', backgroundColor: paleTeal, color: primaryColor }}>
                    <ClipboardList size={24} />
                  </div>
                  <p className="m-0 fw-medium" style={{ color: '#718096', fontSize: '0.95rem' }}>Meu Histórico</p>
                </div>
                
                <div className="mt-2">
                  <h4 className="m-0 fw-bold mb-1" style={{ color: '#2d3748' }}>{totalAppointments} consultas</h4>
                  <p className="m-0" style={{ color: '#718096', fontSize: '0.9rem' }}>Clique para ver detalhes</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

        </Row>

      </Container>
      
      {/* BOTÃO "FLUTUANTE" DE EMERGÊNCIA (TELEFONE) */}
      <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: '1000'}}>
         <button 
           className="btn rounded-circle d-flex align-items-center justify-content-center shadow-lg border-0" 
           style={{ width: '64px', height: '64px', backgroundColor: '#ef4444', transition: 'transform 0.2s' }}
           onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
           onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
           onClick={() => alert("Abrindo canais de emergência CVV (188)...")}
           title="Emergência Psicológica"
         >
             <Phone size={28} className="text-white"/>
         </button>
      </div>

      {/* MODAIS EXTERNOS */}
      <CancelModal 
        show={showCancelModal}
        onHide={handleCloseCancelModal}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        onConfirm={handleConfirmCancel}
      />

      <SettingsMenu 
        show={showSettings} 
        onHide={handleCloseSettings} 
        onLogout={handleLogout} 
      />
      
    </div>
  );
};