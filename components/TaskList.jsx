import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  return (
    <section className="bg-[var(--surface-color)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Checklist</h2>
      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="text-[14px] opacity-60 italic text-center py-8 font-medium bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)] border-dashed">
            No tasks planned for this day. Enjoy your free time!
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
          ))
        )}
      </div>
    </section>
  );
}
