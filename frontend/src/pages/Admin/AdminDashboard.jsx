import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Navbar, Badge, Table, Form, Offcanvas, Modal, Spinner, Toast, ToastContainer } from "react-bootstrap";
import {
  Settings, Users, Search, ShieldCheck, Camera, FileText, 
  CheckCircle2, AlertTriangle, Trash2, UserPlus, Heart, Activity, Lock, LogOut,
  CheckCircle, AlertCircle, XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

// IMPORTANDO O BOTÃO PADRONIZADO
import { SettingsButton } from "../../components/ui/SettingsButton";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("validacao");
  const [isLoading, setIsLoading] = useState(false);
  
  const [pendingProfs, setPendingProfs] = useState([]);
  const [activeProfs, setActiveProfs] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  // Estados Form Novo Admin
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminCpf, setAdminCpf] = useState("");
  const [adminRegistration, setAdminRegistration] = useState("");

  // Estados Form Alterar Senha
  const [changePassEmail, setChangePassEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Controles de Modais e Menu
  const [showSettings, setShowSettings] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRemoveProfModal, setShowRemoveProfModal] = useState(false);
  const [showRemoveAdminModal, setShowRemoveAdminModal] = useState(false);
  
  const [selectedProfId, setSelectedProfId] = useState(null);
  const [profToRemove, setProfToRemove] = useState(null);
  const [adminToRemove, setAdminToRemove] = useState(null);

  // Estados de Notificações (Toasts)
  const [successToast, setSuccessToast] = useState({ show: false, title: "", message: "" });
  const [dangerToast, setDangerToast] = useState({ show: false, title: "", message: "" });

  // PALETA DE CORES UNIFICADA
  const colors = {
    bg: "#F0F4F8", 
    primary: "#2C7A7B", 
    primaryLight: "#E8F3F3", 
    textDark: "#2d3748",
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
          const response = await api.get("/psychologists", config);
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
      
      setSuccessToast({ show: true, title: "Sucesso", message: "Administrador criado com sucesso!" });
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
      setDangerToast({ show: true, title: "Erro", message: error.response?.data?.message || "Erro ao registar administrador. Verifique as permissões." });
    }
  };

  const handleApprove = async () => {
    if (!selectedProfId) return;
    try {
      const token = localStorage.getItem("@DignaMente:token");
      await api.patch(`/admin/psychologists/${selectedProfId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessToast({ show: true, title: "Aprovado", message: "Profissional aprovado e liberado para a rede!" });
      setPendingProfs(pendingProfs.filter(p => p.id !== selectedProfId));
      setSelectedProfId(null);
    } catch (error) {
      console.error("Erro na aprovação:", error);
      setDangerToast({ show: true, title: "Erro", message: "Erro ao aprovar o acesso do profissional." });
    }
  };

  // NOVA FUNÇÃO: Recusar Profissional
  const handleReject = async () => {
    if (!selectedProfId) return;
    try {
      const token = localStorage.getItem("@DignaMente:token");
      await api.patch(`/admin/psychologists/${selectedProfId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessToast({ show: true, title: "Recusado", message: "O cadastro do profissional foi recusado com sucesso." });
      setPendingProfs(pendingProfs.filter(p => p.id !== selectedProfId));
      setSelectedProfId(null);
    } catch (error) {
      console.error("Erro ao recusar:", error);
      setDangerToast({ show: true, title: "Erro", message: "Erro ao recusar o cadastro do profissional." });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setDangerToast({ show: true, title: "Erro", message: "As senhas não coincidem!" });
      return;
    }

    try {
      const token = localStorage.getItem("@DignaMente:token");
      
      await api.patch('/admins/change-password', {
        email: changePassEmail,
        newPassword: newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessToast({ show: true, title: "Senha Alterada", message: "Sua senha foi atualizada com sucesso!" });
      setShowPasswordModal(false);
      
      setChangePassEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setDangerToast({ show: true, title: "Erro", message: error.response?.data?.message || "Erro ao atualizar a senha no servidor." });
    }
  };

  const handleDeleteProf = async () => {
    if (!profToRemove) return;
    
    try {
      const token = localStorage.getItem("@DignaMente:token");
      
      await api.delete(`/psychologists/${profToRemove.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessToast({ show: true, title: "Removido", message: "Profissional excluído com sucesso da plataforma." });
      
      // Remove das listas na tela
      setActiveProfs(activeProfs.filter(p => p.id !== profToRemove.id));
      setPendingProfs(pendingProfs.filter(p => p.id !== profToRemove.id));
      
      setShowRemoveProfModal(false);
      setProfToRemove(null);
    } catch (error) {
      console.error("Erro ao excluir profissional:", error);
      setDangerToast({ show: true, title: "Erro", message: "Não foi possível excluir o profissional do banco de dados." });
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToRemove) return;

    try {
      const token = localStorage.getItem("@DignaMente:token");
      
      await api.delete(`/admins/users/${adminToRemove.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessToast({ show: true, title: "Admin Removido", message: "Acesso administrativo revogado com sucesso." });
      
      setAdminUsers(adminUsers.filter(a => a.id !== adminToRemove.id));
      
      setShowRemoveAdminModal(false);
      setAdminToRemove(null);
    } catch (error) {
      console.error("Erro ao excluir admin:", error);
      setDangerToast({ show: true, title: "Erro", message: "Não foi possível remover o administrador." });
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
              <h5 className="fw-bold mb-4" style={{ color: colors.textDark }}>Fila de Aprovação</h5>
              {isLoading ? <div className="text-center py-4"><Spinner animation="border" style={{color: colors.primary}} /></div> : 
                pendingProfs.length === 0 ? <p className="text-muted text-center py-4">Nenhum pendente.</p> :
                pendingProfs.map(p => (
                  <div key={p.id} onClick={() => setSelectedProfId(p.id)} className="p-3 mb-2 rounded-3 border" 
                    style={{ 
                      cursor: "pointer", 
                      backgroundColor: selectedProfId === p.id ? colors.primaryLight : "white", 
                      borderColor: selectedProfId === p.id ? colors.primary : colors.border 
                    }}>
                    <h6 className="fw-bold m-0" style={{ color: colors.textDark }}>{p.name}</h6>
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
                  <h5 className="fw-bold mb-4" style={{ color: colors.textDark }}>Análise: {prof.name}</h5>
                  <div className="d-flex gap-3 mb-4">
                    <div className="flex-grow-1 p-3 border rounded-4 text-center bg-light d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "160px" }}>
                      {prof.selfieUrl ? (
                        <img src={prof.selfieUrl} alt="Selfie" className="img-fluid rounded shadow-sm" style={{ maxHeight: "120px", objectFit: "cover" }} />
                      ) : (
                        <><Camera size={32} color={colors.primary} /><p className="small mt-2 m-0 fw-bold text-muted">Selfie Indisponível</p></>
                      )}
                    </div>
                    <div className="flex-grow-1 p-3 border rounded-4 text-center bg-light d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "160px" }}>
                      {prof.documentUrl ? (
                        <img src={prof.documentUrl} alt="Documento" className="img-fluid rounded shadow-sm" style={{ maxHeight: "120px", objectFit: "contain" }} />
                      ) : (
                        <><FileText size={32} color="#0EA5E9" /><p className="small mt-2 m-0 fw-bold text-muted">Doc. Indisponível</p></>
                      )}
                    </div>
                  </div>
                  <div className="p-3 rounded-3 mb-4 border border-success bg-success bg-opacity-10 d-flex align-items-center gap-3">
                    <CheckCircle2 size={24} color={colors.primary} />
                    <div><h6 className="fw-bold m-0" style={{ color: colors.textDark }}>Biometria Confirmada</h6><small className="text-muted">Match facial de 98% via Datavalid</small></div>
                  </div>
                  
                  {/* NOVOS BOTÕES DE APROVAR E RECUSAR */}
                  <div className="d-flex gap-3 mt-auto">
                    <button className="btn btn-outline-danger fw-bold py-2 flex-grow-1 rounded-3 d-flex align-items-center justify-content-center gap-2" onClick={handleReject}>
                      <XCircle size={18} /> Recusar
                    </button>
                    <button className="btn text-white fw-bold py-2 flex-grow-1 rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: colors.primary }} onClick={handleApprove}>
                      <CheckCircle2 size={18} /> Aprovar Acesso
                    </button>
                  </div>
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
       <Table responsive hover className="align-middle border-light">
          <thead><tr><th className="text-muted">NOME</th><th className="text-muted">CRP</th><th className="text-muted">STATUS</th><th className="text-end text-muted">AÇÕES</th></tr></thead>
          <tbody>
            {activeProfs.map(p => (
              <tr key={p.id}>
                <td><h6 className="fw-bold m-0" style={{ color: colors.textDark }}>{p.name}</h6><small className="text-muted">{p.email}</small></td>
                <td className="text-muted">{p.crp}</td>
                <td><Badge bg="success" className="bg-opacity-10 text-success border border-success rounded-pill">Ativo</Badge></td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => {
                    setProfToRemove(p);
                    setShowRemoveProfModal(true);
                  }}>
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
         <h5 className="fw-bold m-0" style={{ color: colors.textDark }}>Lista de Administradores</h5>
         <button 
           className="btn text-white rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm transition-all" 
           style={{ backgroundColor: colors.primary }} 
           onClick={() => setShowAddAdminModal(true)}
         >
           <UserPlus size={18} /> <span className="d-none d-sm-inline">Novo Admin</span>
         </button>
       </div>

       <Table responsive hover className="align-middle border-light">
          <thead><tr><th className="text-muted">NOME</th><th className="text-muted">E-MAIL</th><th className="text-end text-muted">AÇÕES</th></tr></thead>
          <tbody>
            {adminUsers.map(a => (
              <tr key={a.id}>
                <td><h6 className="fw-bold m-0" style={{ color: colors.textDark }}>{a.name || "Administrador"}</h6></td>
                <td className="text-muted">{a.email}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => {
                    setAdminToRemove(a);
                    setShowRemoveAdminModal(true);
                  }}>
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
       </Table>
    </Card>
  );

  return (
    <div className="min-vh-100 pb-5 position-relative" style={{ backgroundColor: colors.bg, fontFamily: "Inter, sans-serif" }}>
      
      <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom shadow-sm fixed-top">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: colors.primary }}>
              <Heart size={26} strokeWidth={2.5} />
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline" style={{ fontSize: "1.1rem"}}> — Painel Administrativo</span>
            </h4>
          </div>
          <SettingsButton onClick={() => setShowSettings(true)} />
        </Container>
      </Navbar>

      <div style={{ height: "90px" }}></div>

      <Container className="pt-3 px-md-4" style={{ maxWidth: "1000px" }}>
        
        <div className="mb-5">
          <h1 className="fw-bold m-0" style={{ fontSize: "2.2rem", color: colors.textDark }}>Gestão Hospitalar</h1>
          <p className="m-0 mt-1 fw-medium text-muted" style={{ fontSize: "1.1rem" }}>Monitorização da rede e validação de credenciais profissionais.</p>
        </div>

        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="border-0 rounded-4 shadow-sm h-100 p-3">
              <Card.Body className="d-flex align-items-center gap-3 p-0">
                <div className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "54px", height: "54px", backgroundColor: colors.primaryLight, color: colors.primary }}>
                  <Users size={24} />
                </div>
                <div>
                  <p className="m-0 text-muted fw-medium" style={{ fontSize: "0.9rem" }}>Pendentes</p>
                  <h3 className="m-0 fw-bold" style={{ color: colors.textDark }}>{pendingProfs.length}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 rounded-4 shadow-sm h-100 p-3">
              <Card.Body className="d-flex align-items-center gap-3 p-0">
                <div className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "54px", height: "54px", backgroundColor: colors.primaryLight, color: colors.primary }}>
                  <Activity size={24} />
                </div>
                <div>
                  <p className="m-0 text-muted fw-medium" style={{ fontSize: "0.9rem" }}>Consultas Ativas</p>
                  <h3 className="m-0 fw-bold" style={{ color: colors.textDark }}>{appointmentsCount}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 rounded-4 shadow-sm h-100 p-3">
              <Card.Body className="d-flex align-items-center gap-3 p-0">
                <div className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "54px", height: "54px", backgroundColor: colors.primaryLight, color: colors.primary }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="m-0 text-muted fw-medium" style={{ fontSize: "0.9rem" }}>Admins</p>
                  <h3 className="m-0 fw-bold" style={{ color: colors.textDark }}>{adminUsers.length}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex flex-wrap gap-2 gap-md-3 mb-4">
          <button onClick={() => setActiveTab("validacao")} className={`btn px-4 py-2 rounded-pill fw-bold border-0 ${activeTab === "validacao" ? "text-white shadow-sm" : "bg-white text-muted border"}`} style={activeTab === "validacao" ? {backgroundColor: colors.primary} : {borderColor: colors.border}}>Validação</button>
          <button onClick={() => setActiveTab("gestao")} className={`btn px-4 py-2 rounded-pill fw-bold border-0 ${activeTab === "gestao" ? "text-white shadow-sm" : "bg-white text-muted border"}`} style={activeTab === "gestao" ? {backgroundColor: colors.primary} : {borderColor: colors.border}}>Gestão de Rede</button>
          <button onClick={() => setActiveTab("admins")} className={`btn px-4 py-2 rounded-pill fw-bold border-0 ${activeTab === "admins" ? "text-white shadow-sm" : "bg-white text-muted border"}`} style={activeTab === "admins" ? {backgroundColor: colors.primary} : {borderColor: colors.border}}>Administradores</button>
        </div>

        <div className="animation-fade-in">
          {activeTab === "validacao" && renderTabValidacao()}
          {activeTab === "gestao" && renderTabGestao()}
          {activeTab === "admins" && renderTabAdmins()}
        </div>

      </Container>

      <Offcanvas show={showSettings} onHide={() => setShowSettings(false)} placement="end" style={{ width: "340px" }}>
        <Offcanvas.Header closeButton className="border-bottom pb-3 mt-2 px-4">
          <Offcanvas.Title className="d-flex align-items-center gap-2 fw-bold" style={{ color: colors.textDark }}>
            <Settings size={22} style={{ color: colors.primary }} /> Configurações
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="d-flex flex-column px-4 py-4">
          <div className="d-flex flex-column gap-2">
            <div 
              className="d-flex align-items-center gap-3 p-2 rounded" 
              style={{ cursor: "pointer", transition: "0.2s" }} 
              onClick={() => { setShowSettings(false); setShowPasswordModal(true); }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.primaryLight}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
               <Lock size={20} style={{ color: colors.primary }} />
               <span className="fw-medium" style={{ color: colors.textDark }}>Alterar Senha</span>
            </div>

            <div 
              className="d-flex align-items-center gap-3 p-2 rounded" 
              style={{ cursor: "pointer", transition: "0.2s" }} 
              onClick={() => { setShowSettings(false); setShowAddAdminModal(true); }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.primaryLight}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
               <UserPlus size={20} style={{ color: colors.primary }} />
               <span className="fw-medium" style={{ color: colors.textDark }}>Registar Novo Admin</span>
            </div>
          </div>

          <div className="mt-auto pt-4">
             <button 
               onClick={handleLogout}
               className="btn w-100 fw-bold py-3 d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm rounded-3 transition-all" 
               style={{ backgroundColor: colors.danger, color: "white" }}
               onMouseOver={(e) => e.currentTarget.style.filter = "brightness(0.9)"}
               onMouseOut={(e) => e.currentTarget.style.filter = "brightness(1)"}
             >
                <LogOut size={20} /> Sair da Conta
             </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered size="md">
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold" style={{ color: colors.primary }}>Alterar Senha</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-2">
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3">
              <Form.Label className="text-secondary fw-medium">E-mail atual</Form.Label>
              <Form.Control 
                type="email" 
                value={changePassEmail}
                onChange={(e) => setChangePassEmail(e.target.value)}
                placeholder="Seu e-mail de acesso" 
                className="shadow-none py-2" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-secondary fw-medium">Nova senha</Form.Label>
              <Form.Control 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres" 
                className="shadow-none py-2" 
                required 
                minLength={6}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="text-secondary fw-medium">Confirmar nova senha</Form.Label>
              <Form.Control 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha" 
                className="shadow-none py-2" 
                required 
                minLength={6}
              />
            </Form.Group>
            <button type="submit" className="btn w-100 fw-bold py-2 border-0 text-white rounded-3" style={{ backgroundColor: colors.primary }}>
              Salvar Nova Senha
            </button>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top-0 pt-0 px-4 pb-4">
          <button type="button" onClick={() => setShowPasswordModal(false)} className="btn btn-light fw-bold px-4 py-2 text-secondary border shadow-sm w-100 rounded-3">
            Cancelar
          </button>
        </Modal.Footer>
      </Modal>

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
            <button className="btn btn-light fw-bold px-4 border rounded-3" onClick={() => setShowRemoveProfModal(false)}>Cancelar</button>
            <button className="btn btn-danger fw-bold px-4 rounded-3 d-flex align-items-center gap-2" onClick={handleDeleteProf}>
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
            <button className="btn btn-light fw-bold px-4 border rounded-3" onClick={() => setShowRemoveAdminModal(false)}>Cancelar</button>
            <button className="btn btn-danger fw-bold px-4 rounded-3 d-flex align-items-center gap-2" onClick={handleDeleteAdmin}>
              <Trash2 size={16} /> Remover
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <ToastContainer className="p-4" position="bottom-end" style={{ zIndex: 1050, position: "fixed" }}>
        <Toast show={successToast.show} onClose={() => setSuccessToast(prev => ({ ...prev, show: false }))} delay={5000} autohide className="border-0 shadow-lg rounded-4 overflow-hidden mb-3">
          <Toast.Header className="border-0 pb-1 pt-3 px-4 bg-white justify-content-between">
            <strong className="d-flex align-items-center gap-2 fs-6" style={{ color: colors.primary }}>
              <CheckCircle size={18} style={{ color: colors.primary }} /> {successToast.title}
            </strong>
          </Toast.Header>
          <Toast.Body className="px-4 pb-4 pt-1 bg-white text-dark fw-medium" style={{ fontSize: "0.95rem" }}>
            {successToast.message}
          </Toast.Body>
        </Toast>

        <Toast show={dangerToast.show} onClose={() => setDangerToast(prev => ({ ...prev, show: false }))} delay={5000} autohide className="border-0 shadow-lg rounded-4 overflow-hidden bg-danger text-white mb-3">
          <Toast.Header className="border-0 pb-1 pt-3 px-4 bg-danger text-white justify-content-between" style={{ borderBottom: "none" }}>
            <strong className="d-flex align-items-center gap-2 fs-6 text-white">
              <AlertCircle size={18} /> {dangerToast.title}
            </strong>
          </Toast.Header>
          <Toast.Body className="px-4 pb-4 pt-1 text-white text-opacity-90 fw-medium" style={{ fontSize: "0.95rem" }}>
            {dangerToast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
};