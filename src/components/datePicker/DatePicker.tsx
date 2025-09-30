import React, { useState, useMemo, useCallback } from "react";
import "./DatePicker.css";

type DatePickerProps = {
  onChange?: (date: Date) => void; // Callback function when a date is selected
};

const DatePicker: React.FC<DatePickerProps> = ({ onChange }) => {
  // Today's date (memoized so it doesn't recreate every render)
  const today = useMemo(() => new Date(), []);

  // Currently selected date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Currently displayed month and year
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Controls whether the calendar dropdown is open
  const [isOpen, setIsOpen] = useState(false);

  // Days of the week (memoized as it's static)
  const daysOfWeek = useMemo(() => ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], []);

  // Number of days in the current month
  const daysInMonth = useMemo(() => new Date(currentYear, currentMonth + 1, 0).getDate(), [
    currentYear,
    currentMonth,
  ]);

  // First day of the month (0 = Sunday)
  const firstDayOfMonth = useMemo(() => new Date(currentYear, currentMonth, 1).getDay(), [
    currentYear,
    currentMonth,
  ]);

  // Offset to start calendar on Monday instead of Sunday
  const offset = useMemo(() => (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1), [firstDayOfMonth]);

  // Number of days in the previous month (used for filling previous month's days)
  const prevMonthDays = useMemo(() => new Date(currentYear, currentMonth, 0).getDate(), [
    currentYear,
    currentMonth,
  ]);

  // Array of all 42 calendar cells (including previous and next month overflow)
  const daysArray = useMemo(() => {
    return [
      // Previous month's days
      ...Array.from({ length: offset }, (_, i) => ({
        day: prevMonthDays - offset + i + 1,
        type: "prev" as const,
      })),
      // Current month's days
      ...Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        type: "current" as const,
      })),
      // Next month's days
      ...Array.from({ length: 42 - offset - daysInMonth }, (_, i) => ({
        day: i + 1,
        type: "next" as const,
      })),
    ];
  }, [prevMonthDays, daysInMonth, offset]);

  // Function to select a date and close the calendar
  const handleSelectDate = useCallback(
    (day: number, type: "prev" | "current" | "next") => {
      // Determine the month for the selected day
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

      // Determine the year for the selected day
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
      setSelectedDate(date);      // Update selected date
      onChange?.(date);           // Call optional callback
      setIsOpen(false);           // Close calendar
    },
    [currentMonth, currentYear, onChange]
  );

  // Go to previous month
  const prevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  // Go to next month
  const nextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  // Generate JSX for all calendar days (memoized)
  const calendarDays = useMemo(() => {
    return daysArray.map(({ day, type }, idx) => {
      // Check if this day is the selected date
      const isSelected =
        selectedDate &&
        day === selectedDate.getDate() &&
        type === "current" &&
        currentMonth === selectedDate.getMonth() &&
        currentYear === selectedDate.getFullYear();

      // Check if this day is today
      const isToday =
        day === today.getDate() &&
        type === "current" &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

      return (
        <div
          key={idx}
          className={`day ${type} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
          onClick={() => handleSelectDate(day, type)}
        >
          {day}
        </div>
      );
    });
  }, [daysArray, selectedDate, currentMonth, currentYear, today, handleSelectDate]);

  return (
    <div className="datepicker">
      {/* Input field to show selected date */}
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
        onClick={() => setIsOpen((open) => !open)} // Toggle calendar
      />

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="calendar">
          {/* Calendar header with navigation */}
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

          {/* Calendar grid */}
          <div className="calendar-grid">
            {/* Render days of the week */}
            {daysOfWeek.map((d) => (
              <div key={d} className="day-name">
                {d}
              </div>
            ))}

            {/* Render calendar days */}
            {calendarDays}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
