import React from "react";
import Task from "../Task/Task";

export default function List({ list, onAddTask, onDeleteList, onToggleTask, onDeleteTask }) {
  const total = list.tasks.length;
  const done  = list.tasks.filter(t => t.done).length;

  return (
    <div className="list">
      <div className="list-header">
        <div className="list-header-info">
          <div className="list-name">{list.name}</div>
          {list.description && (
            <div className="list-description">{list.description}</div>
          )}
          <div className="list-task-count">
            {done}/{total} {total === 1 ? "tarefa" : "tarefas"} concluída{done !== 1 ? "s" : ""}
          </div>
        </div>
        <button
          className="btn btn-danger btn-icon btn-sm"
          title="Excluir lista"
          onClick={onDeleteList}
        >🗑</button>
      </div>

      <div className="list-body">
        {list.tasks.length === 0 && (
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center", padding: "12px 0" }}>
            Nenhuma tarefa ainda
          </p>
        )}
        {list.tasks.map((task, i) => (
          <Task
            key={i}
            task={task}
            onToggle={() => onToggleTask(i)}
            onDelete={() => onDeleteTask(i)}
          />
        ))}
      </div>

      <div className="list-footer">
        <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={onAddTask}>
          + Tarefa
        </button>
      </div>
    </div>
  );
}
