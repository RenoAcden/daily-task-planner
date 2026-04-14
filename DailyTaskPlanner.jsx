import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import WeeklyCalendar from './components/WeeklyCalendar';
import TaskInputForm from './components/TaskInputForm';
import Timeline from './components/Timeline';
import TaskList from './components/TaskList';
import ToastNotification from './components/ToastNotification';
import { formatYMD, getStartOfWeek } from './utils/dateUtils';

export default function DailyTaskPlanner() {
  const [theme, setTheme] = useState('light');
  
  const [dateStr, setDateStr] = useState(() => formatYMD(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [tasksByDate, setTasksByDate] = useState({});
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('planner_theme') || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('planner_theme', theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem('planner_tasks');
    if (saved) {
      try {
        setTasksByDate(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local tasks.");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('planner_tasks', JSON.stringify(tasksByDate));
  }, [tasksByDate]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  const showNotification = useCallback((title) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification("Task Reminder: " + title);
    }
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, title }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 8000);
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentYMD = formatYMD(now);
      const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const todaysTasks = tasksByDate[currentYMD] || [];
      todaysTasks.forEach(t => {
        if (!t.completed && t.reminderTime === currentHM) {
          showNotification(t.title);
        }
      });
    };

    const id = setInterval(checkReminders, 60000);
    return () => clearInterval(id);
  }, [tasksByDate, showNotification]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleSelectDate = (d) => {
    setSelectedDate(d);
    setDateStr(formatYMD(d));
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const handleAddTask = (task) => {
    setTasksByDate(prev => {
      const dayTasks = prev[dateStr] || [];
      const updated = [...dayTasks, task].sort((a, b) => a.startTime.localeCompare(b.startTime));
      return { ...prev, [dateStr]: updated };
    });
  };

  const handleToggleTask = (id) => {
    setTasksByDate(prev => ({
      ...prev,
      [dateStr]: prev[dateStr].map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const handleDeleteTask = (id) => {
    setTasksByDate(prev => ({
      ...prev,
      [dateStr]: prev[dateStr].filter(t => t.id !== id)
    }));
  };

  const handleUpdateTask = (id, updatedTask) => {
    setTasksByDate(prev => {
      const dayTasks = prev[dateStr];
      const updated = dayTasks.map(t => t.id === id ? updatedTask : t).sort((a, b) => a.startTime.localeCompare(b.startTime));
      return { ...prev, [dateStr]: updated };
    });
  };

  const activeTasksForDay = tasksByDate[dateStr] || [];

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] transition-colors duration-300 antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        [data-theme='light'] {
          --bg-color: #f3f4f6;
          --surface-color: #ffffff;
          --surface-hover: #f9fafb;
          --text-main: #111827;
          --text-muted: #6b7280;
          --border-color: #e5e7eb;
          --accent-color: #3b82f6;

          --priority-low-bg: rgba(34, 197, 94, 0.15);
          --priority-low-text: #166534;
          --priority-low-border: rgba(34, 197, 94, 0.4);

          --priority-med-bg: rgba(245, 158, 11, 0.15);
          --priority-med-text: #92400e;
          --priority-med-border: rgba(245, 158, 11, 0.4);

          --priority-high-bg: rgba(239, 68, 68, 0.15);
          --priority-high-text: #991b1b;
          --priority-high-border: rgba(239, 68, 68, 0.4);
        }

        [data-theme='dark'] {
          --bg-color: #0f172a;
          --surface-color: #1e293b;
          --surface-hover: #334155;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --border-color: #334155;
          --accent-color: #60a5fa;

          --priority-low-bg: rgba(34, 197, 94, 0.2);
          --priority-low-text: #86efac;
          --priority-low-border: rgba(34, 197, 94, 0.3);

          --priority-med-bg: rgba(245, 158, 11, 0.2);
          --priority-med-text: #fcd34d;
          --priority-med-border: rgba(245, 158, 11, 0.3);

          --priority-high-bg: rgba(239, 68, 68, 0.2);
          --priority-high-text: #fca5a5;
          --priority-high-border: rgba(239, 68, 68, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--border-color);
          border-radius: 20px;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}} />

      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col gap-8">
             <WeeklyCalendar 
               currentWeekStart={currentWeekStart} 
               selectedDate={selectedDate} 
               onSelectDate={handleSelectDate} 
               onNextWeek={handleNextWeek} 
               onPrevWeek={handlePrevWeek} 
               tasksByDate={tasksByDate} 
             />
             <TaskInputForm onAddTask={handleAddTask} />
          </div>
          <div className="flex flex-col gap-8">
             <Timeline tasks={activeTasksForDay} />
             <TaskList 
               tasks={activeTasksForDay} 
               onToggle={handleToggleTask} 
               onDelete={handleDeleteTask} 
               onUpdate={handleUpdateTask} 
             />
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 pointer-events-none">
        {toasts.map(toast => (
          <ToastNotification key={toast.id} toast={toast} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
        ))}
      </div>
    </div>
  );
}
