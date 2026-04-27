import { useState } from 'react';
import { Heart, ShieldCheck, CalendarDays, Video, ChevronLeft, ChevronRight } from 'lucide-react';

export const Onboarding = ({ onFinish }) => {
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      icon: <Heart size={45} strokeWidth={1.5} />,
      title: "Bem-vindo ao DignaMente 💙",
      desc: "Sua porta de entrada para cuidado em saúde mental pelo SUS, gratuito, seguro e humanizado."
    },
    {
      icon: <ShieldCheck size={45} strokeWidth={1.5} />,
      title: "Privacidade garantida 🔒",
      desc: "Suas informações são protegidas pela LGPD. Apenas você e o profissional designado têm acesso ao seu histórico."
    },
    {
      icon: <CalendarDays size={45} strokeWidth={1.5} />,
      title: "Agende sua triagem ✨",
      desc: "Comece com uma avaliação inicial. O psicólogo entende sua necessidade e libera o agendamento de consultas regulares."
    },
    {
      icon: <Video size={45} strokeWidth={1.5} />,
      title: "Teleconsulta acolhedora 📹",
      desc: "Consultas por vídeo do conforto da sua casa. Sala de espera virtual e suporte de emergência sempre disponíveis."
    }
  ];

  const nextStep = () => {
    if (current < steps.length - 1) setCurrent(current + 1);
    else onFinish();
  };

  const prevStep = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <>
      <style>
        {`
          /* Animação de transição suave do conteúdo do card */
          .fade-in-content {
            animation: fadeIn 0.4s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          
          /* Estilo dinâmico das bolinhas (dots) */
          .dot {
            height: 8px;
            width: 8px;
            border-radius: 50%;
            background-color: #cbd5e1; /* slate-300 */
            transition: all 0.3s ease;
          }
          .dot.active {
            background-color: var(--cor-primaria);
            width: 24px;
            border-radius: 12px;
          }
          
          /* Hover no botão Pular */
          .btn-pular:hover {
            color: var(--cor-primaria) !important;
          }
        `}
      </style>

      <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: 'var(--cor-fundo)', fontFamily: 'Inter, sans-serif' }}>
        
        {/* HEADER: Logo à esquerda, Pular à direita */}
        <header className="d-flex justify-content-between align-items-center p-4 px-md-5">
          <div className="d-flex align-items-center gap-2 fw-bold" style={{ color: 'var(--cor-primaria)', fontSize: '1.2rem' }}>
            <Heart size={26} strokeWidth={2.5} /> 
            <span>DignaMente</span>
          </div>
          <button onClick={onFinish} className="btn btn-link text-secondary text-decoration-none fw-medium btn-pular">
            Pular
          </button>
        </header>

        {/* CORPO CENTRAL: Card, Dots e Botões */}
        <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center px-3">
          
          {/* Cartão Flutuante Branco */}
          <div 
            className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center mb-4 w-100 fade-in-content" 
            style={{ maxWidth: '600px', border: '1px solid #f1f5f9' }}
            key={current} // Força o React a reanimar o card a cada passo
          >
            {/* Ícone com fundo suave */}
            <div 
              className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-4" 
              style={{ width: '100px', height: '100px', backgroundColor: 'rgba(44, 122, 123, 0.1)', color: 'var(--cor-primaria)' }}
            >
              {steps[current].icon}
            </div>
            
            {/* Textos */}
            <h2 className="fw-bold text-dark mb-3 fs-3">{steps[current].title}</h2>
            <p className="text-secondary m-0 px-md-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              {steps[current].desc}
            </p>
          </div>

          {/* Bolinhas Indicadoras (Dots) */}
          <div className="d-flex gap-2 mb-4 mt-2">
            {steps.map((_, i) => (
               <div key={i} className={`dot ${i === current ? 'active' : ''}`} />
            ))}
          </div>

          {/* Botões de Controle Inferiores */}
          <div className="d-flex gap-3 w-100" style={{ maxWidth: '600px' }}>
            {/* Botão Voltar */}
            <button
              onClick={prevStep}
              disabled={current === 0}
              className="btn bg-white fw-medium d-flex align-items-center justify-content-center gap-2"
              style={{ 
                width: '130px', 
                color: current === 0 ? '#cbd5e1' : '#475569', 
                border: '1px solid #e2e8f0',
                cursor: current === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={20} /> Voltar
            </button>
            
            {/* Botão Próximo / Começar */}
            <button
              onClick={nextStep}
              className="btn text-white fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              style={{ backgroundColor: 'var(--cor-primaria)', transition: 'background 0.2s' }}
            >
              {current === steps.length - 1 ? 'Começar' : 'Próximo'}
              {current === steps.length - 1 ? null : <ChevronRight size={20} />}
            </button>
          </div>

        </main>

        {/* RODAPÉ */}
        <footer className="text-center p-4">
          <small className="text-secondary" style={{ fontSize: '0.85rem' }}>
            Cuidado em saúde mental · Sistema Único de Saúde
          </small>
        </footer>

      </div>
    </>
  );
};