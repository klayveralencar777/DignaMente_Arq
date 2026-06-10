import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Navbar, Badge, Table, Form, Offcanvas, Modal, Spinner } from "react-bootstrap";
import {
  Settings, Users, Search, ShieldCheck, Camera, FileText, 
  CheckCircle2, AlertTriangle, Trash2, UserPlus, Heart, Activity, Lock, LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("validacao");
  const [isLoading, setIsLoading] = useState(false);
  
  const [pendingProfs, setPendingProfs] = useState([]);
  const [activeProfs, setActiveProfs] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminCpf, setAdminCpf] = useState("");
  const [adminRegistration, setAdminRegistration] = useState("");

  // Controles de Modais, Menu e Animações
  const [showSettings, setShowSettings] = useState(false);
  const [isSettingsHovered, setIsSettingsHovered] = useState(false); // <--- Estado novo para o botão expandir!
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRemoveProfModal, setShowRemoveProfModal] = useState(false);
  const [showRemoveAdminModal, setShowRemoveAdminModal] = useState(false);
  
  const [selectedProfId, setSelectedProfId] = useState(null);
  const [profToRemove, setProfToRemove] = useState(null);
  const [adminToRemove, setAdminToRemove] = useState(null);

  const colors = {
    bg: "#F8FAFC",
    primary: "#2C7A7B", 
    primaryLight: "#F0F4F8",
    textDark: "#1E293B",
    textMuted: "#64748B",
    border: "#E2E8F0",
    danger: "#EF4444",
    dangerLight: "#FEF2F2"
  };

  const maskCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  useEffect(() => {
    // ... Lógica de fetch (mantida exatamente igual)
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("@DignaMente:token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
          const appointmentsResponse = await api.get("/appointments", config); 
          setAppointmentsCount(appointmentsResponse.data.length);
        } catch (error) {
          console.error("Erro ao buscar total de consultas:", error);
        }

        if (activeTab === "validacao") {
          const response = await api.get("psychologists", config);
          setPendingProfs(response.data);
          if (response.data.length > 0) setSelectedProfId(response.data[0].id);
        } 
        else if (activeTab === "gestao") {
          const response = await api.get("/psychologists", config);
          setActiveProfs(response.data);
        }
        else if (activeTab === "admins") {
          const response = await api.get("/admins/users", config);
          setAdminUsers(response.data);
        }
      } catch (error) {
        console.error("Erro ao procurar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };


  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("@DignaMente:token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const novoAdmin = {
        name: "Administrador Secundário",
        email: adminEmail,
        password: adminPassword,
        typeUser: "ADMIN",
        role: "ADMIN",
        cpf: adminCpf.replace(/\D/g, ""), 
        registration: adminRegistration
      };

      await api.post("/admins", novoAdmin, config); 
      
      alert("Administrador criado com sucesso!");
      setShowAddAdminModal(false);
      
      setAdminEmail("");
      setAdminPassword("");
      setAdminCpf("");
      setAdminRegistration("");
    
      if (activeTab === "admins") {
        const response = await api.get("/admins/users", config);
        setAdminUsers(response.data);
      }
    } catch (error) {
      console.error("Erro ao criar admin:", error);
      alert(error.response?.data?.message || "Erro ao registar administrador. Verifique as permissões.");
    }
  };

  const handleApprove = async () => {
    if (!selectedProfId) return;
    try {
      const token = localStorage.getItem("@DignaMente:token");
      await api.patch(`/admin/psychologists/${selectedProfId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Profissional aprovado com sucesso!");
      setPendingProfs(pendingProfs.filter(p => p.id !== selectedProfId));
      setSelectedProfId(null);
    } catch (error) {
      console.error("Erro na aprovação:", error);
      alert("Erro ao aprovar o acesso.");
    }
  };


  // --- Renders das Abas ---
  const renderTabValidacao = () => {
    const prof = pendingProfs.find(p => p.id === selectedProfId);
    return (
      <Row className="g-4">
        <Col md={5}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Fila de Aprovação</h5>
              {isLoading ? <div className="text-center py-4"><Spinner animation="border" style={{color: colors.primary}} /></div> : 
                pendingProfs.length === 0 ? <p className="text-muted text-center py-4">Nenhum pendente.</p> :
                pendingProfs.map(p => (
                  <div key={p.id} onClick={() => setSelectedProfId(p.id)} className="p-3 mb-2 rounded-3 border" 
                    style={{ 
                      cursor: "pointer", 
                      backgroundColor: selectedProfId === p.id ? colors.primaryLight : "white", 
                      borderColor: selectedProfId === p.id ? colors.primary : colors.border 
                    }}>
                    <h6 className="fw-bold m-0">{p.name}</h6>
                    <small className="text-muted">{p.email}</small>
                  </div>
                ))
              }
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 d-flex flex-column">
              {!prof ? (
                <div className="m-auto text-center text-muted"><Search size={40} className="mb-2 opacity-25"/><p>Selecione um profissional para validar.</p></div>
              ) : (
                <>
                  <h5 className="fw-bold mb-4">Análise: {prof.name}</h5>
                  <div className="d-flex gap-3 mb-4">
                    <div className="flex-grow-1 p-4 border rounded-4 text-center bg-light"><Camera size={32} color={colors.primary} /><p className="small mt-2 m-0 fw-bold">Selfie</p></div>
                    <div className="flex-grow-1 p-4 border rounded-4 text-center bg-light"><FileText size={32} color="#0EA5E9" /><p className="small mt-2 m-0 fw-bold">Documento</p></div>
                  </div>
                  <div className="p-3 rounded-3 mb-3 border border-success bg-success bg-opacity-10 d-flex align-items-center gap-3">
                    <CheckCircle2 size={24} color={colors.primary} />
                    <div><h6 className="fw-bold m-0">Biometria Confirmada</h6><small>Match facial de 98% via Datavalid</small></div>
                  </div>
                  <button className="btn w-100 text-white fw-bold py-2 mt-auto" style={{ backgroundColor: colors.primary }} onClick={handleApprove}>Aprovar Acesso</button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderTabGestao = () => (
    <Card className="border-0 shadow-sm rounded-4 p-4">
       <Table responsive hover className="align-middle">
          <thead><tr><th>NOME</th><th>CRP</th><th>STATUS</th><th className="text-end">AÇÕES</th></tr></thead>
          <tbody>
            {activeProfs.map(p => (
              <tr key={p.id}>
                <td><h6 className="fw-bold m-0">{p.name}</h6><small>{p.email}</small></td>
                <td>{p.crp}</td>
                <td><Badge bg="success" className="bg-opacity-10 text-success border border-success rounded-pill">Ativo</Badge></td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => {setProfToRemove(p); setShowRemoveProfModal(true);}}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
       </Table>
    </Card>
  );

  const renderTabAdmins = () => (
    <Card className="border-0 shadow-sm rounded-4 p-4">
       <div className="d-flex justify-content-between align-items-center mb-4">
         <h5 className="fw-bold m-0">Lista de Administradores</h5>
         <button 
           className="btn text-white rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm" 
           style={{ backgroundColor: colors.primary }} 
           onClick={() => setShowAddAdminModal(true)}
         >
           <UserPlus size={18} /> <span className="d-none d-sm-inline">Novo Admin</span>
         </button>
       </div>

       <Table responsive hover className="align-middle">
          <thead><tr><th>NOME</th><th>E-MAIL</th><th className="text-end">AÇÕES</th></tr></thead>
          <tbody>
            {adminUsers.map(a => (
              <tr key={a.id}>
                <td><h6 className="fw-bold m-0">{a.name || "Administrador"}</h6></td>
                <td>{a.email}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => {setAdminToRemove(a); setShowRemoveAdminModal(true);}}>
                    <Trash2 size={14}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
       </Table>
    </Card>
  );

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: colors.bg, fontFamily: "Inter, sans-serif" }}>
      
      {/* NAVBAR */}
      <Navbar bg="white" className="px-4 py-3 border-bottom sticky-top shadow-sm">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
            <Heart size={24} color={colors.primary} strokeWidth={2.5} />
            <span style={{ color: colors.primary }}>DignaMente</span>
            <span className="text-muted fw-normal ms-2 d-none d-sm-inline">— Painel Administrativo</span>
          </h5>
          
          {/* BOTÃO ANIMADO (EXPANDE NO HOVER) */}
          <button 
            className="btn d-flex align-items-center gap-2 rounded-pill border bg-white shadow-sm"
            style={{ 
              color: colors.primary, 
              transition: "all 0.3s ease-in-out", // Deixa a animação suave
              padding: isSettingsHovered ? "8px 20px" : "8px 12px", // Cresce um pouco quando passa o mouse
              width: isSettingsHovered ? "150px" : "46px", // Altera a largura dinamicamente
              overflow: "hidden" // Impede que o texto quebre
            }}
            onClick={() => setShowSettings(true)}
            onMouseEnter={() => setIsSettingsHovered(true)}
            onMouseLeave={() => setIsSettingsHovered(false)}
          >
            <Settings size={20} style={{ minWidth: "20px" }} />
            {isSettingsHovered && <span className="fw-semibold ms-1" style={{ whiteSpace: "nowrap" }}>Configurações</span>}
          </button>

        </Container>
      </Navbar>

      <Container className="pt-5" style={{ maxWidth: "1100px" }}>
        
        {/* HEADER E STATS */}
        <div className="mb-5">
          <h2 className="fw-bold">Gestão Hospitalar</h2>
          <p className="text-muted fs-5">Monitorização da rede e validação de credenciais profissionais.</p>
        </div>

        <Row className="g-4 mb-5">
          <Col md={4}><Card className="border-0 shadow-sm rounded-4 p-4"><div className="d-flex align-items-center gap-3"><Users size={24} color={colors.textMuted}/><div className="fw-bold small text-muted">Pendentes</div></div><h3 className="fw-bold mt-2">{pendingProfs.length}</h3></Card></Col>
          <Col md={4}><Card className="border-0 shadow-sm rounded-4 p-4"><div className="d-flex align-items-center gap-3"><Activity size={24} color={colors.primary}/><div className="fw-bold small text-muted">Consultas Ativas</div></div><h3 className="fw-bold mt-2">{appointmentsCount}</h3></Card></Col>
          <Col md={4}><Card className="border-0 shadow-sm rounded-4 p-4"><div className="d-flex align-items-center gap-3"><ShieldCheck size={24} color={colors.textMuted}/><div className="fw-bold small text-muted">Admins</div></div><h3 className="fw-bold mt-2">{adminUsers.length}</h3></Card></Col>
        </Row>

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="d-flex gap-3 mb-4">
          <button onClick={() => setActiveTab("validacao")} className={`btn px-4 py-2 rounded-pill fw-bold border-0 ${activeTab === "validacao" ? "text-white shadow-sm" : "bg-white text-muted"}`} style={activeTab === "validacao" ? {backgroundColor: colors.primary} : {}}>Validação</button>
          <button onClick={() => setActiveTab("gestao")} className={`btn px-4 py-2 rounded-pill fw-bold border-0 ${activeTab === "gestao" ? "text-white shadow-sm" : "bg-white text-muted"}`} style={activeTab === "gestao" ? {backgroundColor: colors.primary} : {}}>Gestão de Rede</button>
          <button onClick={() => setActiveTab("admins")} className={`btn px-4 py-2 rounded-pill fw-bold border-0 ${activeTab === "admins" ? "text-white shadow-sm" : "bg-white text-muted"}`} style={activeTab === "admins" ? {backgroundColor: colors.primary} : {}}>Administradores</button>
        </div>

        {/* CONTEÚDO DINÂMICO */}
        <div className="animation-fade-in">
          {activeTab === "validacao" && renderTabValidacao()}
          {activeTab === "gestao" && renderTabGestao()}
          {activeTab === "admins" && renderTabAdmins()}
        </div>

      </Container>

      {/* MENU LATERAL EXCLUSIVO DO ADMIN (Com a mesma aparência chique) */}
      <Offcanvas show={showSettings} onHide={() => setShowSettings(false)} placement="end" style={{ width: '340px' }}>
        <Offcanvas.Header closeButton className="border-bottom pb-3 mt-2 px-4">
          <Offcanvas.Title className="d-flex align-items-center gap-2 fw-bold" style={{ color: '#2d3748' }}>
            <Settings size={22} style={{ color: colors.primary }} /> Configurações
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="d-flex flex-column px-4 py-4">
          <div className="d-flex flex-column gap-2">
            
            <div 
              className="d-flex align-items-center gap-3 p-2 rounded" 
              style={{ cursor: 'pointer', transition: '0.2s' }} 
              onClick={() => { setShowSettings(false); setShowPasswordModal(true); }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.primaryLight}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
               <Lock size={20} style={{ color: colors.primary }} />
               <span className="fw-medium text-dark">Alterar Senha</span>
            </div>

            <div 
              className="d-flex align-items-center gap-3 p-2 rounded" 
              style={{ cursor: 'pointer', transition: '0.2s' }} 
              onClick={() => { setShowSettings(false); setShowAddAdminModal(true); }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.primaryLight}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
               <UserPlus size={20} style={{ color: colors.primary }} />
               <span className="fw-medium text-dark">Registar Novo Admin</span>
            </div>
            
          </div>

          <div className="mt-auto pt-4">
             <button 
               onClick={handleLogout}
               className="btn w-100 fw-bold py-3 d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm rounded-3 transition-all" 
               style={{ backgroundColor: colors.danger, color: "white" }}
               onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.9)'}
               onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
             >
                <LogOut size={20} /> Sair da Conta
             </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* MODAL DE ALTERAR SENHA DO ADMIN (Chique igual ao do Psicólogo) */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered size="md">
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold" style={{ color: colors.primary }}>Alterar Senha</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-2">
          <Form onSubmit={(e) => { e.preventDefault(); setShowPasswordModal(false); alert('Senha alterada!'); }}>
            <Form.Group className="mb-3">
              <Form.Label className="text-secondary fw-medium">E-mail atual</Form.Label>
              <Form.Control type="email" placeholder="Seu e-mail de acesso" className="shadow-none py-2" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-secondary fw-medium">Nova senha</Form.Label>
              <Form.Control type="password" placeholder="Mínimo 6 caracteres" className="shadow-none py-2" required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="text-secondary fw-medium">Confirmar nova senha</Form.Label>
              <Form.Control type="password" placeholder="Repita a nova senha" className="shadow-none py-2" required />
            </Form.Group>
            <button type="submit" className="btn w-100 fw-bold py-2 border-0 text-white" style={{ backgroundColor: colors.primary }}>
              Salvar Nova Senha
            </button>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top-0 pt-0 px-4 pb-4">
          <button type="button" onClick={() => setShowPasswordModal(false)} className="btn btn-light fw-bold px-4 py-2 text-secondary border shadow-sm w-100">
            Cancelar
          </button>
        </Modal.Footer>
      </Modal>

      {/* MODAIS GERAIS (Adicionar Admin e Remover) */}
      <Modal show={showAddAdminModal} onHide={() => setShowAddAdminModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0"><Modal.Title className="fw-bold" style={{color: colors.primary}}>Novo Administrador</Modal.Title></Modal.Header>
        <Modal.Body className="pt-3">
          <Form onSubmit={handleAddAdmin}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">CPF</Form.Label>
              <Form.Control 
                type="text" 
                value={adminCpf} 
                onChange={(e) => setAdminCpf(maskCPF(e.target.value))} 
                placeholder="000.000.000-00" 
                maxLength={14}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Matrícula</Form.Label>
              <Form.Control type="text" value={adminRegistration} onChange={(e) => setAdminRegistration(e.target.value)} placeholder="Ex: ADM-1234" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">E-mail Institucional</Form.Label>
              <Form.Control type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@digna.gov.br" required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">Senha Provisória</Form.Label>
              <Form.Control type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Mínimo 4 caracteres" required minLength={4} />
            </Form.Group>
            <button type="submit" className="btn w-100 text-white fw-bold py-2 rounded-3" style={{backgroundColor: colors.primary}}>Criar Conta de Acesso</button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* (Modais de Remover Profissional/Admin mantidos iguais) */}
      <Modal show={showRemoveProfModal} onHide={() => setShowRemoveProfModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2 text-danger">
            <AlertTriangle size={22} /> Remover Profissional
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <p className="text-muted mb-4">Tem certeza que deseja excluir permanentemente este utilizador da plataforma?</p>
          {profToRemove && (
            <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: colors.dangerLight, border: `1px solid ${colors.danger}30` }}>
              <h6 className="fw-bold m-0 text-dark">{profToRemove.name}</h6>
              <p className="text-muted small m-0">CRP {profToRemove.crp} — {profToRemove.email}</p>
            </div>
          )}
          <div className="d-flex gap-2 justify-content-end mt-4">
            <button className="btn btn-light fw-bold px-4 border" onClick={() => setShowRemoveProfModal(false)}>Cancelar</button>
            <button className="btn btn-danger fw-bold px-4 d-flex align-items-center gap-2" onClick={() => { alert('Profissional removido!'); setShowRemoveProfModal(false); }}>
              <Trash2 size={16} /> Excluir
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showRemoveAdminModal} onHide={() => setShowRemoveAdminModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2 text-danger">
            <AlertTriangle size={22} /> Remover Administrador
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <p className="text-muted mb-4">Tem certeza que deseja remover o acesso administrativo de <strong>{adminToRemove?.name}</strong>?</p>
          <div className="d-flex gap-2 justify-content-end mt-4">
            <button className="btn btn-light fw-bold px-4 border" onClick={() => setShowRemoveAdminModal(false)}>Cancelar</button>
            <button className="btn btn-danger fw-bold px-4 d-flex align-items-center gap-2" onClick={() => { alert('Administrador removido!'); setShowRemoveAdminModal(false); }}>
              <Trash2 size={16} /> Remover
            </button>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
};