import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button as BootstrapButton, Badge, Card } from 'react-bootstrap';
import { Mic, MicOff, Video, VideoOff, ShieldAlert, ShieldCheck, User, Save, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const TriageRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- Estados de mídia e privacidade ---
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isPrivacyActive, setIsPrivacyActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  // --- Estados do formulário de triagem ---
  const [triageNotes, setTriageNotes] = useState('');
  const [classification, setClassification] = useState('');

  const primaryTeal = '#2C7A7B';
  const lightBackground = '#F0F4F8';

  // Cronômetro sutil para acompanhar o tempo de atendimento
  useEffect(() => {
    const timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handlePrivacyToggle = () => {
    const nextPrivacy = !isPrivacyActive;
    setIsPrivacyActive(nextPrivacy);
    if (nextPrivacy) {
      setIsMicOn(false);
      setIsCamOn(false);
    } else {
      setIsMicOn(true);
      setIsCamOn(true);
    }
  };

  // Envia as informações e limpa a fila liberando o paciente
  const handleSaveAndRelease = () => {
    // Redireciona notificando o painel principal para disparar o Toast de sucesso
    navigate('/psicologo', { state: { triageSuccess: true } });
  };

  return (
    <div className="vh-100 d-flex flex-column" style={{ backgroundColor: '#1a202c', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      
      {/* --- Barra Superior Estilo Call --- */}
      <div className="w-100 px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25" style={{ backgroundColor: '#2d3748' }}>
        <div className="d-flex align-items-center gap-3">
          <Badge bg="primary" className="px-3 py-2 rounded-pill fw-bold" style={{ backgroundColor: `${primaryTeal} !important` }}>
            TRIAGEM EM ANDAMENTO
          </Badge>
          <span className="text-white opacity-75 fw-medium font-monospace">{formatTime(sessionTime)}</span>
        </div>

        <BootstrapButton 
          variant={isPrivacyActive ? 'warning' : 'outline-light'}
          onClick={handlePrivacyToggle}
          className="d-flex align-items-center gap-2 fw-bold rounded-pill px-4 transition-all"
          style={{ fontSize: '0.9rem' }}
        >
          {isPrivacyActive ? (
            <><ShieldAlert size={16} /> Privacidade Ativa</>
          ) : (
            <><ShieldCheck size={16} /> Privacidade Rápida</>
          )}
        </BootstrapButton>
      </div>

      {/* --- Corpo Principal: Grid Dividida --- */}
      <div className="flex-grow-1 w-100 d-flex p-3 gap-3 overflow-hidden" style={{ backgroundColor: '#1a202c' }}>
        
        {/* Lado Esquerdo - Layout da VídeoChamada */}
        <div className="flex-grow-1 d-flex flex-column position-relative justify-content-center align-items-center rounded-4 overflow-hidden" style={{ backgroundColor: '#2d3748', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="d-flex flex-column align-items-center text-white opacity-40">
            <User size={70} strokeWidth={1} />
            <p className="mt-2 small">Conectando vídeo com o paciente da triagem...</p>
          </div>

          {/* Miniatura do Psicólogo (PiP) */}
          <div className="position-absolute rounded-3 overflow-hidden shadow d-flex align-items-center justify-content-center" 
               style={{ width: '160px', height: '110px', bottom: '20px', right: '20px', backgroundColor: isCamOn ? '#4a5568' : '#1a202c', border: '1px solid rgba(255,255,255,0.2)' }}>
            {isCamOn ? <User size={30} className="text-white opacity-60" /> : <VideoOff size={24} className="text-danger" />}
          </div>

          {/* Controles de Mídia Inferiores */}
          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2">
            <BootstrapButton variant={isMicOn ? 'light' : 'danger'} className="rounded-circle p-2" onClick={() => setIsMicOn(!isMicOn)}>
              {isMicOn ? <Mic size={18} color="#1a202c" /> : <MicOff size={18} />}
            </BootstrapButton>
            <BootstrapButton variant={isCamOn ? 'light' : 'danger'} className="rounded-circle p-2" onClick={() => setIsCamOn(!isCamOn)}>
              {isCamOn ? <Video size={18} color="#1a202c" /> : <VideoOff size={18} />}
            </BootstrapButton>
          </div>
        </div>

        {/* Lado Direito - Painel Registro de Triagem */}
        <Card className="border-0 rounded-4 shadow-sm h-100 flex-shrink-0 d-flex flex-column" style={{ width: '380px', backgroundColor: '#fff' }}>
          <Card.Body className="p-4 d-flex flex-column h-100 justify-content-between">
            
            <div className="overflow-y-auto pr-1">
              <h5 className="fw-bold m-0 text-dark" style={{ fontSize: '1.25rem' }}>Registro de Triagem</h5>
              <p className="text-muted small mt-1 mb-4">Registre as observações iniciais e classifique o caso do paciente.</p>
              
              {/* Campo das Anotações */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small text-secondary">Anotações da Triagem</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={8}
                  placeholder="Escreva as principais queixas, sintomas observados e notas gerais do acolhimento..."
                  value={triageNotes}
                  onChange={(e) => setTriageNotes(e.target.value)}
                  className="shadow-none rounded-3 p-3 text-secondary"
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', resize: 'none', fontSize: '0.9rem' }}
                />
              </Form.Group>

              {/* Classificação de Gravidade */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-secondary">Classificação de Risco / Caso</Form.Label>
                <Form.Select 
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                  className="shadow-none rounded-3 fw-medium text-secondary"
                  style={{ fontSize: '0.9rem' }}
                >
                  <option value="">Selecione um nível...</option>
                  <option value="leve">Complexidade Baixa / Leve</option>
                  <option value="moderado">Complexidade Média / Moderado</option>
                  <option value="urgente">Complexidade Alta / Urgente</option>
                </Form.Select>
              </Form.Group>
            </div>

            {/* Ação finalizador de Triagem */}
            <div className="pt-3 border-top mt-2">
              <BootstrapButton
                onClick={handleSaveAndRelease}
                disabled={!triageNotes.trim() || !classification}
                className="w-100 d-flex align-items-center justify-content-center gap-2 py-2.5 fw-bold border-0 rounded-3 shadow-sm transition-all text-white"
                style={{ backgroundColor: primaryTeal }}
              >
                <Save size={18} /> Salvar e Liberar Paciente
              </BootstrapButton>
            </div>

          </Card.Body>
        </Card>

      </div>
    </div>
  );
};