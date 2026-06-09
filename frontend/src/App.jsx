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
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const handleFinishOnboarding = () => {
    localStorage.setItem("@DignaMente:onboarding", "true");
    setHasSeenOnboarding(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            hasSeenOnboarding ? (
              <Navigate to="/login" />
            ) : (
              <Onboarding onFinish={handleFinishOnboarding} />
            )
          }
        />
        
        {/* --- Autenticação e Recuperação --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        
        {/* Rota exata que o Back-end envia no e-mail */}
        <Route path="/reset-password" element={<ResetPassword />} /> 

        {/* --- Rotas de Cadastro --- */}
        <Route path="/cadastro" element={<RegisterChoice />} />
        <Route path="/cadastro/paciente" element={<RegisterPatient />} />
        <Route path="/cadastro/psicologo" element={<RegisterPsychologist />} />

        {/* --- Dashboards --- */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/paciente" element={<PatientDashboard />} />
        <Route path="/psicologo" element={<PsychologistDashboard />} />

        {/* --- Rotas do Paciente --- */}
        <Route path="/sala-de-espera" element={<WaitingRoom />} />
        <Route path="/teleconsulta" element={<TeleconsultaRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;