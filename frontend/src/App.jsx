

// REACT E BOOTSTRAP
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// IMPORTAÇÕES
import { PsychologistDashboard } from "./pages/Psychologist/DashboardPsy/PsychologistDashboard";
import { Login } from "./pages/Auth/Login";
import { RecuperarSenha } from "./pages/Auth/RecuperarSenha";
import { RegisterChoice } from "./pages/Auth/Register/RegisterChoice";
import { RegisterPatient } from "./pages/Auth/Register/RegisterPatient";
import { RegisterPsychologist } from "./pages/Auth/Register/RegisterPsychologist";
import { Onboarding } from "./pages/Auth/Onboarding";
import { PatientDashboard } from "./pages/Patient/Dashboard/PatientDashboard";
import { WaitingRoom } from "./pages/Patient/Teleconsulta/WaitingRoom";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { RedefinirSenha } from "./pages/Auth/RedefinirSenha";
import { ResetPassword } from "./pages/ResetPassword";
import { HistoryPatient } from "./pages/Patient/Dashboard/HistoryPatient";
import { SchedulePatient } from "./pages/Patient/Agendamento/SchedulePatient";

function App() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(
    () => localStorage.getItem("@DignaMente:onboarding") === "true"
  );

  const handleFinishOnboarding = () => {
    localStorage.setItem("@DignaMente:onboarding", "true");
    setHasSeenOnboarding(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas de Entrada */}
        <Route path="/" element={hasSeenOnboarding ? <Navigate to="/login" /> : <Onboarding onFinish={handleFinishOnboarding} />} />
        <Route path="/login" element={<Login />} />
        
        {/* Recuperação de Senha */}
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/reset-password" element={<ResetPassword />} /> 

        {/* Cadastros */}
        <Route path="/cadastro" element={<RegisterChoice />} />
        <Route path="/cadastro/paciente" element={<RegisterPatient />} />
        <Route path="/cadastro/psicologo" element={<RegisterPsychologist />} />

        {/* Dashboards Principais */}
        <Route path="/psicologo" element={<PsychologistDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fluxo do Paciente (O NOVO FLUXO OFICIAL) */}
        <Route path="/paciente/dashboard" element={<PatientDashboard />} />
        <Route path="/paciente/agendar-consulta" element={<SchedulePatient />} />
        <Route path="/paciente/historico" element={<HistoryPatient />} /> 
        <Route path="/sala-de-espera" element={<WaitingRoom />} />

        {/* Fallback de Segurança */}
        <Route path="/paciente" element={<Navigate to="/paciente/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;