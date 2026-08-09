import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock } from "lucide-react";

function CalendarView({ appointments }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = () => setCurrentDate(new Date());

  const appointmentsByDate = useMemo(() => {
    const map = {};
    appointments.forEach((apt) => {
      if (!apt.date) return;
      const d = new Date(apt.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(apt);
    });
    return map;
  }, [appointments]);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const isToday = (day) => {
    const now = new Date();
    return day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
  };

  const getDayKey = (day) => `${year}-${month}-${day}`;

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <h3><CalIcon size={18} /> {monthName}</h3>
        <div className="calendar-nav">
          <button type="button" onClick={prevMonth}><ChevronLeft size={18} /></button>
          <button type="button" className="today-btn" onClick={today}>Today</button>
          <button type="button" onClick={nextMonth}><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div className="calendar-weekday" key={d}>{d}</div>
        ))}
        {calendarDays.map((day, idx) => {
          if (day === null) return <div className="calendar-day empty" key={idx} />;
          const key = getDayKey(day);
          const dayApts = appointmentsByDate[key] || [];
          const todayClass = isToday(day) ? "today" : "";
          return (
            <div className={`calendar-day ${todayClass}`} key={idx}>
              <span className="day-number">{day}</span>
              {dayApts.length > 0 && (
                <div className="day-events">
                  {dayApts.slice(0, 3).map((apt, i) => (
                    <span className={`day-event ${apt.status?.toLowerCase() || "pending"}`} key={i} title={`${apt.patient} with ${apt.doctor} at ${apt.time}`}>
                      <Clock size={10} /> {apt.time || "--:--"} {apt.patient}
                    </span>
                  ))}
                  {dayApts.length > 3 && <span className="day-more">+{dayApts.length - 3} more</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;
