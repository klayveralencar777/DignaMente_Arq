import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Login } from './pages/Login';
import { RegisterChoice } from './pages/RegisterChoice';
import { RegisterPatient } from './pages/RegisterPatient';
import { RegisterPsychologist } from './pages/RegisterPsychologist';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Novas Rotas de Cadastro */}
        <Route path="/cadastro" element={<RegisterChoice />} />
        <Route path="/cadastro/paciente" element={<RegisterPatient />} />
        <Route path="/cadastro/psicologo" element={<RegisterPsychologist />} />

        {/* Telas provisórias */}
        <Route path="/paciente" element={<h1>Painel do Paciente</h1>} />
        <Route path="/psicologo" element={<h1>Painel do Psicólogo</h1>} />
        <Route path="/admin" element={<h1>Painel do Admin</h1>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;