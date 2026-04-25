import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Login } from './pages/Login';
import { RegisterChoice } from './pages/RegisterChoice';
import { RegisterPatient } from './pages/RegisterPatient';
import { RegisterPsychologist } from './pages/RegisterPsychologist';
import { Onboarding } from './pages/Onboarding'; // Importando o Onboarding!

function App() {
  // Verifica no navegador se o usuário já passou pelo onboarding
  // FORÇANDO o onboarding a aparecer para testar o design
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Função que o botão "Pular" ou "Começar Agora" vai chamar
  const handleFinishOnboarding = () => {
    localStorage.setItem('@DignaMente:onboarding', 'true');
    setHasSeenOnboarding(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Raiz: Decide inteligentemente para onde mandar o usuário */}
        <Route 
          path="/" 
          element={
            hasSeenOnboarding 
              ? <Navigate to="/login" /> 
              : <Onboarding onFinish={handleFinishOnboarding} />
          } 
        />
        
        <Route path="/login" element={<Login />} />
        
        {/* Rotas de Cadastro */}
        <Route path="/cadastro" element={<RegisterChoice />} />
        <Route path="/cadastro/paciente" element={<RegisterPatient />} />
        <Route path="/cadastro/psicologo" element={<RegisterPsychologist />} />

        {/* Telas provisórias (Dashboards) */}
        <Route path="/paciente" element={<h1>Painel do Paciente</h1>} />
        <Route path="/psicologo" element={<h1>Painel do Psicólogo</h1>} />
        <Route path="/admin" element={<h1>Painel do Admin</h1>} />

        {/* Se digitar uma URL que não existe, joga pro início */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
