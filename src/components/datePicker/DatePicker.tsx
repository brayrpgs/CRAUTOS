import React, { useState } from "react";
import "./DatePicker.css";

type DatePickerProps = {
  onChange?: (date: Date) => void;
};

const DatePicker: React.FC<DatePickerProps> = ({ onChange }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [isOpen, setIsOpen] = useState(false);

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const handleSelectDate = (day: number, type: "prev" | "current" | "next") => {
    const month =
      type === "prev"
        ? currentMonth === 0
          ? 11
          : currentMonth - 1
        : type === "next"
          ? currentMonth === 11
            ? 0
            : currentMonth + 1
          : currentMonth;

    const year =
      type === "prev"
        ? currentMonth === 0
          ? currentYear - 1
          : currentYear
        : type === "next"
          ? currentMonth === 11
            ? currentYear + 1
            : currentYear
          : currentYear;

    const date = new Date(year, month, day);
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const daysArray: { day: number; type: "prev" | "current" | "next" }[] = [
    ...Array.from({ length: offset }, (_, i) => ({
      day: prevMonthDays - offset + i + 1,
      type: "prev" as const,
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      type: "current" as const,
    })),
    ...Array.from({ length: 42 - offset - daysInMonth }, (_, i) => ({
      day: i + 1,
      type: "next" as const,
    })),
  ];

  return (
    <div className="datepicker">
      <input
        id="datepicker"
        type="text"
        readOnly
        value={
          selectedDate
            ? selectedDate.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
            : ""
        }
        placeholder="Selecciona una fecha"
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="calendar">
          <div className="calendar-header">
            <button onClick={prevMonth}>&lt;</button>
            <span>
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
              })}{" "}
              {currentYear}
            </span>
            <button onClick={nextMonth}>&gt;</button>
          </div>

          <div className="calendar-grid">
            {daysOfWeek.map((d) => (
              <div key={d} className="day-name">
                {d}
              </div>
            ))}

            {daysArray.map(({ day, type }, idx) => {
              const isSelected =
                selectedDate &&
                day === selectedDate.getDate() &&
                type === "current" &&
                currentMonth === selectedDate.getMonth() &&
                currentYear === selectedDate.getFullYear();

              const isToday =
                day === today.getDate() &&
                type === "current" &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <div
                  key={idx}
                  className={`day ${type} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""
                    }`}
                  onClick={() => handleSelectDate(day, type)}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
