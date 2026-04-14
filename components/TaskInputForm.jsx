import React, { useState } from 'react';
import { generateId } from '../utils/dateUtils';

export default function TaskInputForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [reminder, setReminder] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Task title cannot be empty.'); return; }
    if (startTime >= endTime) { setError('End time must be after start time.'); return; }
    
    onAddTask({
      id: generateId(),
      title: title.trim(),
      startTime,
      endTime,
      reminderTime: reminder || null,
      priority,
      completed: false
    });
    
    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setReminder('');
    setPriority('Medium');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--surface-color)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">New Task</h2>
      
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-title" className="text-[14px] opacity-60 font-medium">Task Title</label>
        <input 
          id="task-title"
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="What do you need to do?"
          className="p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-shadow"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="start-time" className="text-[14px] opacity-60 font-medium">Start Time</label>
          <input 
            id="start-time"
            type="time" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            className="p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-shadow" 
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="end-time" className="text-[14px] opacity-60 font-medium">End Time</label>
          <input 
            id="end-time"
            type="time" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
            className="p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-shadow" 
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="reminder-time" className="text-[14px] opacity-60 font-medium">Reminder Time (Optional)</label>
          <input 
            id="reminder-time"
            type="time" 
            value={reminder} 
            onChange={(e) => setReminder(e.target.value)} 
            className="p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-shadow" 
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="priority" className="text-[14px] opacity-60 font-medium">Priority</label>
          <select 
            id="priority"
            value={priority} 
            onChange={(e) => setPriority(e.target.value)} 
            className="p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-shadow"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-1" role="alert">{error}</p>}
      
      <button type="submit" className="mt-2 bg-[var(--accent-color)] text-white p-3 rounded-lg font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm">
        Add Task
      </button>
    </form>
  );
}
