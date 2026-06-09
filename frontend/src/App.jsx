// REACT E BOOTSTRAP --
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PsychologistDashboard } from "./pages/Psychologist/DashboardPsy/PsychologistDashboard";
import { Login } from "./pages/Auth/Login";
import { RecuperarSenha } from "./pages/Auth/RecuperarSenha";
import { RegisterChoice } from "./pages/Auth/Register/RegisterChoice";
import { RegisterPatient } from "./pages/Auth/Register/RegisterPatient";
import { RegisterPsychologist } from "./pages/Auth/Register/RegisterPsychologist";
import { Onboarding } from "./pages/Auth/Onboarding";
import { PatientDashboard } from "./pages/Patient/Dashboard/PatientDashboard";
import { WaitingRoom } from "./pages/Patient/Teleconsulta/WaitingRoom";
import { TeleconsultaRoom } from "./pages/Patient/Teleconsulta/TeleconsultaRoom";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { RedefinirSenha } from "./pages/Auth/RedefinirSenha";
import { ResetPassword } from "./pages/ResetPassword";

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
        <Route path="/reset-password" element={<RedefinirSenha/>}/>
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        
        {/* Rota exata que o Back-end envia no e-mail */}
        <Route path="/reset-password" element={<ResetPassword />} /> 

        {/* --- Rotas de Cadastro --- */}
        <Route path="/cadastro" element={<RegisterChoice />} />
        <Route path="/cadastro/paciente" element={<RegisterPatient />} />
        <Route path="/cadastro/psicologo" element={<RegisterPsychologist />} />

        {/* --- Dashboards psicologo --- */}
        <Route path="/psicologo" element={<PsychologistDashboard />} />
        
        {/* --- Dashboard admin --- */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin" element={<h1>Painel do Admin</h1>} />

        {/* Dashboard principal paciente */}
        <Route path="/paciente/dashboard" element={<PatientDashboard />} />
        <Route path="/paciente/historico" element={<HistoryPatient />} /*esse daqui é só o template qnd CLICA no meu historico em paciente, como n tenho back nem o banco, nn consigo fzer a passagem... qnd ce conseguir pode apagar essa rota*//> 
            
        {/* Painel da Triagem */}
        <Route path="/paciente/triagem" element={<TriageDashboard />} />
        <Route path="/teleconsulta-triagem" element={<TeleconsultaTriage />} />
        <Route path="/sala-de-espera-triagem" element={<WaitingRoomTriage />} />
        
        {/* --- Rotas de consulta e Agendamentos --- */}
        <Route path="/sala-de-espera" element={<WaitingRoom />} />
        <Route path="/teleconsulta" element={<TeleconsultaRoom />} />
        <Route path="/paciente/agendar-consulta" element={<SchedulePatient />} />

        {/* Fallback do /paciente. todas as ações que forem pra voltar(tipo desligar chamada) vão cair no dashboard principal*/}
        <Route path="/paciente" element={<Navigate to="/paciente/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;