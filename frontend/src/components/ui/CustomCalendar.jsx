import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CustomCalendar = ({ selectedDate, onSelectDate }) => {
  // Pega o dia de hoje e zera as horas para facilitar a comparação
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Inicia mostrando o mês da data selecionada (se houver) ou o mês atual
  const initialViewDate = selectedDate ? new Date(selectedDate) : new Date(today);
  const [currentDate, setCurrentDate] = useState(initialViewDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Matemática das datas
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Funções de navegação
  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

  // Função ao clicar em um dia
  const handleSelect = (day) => {
    const selected = new Date(year, month, day);
    if (selected >= today) {
      if (onSelectDate) onSelectDate(selected); // Envia a data para o pai
    }
  };

  const renderDays = () => {
    const days = [];
    
    // 1. Renderiza os últimos dias do mês passado (clarinhos e bloqueados)
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="text-center p-2 text-muted" style={{ opacity: 0.3, fontSize: "0.95rem" }}>
          {daysInPrevMonth - i}
        </div>
      );
    }

    // 2. Renderiza os dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const dateOfThisDay = new Date(year, month, day);
      const isPast = dateOfThisDay < today;
      
      // A MÁGICA AQUI: Ele olha para a prop do pai para saber se está selecionado
      const isSelected = selectedDate && dateOfThisDay.getTime() === selectedDate.getTime();
      const isToday = dateOfThisDay.getTime() === today.getTime();

      // Estilos base para todos os dias
      let baseStyle = "text-center p-2 rounded-circle transition-all d-flex align-items-center justify-content-center mx-auto";
      let customStyle = { 
        width: "36px", 
        height: "36px", 
        cursor: isPast ? "not-allowed" : "pointer",
        fontSize: "0.95rem"
      };

      // Aplica as cores dependendo do status do dia
      if (isSelected) {
        baseStyle += " text-white shadow-sm fw-bold";
        customStyle.backgroundColor = "#2C7A7B";
        customStyle.boxShadow = "0 0 0 2px #fff, 0 0 0 4px #2C7A7B";
      } else if (isPast) {
        baseStyle += " text-muted";
        customStyle.opacity = 0.35;
      } else if (isToday) {
        baseStyle += " fw-bold";
        customStyle.color = "#2C7A7B";
        customStyle.backgroundColor = "#E8F3F3";
      } else {
        baseStyle += " text-secondary";
      }

      days.push(
        <div 
          key={`current-${day}`} 
          className={baseStyle} 
          style={customStyle}
          onClick={() => !isPast && handleSelect(day)}
          onMouseOver={(e) => {
            if (!isPast && !isSelected) e.currentTarget.style.backgroundColor = '#F4F7F9';
          }}
          onMouseOut={(e) => {
            if (!isPast && !isSelected) e.currentTarget.style.backgroundColor = isToday ? '#E8F3F3' : 'transparent';
          }}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-4 p-4 shadow-sm border" style={{ width: "100%", maxWidth: "340px", borderColor: "#E2E8F0", fontFamily: "Inter, sans-serif" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={handlePrev} className="btn p-0 rounded-circle d-flex align-items-center justify-content-center bg-transparent transition-all" style={{ width: "36px", height: "36px", border: "1px solid #E2E8F0", color: "#64748B" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F4F7F9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <ChevronLeft size={18} />
        </button>
        
        <h6 className="m-0 fw-bold" style={{ color: "#1E293B" }}>
          {monthNames[month]} {year}
        </h6>
        
        <button onClick={handleNext} className="btn p-0 rounded-circle d-flex align-items-center justify-content-center bg-transparent transition-all" style={{ width: "36px", height: "36px", border: "1px solid #E2E8F0", color: "#64748B" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F4F7F9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="d-grid mb-2" style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {weekDays.map(day => (
          <div key={day} className="text-center fw-medium text-secondary" style={{ fontSize: "0.85rem" }}>
            {day}
          </div>
        ))}
      </div>

      <div className="d-grid" style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", rowGap: "12px" }}>
        {renderDays()}
      </div>
    </div>
  );
};