import React from 'react';

export default function Timeline({ tasks }) {
  const START_HOUR = 6;
  const END_HOUR = 23;
  const HOUR_HEIGHT = 64; 
  
  const hours = [];
  for (let i = START_HOUR; i <= END_HOUR; i++) {
    hours.push(i);
  }

  return (
    <section className="bg-[var(--surface-color)] border border-[var(--border-color)] shadow-sm rounded-xl p-6 flex flex-col h-[480px]">
      <h2 className="text-lg font-semibold mb-4 shrink-0">Timeline</h2>
      <div className="relative overflow-y-auto pr-2 rounded-lg custom-scrollbar flex-1 pb-4">
        <div className="relative" style={{ height: `${(END_HOUR - START_HOUR + 1) * HOUR_HEIGHT}px` }}>
          {hours.map(hour => (
            <div key={hour} className="absolute w-full flex items-start" style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}>
              <span className="w-12 text-right mr-4 text-[12px] opacity-50 font-semibold translate-y-[-50%] tracking-wider">
                 {String(hour).padStart(2,'0')}:00
              </span>
              <div className="flex-1 border-t border-[var(--border-color)]"></div>
            </div>
          ))}

          {tasks.map(task => {
             const [sh, sm] = task.startTime.split(':').map(Number);
             const [eh, em] = task.endTime.split(':').map(Number);
             
             const startMins = (sh - START_HOUR) * 60 + sm;
             const endMins = (eh - START_HOUR) * 60 + em;
             
             if (eh < START_HOUR || sh > 24) return null;

             const top = (startMins / 60) * HOUR_HEIGHT;
             const height = ((endMins - startMins) / 60) * HOUR_HEIGHT;
             
             const clampedTop = Math.max(0, top);
             const clampedHeight = Math.max(20, height);

             let bgColorClass = 'bg-[var(--priority-low-bg)] text-[var(--priority-low-text)] border-[var(--priority-low-border)]';
             if (task.priority === 'Medium') bgColorClass = 'bg-[var(--priority-med-bg)] text-[var(--priority-med-text)] border-[var(--priority-med-border)]';
             if (task.priority === 'High') bgColorClass = 'bg-[var(--priority-high-bg)] text-[var(--priority-high-text)] border-[var(--priority-high-border)]';

             return (
               <div key={task.id} 
                    className={`absolute left-[70px] right-2 rounded-lg p-2 border shadow-sm flex flex-col justify-start z-10 transition-opacity hover:z-20 ${bgColorClass} ${task.completed ? 'opacity-40' : 'backdrop-blur-sm'}`}
                    style={{ top: `${clampedTop}px`, height: `${clampedHeight}px` }}>
                  <div className={`text-sm font-semibold truncate ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </div>
                  {clampedHeight >= 45 && (
                    <div className="text-[11px] opacity-80 mt-1 font-medium tracking-wide">
                      {task.startTime} - {task.endTime}
                    </div>
                  )}
               </div>
             )
          })}
        </div>
      </div>
    </section>
  );
}
