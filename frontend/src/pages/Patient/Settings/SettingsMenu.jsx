import { Offcanvas, Button as BootstrapButton } from "react-bootstrap";
import { Settings, FileText, Shield, Lock, LogOut, UserX } from "lucide-react"; // <-- Ícone UserX adicionado aqui

// <-- Prop onDeleteAccount adicionada aqui
export const SettingsMenu = ({ show, onHide, onLogout, onDeleteAccount }) => {
  const primaryGreen = "#50C878";

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ width: "320px" }}
    >
      <Offcanvas.Header closeButton className="border-bottom pb-3 mt-2 px-4">
        <Offcanvas.Title
          className="d-flex align-items-center gap-2 fw-bold"
          style={{ color: "#2d3748" }}
        >
          <Settings size={22} style={{ color: primaryGreen }} /> Configurações
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column px-4 py-4">
        <div className="d-flex flex-column gap-3">
          <div
            className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light"
            style={{ cursor: "pointer", transition: "0.2s" }}
          >
            <FileText size={20} style={{ color: primaryGreen }} />
            <span className="fw-medium text-dark">Termos de Uso</span>
          </div>

          <div
            className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light"
            style={{ cursor: "pointer", transition: "0.2s" }}
          >
            <Shield size={20} style={{ color: primaryGreen }} />
            <span className="fw-medium text-dark">Política de Privacidade</span>
          </div>

          <div
            className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light"
            style={{ cursor: "pointer", transition: "0.2s" }}
          >
            <Lock size={20} className="text-warning" />
            <span className="fw-medium text-dark">Alterar Senha</span>
          </div>

          {/* --- NOVO BOTÃO DE EXCLUIR CONTA --- */}
          <div
            className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light mt-4 border border-danger border-opacity-25 bg-danger bg-opacity-10"
            style={{ cursor: "pointer", transition: "0.2s" }}
            onClick={onDeleteAccount}
          >
            <UserX size={20} className="text-danger" />
            <span className="fw-bold text-danger">Excluir Conta</span>
          </div>
          
        </div>

        <div className="mt-auto">
          <BootstrapButton
            variant="danger"
            onClick={onLogout}
            className="w-100 fw-bold py-2 d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm"
            style={{ backgroundColor: "#e84545" }}
          >
            <LogOut size={18} /> Sair da Conta
          </BootstrapButton>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
