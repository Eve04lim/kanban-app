import { useState, useEffect, useRef } from 'react';

const PRIORITY_STYLE = {
  high: { bg: '#FCEBEB', color: '#A32D2D', label: '高' },
  medium: { bg: '#FAEEDA', color: '#854F0B', label: '中' },
  low: { bg: '#EAF3DE', color: '#3B6D11', label: '低' },
};

function getDueDateInfo(dueDate) {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diff = Math.round((due - today) / 864e5);
  const label = `${due.getMonth() + 1}/${due.getDate()}`;
  if (diff < 0) return { bg: '#FCEBEB', color: '#A32D2D', label };
  if (diff === 0) return { bg: '#FAEEDA', color: '#854F0B', label };
  if (diff <= 3) return { bg: '#EAF3DE', color: '#3B6D11', label };
  return { bg: '#F0F0F0', color: '#666', label };
}

export default function Card({ card, dispatch }) {
  const cardRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [titleDraft, setTitleDraft] = useState(card.title);
  const [descDraft, setDescDraft] = useState(card.desc);
  const [dueDateDraft, setDueDateDraft] = useState(card.dueDate ?? '');

  // Mount: fadeSlideIn (no React state — avoids act() warnings in tests)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.classList.add('fade-slide-in');
    const t = setTimeout(() => el.classList.remove('fade-slide-in'), 200);
    return () => clearTimeout(t);
  }, []);

  const isEditing = editingTitle || editingDesc || editingDueDate;
  const priority = PRIORITY_STYLE[card.priority] || PRIORITY_STYLE.medium;
  const dueDateInfo = getDueDateInfo(card.dueDate);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('cardId', card.id);
    setDragging(true);
  };

  const handleDelete = () => {
    const el = cardRef.current;
    if (el) el.classList.add('fade-out');
    setTimeout(() => dispatch({ type: 'DELETE_CARD', cardId: card.id }), 200);
  };

  const confirmTitle = () => {
    dispatch({ type: 'EDIT_CARD', cardId: card.id, changes: { title: titleDraft } });
    setEditingTitle(false);
  };

  const confirmDesc = () => {
    dispatch({ type: 'EDIT_CARD', cardId: card.id, changes: { desc: descDraft } });
    setEditingDesc(false);
  };

  const confirmDueDate = () => {
    dispatch({
      type: 'EDIT_CARD',
      cardId: card.id,
      changes: { dueDate: dueDateDraft || null },
    });
    setEditingDueDate(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') confirmTitle();
    if (e.key === 'Escape') {
      setTitleDraft(card.title);
      setEditingTitle(false);
    }
  };

  const handleDescKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmDesc();
    }
    if (e.key === 'Escape') {
      setDescDraft(card.desc);
      setEditingDesc(false);
    }
  };

  const handleDueDateKeyDown = (e) => {
    if (e.key === 'Enter') confirmDueDate();
    if (e.key === 'Escape') {
      setDueDateDraft(card.dueDate ?? '');
      setEditingDueDate(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`card${dragging ? ' dragging' : ''}`}
      draggable={!isEditing}
      onDragStart={isEditing ? undefined : handleDragStart}
      onDragEnd={() => setDragging(false)}
    >
      <div className="card-header">
        <span className="priority-badge" style={{ background: priority.bg, color: priority.color }}>
          {priority.label}
        </span>
        <button className="card-delete" onClick={handleDelete} aria-label="削除">
          ×
        </button>
      </div>
      {editingTitle ? (
        <input
          className="card-title-input"
          autoFocus
          value={titleDraft}
          onChange={(e) => setTitleDraft(e.target.value)}
          onBlur={confirmTitle}
          onKeyDown={handleTitleKeyDown}
        />
      ) : (
        <div
          className="card-title"
          onDoubleClick={() => {
            setTitleDraft(card.title);
            setEditingTitle(true);
          }}
        >
          {card.title}
        </div>
      )}
      {editingDesc ? (
        <textarea
          className="card-desc-input"
          autoFocus
          value={descDraft}
          onChange={(e) => setDescDraft(e.target.value)}
          onBlur={confirmDesc}
          onKeyDown={handleDescKeyDown}
        />
      ) : (
        <div
          className="card-desc"
          onDoubleClick={() => {
            setDescDraft(card.desc);
            setEditingDesc(true);
          }}
        >
          {card.desc || <span className="card-desc-placeholder">説明を追加…</span>}
        </div>
      )}
      <div className="card-due">
        {editingDueDate ? (
          <input
            type="date"
            className="card-date-input"
            autoFocus
            value={dueDateDraft}
            onChange={(e) => setDueDateDraft(e.target.value)}
            onBlur={confirmDueDate}
            onKeyDown={handleDueDateKeyDown}
          />
        ) : dueDateInfo ? (
          <span
            className="due-date-badge"
            style={{ background: dueDateInfo.bg, color: dueDateInfo.color }}
            onDoubleClick={() => {
              setDueDateDraft(card.dueDate ?? '');
              setEditingDueDate(true);
            }}
          >
            {dueDateInfo.label}
          </span>
        ) : (
          <button
            className="due-date-set-btn"
            onClick={() => {
              setDueDateDraft('');
              setEditingDueDate(true);
            }}
          >
            期日を設定
          </button>
        )}
      </div>
    </div>
  );
}
