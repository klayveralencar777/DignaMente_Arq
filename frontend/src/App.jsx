import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// --- AUTH (REGISTRAR, LOGIN E ONBOARDING) ---
import { Login } from "./pages/Auth/Login";
import { RecuperarSenha } from "./pages/Auth/RecuperarSenha";
import { RegisterChoice } from "./pages/Auth/Register/RegisterChoice";
import { RegisterPatient } from "./pages/Auth/Register/RegisterPatient";
import { RegisterPsychologist } from "./pages/Auth/Register/RegisterPsychologist";
import { Onboarding } from "./pages/Auth/Onboarding";
import { RedefinirSenha } from "./pages/Auth/RedefinirSenha";
import { ResetPassword } from "./pages/ResetPassword";

// --- DASHBOARDS E TELAS DO PACIENTE ---
import { PatientDashboard } from "./pages/Patient/Dashboard/PatientDashboard"; 
import { WaitingRoom } from "./pages/Patient/Teleconsulta/WaitingRoom"; 
import { SchedulePatient } from "./pages/Patient/Agendamento/SchedulePatient"; 
import { HistoryPatient } from "./pages/Patient/Dashboard/HistoryPatient"; 

// --- DASHBOARD DO PSICOLOGO E FUNCIONALIDADES ---
import { PsychologistDashboard } from "./pages/Psychologist/DashboardPsy/PsychologistDashboard";
import { SchedulePsychologist } from "./pages/Psychologist/Agenda/SchedulePsychologist";
import { SessionRoom } from "./pages/Psychologist/Atendimento/SessionRoom";
import { PatientChart } from "./pages/Psychologist/Prontuario/PatientChart";

// --- DASHBOARD DO ADMIN ---
import { AdminDashboard } from "./pages/Admin/AdminDashboard";

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

        {/* Rotas Independentes */}
        <Route path="/" element={hasSeenOnboarding ? <Navigate to="/login" /> : <Onboarding onFinish={handleFinishOnboarding} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/reset-password" element={<ResetPassword />} /> 
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />

        {/* Rotas de Cadastro */}
        <Route path="/cadastro" element={<RegisterChoice />} />
        <Route path="/cadastro/paciente" element={<RegisterPatient />} />
        <Route path="/cadastro/psicologo" element={<RegisterPsychologist />} />

        {/* Dashboards e Funcionalidades do Psicólogo */}
        <Route path="/psicologo" element={<PsychologistDashboard />} />
        <Route path="/psicologo/agenda" element={<SchedulePsychologist />} />
        <Route path="/psicologo/sessao/:id" element={<SessionRoom />} />
        <Route path="/psicologo/prontuario/:id" element={<PatientChart />} />
        
        {/* Dashboard Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Dashboard Principal Paciente */}
        <Route path="/paciente/dashboard" element={<PatientDashboard />} />
        <Route path="/paciente/historico" element={<HistoryPatient />} /> 
        
        {/* Rotas de Consulta e Agendamentos */}
        <Route path="/sala-de-espera" element={<WaitingRoom />} />
        <Route path="/paciente/agendar-consulta" element={<SchedulePatient />} />
        <Route path="/paciente/historico" element={<HistoryPatient />} /> 
        <Route path="/sala-de-espera" element={<WaitingRoom />} />

        {/* Fallback do Paciente */}
        <Route path="/paciente" element={<Navigate to="/paciente/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;