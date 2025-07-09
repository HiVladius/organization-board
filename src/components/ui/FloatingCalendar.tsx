import React, { useEffect, useRef, useState } from "react";

interface FloatingCalendarProps {
  startDate?: Date;
  endDate?: Date;
  onDateChange: (startDate: Date, endDate?: Date) => void;
  onDateConfirm: (startDate: Date, enDate?: Date) => void;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const FloatingCalendar: React.FC<FloatingCalendarProps> = ({
  startDate,
  endDate,
  onDateChange,
  onDateConfirm,
  onClose,
  className = "",
  style = {},
}) => {
  const [currentDate, setCurrentDate] = useState(startDate || new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    startDate || null,
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    endDate || null,
  );
  const [hasDateRange, setHasDateRange] = useState(!!endDate);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

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

  // Cerrar calendario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

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
    const clickedDate = new Date(currentYear, currentMonth, day);

    if (!hasDateRange) {
      // Solo seleccionar fecha de inicio y cerrar inmediatamente
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
      onDateChange(clickedDate);
      // Para fechas únicas, cerrar automáticamente
      setTimeout(() => onClose(), 100);
    } else {
      // Manejo de rango de fechas
      if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // Primera selección o reiniciar selección
        setSelectedStartDate(clickedDate);
        setSelectedEndDate(null);
        setIsSelectingEnd(true);
        // Actualizar con la fecha de inicio seleccionada
        onDateChange(clickedDate);
      } else if (isSelectingEnd) {
        // Segunda selección
        let finalStartDate = selectedStartDate;
        let finalEndDate = clickedDate;

        if (clickedDate < selectedStartDate) {
          // Si la fecha final es anterior a la inicial, intercambiar
          finalStartDate = clickedDate;
          finalEndDate = selectedStartDate;
        }

        setSelectedStartDate(finalStartDate);
        setSelectedEndDate(finalEndDate);
        setIsSelectingEnd(false);
        // Actualizar con ambas fechas seleccionadas
        onDateChange(finalStartDate, finalEndDate);
      }
    }
  };

  const handleRangeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setHasDateRange(enabled);

    if (!enabled) {
      setSelectedEndDate(null);
      setIsSelectingEnd(false);
      if (selectedStartDate) {
        // Actualizar con solo la fecha de inicio
        onDateChange(selectedStartDate);
      }
    } else {
      // Habilitar rango de fechas
      if (selectedStartDate && !selectedEndDate) {
        // Si ya hay fecha de inicio pero no final, preparar para seleccionar final
        setIsSelectingEnd(true);
      } else {
        setIsSelectingEnd(false);
      }
      
      // Si ya hay una fecha de inicio y final, mantenerlas
      if (selectedStartDate && selectedEndDate) {
        onDateChange(selectedStartDate, selectedEndDate);
      }
    }
  };

  const isDateInRange = (day: number) => {
    if (!hasDateRange || !selectedStartDate || !selectedEndDate) return false;

    const date = new Date(currentYear, currentMonth, day);
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateSelected = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);

    if (!hasDateRange) {
      return selectedStartDate &&
        date.toDateString() === selectedStartDate.toDateString();
    }

    return (selectedStartDate &&
      date.toDateString() === selectedStartDate.toDateString()) ||
      (selectedEndDate &&
        date.toDateString() === selectedEndDate.toDateString());
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear;
  };

  const getDaysBetween = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    const timeDiff = selectedEndDate.getTime() - selectedStartDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
  };

  const renderCalendarDays = () => {
    const days = [];

    // Agregar días vacíos al inicio
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Agregar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isDateSelected(day);
      const isTodayDate = isToday(day);
      const isInRange = isDateInRange(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded-full transition-all duration-200 relative ${
            isSelected
              ? "bg-cyan-600 text-white z-10"
              : isInRange
              ? "bg-cyan-200 text-cyan-800"
              : isTodayDate
              ? "bg-cyan-500 text-white"
              : "text-gray-300 hover:bg-cyan-600 hover:text-white"
          }`}
        >
          {day}
        </button>,
      );
    }

    return days;
  };

  const handleConfirm = () => {
    if (selectedStartDate){
      if(onDateConfirm){
        onDateConfirm(selectedStartDate, selectedEndDate || undefined);
      }
      onClose();
    }
  }

  return (
    <div
      ref={calendarRef}
      className={`fixed bg-slate-800 rounded-lg p-4 border border-slate-600 shadow-2xl z-50 w-80
                  animate-in fade-in-0 zoom-in-95 duration-200 ${className}`}
      style={style}
    >
      {/* Header con navegación de año */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousYear}
          className="p-1 rounded hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
        >
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
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        <h3 className="text-lg font-semibold text-white">
          {currentYear}
        </h3>

        <button
          onClick={goToNextYear}
          className="p-1 rounded hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
        >
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
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Header con navegación de mes */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 rounded hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h4 className="text-base font-medium text-white">
          {monthNames[currentMonth]}
        </h4>

        <button
          onClick={goToNextMonth}
          className="p-1 rounded hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
        >
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Switch para habilitar rango de fechas */}
      <div className="flex items-center justify-center space-x-3 mb-4 p-3 bg-slate-700 rounded-lg">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={hasDateRange}
            onChange={handleRangeToggle}
          />
          <div
            className={`w-11 h-6 rounded-full transition-colors ${
              hasDateRange ? "bg-cyan-600" : "bg-slate-600"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                hasDateRange ? "translate-x-5" : "translate-x-0"
              } mt-0.5 ml-0.5`}
            >
            </div>
          </div>
        </label>
        <span className="text-sm font-medium text-gray-200">
          {hasDateRange ? "Rango de fechas" : "Fecha única"}
        </span>
      </div>

      {/* Información de selección */}
      {hasDateRange && (
        <div className="text-center mb-4 p-2 bg-cyan-900/50 rounded-lg">
          {isSelectingEnd && selectedStartDate
            ? (
              <p className="text-sm text-cyan-300">
                📅 Selecciona la fecha final (inicio:{" "}
                {selectedStartDate.toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                })})
              </p>
            )
            : !selectedStartDate
            ? (
              <p className="text-sm text-cyan-300">
                📅 Selecciona la fecha de inicio
              </p>
            )
            : (
              <p className="text-sm text-green-300">
                ✅ Rango seleccionado correctamente
              </p>
            )}
        </div>
      )}

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderCalendarDays()}
      </div>

      {/* Información de fechas seleccionadas */}
      {selectedStartDate && (
        <div className="p-3 bg-slate-700 rounded-lg text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-300">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                <strong>Inicio:</strong>{" "}
                {selectedStartDate.toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {hasDateRange && selectedEndDate && (
              <>
                <div className="flex items-center gap-2 text-gray-300">
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
                    <strong>Final:</strong>{" "}
                    {selectedEndDate.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-cyan-300 pt-2 border-t border-slate-600">
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
                    <strong>Duración:</strong> {getDaysBetween()} días
                  </span>
                </div>
              </>
            )}
          </div>
          
          {/* Botón de confirmación para rangos de fechas */}
          {hasDateRange && selectedStartDate && selectedEndDate && (
            <div className="mt-3 pt-3 border-t border-slate-600">
              <button
                onClick={handleConfirm}
                className="w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                Confirmar Selección
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
