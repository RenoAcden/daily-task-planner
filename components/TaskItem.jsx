import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellOff, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react';

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef(null);

  const [editTitle, setEditTitle] = useState(task.title);
  const [editStart, setEditStart] = useState(task.startTime);
  const [editEnd, setEditEnd] = useState(task.endTime);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editReminder, setEditReminder] = useState(task.reminderTime || '');

  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (!editTitle.trim() || editStart >= editEnd) return;
    onUpdate(task.id, {
      ...task,
      title: editTitle.trim(),
      startTime: editStart,
      endTime: editEnd,
      priority: editPriority,
      reminderTime: editReminder || null
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 rounded-xl border-2 border-[var(--accent-color)] bg-[var(--surface-color)] flex flex-col gap-3 shadow-md animate-slide-up">
         <input 
           ref={titleRef}
           type="text" 
           value={editTitle} 
           onChange={e=>setEditTitle(e.target.value)} 
           className="p-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm font-medium" 
           aria-label="Edit title"
         />
         <div className="flex flex-wrap gap-2 text-sm">
           <input type="time" value={editStart} onChange={e=>setEditStart(e.target.value)} aria-label="Edit start time" className="p-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] flex-1 focus:outline-none" />
           <input type="time" value={editEnd} onChange={e=>setEditEnd(e.target.value)} aria-label="Edit end time" className="p-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] flex-1 focus:outline-none" />
         </div>
         <div className="flex flex-wrap gap-2 text-sm items-center justify-between">
           <div className="flex gap-2 w-full sm:w-auto">
             <input type="time" value={editReminder} onChange={e=>setEditReminder(e.target.value)} aria-label="Edit reminder" className="p-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] flex-1 focus:outline-none" />
             <select value={editPriority} onChange={e=>setEditPriority(e.target.value)} aria-label="Edit priority" className="p-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] flex-1 focus:outline-none font-medium">
               <option>Low</option><option>Medium</option><option>High</option>
             </select>
           </div>
           <div className="flex gap-2 ml-auto w-full sm:w-auto mt-2 sm:mt-0">
             <button onClick={handleSave} className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 flex-1 sm:flex-none">Save</button>
             <button onClick={()=>setIsEditing(false)} className="px-4 py-2 text-sm border border-[var(--border-color)] bg-[var(--surface-color)] rounded-lg hover:bg-[var(--surface-hover)] font-medium flex-1 sm:flex-none">Cancel</button>
           </div>
         </div>
      </div>
    );
  }

  let priorityBadgeClass = 'bg-[var(--priority-low-bg)] text-[var(--priority-low-text)] border-[var(--priority-low-border)]';
  if (task.priority === 'Medium') priorityBadgeClass = 'bg-[var(--priority-med-bg)] text-[var(--priority-med-text)] border-[var(--priority-med-border)]';
  if (task.priority === 'High') priorityBadgeClass = 'bg-[var(--priority-high-bg)] text-[var(--priority-high-text)] border-[var(--priority-high-border)]';

  return (
    <div className={`p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] flex items-center gap-4 transition-all hover:shadow-sm group ${task.completed ? 'opacity-50' : ''}`}>
      <button 
        onClick={() => onToggle(task.id)} 
        className="shrink-0 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] rounded-full transition-transform hover:scale-110" 
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed ? <CheckCircle2 className="text-green-500 w-6 h-6" /> : <Circle className="text-[var(--text-muted)] hover:text-[var(--text-main)] w-6 h-6 transition-colors" />}
      </button>
      
      <div className={`flex-1 flex flex-col min-w-0 ${task.completed ? 'line-through' : ''}`}>
        <span className="font-semibold text-[15px] truncate">{task.title}</span>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
           <span className="text-xs opacity-70 bg-[var(--bg-color)] px-2 py-0.5 rounded-md border border-[var(--border-color)] font-medium">
              {task.startTime} - {task.endTime}
           </span>
           <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${priorityBadgeClass}`}>
             {task.priority}
           </span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
         <div title={task.reminderTime ? `Reminder set for ${task.reminderTime}` : "No reminder"}>
           {task.reminderTime 
              ? <Bell className="w-4 h-4 text-[var(--accent-color)]" fill="currentColor" /> 
              : <BellOff className="w-4 h-4 opacity-30" />
           }
         </div>
         <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors text-[var(--text-muted)] opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none" aria-label="Edit task">
           <Pencil className="w-4 h-4" />
         </button>
         <button onClick={() => onDelete(task.id)} className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-[var(--text-muted)] opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none" aria-label="Delete task">
           <Trash2 className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
}
