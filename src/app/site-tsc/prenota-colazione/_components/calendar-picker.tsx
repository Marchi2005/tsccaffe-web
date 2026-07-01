import { useState, useEffect } from "react";
import clsx from "clsx";

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function CalendarPicker({ selectedDate, setSelectedDate }: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Genera i giorni del mese
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    let days: (Date | null)[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null); // Giorni vuoti prima del primo giorno
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date >= today) {
        days.push(date);
      } else {
        days.push(null); // Giorni passati non selezionabili
      }
    }

    return days;
  };

  const renderCalendarHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
        &larr;
      </button>
      <h3 className="font-bold text-sm">{currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}</h3>
      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
        &rarr;
      </button>
    </div>
  );

  const renderCalendarDays = () => {
    const days = generateCalendarDays();
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
          <span key={day} className="text-center text-xs font-bold text-slate-500 py-1">{day}</span>
        ))}
        {days.map((date, index) => {
          if (!date) return <div key={index}></div>;
          
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === selectedDate.toDateString();

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={clsx(
                "text-center text-sm py-2 rounded-lg transition-colors",
                isToday ? "bg-amber-100 text-amber-900 font-bold" : "",
                isSelected ? "bg-amber-900 text-white shadow-md" : "hover:bg-slate-100"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      {renderCalendarHeader()}
      {renderCalendarDays()}
    </div>
  );
}
