import React from "react";

const URGENCY_LABEL = { alta: "🔴 Alta", media: "🟡 Média", baixa: "🟢 Baixa" };
const URGENCY_CLASS = { alta: "badge-urgency-alta", media: "badge-urgency-media", baixa: "badge-urgency-baixa" };

function calcDuration(startDate, doneAt) {
  if (!startDate || !doneAt) return null;
  const start = new Date(startDate);
  const end   = new Date(doneAt);
  const diffMs = end - start;
  const days   = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1)  return "menos de 1 dia";
  if (days === 1) return "1 dia";
  return `${days} dias`;
}

export default function Task({ task, onToggle, onDelete }) {
  const duration = task.done ? calcDuration(task.startDate, task.doneAt) : null;

  const accentColor = task.color || "var(--accent)";

  return (
    <div
      className={`task ${task.done ? "task-done" : ""}`}
      style={{ "--task-accent": accentColor, background: "var(--surface-2)" }}
    >
      <div className="task-title">{task.title}</div>

      <div className="task-meta">
        {task.deadline && (
          <span className="task-badge badge-deadline">📅 {task.deadline}</span>
        )}
        {task.urgency && (
          <span className={`task-badge ${URGENCY_CLASS[task.urgency]}`}>
            {URGENCY_LABEL[task.urgency]}
          </span>
        )}
      </div>

      {task.description && (
        <div className="task-description">{task.description}</div>
      )}

      {task.done && duration && (
        <div className="task-done-feedback">✅ Concluída em {duration}</div>
      )}
      {task.done && !duration && (
        <div className="task-done-feedback">✅ Concluída</div>
      )}

      <div className="task-actions">
        {!task.done ? (
          <button className="btn btn-success btn-sm" onClick={onToggle}>
            ✓ Concluir
          </button>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={onToggle}>
            ↩ Reabrir
          </button>
        )}
        {!task.done && (
          <button className="btn btn-danger btn-sm" onClick={onDelete}>
            🗑
          </button>
        )}
      </div>
    </div>
  );
}
