import React, { useState } from "react";
import List from "./components/List/List";
import Modal from "./common/Modal";
import "./styles.css";

const COLORS = [
  { hex: "#7c6af7", label: "Roxo"    },
  { hex: "#f76a8a", label: "Rosa"    },
  { hex: "#6af7c8", label: "Verde"   },
  { hex: "#f7c46a", label: "Âmbar"   },
  { hex: "#6ab8f7", label: "Azul"    },
  { hex: "#f7976a", label: "Laranja" },
];

const emptyTask = {
  title: "", startDate: "", deadline: "", urgency: "media",
  description: "", color: ""
};

const emptyList = { name: "", description: "" };

export default function App() {
  const [lists, setLists] = useState([]);

  const [listModal, setListModal] = useState(false);
  const [listForm, setListForm] = useState(emptyList);
  const [listErrors, setListErrors] = useState({});

  const [taskModal, setTaskModal] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [taskErrors, setTaskErrors] = useState({});

  const [confirm, setConfirm] = useState(null);

  const openNewList = () => { setListForm(emptyList); setListErrors({}); setListModal(true); };

  const saveList = () => {
    const errors = {};
    if (!listForm.name.trim()) {
      errors.name = "Nome da lista é obrigatório.";
    }

    if (Object.keys(errors).length) { 
      setListErrors(errors); return; 
    }

    setLists(prev => [...prev, { ...listForm, tasks: [] }]);
    setListModal(false);
  };

  const deleteList = (idx) => {
    setConfirm({
      icon: "🗂️",
      title: "Excluir lista?",
      text: `A lista "${lists[idx].name}" e todas as suas tarefas serão removidas.`,
      onConfirm: () => {
        setLists(prev => prev.filter((_, i) => i !== idx));
        setConfirm(null);
      }
    });
  };

  const openNewTask = (listIdx) => {
    setCurrentList(listIdx);
    setTaskForm(emptyTask);
    setTaskErrors({});
    setTaskModal(true);
  };

  const saveTask = () => {
    const errors = {};

    const dateDiff = (new Date(taskForm.deadline) - new Date(taskForm.startDate)) / (1000 * 60 * 60 * 24);

    if (!taskForm.title.trim()) {
      errors.title = "Título é obrigatório.";
    }

    if (!taskForm.startDate) {
      errors.startDate = "Data de início é obrigatória.";
    }
    if (!taskForm.deadline){
      errors.deadline = "Prazo é obrigatório.";
    }

    if (dateDiff < 0) {
      errors.deadline = "Prazo não pode ser antes da data de ínicio";
    }

    if (Object.keys(errors).length) { 
      setTaskErrors(errors); return; 
    }

    setLists(prev => {
      const next = prev.map((l, i) => {
        if (i !== currentList) {
          return l;
        }

        return { ...l, tasks: [...l.tasks, { ...taskForm, done: false, doneAt: null }] };
      });
      return next;
    });
    setTaskModal(false);
  };

  const toggleTask = (listIdx, taskIdx) => {
    setLists(prev => prev.map((l, i) => {
      if (i !== listIdx){
        return l;
      }
      return {
        ...l,
        tasks: l.tasks.map((t, j) => {
          if (j !== taskIdx) return t;
          return { ...t, done: !t.done, doneAt: !t.done ? new Date().toISOString() : null };
        })
      };
    }));
  };

  const deleteTask = (listIdx, taskIdx) => {
    const task = lists[listIdx].tasks[taskIdx];
    if (task.done) {
      return;
    }

    setConfirm({
      icon: "🗑️",
      title: "Excluir tarefa?",
      text: `"${task.title}" será removida permanentemente.`,
      onConfirm: () => {
        setLists(prev => prev.map((l, i) => {
          if (i !== listIdx) {
            return l;
          }
          
          return { ...l, tasks: l.tasks.filter((_, j) => j !== taskIdx) };
        }));
        setConfirm(null);
      }
    });
  };

  const setField = (setter) => (field) => (e) =>
    setter(prev => ({ ...prev, [field]: e.target ? e.target.value : e }));

  const setListField = setField(setListForm);
  const setTaskField = setField(setTaskForm);

  return (
    <div className="app">

      <header className="app-header">
        <div className="app-logo">n<span>Time</span></div>
        <button className="btn btn-primary" onClick={openNewList}>
          + Nova Lista
        </button>
      </header>

      <main className="app-main">
        {lists.length === 0 ? (
          <div className="board-empty">
            <div className="board-empty-icon">📋</div>
            <p>Nenhuma lista ainda</p>
            <small>Clique em "Nova Lista" para começar</small>
          </div>
        ) : (
          <div className="board">
            {lists.map((list, i) => (
              <List
                key={i}
                list={list}
                onAddTask={() => openNewTask(i)}
                onDeleteList={() => deleteList(i)}
                onToggleTask={(t) => toggleTask(i, t)}
                onDeleteTask={(t) => deleteTask(i, t)}
              />
            ))}
          </div>
        )}
      </main>

      {listModal && (
        <Modal onClose={() => setListModal(false)}>
          <div className="modal-header">
            <span className="modal-title">Nova Lista</span>
            <button className="btn btn-ghost btn-icon" onClick={() => setListModal(false)}>✕</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nome <span className="required">*</span></label>
              <input
                className="form-input"
                placeholder="Ex: Trabalho, Estudos..."
                value={listForm.name}
                onChange={setListField("name")}
              />
              {listErrors.name && <span className="form-error">{listErrors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Descrição <span style={{color:"var(--text-muted)",fontWeight:400,textTransform:"none",letterSpacing:0}}>(opcional)</span></label>
              <textarea
                className="form-textarea"
                placeholder="Descreva o objetivo desta lista..."
                value={listForm.description}
                onChange={setListField("description")}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setListModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={saveList}>Criar Lista</button>
          </div>
        </Modal>
      )}

      {taskModal && (
        <Modal onClose={() => setTaskModal(false)}>
          <div className="modal-header">
            <span className="modal-title">Nova Tarefa</span>
            <button className="btn btn-ghost btn-icon" onClick={() => setTaskModal(false)}>✕</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Título <span className="required">*</span></label>
              <input
                className="form-input"
                placeholder="Nome da tarefa"
                value={taskForm.title}
                onChange={setTaskField("title")}
              />
              {taskErrors.title && <span className="form-error">{taskErrors.title}</span>}
            </div>

            <div className="form-row">
              <div className="form-group" style={{marginBottom:0}}>
                <label className="form-label">Início <span className="required">*</span></label>
                <input
                  className="form-input"
                  type="date"
                  value={taskForm.startDate}
                  onChange={setTaskField("startDate")}
                />
                {taskErrors.startDate && <span className="form-error">{taskErrors.startDate}</span>}
              </div>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="form-label">Prazo <span className="required">*</span></label>
                <input
                  className="form-input"
                  type="date"
                  value={taskForm.deadline}
                  onChange={setTaskField("deadline")}
                />
                {taskErrors.deadline && <span className="form-error">{taskErrors.deadline}</span>}
              </div>
            </div>
            <div style={{marginBottom:14}}/>

            <div className="form-group">
              <label className="form-label">Urgência</label>
              <select
                className="form-select"
                value={taskForm.urgency}
                onChange={setTaskField("urgency")}
              >
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Média</option>
                <option value="baixa">🟢 Baixa</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea
                className="form-textarea"
                placeholder="Detalhes da tarefa..."
                value={taskForm.description}
                onChange={setTaskField("description")}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cor de destaque</label>
              <div className="color-swatches">
                {COLORS.map(c => (
                  <button
                    key={c.hex}
                    title={c.label}
                    className={`swatch ${taskForm.color === c.hex ? "active" : ""}`}
                    style={{ background: c.hex }}
                    onClick={() => setTaskForm(prev => ({ ...prev, color: taskForm.color === c.hex ? "" : c.hex }))}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setTaskModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={saveTask}>Salvar Tarefa</button>
          </div>
        </Modal>
      )}

      {confirm && (
        <Modal onClose={() => setConfirm(null)} className="confirm-dialog">
          <div className="modal-body" style={{textAlign:"center",padding:"28px 24px 20px"}}>
            <div className="confirm-icon">{confirm.icon}</div>
            <div className="modal-title" style={{marginBottom:8}}>{confirm.title}</div>
            <p className="confirm-text">{confirm.text}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setConfirm(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={confirm.onConfirm}>Confirmar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
