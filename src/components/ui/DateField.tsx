import React, { useState } from "react";
import { FloatingCalendar } from "./FloatingCalendar";

interface DateFieldProps {
    startDate?: Date;
    endDate?: Date;
    onDateChange: (startDate: Date, endDate?: Date) => void;
    placeholder?: string;
    className?: string;
}

export const DateField: React.FC<DateFieldProps> = ({
    startDate,
    endDate,
    onDateChange,
    placeholder = "Seleccionar fecha",
    className = "",
}) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [fieldPosition, setFieldPosition] = useState({ top: 0, left: 0 });

    const handleFieldClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const calendarWidth = 320; // Ancho aproximado del calendario
        const calendarHeight = 500; // Alto aproximado del calendario (aumentado para incluir información)

        // Posición preferida: arriba y a la derecha
        let top = rect.top + window.scrollY - calendarHeight - 12;
        let left = rect.right + window.scrollX + 12;

        // Si se sale por la derecha, intentar a la izquierda del campo
        if (left + calendarWidth > viewportWidth - 16) {
            left = rect.left + window.scrollX - calendarWidth - 12;
        }

        // Si aún se sale por la izquierda, centrar horizontalmente
        if (left < 16) {
            left = Math.max(16, (viewportWidth - calendarWidth) / 2);
        }

        // Si se sale por arriba, colocar debajo del campo
        if (top < window.scrollY + 16) {
            top = rect.bottom + window.scrollY + 12;
        }

        setFieldPosition({ top, left });
        setShowCalendar(true);
    };

    const handleDateChange = (newStartDate: Date, newEndDate?: Date) => {
        onDateChange(newStartDate, newEndDate);
        setShowCalendar(false);
    };

    const handleClose = () => {
        setShowCalendar(false);
    };

    const formatDateDisplay = () => {
        if (!startDate) return placeholder;

        const startDateStr = startDate.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        if (endDate) {
            const endDateStr = endDate.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            return `${startDateStr} - ${endDateStr}`;
        }

        return startDateStr;
    };

    return (
        <>
            <button
                type="button"
                onClick={handleFieldClick}
                className={`w-full p-3 rounded-md border border-slate-600 bg-slate-700 text-left transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${className}`}
            >
                <div className="flex items-center justify-between">
                    <span
                        className={startDate ? "text-white" : "text-gray-400"}
                    >
                        {formatDateDisplay()}
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

            {showCalendar && (
                <FloatingCalendar
                    startDate={startDate}
                    endDate={endDate}
                    onDateChange={handleDateChange}
                    onClose={handleClose}
                    className="transform"
                    style={{
                        top: `${fieldPosition.top}px`,
                        left: `${fieldPosition.left}px`,
                    }}
                />
            )}
        </>
    );
};