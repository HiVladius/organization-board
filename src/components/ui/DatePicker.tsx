import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "./Calendar";

interface DatePickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date | null) => void;
  hasEndDate: boolean;
  onEndDateToggle: (enabled: boolean) => void;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  hasEndDate,
  onEndDateToggle,
  className = "",
}) => {
  const [activeCalendar, setActiveCalendar] = useState<
    "start" | "end" | null
  >();
  const calendarRef = useRef<HTMLDivElement>(null);

  // Cerrar calendario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setActiveCalendar(null);
      }
    };

    if (activeCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeCalendar]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleStartDateClick = () => {
    setActiveCalendar(activeCalendar === "start" ? null : "start");
  };

  const handleEndDateClick = () => {
    setActiveCalendar(activeCalendar === "end" ? null : "end");
  };

  const handleStartDateChange = (date: Date) => {
    onStartDateChange(date);
    setActiveCalendar(null); // Cerrar calendario después de seleccionar
  };

  const handleEndDateChange = (date: Date) => {
    onEndDateChange(date);
    setActiveCalendar(null); // Cerrar calendario después de seleccionar
  };

  const handleEndDateToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    onEndDateToggle(enabled);
    if (!enabled) {
      onEndDateChange(null);
      setActiveCalendar(null); // Cerrar calendario si se desactiva
    } else if (!endDate) {
      // Si se habilita pero no hay fecha final, usar la fecha de inicio + 1 día
      const newEndDate = new Date(startDate || new Date());
      newEndDate.setDate(newEndDate.getDate() + 1);
      onEndDateChange(newEndDate);
    }
  };

  return (
    <div className={`space-y-4 ${className}`} ref={calendarRef}>
      {/* Selector de fecha de inicio */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Fecha de inicio
        </label>
        <button
          type="button"
          onClick={handleStartDateClick}
          className="w-full p-3 rounded-md border border-slate-600 bg-slate-700 text-left transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        >
          <div className="flex items-center justify-between">
            <span
              className={startDate ? "text-white" : "text-gray-400"}
            >
              {startDate
                ? formatDate(startDate)
                : "Seleccionar fecha de inicio"}
            </span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </button>

        {/* Calendario compacto para fecha de inicio */}
        {activeCalendar === "start" && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <Calendar
              selectedDate={startDate}
              onDateChange={handleStartDateChange}
              className="shadow-lg border border-slate-500"
              compact={true}
            />
          </div>
        )}
      </div>

      {/* Switch para habilitar fecha final */}
      <div className="flex items-center space-x-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={hasEndDate}
            onChange={handleEndDateToggle}
          />
          <div
            className={`w-11 h-6 rounded-full transition-colors ${
              hasEndDate ? "bg-cyan-600" : "bg-slate-600"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                hasEndDate ? "translate-x-5" : "translate-x-0"
              } mt-0.5 ml-0.5`}
            >
            </div>
          </div>
        </label>
        <span className="text-sm font-medium text-gray-200">
          Agregar fecha final
        </span>
      </div>

      {/* Selector de fecha final */}
      {hasEndDate && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Fecha final
          </label>
          <button
            type="button"
            onClick={handleEndDateClick}
            className="w-full p-3 rounded-md border border-slate-600 bg-slate-700 text-left transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <div className="flex items-center justify-between">
              <span
                className={endDate ? "text-white" : "text-gray-400"}
              >
                {endDate ? formatDate(endDate) : "Seleccionar fecha final"}
              </span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </button>

          {/* Calendario compacto para fecha final */}
          {activeCalendar === "end" && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50">
              <Calendar
                selectedDate={endDate}
                onDateChange={handleEndDateChange}
                className="shadow-lg border border-slate-500"
                compact={true}
              />
            </div>
          )}
        </div>
      )}

      {/* Mostrar duración si hay ambas fechas */}
      {hasEndDate && startDate && endDate && (
        <div className="text-sm text-gray-400 bg-slate-800 p-3 rounded-md">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Duración: {Math.ceil(
                (endDate.getTime() - startDate.getTime()) /
                  (1000 * 60 * 60 * 24),
              )} días
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
