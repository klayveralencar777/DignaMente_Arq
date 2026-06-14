// REACT E BOOTSTRAP --
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// --- ROTAS DE AUTENTICAÇÃO E ONBOARDING ---
import { Login } from "./pages/Auth/Login";
import { RecuperarSenha } from "./pages/Auth/RecuperarSenha";
import { RedefinirSenha } from "./pages/Auth/RedefinirSenha";
import { ResetPassword } from "./pages/ResetPassword";
import { RegisterChoice } from "./pages/Auth/Register/RegisterChoice";
import { RegisterPatient } from "./pages/Auth/Register/RegisterPatient";
import { RegisterPsychologist } from "./pages/Auth/Register/RegisterPsychologist";
import { Onboarding } from "./pages/Auth/Onboarding";

// --- DASHBOARDS DO PACIENTE ---
import { PatientDashboard } from "./pages/Patient/Dashboard/PatientDashboard"; //dashboard - principal
import { HistoryPatient } from "./pages/Patient/Dashboard/HistoryPatient"; //TEMPLATE pro historico - principal
import { TriageDashboard } from "./pages/Patient/Dashboard/TriageDashboard"; //dashboard - triagem
import { WaitingRoomTriage } from "./pages/Patient/Teleconsulta/WaitingRoomTriage"; //sala de espera - triagem
import { TeleconsultaTriage } from "./pages/Patient/Teleconsulta/TeleconsultaTriage"; //teleconsulta - triagem
import { WaitingRoom } from "./pages/Patient/Teleconsulta/WaitingRoom"; //sala de espera da teleconsulta - principal
import { TeleconsultaRoom } from "./pages/Patient/Teleconsulta/TeleconsultaRoom"; //teleconsulta - principal
import { SchedulePatient } from "./pages/Patient/Agendamento/SchedulePatient"; //agendamento - principal

// --- DASHBOARD DO PSICOLOGO E FUNCIONALIDADES ---
import { PsychologistDashboard } from "./pages/Psychologist/DashboardPsy/PsychologistDashboard";
import { SchedulePsychologist } from "./pages/Psychologist/Agenda/SchedulePsychologist";
import { SessionRoom } from "./pages/Psychologist/Atendimento/SessionRoom";
import { TriageRoom } from "./pages/Psychologist/Atendimento/TriageRoom";
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
        {/* rotas independentes */}
        <Route path="/" element={hasSeenOnboarding ? <Navigate to="/login" /> : <Onboarding onFinish={handleFinishOnboarding} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        
        {/* Rota exata que o Back-end envia no e-mail */}
        <Route path="/reset-password" element={<ResetPassword />} /> 

        {/* --- Rotas de Cadastro --- */}
        <Route path="/cadastro" element={<RegisterChoice />} />
        <Route path="/cadastro/paciente" element={<RegisterPatient />} />
        <Route path="/cadastro/psicologo" element={<RegisterPsychologist />} />

        {/* --- Dashboards e Funcionalidades do Psicólogo --- */}
        <Route path="/psicologo" element={<PsychologistDashboard />} />
        <Route path="/psicologo/agenda" element={<SchedulePsychologist />} />
        <Route path="/psicologo/sessao/:id" element={<SessionRoom />} />
        <Route path="/psicologo/triagem/:id" element={<TriageRoom />} />
        <Route path="/psicologo/prontuario/:id" element={<PatientChart />} />
        
        {/* --- Dashboard admin --- */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Dashboard principal paciente */}
        <Route path="/paciente/dashboard" element={<PatientDashboard />} />
        <Route path="/paciente/historico" element={<HistoryPatient />} /> 
            
        {/* Painel da Triagem */}
        <Route path="/paciente/triagem" element={<TriageDashboard />} />
        <Route path="/teleconsulta-triagem" element={<TeleconsultaTriage />} />
        <Route path="/sala-de-espera-triagem" element={<WaitingRoomTriage />} />
        
        {/* --- Rotas de consulta e Agendamentos --- */}
        <Route path="/sala-de-espera" element={<WaitingRoom />} />
        <Route path="/teleconsulta" element={<TeleconsultaRoom />} />
        <Route path="/paciente/agendar-consulta" element={<SchedulePatient />} />

        {/* Fallback do /paciente */}
        <Route path="/paciente" element={<Navigate to="/paciente/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;