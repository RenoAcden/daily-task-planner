import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatYMD } from '../utils/dateUtils';

export default function WeeklyCalendar({ currentWeekStart, selectedDate, onSelectDate, onNextWeek, onPrevWeek, tasksByDate }) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const todayStr = formatYMD(new Date());
  
  return (
    <section className="bg-[var(--surface-color)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{days[0].toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
        <div className="flex gap-2">
          <button onClick={onPrevWeek} aria-label="Previous week" className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--surface-hover)] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={onNextWeek} aria-label="Next week" className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--surface-hover)] transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between gap-2">
         {days.map(d => {
           const ymd = formatYMD(d);
           const isToday = ymd === todayStr;
           const isSelected = ymd === formatYMD(selectedDate);
           const hasTasks = tasksByDate[ymd] && tasksByDate[ymd].length > 0;
           
           return (
             <button 
               key={ymd} 
               onClick={() => onSelectDate(d)} 
               aria-label={`Select date ${d.toDateString()}`}
               className={`flex flex-col items-center py-2 px-1 sm:w-12 h-16 rounded-xl border focus:outline-none transition-all ${
                 isSelected ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] shadow-md' :
                 isToday ? 'border-2 border-[var(--accent-color)] bg-[var(--bg-color)]' :
                 'border-transparent hover:bg-[var(--surface-hover)] bg-transparent'
               }`}
             >
                <span className="text-[11px] uppercase font-semibold mt-0.5 opacity-80">
                  {d.toLocaleDateString(undefined, { weekday: 'short' }).substring(0, 3)}
                </span>
                <span className="text-sm font-semibold mt-1">{d.getDate()}</span>
                {hasTasks && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-auto mb-0.5 ${isSelected ? 'bg-white' : 'bg-[var(--accent-color)]'}`}></div>
                )}
             </button>
           );
         })}
      </div>
    </section>
  );
}
