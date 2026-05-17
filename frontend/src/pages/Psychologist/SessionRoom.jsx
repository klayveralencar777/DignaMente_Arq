import { useState, useEffect } from 'react';
import { Container, Card, Button as BootstrapButton, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { 
  ArrowLeft, Video, Mic, MicOff, VideoOff, 
  PhoneOff, Shield, ShieldAlert, WifiOff, Clock, UserCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const SessionRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- Estados de Mídia ---
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  
  // --- Estado de Conexão ---
  const [isConnectionLost, setIsConnectionLost] = useState(false);

  // --- Cores do Sistema ---
  const primaryTeal = '#2C7A7B';
  const actionGreen = '#48BB78';
  const dangerRed = '#EF4444';
  const lightBackground = '#F0F4F8'; // Fundo levíssimo teal/cinza conforme o painel

  // --- Nomes para os Avatares ---
  const [patientName, setPatientName] = useState('Fulano de Tal');
  const [psychologistName, setPsychologistName] = useState('Dra. Maria');

  // --- Handlers ---
  const handleQuickPrivacy = () => {
    // Corta áudio e vídeo em um clique!
    setIsMicOn(false);
    setIsCamOn(false);
  };

  const handleEndCall = () => {
    // Ao encerrar, volta pro Dashboard
    navigate('/psicologo');
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: lightBackground, fontFamily: 'Inter, sans-serif' }}>
      
      {/* Botão Voltar (Canto Superior Esquerdo) */}
      <div className="position-absolute top-0 start-0 p-4">
        <button 
          onClick={() => navigate('/psicologo')} 
          className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 fw-medium transition-all"
          style={{ color: primaryTeal, opacity: 0.85 }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.85'}
        >
          <ArrowLeft size={18} /> Voltar ao Painel
        </button>
      </div>

      <Container className="d-flex flex-column align-items-center" style={{ maxWidth: '950px', width: '100%' }}>
        
        {/* --- ÁREA DE VÍDEO PRINCIPAL --- */}
        <Card 
          className="w-100 border-0 shadow-sm rounded-4 position-relative d-flex align-items-center justify-content-center overflow-hidden" 
          style={{ height: '65vh', border: isConnectionLost ? `2px solid ${dangerRed}` : '1px solid #E2E8F0', backgroundColor: isConnectionLost ? '#FEF2F2' : '#fff', transition: 'all 0.3s ease' }}
        >
          
          {/* Botão Privacidade Rápida (Canto Superior Direito) */}
          <div className="position-absolute p-3" style={{ top: 0, right: 0, zIndex: 10 }}>
            <BootstrapButton 
              variant="danger" 
              onClick={handleQuickPrivacy}
              className="d-flex align-items-center gap-2 fw-bold border-0 px-3 py-2 rounded-3 shadow-sm transition-all hover-brightness"
              style={{ backgroundColor: dangerRed, fontSize: '0.9rem' }}
            >
              {!isMicOn && !isCamOn ? <ShieldAlert size={18} /> : <Shield size={18} />}
              Privacidade Rápida
            </BootstrapButton>
          </div>

          {/* Renderização Condicional: Se a internet cair, mostra o aviso. Senão, mostra o vídeo/avatares. */}
          {isConnectionLost ? (
            <div className="d-flex flex-column align-items-center text-center p-4">
              <div className="p-3 bg-danger bg-opacity-10 rounded-circle mb-3">
                <WifiOff size={48} style={{ color: dangerRed }} />
              </div>
              <h4 className="fw-bold text-danger m-0">Conexão Interrompida</h4>
              <p className="text-muted m-0 mt-2 fs-6">Aguardando reconexão com a rede. Não feche a janela.</p>
              <Spinner animation="grow" variant="danger" size="sm" className="mt-3 opacity-75" />
            </div>
          ) : (
            <>
              {/* Se a câmera estiver LIGADA, mostra o placeholder de vídeo (Action Green) */}
              {isCamOn && (
                <div className="d-flex flex-column align-items-center text-center">
                  <Video size={56} style={{ color: actionGreen }} className="mb-3" />
                  <h5 className="fw-bold text-dark m-0">Sala de Teleconsulta</h5>
                  <p className="text-muted m-0 mt-1">Sessão em andamento</p>
                </div>
              )}

              {/* Se a câmera estiver DESLIGADA, mostra os Avatares e Status (Nova Sala Premium) */}
              {!isCamOn && (
                <div className="d-flex flex-column align-items-center w-100 p-5">
                  
                  {/* Avatares dos Usuários (Z-index menor que Privacidade Rápida) */}
                  <Row className="w-100 justify-content-center gap-5 mb-4 position-relative" style={{ zIndex: 5 }}>
                    <Col xs="auto" className="d-flex flex-column align-items-center text-center">
                      <div className="p-1 rounded-circle mb-2" style={{ border: `2px solid #E2E8F0` }}>
                        <UserCircle size={80} style={{ color: primaryTeal }} />
                      </div>
                      <p className="fw-bold m-0 text-dark" style={{ fontSize: '1rem' }}>{patientName}</p>
                      <span className="text-muted fs-7">Paciente</span>
                    </Col>
                    <Col xs="auto" className="d-flex flex-column align-items-center text-center">
                      <div className="p-1 rounded-circle mb-2" style={{ border: `2px solid #E2E8F0` }}>
                        <UserCircle size={80} style={{ color: primaryTeal }} />
                      </div>
                      <p className="fw-bold m-0 text-dark" style={{ fontSize: '1rem' }}>{psychologistName}</p>
                      <span className="text-muted fs-7">Psicólogo</span>
                    </Col>
                  </Row>

                  {/* Status da Sessão Refinado */}
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 border w-100 shadow-inner" style={{ maxWidth: '400px' }}>
                    <VideoOff size={32} style={{ color: '#A0AEC0' }} />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold m-0 text-dark" style={{ color: '#2d3748'}}>Sala de Teleconsulta</h6>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <Badge bg="success" className="px-2 py-1 fw-bold rounded-pill text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', backgroundColor: actionGreen+'!important' }}>
                          <span className="pulsing-dot bg-white"></span> Sessão em andamento
                        </Badge>
                        <span className="text-muted fs-7"><Clock size={12} className="text-success me-1"/> 16:19</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* --- CONTROLES DE CHAMADA (Mic, Cam, Desligar) - Novos Botões Premium --- */}
        <div className="d-flex justify-content-center align-items-center gap-4 mt-4 mb-3">
          {/* Microfone */}
          <BootstrapButton 
            variant="light" 
            onClick={() => setIsMicOn(!isMicOn)}
            className="rounded-circle shadow-sm d-flex align-items-center justify-content-center border-0 transition-all hover-elevation"
            style={{ width: '64px', height: '64px', backgroundColor: '#fff', color: isMicOn ? primaryTeal : dangerRed }}
          >
            {isMicOn ? <Mic size={28} /> : <MicOff size={28} />}
          </BootstrapButton>
          
          {/* Câmera */}
          <BootstrapButton 
            variant="light" 
            onClick={() => setIsCamOn(!isCamOn)}
            className="rounded-circle shadow-sm d-flex align-items-center justify-content-center border-0 transition-all hover-elevation"
            style={{ width: '64px', height: '64px', backgroundColor: '#fff', color: isCamOn ? primaryTeal : dangerRed }}
          >
            {isCamOn ? <Video size={28} /> : <VideoOff size={28} />}
          </BootstrapButton>

          {/* Desligar (Telefone Vermelho) */}
          <BootstrapButton 
            onClick={handleEndCall}
            className="rounded-circle shadow-lg d-flex align-items-center justify-content-center border-0 transition-all hover-brightness"
            style={{ width: '64px', height: '64px', backgroundColor: dangerRed, color: '#fff' }}
          >
            <PhoneOff size={28} />
          </BootstrapButton>
        </div>

      </Container>
    </div>
  );
};