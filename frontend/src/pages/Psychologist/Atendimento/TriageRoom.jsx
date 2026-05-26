import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button as BootstrapButton, Navbar, Spinner } from 'react-bootstrap';
import { 
  Heart, ArrowLeft, Video, Mic, MicOff, VideoOff, 
  Save, ClipboardList, Clock, Activity, User, FileText
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// --- Componentes ---
import { SettingsButton } from '../../../components/ui/SettingsButton';
import { SettingsMenu } from '../Patient/SettingsMenu';

export const TriageRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // --- Estados de Interface ---
  const [showSettings, setShowSettings] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Dados do Formulário ---
  const [clinicalObs, setClinicalObs] = useState('');
  const [behavior, setBehavior] = useState('');
  const [priority, setPriority] = useState('Leve');

  // --- Nossas Cores Padrão Oficiais ---
  const primaryTeal = '#2C7A7B';
  const actionGreen = '#48BB78'; // O nosso verde padrão de sucesso/salvar
  const lightBackground = '#F0F4F8';

  // --- Lógica de Salvamento ---
  const handleSaveAndRelease = async () => {
    if (!clinicalObs.trim() && !behavior.trim()) {
      return alert('Preencha pelo menos um campo de anotação para o prontuário.');
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const storedApts = JSON.parse(localStorage.getItem('@DignaMente:mockAppointments') || '[]');
      const updatedApts = storedApts.filter(apt => apt.id !== Number(id));
      localStorage.setItem('@DignaMente:mockAppointments', JSON.stringify(updatedApts));

      navigate('/psicologo', { 
        state: { 
          triageSuccess: true, 
          patientName: 'Lúcia Pereira',
          priority: priority 
        } 
      });
    } catch (error) {
      alert('Erro ao salvar triagem.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: lightBackground, color: '#333', fontFamily: 'Inter, sans-serif' }}>
      
      <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom shadow-sm">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h5 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: primaryTeal }}>
              <Heart size={24} strokeWidth={2.5} />
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2"> — Teleconsulta de Triagem</span>
            </h5>
          </div>
          <SettingsButton onClick={() => setShowSettings(true)} />
        </Container>
      </Navbar>

      <Container fluid className="flex-grow-1 p-3 p-md-4" style={{ maxWidth: '1400px' }}>
        
        {/* --- Botão Cancelar Refinado --- */}
        <div className="mb-3">
          <button 
            onClick={() => navigate('/psicologo')} 
            className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 fw-bold transition-all" 
            style={{ color: primaryTeal, opacity: 0.85 }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.85'}
          >
            <ArrowLeft size={18} /> Cancelar Triagem
          </button>
        </div>

        <Row className="g-4 h-100">
          
          {/* --- COLUNA ESQUERDA: VÍDEO --- */}
          <Col lg={7} className="d-flex flex-column">
            <Card className="border-0 shadow-sm rounded-4 flex-grow-1 overflow-hidden" style={{ border: `2px solid #E2E8F0`, backgroundColor: '#fff', minHeight: '65vh' }}>
              <div className="d-flex justify-content-between p-3 position-absolute w-100" style={{ zIndex: 10 }}>
                <span className="badge bg-success bg-opacity-75 text-white px-3 py-2 rounded-pill fw-bold" style={{ letterSpacing: '0.5px' }}>
                  AVALIAÇÃO INICIAL
                </span>
                <span className="badge bg-white text-dark border px-3 py-2 rounded-pill fw-medium d-flex align-items-center gap-2 shadow-sm">
                  <Clock size={14} className="text-danger" /> Ao vivo
                </span>
              </div>

              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center" style={{ backgroundColor: '#F7FAFC' }}>
                {isCamOn ? (
                  <>
                    <div className="p-4 bg-white rounded-circle shadow-sm mb-3">
                      <Video size={48} style={{ color: actionGreen }} />
                    </div>
                    <h4 className="fw-bold text-dark m-0">Sala de Triagem</h4>
                    <p className="text-muted m-0 fs-5 mt-1">Lúcia Pereira</p>
                  </>
                ) : (
                  <>
                    <VideoOff size={48} style={{ color: '#A0AEC0' }} className="mb-3" />
                    <p className="text-muted m-0">Sua câmera está desligada</p>
                  </>
                )}
              </div>
            </Card>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <BootstrapButton variant="light" onClick={() => setIsMicOn(!isMicOn)} className="rounded-circle shadow-sm d-flex align-items-center justify-content-center border" style={{ width: '56px', height: '56px', backgroundColor: isMicOn ? '#fff' : '#FEE2E2', color: isMicOn ? '#4A5568' : '#EF4444' }}>
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
              </BootstrapButton>
              <BootstrapButton variant="light" onClick={() => setIsCamOn(!isCamOn)} className="rounded-circle shadow-sm d-flex align-items-center justify-content-center border" style={{ width: '56px', height: '56px', backgroundColor: isCamOn ? '#fff' : '#FEE2E2', color: isCamOn ? '#4A5568' : '#EF4444' }}>
                {isCamOn ? <Video size={24} /> : <VideoOff size={24} />}
              </BootstrapButton>
            </div>
          </Col>

          {/* --- COLUNA DIREITA: PRONTUÁRIO --- */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm rounded-4 h-100 p-4 d-flex flex-column">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ClipboardList size={22} style={{ color: primaryTeal }} />
                <h5 className="fw-bold text-dark m-0">Registro de Triagem</h5>
              </div>
              <p className="text-muted fs-6 mb-4">Classifique o caso e preencha o prontuário.</p>

              <div className="flex-grow-1 overflow-auto pe-2" style={{ maxHeight: '50vh' }}>
                {/* Prioridade Clínica */}
                <div className="mb-4">
                  <label className="fw-bold text-dark mb-2 d-flex align-items-center gap-2"><Activity size={16} className="text-secondary"/> Prioridade Clínica</label>
                  <div className="d-flex gap-2">
                    <BootstrapButton variant="light" onClick={() => setPriority('Leve')} className="flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium transition-all" style={{ border: priority === 'Leve' ? `2px solid ${actionGreen}` : '1px solid #E2E8F0', backgroundColor: priority === 'Leve' ? '#F0FFF4' : '#fff', color: '#2D3748' }}>
                      <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: actionGreen }} /> Leve
                    </BootstrapButton>
                    <BootstrapButton variant="light" onClick={() => setPriority('Moderada')} className="flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium transition-all" style={{ border: priority === 'Moderada' ? `2px solid #ECC94B` : '1px solid #E2E8F0', backgroundColor: priority === 'Moderada' ? '#FEFCBF' : '#fff', color: '#2D3748' }}>
                      <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#ECC94B' }} /> Moderada
                    </BootstrapButton>
                    <BootstrapButton variant="light" onClick={() => setPriority('Urgente')} className="flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium transition-all" style={{ border: priority === 'Urgente' ? `2px solid #EF4444` : '1px solid #E2E8F0', backgroundColor: priority === 'Urgente' ? '#FEF2F2' : '#fff', color: '#2D3748' }}>
                      <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#EF4444' }} /> Urgente
                    </BootstrapButton>
                  </div>
                </div>

                {/* Observações Clínicas */}
                <div className="mb-3">
                  <label className="fw-bold text-dark mb-2 d-flex align-items-center gap-2"><FileText size={16} className="text-secondary"/> Observações Clínicas</label>
                  <Form.Control as="textarea" rows={4} placeholder="Queixa principal, sintomas observados..." value={clinicalObs} onChange={(e) => setClinicalObs(e.target.value)} className="shadow-none rounded-3 border-secondary border-opacity-25" style={{ backgroundColor: '#F8FAFC' }} />
                </div>

                {/* Comportamento */}
                <div className="mb-3">
                  <label className="fw-bold text-dark mb-2 d-flex align-items-center gap-2"><User size={16} className="text-secondary"/> Comportamento do Paciente</label>
                  <Form.Control as="textarea" rows={3} placeholder="Postura, fala, estado emocional..." value={behavior} onChange={(e) => setBehavior(e.target.value)} className="shadow-none rounded-3 border-secondary border-opacity-25" style={{ backgroundColor: '#F8FAFC' }} />
                </div>
              </div>

              {/* --- Botão Salvar Refinado --- */}
              <div className="mt-4 pt-3 border-top">
                <BootstrapButton 
                  onClick={handleSaveAndRelease} 
                  disabled={isSaving} 
                  className="w-100 py-3 fw-bold border-0 text-white rounded-3 shadow-sm transition-all d-flex align-items-center justify-content-center gap-2" 
                  style={{ backgroundColor: actionGreen }} // Aqui está o nosso verde padrão garantido!
                >
                  {isSaving ? <Spinner size="sm" animation="border" /> : <><Save size={18} /> Salvar e Liberar Paciente</>}
                </BootstrapButton>
              </div>

            </Card>
          </Col>
        </Row>
      </Container>

      <SettingsMenu show={showSettings} onHide={() => setShowSettings(false)} onLogout={() => navigate('/login')} />
    </div>
  );
};