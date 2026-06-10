import { useState, useEffect } from 'react';
import { Container, Button as BootstrapButton, Badge } from 'react-bootstrap';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const SessionRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da consulta se precisar puxar dados do banco depois
  
  // Estados para controlar a câmera, microfone e a privacidade rápida
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isPrivacyActive, setIsPrivacyActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const primaryTeal = '#2C7A7B';
  const dangerRed = '#EF4444';

  // Cronômetro da sessão
  useEffect(() => {
    const timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Função mágica da Privacidade Rápida
  const handlePrivacyToggle = () => {
    const newPrivacyState = !isPrivacyActive;
    setIsPrivacyActive(newPrivacyState);
    
    if (newPrivacyState) {
      // Se ativou a privacidade: corta audio e video na hora
      setIsMicOn(false);
      setIsCamOn(false);
    } else {
      // Se desativou: volta tudo ao normal
      setIsMicOn(true);
      setIsCamOn(true);
    }
  };

  // Se o psicólogo mexer nos botões embaixo manualmente, tira do modo privacidade
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (isPrivacyActive) setIsPrivacyActive(false);
  };

  const toggleCam = () => {
    setIsCamOn(!isCamOn);
    if (isPrivacyActive) setIsPrivacyActive(false);
  };

  const handleEndCall = () => {
    // Encerra e volta pro painel
    navigate('/psicologo');
  };

  return (
    <div className="vh-100 d-flex flex-column position-relative" style={{ backgroundColor: '#1a202c', fontFamily: 'Inter, sans-serif' }}>
      
      {/* --- BARRA SUPERIOR (Info do paciente e Privacidade Rápida) --- */}
      <div className="w-100 px-4 py-3 d-flex justify-content-between align-items-center position-absolute top-0" style={{ zIndex: 10, background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' }}>
        <div className="d-flex align-items-center gap-3">
          <Badge bg="danger" className="px-2 py-1 rounded-pill d-flex align-items-center gap-2">
            <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#fff' }}></span>
            GRAVANDO
          </Badge>
          <span className="text-white fw-bold fs-5">Sessão em Andamento</span>
          <span className="text-white opacity-75 fw-medium font-monospace">{formatTime(sessionTime)}</span>
        </div>

        {/* Botão de Privacidade Rápida */}
        <BootstrapButton 
          variant={isPrivacyActive ? 'warning' : 'outline-light'}
          onClick={handlePrivacyToggle}
          className="d-flex align-items-center gap-2 fw-bold rounded-pill px-4 transition-all"
          style={{ border: isPrivacyActive ? 'none' : '1px solid rgba(255,255,255,0.3)' }}
        >
          {isPrivacyActive ? (
            <><ShieldAlert size={18} /> Privacidade Ativada (Mutado)</>
          ) : (
            <><ShieldCheck size={18} /> Privacidade Rápida</>
          )}
        </BootstrapButton>
      </div>

      {/* --- ÁREA DAS CÂMERAS --- */}
      <Container fluid className="flex-grow-1 d-flex p-3 p-md-4 gap-3 position-relative h-100 align-items-center justify-content-center">
        
        {/* Placeholder do Paciente (Vídeo Principal) */}
        <div className="w-100 h-100 rounded-4 overflow-hidden position-relative d-flex align-items-center justify-content-center shadow-lg" style={{ backgroundColor: '#2d3748', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="d-flex flex-column align-items-center text-white opacity-50">
            <User size={80} strokeWidth={1} />
            <p className="mt-3 fw-medium">Aguardando câmera do paciente...</p>
          </div>
          <div className="position-absolute bottom-0 start-0 p-4">
            <Badge bg="dark" className="fs-6 px-3 py-2 rounded-pill bg-opacity-75">
              Paciente
            </Badge>
          </div>
        </div>

        {/* Placeholder do Psicólogo (PiP - Canto inferior direito) */}
        <div className="position-absolute rounded-4 overflow-hidden shadow-lg d-flex align-items-center justify-content-center" 
             style={{ 
               width: '240px', height: '160px', 
               bottom: '120px', right: '40px', 
               backgroundColor: isCamOn ? '#4a5568' : '#1a202c',
               border: '2px solid rgba(255,255,255,0.2)',
               zIndex: 20
             }}>
          {isCamOn ? (
            <User size={50} className="text-white opacity-75" />
          ) : (
            <div className="d-flex flex-column align-items-center text-danger">
              <VideoOff size={40} />
            </div>
          )}
          <Badge bg="dark" className="position-absolute bottom-0 start-0 m-2 font-monospace" style={{ fontSize: '0.7rem' }}>Você</Badge>
        </div>

      </Container>

      {/* --- BARRA DE CONTROLES INFERIOR --- */}
      <div className="w-100 py-4 d-flex justify-content-center align-items-center gap-4 position-absolute bottom-0" style={{ zIndex: 10, background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}>
        
        {/* Botão Microfone */}
        <BootstrapButton 
          variant={isMicOn ? 'light' : 'danger'} 
          className="rounded-circle d-flex align-items-center justify-content-center shadow-lg"
          style={{ width: '56px', height: '56px' }}
          onClick={toggleMic}
        >
          {isMicOn ? <Mic size={24} color="#1a202c" /> : <MicOff size={24} color="#fff" />}
        </BootstrapButton>

        {/* Botão Câmera */}
        <BootstrapButton 
          variant={isCamOn ? 'light' : 'danger'} 
          className="rounded-circle d-flex align-items-center justify-content-center shadow-lg"
          style={{ width: '56px', height: '56px' }}
          onClick={toggleCam}
        >
          {isCamOn ? <Video size={24} color="#1a202c" /> : <VideoOff size={24} color="#fff" />}
        </BootstrapButton>

        {/* Botão Desligar */}
        <BootstrapButton 
          variant="danger" 
          className="rounded-pill d-flex align-items-center justify-content-center gap-2 px-4 shadow-lg fw-bold"
          style={{ height: '56px', backgroundColor: dangerRed, border: 'none' }}
          onClick={handleEndCall}
        >
          <PhoneOff size={24} /> Encerrar Sessão
        </BootstrapButton>

      </div>
    </div>
  );
};