import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Button as BootstrapButton, Spinner, Badge, Alert } from 'react-bootstrap';
import { Heart, User, MapPin, Phone, FileText, PlusCircle, ArrowLeft, Clock, ClipboardList, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// --- IMPORTANDO A NOSSA API REAL ---
import { api } from '../../../services/api';

export const PatientChart = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID do agendamento vindo da URL

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const primaryTeal = '#2C7A7B';
  const lightBackground = '#F0F4F8';

  // Estados vazios aguardando o Back-end
  const [psychologistName, setPsychologistName] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchRealChartData = async () => {
      try {
        setIsLoading(true);

        // 1. Pega o nome do psicólogo logado (pode vir do localStorage ou de uma rota de perfil)
        const storedName = localStorage.getItem('@DignaMente:userName') || 'Psicólogo(a)';
        setPsychologistName(storedName);

        // 2. Busca os dados do Agendamento para descobrir quem é o paciente
        const aptResponse = await api.get(`/appointments/${id}`);
        const appointment = aptResponse.data;
        
        // Extrai os dados do paciente (ajuste os nomes conforme o DTO do Java)
        const patient = appointment.patient || {};
        
        setPatientData({
          id: patient.id || 'N/A',
          name: patient.name || appointment.patientName || 'Paciente não identificado',
          email: patient.email || 'E-mail não informado',
          phone: patient.phone || 'Telefone não informado',
          details: {
            cartaoSus: patient.cardSus || 'Não informado',
            nascimento: patient.birthDate || 'Não informada',
            genero: patient.gender || 'Não informado',
            endereco: patient.address || 'Endereço não cadastrado',
            contatoEmergencia: patient.emergencyContact || 'Não cadastrado'
          }
        });

        // 3. Busca o histórico de prontuários do back-end
        // OBS: Usando a rota /medical-records/me que vimos no seu controller
        const recordsResponse = await api.get('/medical-records/me');
        const allRecords = recordsResponse.data;

        // Filtra para mostrar apenas os prontuários DESTE paciente (se o back-end já não fizer isso)
        // Se o DTO de medical-record tiver o patientId, usamos ele. 
        const patientRecords = allRecords.filter(record => 
          record.patientId === patient.id || record.patient?.id === patient.id
        );

        // Ordena do mais recente para o mais antigo (opcional, dependendo de como o Java retorna)
        const sortedRecords = patientRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setHistory(sortedRecords);

      } catch (error) {
        console.error("Erro ao carregar o prontuário:", error);
        setErrorMsg("Não foi possível carregar os dados do paciente. Verifique sua conexão com o servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealChartData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: lightBackground }}>
        <Spinner animation="border" style={{ color: primaryTeal, width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted fw-medium">Sincronizando prontuário no servidor...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: lightBackground }}>
        <Alert variant="danger">{errorMsg}</Alert>
        <BootstrapButton onClick={() => navigate('/psicologo')} variant="outline-secondary" className="mt-3">
          Voltar ao Painel
        </BootstrapButton>
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
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline" style={{ fontSize: '1.1rem'}}> — Prontuário Clínico</span>
            </h4>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Badge bg="light" className="text-secondary fw-medium px-3 py-2 rounded-pill">
              {psychologistName}
            </Badge>
          </div>
        </Container>
      </Navbar>

      <div style={{ height: '90px' }}></div>

      <Container className="pt-3 px-md-4" style={{ maxWidth: '1200px' }}>
        
        {/* --- Cabeçalho --- */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-4 gap-3">
          <div>
            <h1 className="fw-bold m-0" style={{ fontSize: '2rem', color: '#2d3748' }}>Prontuário do Paciente</h1>
            <p className="m-0 mt-1 fs-5 fw-medium text-secondary">{patientData?.name}</p>
          </div>
          
          <div className="d-flex gap-2">
            <BootstrapButton 
              variant="outline-secondary"
              onClick={() => navigate('/psicologo')}
              className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 fw-bold border rounded-3 bg-white"
            >
              <ArrowLeft size={18} /> Voltar
            </BootstrapButton>
            <BootstrapButton 
              onClick={() => navigate(`/psicologo/prontuario/${id}/nova-anotacao`)}
              className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 fw-bold border-0 rounded-3 shadow-sm text-white"
              style={{ backgroundColor: primaryTeal }}
            >
              <PlusCircle size={18} /> Nova Anotação
            </BootstrapButton>
          </div>
        </div>

        <Row className="g-4">
          
          {/* --- COLUNA ESQUERDA: DADOS REAIS DO PACIENTE --- */}
          <Col lg={4}>
            <Card className="border-0 rounded-4 shadow-sm bg-white p-4">
              <Card.Body className="p-0">
                
                <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-4">
                  <div className="rounded-circle d-flex align-items-center justify-content-center bg-light border text-teal flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                    <User size={40} className="text-secondary" />
                  </div>
                  <div>
                    <h5 className="fw-bold m-0 text-dark">{patientData?.name}</h5>
                    <p className="small text-muted m-0">{patientData?.email}</p>
                    <p className="small text-muted m-0">{patientData?.phone}</p>
                  </div>
                </div>

                <h6 className="fw-bold text-teal mb-3">Dados Pessoais</h6>
                
                <div className="d-flex flex-column gap-3 fs-7">
                  <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-light">
                    <span className="text-muted fw-medium">Cartão SUS</span>
                    <span className="fw-bold text-dark">{patientData?.details?.cartaoSus}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-light">
                    <span className="text-muted fw-medium">Data de Nascimento</span>
                    <span className="fw-bold text-dark">{patientData?.details?.nascimento}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-light">
                    <span className="text-muted fw-medium">Gênero</span>
                    <span className="fw-bold text-dark">{patientData?.details?.genero}</span>
                  </div>
                  
                  <div className="mt-2">
                    <p className="small fw-bold text-secondary mb-1"><MapPin size={14} /> Endereço Residencial</p>
                    <p className="m-0 text-muted small p-2 rounded-2 border bg-white">{patientData?.details?.endereco}</p>
                  </div>
                  <div className="mt-2">
                    <p className="small fw-bold text-secondary mb-1"><Phone size={14} /> Contato de Emergência</p>
                    <p className="m-0 text-muted small p-2 rounded-2 border bg-white">{patientData?.details?.contatoEmergencia}</p>
                  </div>
                </div>

              </Card.Body>
            </Card>
          </Col>

          {/* --- COLUNA DIREITA: HISTÓRICO REAL DA API --- */}
          <Col lg={8}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0" style={{ color: '#4a5568' }}>Histórico de Atendimentos</h5>
            </div>
            
            {history.length === 0 ? (
              <div className="text-center p-5 rounded-4 border bg-white">
                <ClipboardList size={40} className="text-muted mb-3 opacity-50" />
                <h6 className="fw-bold text-secondary">Nenhum registro encontrado</h6>
                <p className="text-muted small m-0">Este paciente ainda não possui anotações de prontuário.</p>
              </div>
            ) : (
              <div className="position-relative ps-4" style={{ borderLeft: '3px solid #e2e8f0' }}>
                
                {history.map((record, index) => {
                  const isLatest = index === 0; // O primeiro da lista ganha destaque
                  const activeColor = isLatest ? primaryTeal : '#718096';
                  
                  // Formatação de data simples caso o Java mande um ISO String (ex: 2026-06-10T14:30:00)
                  const recordDate = record.createdAt ? new Date(record.createdAt).toLocaleDateString('pt-BR') : 'Data não informada';
                  const recordTime = record.createdAt ? new Date(record.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

                  return (
                    <div key={record.id || index} className="position-relative mb-5">
                      
                      <div 
                        className="position-absolute rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                        style={{ width: '32px', height: '32px', left: '-52px', top: '10px', backgroundColor: activeColor, border: '4px solid #fff' }}
                      >
                        {isLatest ? <CheckCircle size={16} className="text-white" /> : <Clock size={16} className="text-white" />}
                      </div>

                      <Card className="border-0 rounded-4 shadow-sm bg-white">
                        <Card.Header className="bg-white border-0 p-4 pb-1 d-flex flex-column flex-md-row justify-content-between gap-2">
                          <div>
                            <Badge style={{ backgroundColor: isLatest ? activeColor : '#EDF2F7', color: isLatest ? '#fff' : '#4a5568' }} className="px-3 py-2 rounded-pill fw-bold text-uppercase fs-8 mb-2">
                              {record.type || 'Atendimento Clínico'}
                            </Badge>
                            <p className="text-muted small m-0 fw-medium d-flex align-items-center gap-1">
                              <Clock size={14} /> {recordDate} {recordTime && `às ${recordTime}`}
                            </p>
                          </div>
                        </Card.Header>
                        
                        <Card.Body className="p-4 pt-3">
                          <Row className="g-3">
                            
                            {record.diagnosis && (
                              <Col xs={12}>
                                <div className="bg-light p-3 rounded-3 mb-2 border border-light">
                                  <p className="small fw-bold text-teal mb-1">Diagnóstico / Análise</p>
                                  <p className="fw-semibold m-0 text-dark" style={{ fontSize: '0.95rem' }}>
                                    {record.diagnosis}
                                  </p>
                                </div>
                              </Col>
                            )}
                            
                            {record.mainComplaint && (
                              <Col xs={12}>
                                <div className="p-3 rounded-3 mb-2 bg-white border">
                                  <p className="small fw-bold text-secondary mb-1">Queixa Principal</p>
                                  <p className="m-0 text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    {record.mainComplaint}
                                  </p>
                                </div>
                              </Col>
                            )}

                            <Col xs={12}>
                              <p className="small fw-bold text-secondary mb-1">Anotações da Sessão</p>
                              <p className="m-0 text-dark" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                {record.notes || record.description || 'Nenhuma anotação detalhada registrada nesta sessão.'}
                              </p>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};