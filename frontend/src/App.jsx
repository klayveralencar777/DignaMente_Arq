import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


import { PsychologistDashboard } from "./pages/Psychologist/PsychologistDashboard";
import { Login } from "./pages/Login";
import { RecuperarSenha } from "./pages/RecuperarSenha";
import { RegisterChoice } from "./pages/RegisterChoice";
import { RegisterPatient } from "./pages/RegisterPatient";
import { RegisterPsychologist } from "./pages/RegisterPsychologist";
import { Onboarding } from "./pages/Onboarding";
import { PatientDashboard } from "./pages/Patient/PatientDashboard";
import { WaitingRoom } from "./pages/Patient/WaitingRoom";
import { TeleconsultaRoom } from "./pages/Patient/TeleconsultaRoom";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { RedefinirSenha } from "./pages/RedefinirSenha";

function App() {

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);


  const handleFinishOnboarding = () => {
    localStorage.setItem("@DignaMente:onboarding", "true");
    setHasSeenOnboarding(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {}
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
        <Route path="/reset-password" element={<RedefinirSenha/>}/>
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas de Cadastro */}
        <Route path="/cadastro" element={<RegisterChoice />} />
        <Route path="/cadastro/paciente" element={<RegisterPatient />} />
        <Route path="/cadastro/psicologo" element={<RegisterPsychologist />} />

        {/* --- Dashboards --- */}
        <Route path="/paciente" element={<PatientDashboard />} />
        <Route path="/psicologo" element={<PsychologistDashboard />} />
        <Route path="/admin" element={<h1>Painel do Admin</h1>} />

        {/* --- Rotas do Paciente --- */}
        <Route path="/sala-de-espera" element={<WaitingRoom />} />
        <Route path="/teleconsulta" element={<TeleconsultaRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;