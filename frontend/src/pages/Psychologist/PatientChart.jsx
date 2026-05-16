import { useState, useEffect } from 'react';
import { Container, Card, Navbar, Button as BootstrapButton, Form, Badge, Spinner } from 'react-bootstrap';
import { Heart, ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// --- Componentes Isolados ---
import { SettingsButton } from '../../components/ui/SettingsButton';
import { SettingsMenu } from './SettingsMenu';

export const PatientChart = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID do paciente na URL se precisar buscar no banco

  // --- Estados de Interface ---
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // --- Dados do Paciente e Formulário ---
  const [patientName, setPatientName] = useState('Mariana Costa');
  const [newNote, setNewNote] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('Baixa');
  
  // Histórico de Registros (Iniciamos vazio simulando um paciente novo)
  // Para testar o visual com dados, basta descomentar o item abaixo
  const [history, setHistory] = useState([
    /*
    {
      id: 1,
      date: '10/04/2026',
      note: 'Paciente relatou melhora no quadro de ansiedade. Mantida abordagem cognitivo-comportamental.',
      priority: 'Baixa'
    }
    */
  ]);

  // --- Configuração das Prioridades ---
  const priorities = [
    { label: 'Baixa', color: '#48BB78', bg: '#F0FFF4' },
    { label: 'Moderada', color: '#ECC94B', bg: '#FEFCBF' },
    { label: 'Alta', color: '#ED8936', bg: '#FFFAF0' },
    { label: 'Urgente', color: '#E53E3E', bg: '#FFF5F5' }
  ];

  // --- Cores Padrão ---
  const primaryTeal = '#2C7A7B';
  const actionGreen = '#48BB78';
  const lightBackground = '#F0F4F8';

  // --- Handlers ---
  const handleSaveNote = async () => {
    if (!newNote.trim()) return alert('Escreva alguma anotação antes de salvar.');

    setIsSaving(true);
    try {
      // Simula o tempo de salvar na API
      await new Promise(resolve => setTimeout(resolve, 600));

      const now = new Date();
      const newRecord = {
        id: Date.now(),
        date: now.toLocaleDateString('pt-BR'),
        note: newNote,
        priority: selectedPriority
      };

      // Adiciona a nota nova no topo do histórico
      setHistory(prev => [newRecord, ...prev]);
      setNewNote(''); // Limpa o campo
      alert('Prontuário atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao salvar anotação.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('@DignaMente:token');
    localStorage.removeItem('@DignaMente:role');
    navigate('/login');
  };

  // --- Helper para pegar a cor do Badge ---
  const getPriorityColor = (priorityLabel) => {
    const found = priorities.find(p => p.label === priorityLabel);
    return found ? found.color : '#A0AEC0';
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: lightBackground, color: '#333', fontFamily: 'Inter, sans-serif' }}>
      
      {/* --- Navbar --- */}
      <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom shadow-sm fixed-top">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: primaryTeal }}>
              <Heart size={26} strokeWidth={2.5} />
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline" style={{ fontSize: '1.1rem'}}> — Prontuário Clínico</span>
            </h4>
          </div>
          <SettingsButton onClick={() => setShowSettings(true)} />
        </Container>
      </Navbar>

      <div style={{ height: '90px' }}></div>

      <Container className="pt-4 pb-5 flex-grow-1" style={{ maxWidth: '800px' }}>
        
        {/* --- Botão Voltar --- */}
        <button 
          onClick={() => navigate('/psicologo')} 
          className="btn btn-link text-decoration-none p-0 mb-4 d-flex align-items-center gap-2 fw-medium transition-all"
          style={{ color: primaryTeal }}
        >
          <ArrowLeft size={20} /> Voltar ao Painel
        </button>

        {/* --- Card Principal --- */}
        <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5">
          
          {/* Título */}
          <div className="mb-4">
            <h3 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
              Prontuário — {patientName}
            </h3>
            <p className="text-muted m-0 fs-6 mt-1">Anotações exclusivas e confidenciais deste paciente.</p>
          </div>

          {/* --- Registros Anteriores --- */}
          <div className="mb-4">
            <h6 className="fw-bold text-secondary mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
              REGISTROS ANTERIORES
            </h6>
            
            {history.length === 0 ? (
              <div className="p-3 rounded-3 bg-light text-muted border border-light fs-6">
                Nenhum registro anterior encontrado. Este é o primeiro atendimento cadastrado para o paciente.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {history.map((item) => (
                  <div key={item.id} className="p-3 rounded-3 border bg-white shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted fw-medium fs-6">{item.date}</span>
                      <span 
                        className="px-2 py-1 rounded-pill fw-bold text-white fs-6"
                        style={{ backgroundColor: getPriorityColor(item.priority) }}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="m-0 text-dark fs-6" style={{ lineHeight: '1.5' }}>{item.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Nova Anotação --- */}
          <div className="mb-4">
            <h6 className="fw-bold text-secondary mb-2" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
              NOVA ANOTAÇÃO
            </h6>
            <Form.Control 
              as="textarea" 
              rows={4} 
              placeholder="Escreva suas anotações clínicas aqui..." 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="shadow-none rounded-3 border-secondary border-opacity-25 p-3 fs-6"
            />
          </div>

          {/* --- Classificação de Prioridade --- */}
          <div className="p-3 rounded-4 border bg-light mb-4">
            <div className="d-flex align-items-center gap-2 mb-1">
              <AlertTriangle size={18} className="text-secondary" />
              <strong className="text-dark fs-6">Classificação de Prioridade</strong>
            </div>
            <p className="text-muted fs-6 mb-3">Selecione a urgência clínica do caso para acompanhamento.</p>
            
            <div className="d-flex flex-wrap gap-2">
              {priorities.map((p) => {
                const isSelected = selectedPriority === p.label;
                return (
                  <BootstrapButton
                    key={p.label}
                    variant="light"
                    onClick={() => setSelectedPriority(p.label)}
                    className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill border fw-medium transition-all"
                    style={{
                      backgroundColor: isSelected ? p.bg : '#fff',
                      borderColor: isSelected ? p.color : '#dee2e6',
                      color: '#2d3748'
                    }}
                  >
                    <span 
                      className="rounded-circle" 
                      style={{ 
                        width: '10px', 
                        height: '10px', 
                        backgroundColor: p.color 
                      }} 
                    />
                    {p.label}
                  </BootstrapButton>
                );
              })}
            </div>
          </div>

          {/* --- Botão Salvar --- */}
          <div>
            <BootstrapButton 
              onClick={handleSaveNote}
              disabled={isSaving}
              className="px-4 py-2 fw-bold border-0 text-white rounded-3 shadow-sm transition-all"
              style={{ backgroundColor: actionGreen, opacity: newNote.trim() ? 1 : 0.6 }}
            >
              {isSaving ? <Spinner size="sm" animation="border" /> : 'Salvar Anotação'}
            </BootstrapButton>
          </div>

        </Card>
      </Container>

      {/* --- Menu Lateral --- */}
      <SettingsMenu show={showSettings} onHide={() => setShowSettings(false)} onLogout={handleLogout} />

    </div>
  );
};