import React, { useState } from "react";

interface CalendarProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  className?: string;
  compact?: boolean; // Nueva prop para versión compacta
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateChange,
  className = "",
  compact = false,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToPreviousYear = () => {
    setCurrentDate(new Date(currentYear - 1, currentMonth, 1));
  };

  const goToNextYear = () => {
    setCurrentDate(new Date(currentYear + 1, currentMonth, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateChange(newDate);
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear;
  };

  const isToday = (day: number) => {
    return today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear;
  };

  const renderCalendarDays = () => {
    const days = [];
    const daySize = compact ? "w-6 h-6" : "w-8 h-8";

    // Agregar días vacíos al inicio
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className={daySize}></div>,
      );
    }

    // Agregar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isDateSelected(day);
      const isTodayDate = isToday(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`${daySize} flex items-center justify-center ${
            compact ? "text-xs" : "text-sm"
          } rounded-full hover:bg-cyan-600 hover:text-white transition-colors ${
            isSelected
              ? "bg-cyan-600 text-white"
              : isTodayDate
              ? "bg-cyan-500 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          {day}
        </button>,
      );
    }

    return days;
  };

  return (
    <div
      className={`bg-slate-700 rounded-lg ${
        compact ? "p-3" : "p-4"
      } border border-slate-600 ${className}`}
    >
      {/* Header con navegación de año */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousYear}
          className="p-1 rounded hover:bg-slate-600 text-gray-300 hover:text-white"
        >
          <svg
            className={`${compact ? "w-3 h-3" : "w-4 h-4"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        <h3
          className={`${
            compact ? "text-base" : "text-lg"
          } font-semibold text-white`}
        >
          {currentYear}
        </h3>

        <button
          onClick={goToNextYear}
          className="p-1 rounded hover:bg-slate-600 text-gray-300 hover:text-white"
        >
          <svg
            className={`${compact ? "w-3 h-3" : "w-4 h-4"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Header con navegación de mes */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousMonth}
          className="p-1 rounded hover:bg-slate-600 text-gray-300 hover:text-white"
        >
          <svg
            className={`${compact ? "w-3 h-3" : "w-4 h-4"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h4
          className={`${
            compact ? "text-sm" : "text-base"
          } font-medium text-white`}
        >
          {monthNames[currentMonth]}
        </h4>

        <button
          onClick={goToNextMonth}
          className="p-1 rounded hover:bg-slate-600 text-gray-300 hover:text-white"
        >
          <svg
            className={`${compact ? "w-3 h-3" : "w-4 h-4"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className={`${
              compact ? "w-6 h-6" : "w-8 h-8"
            } flex items-center justify-center text-xs font-medium text-gray-400`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};
