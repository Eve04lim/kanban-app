import { useState } from 'react';

const PRIORITY_STYLE = {
  high:   { bg: '#FCEBEB', color: '#A32D2D', label: '高' },
  medium: { bg: '#FAEEDA', color: '#854F0B', label: '中' },
  low:    { bg: '#EAF3DE', color: '#3B6D11', label: '低' },
};

export default function Card({ card, dispatch }) {
  const [dragging, setDragging] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [titleDraft, setTitleDraft] = useState(card.title);
  const [descDraft, setDescDraft] = useState(card.desc);

  const isEditing = editingTitle || editingDesc;
  const priority = PRIORITY_STYLE[card.priority] || PRIORITY_STYLE.medium;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('cardId', card.id);
    setDragging(true);
  };

  const confirmTitle = () => {
    dispatch({ type: 'EDIT_CARD', cardId: card.id, changes: { title: titleDraft } });
    setEditingTitle(false);
  };

  const confirmDesc = () => {
    dispatch({ type: 'EDIT_CARD', cardId: card.id, changes: { desc: descDraft } });
    setEditingDesc(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') confirmTitle();
    if (e.key === 'Escape') { setTitleDraft(card.title); setEditingTitle(false); }
  };

  const handleDescKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmDesc(); }
    if (e.key === 'Escape') { setDescDraft(card.desc); setEditingDesc(false); }
  };

  return (
    <div
      className={`card${dragging ? ' dragging' : ''}`}
      draggable={!isEditing}
      onDragStart={isEditing ? undefined : handleDragStart}
      onDragEnd={() => setDragging(false)}
    >
      <div className="card-header">
        <span
          className="priority-badge"
          style={{ background: priority.bg, color: priority.color }}
        >
          {priority.label}
        </span>
        <button
          className="card-delete"
          onClick={() => dispatch({ type: 'DELETE_CARD', cardId: card.id })}
          aria-label="削除"
        >
          ×
        </button>
      </div>
      {editingTitle ? (
        <input
          className="card-title-input"
          autoFocus
          value={titleDraft}
          onChange={e => setTitleDraft(e.target.value)}
          onBlur={confirmTitle}
          onKeyDown={handleTitleKeyDown}
        />
      ) : (
        <div
          className="card-title"
          onDoubleClick={() => { setTitleDraft(card.title); setEditingTitle(true); }}
        >
          {card.title}
        </div>
      )}
      {editingDesc ? (
        <textarea
          className="card-desc-input"
          autoFocus
          value={descDraft}
          onChange={e => setDescDraft(e.target.value)}
          onBlur={confirmDesc}
          onKeyDown={handleDescKeyDown}
        />
      ) : (
        <div
          className="card-desc"
          onDoubleClick={() => { setDescDraft(card.desc); setEditingDesc(true); }}
        >
          {card.desc || <span className="card-desc-placeholder">説明を追加…</span>}
        </div>
      )}
    </div>
  );
}
