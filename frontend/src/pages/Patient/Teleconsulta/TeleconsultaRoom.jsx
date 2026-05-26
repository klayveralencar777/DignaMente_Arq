import { useState } from 'react';
import { Container, Navbar, Button as BootstrapButton, Card, Modal, Offcanvas } from 'react-bootstrap';
// Adicionamos os ícones FileText, Lock e LogOut
import { Settings, Video, VideoOff, Heart, Mic, MicOff, Shield, WifiOff, PhoneOff, Phone, FileText, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeleconsultaRoom = () => {
  const navigate = useNavigate();
  const primaryGreen = '#50C878';
  const lightBackground = '#f8f9fa';

  // --- ESTADOS ---
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Estado para o Menu Lateral (Offcanvas)
  const [showSettings, setShowSettings] = useState(false);

  // --- FUNÇÕES ---
  const toggleMic = () => setMicOn(!micOn);
  const toggleCamera = () => setCameraOn(!cameraOn);

  const handlePrivacidadeRapida = () => {
    setMicOn(false);
    setCameraOn(false);
  };

  // Funções do Menu de Configurações
  const handleCloseSettings = () => setShowSettings(false);
  const handleShowSettings = () => setShowSettings(true);

  // Função de Logout Real
  const handleLogout = () => {
    localStorage.removeItem('@DignaMente:token');
    localStorage.removeItem('@DignaMente:role');
    window.location.href = '/login';
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: lightBackground, color: '#333', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Cabeçalho */}
      <Navbar bg="white" expand="lg" className="px-4 py-2 border-bottom shadow-sm">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2">
              <span style={{ color: primaryGreen, fontSize: '1.4rem' }}>
                <Heart size={24} style={{ border: '2px solid', borderRadius: '5px', padding: '3px'}}/>
              </span>
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline"> — Teleconsulta</span>
            </h4>
          </div>
          {/* Botão que abre o Menu de Configurações */}
          <BootstrapButton 
            variant="outline-secondary" 
            onClick={handleShowSettings}
            className="d-flex align-items-center gap-2 text-capitalize px-3 py-1 fw-medium" 
            style={{ fontSize: '0.9rem'}}
          >
            <Settings size={18} /> Configurações
          </BootstrapButton>
        </Container>
      </Navbar>

      {/* Área Central */}
      <Container className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4">
        <Card className="w-100 shadow-sm rounded-4 position-relative mb-4 d-flex flex-column align-items-center justify-content-center border-light-subtle" style={{ maxWidth: '900px', height: '60vh', backgroundColor: '#fff' }}>
          <div className="position-absolute top-0 end-0 p-3">
             <BootstrapButton 
                variant="danger" 
                onClick={handlePrivacidadeRapida}
                className="d-flex align-items-center gap-2 fw-bold rounded-3 px-3 py-2 border-0 shadow-sm" 
                style={{ fontSize: '0.85rem', backgroundColor: '#e84545', transition: '0.2s' }}
              >
                <Shield size={16} /> Privacidade Rápida
             </BootstrapButton>
          </div>

          <div className="text-center">
            {cameraOn ? (
              <>
                <Video size={64} style={{ color: primaryGreen, marginBottom: '1rem' }} />
                <h5 className="fw-medium mb-1" style={{ color: primaryGreen }}>Sala de Teleconsulta</h5>
                <p className="text-muted m-0" style={{ fontSize: '0.9rem' }}>Dra. Maria Silva — Psicologia</p>
              </>
            ) : (
              <>
                <VideoOff size={64} style={{ color: '#6c757d', marginBottom: '1rem' }} />
                <p className="text-muted m-0 fw-medium" style={{ fontSize: '1rem' }}>Câmera desligada</p>
              </>
            )}
          </div>
        </Card>

        {/* Controles da Chamada */}
        <div className="d-flex gap-3 mb-4">
          <BootstrapButton 
            variant={micOn ? "outline-secondary" : "danger"} 
            className={`rounded-circle d-flex align-items-center justify-content-center ${micOn ? 'bg-white' : 'border-0 text-white shadow-sm'}`} 
            style={{ width: '56px', height: '56px', transition: 'all 0.2s' }}
            onClick={toggleMic}
          >
             {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </BootstrapButton>

          <BootstrapButton 
            variant={cameraOn ? "outline-secondary" : "danger"} 
            className={`rounded-circle d-flex align-items-center justify-content-center ${cameraOn ? 'bg-white' : 'border-0 text-white shadow-sm'}`} 
            style={{ width: '56px', height: '56px', transition: 'all 0.2s' }}
            onClick={toggleCamera}
          >
             {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
          </BootstrapButton>
          
          <BootstrapButton 
            variant="danger" 
            className="rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm" 
            style={{ width: '56px', height: '56px', backgroundColor: '#e84545', transition: 'all 0.2s' }}
            onClick={() => navigate('/paciente')}
          >
             <PhoneOff size={24} />
          </BootstrapButton>
        </div>

        <BootstrapButton variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2 fw-medium text-muted bg-white border-light-subtle px-3 py-2">
           <WifiOff size={16} /> Simular Queda de Conexão
        </BootstrapButton>
      </Container>

      {/* Botão Flutuante */}
      <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: '1000'}}>
         <BootstrapButton 
            variant="danger" 
            onClick={() => setShowHelpModal(true)}
            className="rounded-circle d-flex align-items-center justify-content-center shadow border-0" 
            style={{ width: '56px', height: '56px' }}
          >
             <Phone size={24} className="text-white"/>
         </BootstrapButton>
      </div>

      {/* --- MENU LATERAL DE CONFIGURAÇÕES (OFFCANVAS) --- */}
      <Offcanvas show={showSettings} onHide={handleCloseSettings} placement="end" style={{ width: '320px' }}>
        <Offcanvas.Header closeButton className="border-bottom pb-3 mt-2 px-4">
          <Offcanvas.Title className="d-flex align-items-center gap-2 fw-bold" style={{ color: '#2d3748' }}>
            <Settings size={22} style={{ color: primaryGreen }} /> Configurações
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column px-4 py-4">
          
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light" style={{ cursor: 'pointer', transition: '0.2s' }}>
               <FileText size={20} style={{ color: primaryGreen }} />
               <span className="fw-medium text-dark">Termos de Uso</span>
            </div>
            
            <div className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light" style={{ cursor: 'pointer', transition: '0.2s' }}>
               <Shield size={20} style={{ color: primaryGreen }} />
               <span className="fw-medium text-dark">Política de Privacidade</span>
            </div>
            
            <div className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light" style={{ cursor: 'pointer', transition: '0.2s' }}>
               <Lock size={20} className="text-warning" />
               <span className="fw-medium text-dark">Alterar Senha</span>
            </div>
          </div>

          <div className="mt-auto">
             <BootstrapButton 
               variant="danger" 
               onClick={handleLogout}
               className="w-100 fw-bold py-2 d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm" 
               style={{ backgroundColor: '#e84545' }}
             >
                <LogOut size={18} /> Sair da Conta
             </BootstrapButton>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* --- MODAL DE AJUDA URGENTE --- */}
      <Modal show={showHelpModal} onHide={() => setShowHelpModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger fw-bold d-flex align-items-center gap-2" style={{ fontSize: '1.4rem' }}>
            <Heart size={24} /> Ajuda Urgente
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2 px-4 pb-4">
          <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
            Se você está em crise ou precisa de ajuda imediata, ligue agora:
          </p>

          <Card className="border-0 mb-3 shadow-sm" style={{ backgroundColor: '#fdf2f2', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '54px', height: '54px', minWidth: '54px' }}>
                <Phone className="text-white" size={24} />
              </div>
              <div>
                <h3 className="fw-bold m-0 text-dark mb-1">188</h3>
                <p className="m-0 text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.3' }}>
                  CVV — Centro de Valorização da Vida<br/>24h, gratuito, sigilo garantido
                </p>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: '#f0fdf4', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '54px', height: '54px', minWidth: '54px' }}>
                <Phone className="text-white" size={24} />
              </div>
              <div>
                <h3 className="fw-bold m-0 text-dark mb-1">192</h3>
                <p className="m-0 text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.3' }}>
                  SAMU — Serviço de Atendimento Móvel<br/>Emergências médicas 24h
                </p>
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>

    </div>
  );
};