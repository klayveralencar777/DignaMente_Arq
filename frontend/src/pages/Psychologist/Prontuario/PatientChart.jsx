PatientChart.jsx

import { useState, useEffect } from 'react';
import { Container, Card, Form, Button as BootstrapButton, Spinner, Badge, Alert, Modal } from 'react-bootstrap';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { api } from '../../../services/api';

export const PatientChart = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Esse id da URL é o nosso appointmentId!

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [patientName, setPatientName] = useState("");
  const [history, setHistory] = useState([]);
  
  const [newNote, setNewNote] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(null);

  // --- ESTADO DO NOVO MODAL DE SUCESSO ---
  const [successModal, setSuccessModal] = useState({ show: false, message: '' });

  const primaryTeal = '#2C7A7B';
  const lightBackground = '#F4F7F9';

  const priorities = [
    { id: 'Baixa', label: 'Baixa', color: '#2C7A7B' },
    { id: 'Moderada', label: 'Moderada', color: '#D69E2E' },
    { id: 'Alta', label: 'Alta', color: '#ED8936' },
    { id: 'Urgente', label: 'Urgente', color: '#E53E3E' }
  ];

  useEffect(() => {
    fetchProntuarioData();
  }, [id]);

  const fetchProntuarioData = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");

      // 1. Busca dados do agendamento específico
      const aptResponse = await api.get(`/appointments/${id}`);
      const appointment = aptResponse.data;
      const patient = appointment.patient || {};
      
      setPatientName(patient.name || appointment.patientName || "Paciente");

      // 2. Busca histórico
      const recordsResponse = await api.get('/medical-records/me');
      const allRecords = recordsResponse.data || [];
      
      // Filtra registros associados a este paciente
      const patientRecords = allRecords.filter(record => 
        record.patientId === patient.id || record.patient?.id === patient.id
      );

      const formattedHistory = patientRecords.map(rec => ({
        id: rec.id,
        date: rec.createdAt ? new Date(rec.createdAt).toLocaleDateString('pt-BR') : 'Data Indisponível',
        priority: rec.priority || 'Baixa', 
        text: rec.notes || rec.description || 'Sem descrição cadastrada.'
      }));

      setHistory(formattedHistory.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Erro ao carregar prontuário da API:", error);
      setErrorMsg("Não foi possível sincronizar o histórico com o banco de dados.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.trim() || !selectedPriority) return;
    
    setIsSaving(true);
    try {
      // O PAYLOAD ALINHADO COM O JAVA!
      const payload = {
        appointmentId: id,
        notes: newNote,
        priority: selectedPriority,
        diagnosis: "",
        prescription: ""
      };
      
      await api.post('/medical-records', payload);
      
      setNewNote("");
      setSelectedPriority(null);
      setSuccessModal({ show: true, message: 'Prontuário salvo e integrado ao histórico do paciente!' });
      
      fetchProntuarioData(); // recarrega a lista para mostrar a nova anotação
    } catch (error) {
      console.error("Erro ao salvar prontuário:", error);
      setErrorMsg("Erro ao gravar anotação no banco de dados. Verifique o console.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: lightBackground }}><Spinner animation="border" style={{ color: primaryTeal }} /></div>;

  const isSaveDisabled = !newNote.trim() || !selectedPriority || isSaving;

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: lightBackground, color: '#333', fontFamily: 'Inter, sans-serif' }}>
      <Container style={{ maxWidth: '800px' }}>
        
        <div className="mb-4">
          <BootstrapButton variant="link" onClick={() => navigate('/psicologo')} className="p-0 text-decoration-none d-flex align-items-center gap-2 fw-medium" style={{ color: primaryTeal }}>
            <ArrowLeft size={18} /> Voltar ao Painel
          </BootstrapButton>
        </div>

        {errorMsg && <Alert variant="danger" className="mb-4 rounded-3">{errorMsg}</Alert>}

        <Card className="border-0 rounded-4 shadow-sm bg-white p-4 p-md-5">
          <Card.Body className="p-0">
            
            <div className="mb-5">
              <h2 className="fw-bold m-0" style={{ color: '#2d3748', fontSize: '1.75rem' }}>Prontuário — {patientName}</h2>
              <p className="text-muted mt-1" style={{ fontSize: '0.95rem' }}>Anotações exclusivas deste paciente.</p>
            </div>

            {/* HISTÓRICO REAL */}
            <div className="mb-5">
              <h6 className="fw-bold text-secondary mb-3 text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Registros Anteriores</h6>
              
              {history.length === 0 ? (
                <p className="text-muted small p-3 rounded-3 bg-light border text-center">Nenhum registro anterior localizado para este paciente no banco.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {history.map((record) => (
                    <div key={record.id} className="p-3 rounded-3" style={{ border: '1px solid #E2E8F0', backgroundColor: '#fff' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted fw-medium" style={{ fontSize: '0.9rem' }}>{record.date}</span>
                        <Badge bg="light" className="px-3 py-1 rounded-pill fw-medium" style={{ color: primaryTeal, border: `1px solid ${primaryTeal}20`, backgroundColor: `${primaryTeal}10 !important` }}>
                          {record.priority}
                        </Badge>
                      </div>
                      <p className="m-0 text-dark" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{record.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FORMULÁRIO REAL */}
            <div>
              <h6 className="fw-bold text-secondary mb-3 text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Nova Anotação</h6>
              
              <Form.Control as="textarea" rows={5} placeholder="Escreva suas anotações clínicas aqui..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="shadow-none rounded-3 p-3 mb-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', resize: 'vertical', fontSize: '0.95rem' }} />

              <div className="p-4 rounded-3 mb-4" style={{ border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <AlertTriangle size={18} className="text-dark" />
                  <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>Classificação de Prioridade</span>
                </div>
                <p className="text-muted small mb-3">Selecione a urgência clínica do caso.</p>
                
                <div className="d-flex flex-wrap gap-2">
                  {priorities.map((p) => {
                    const isSelected = selectedPriority === p.id;
                    return (
                      <button key={p.id} type="button" onClick={() => setSelectedPriority(p.id)} className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-medium transition-all" style={{ backgroundColor: '#fff', border: isSelected ? `2px solid ${p.color}` : '1px solid #E2E8F0', color: isSelected ? p.color : '#4A5568', fontSize: '0.9rem', cursor: 'pointer', outline: 'none' }}>
                        <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: p.color }} />
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <BootstrapButton onClick={handleSaveNote} disabled={isSaveDisabled} className="fw-bold border-0 px-4 py-2 rounded-3 text-white transition-all" style={{ backgroundColor: primaryTeal, opacity: isSaveDisabled ? 0.6 : 1, fontSize: '1rem' }}>
                {isSaving ? <Spinner size="sm" animation="border" /> : "Salvar Anotação"}
              </BootstrapButton>
            </div>

          </Card.Body>
        </Card>
      </Container>

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

    </div>
  );
};