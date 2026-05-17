import { useState } from 'react';
import Card from './Card';

export default function Column({ column, cards, totalCards, dispatch }) {
  const [isOver, setIsOver] = useState(false);
  const [dropped, setDropped] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [renamingTitle, setRenamingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => setIsOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) {
      dispatch({ type: 'MOVE_CARD', cardId, targetColumnId: column.id });
      setDropped(true);
      setTimeout(() => setDropped(false), 300);
    }
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    dispatch({
      type: 'ADD_CARD',
      card: {
        id: `card-${Date.now()}`,
        columnId: column.id,
        title: newTitle.trim(),
        desc: '',
        priority: newPriority,
        dueDate: newDueDate || null,
      },
    });
    setNewTitle('');
    setNewPriority('medium');
    setNewDueDate('');
    setAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setAdding(false);
      setNewTitle('');
      setNewDueDate('');
    }
  };

  const confirmRename = () => {
    if (titleDraft.trim()) {
      dispatch({ type: 'RENAME_COLUMN', columnId: column.id, title: titleDraft.trim() });
    } else {
      setTitleDraft(column.title);
    }
    setRenamingTitle(false);
  };

  const handleRenameKeyDown = (e) => {
    if (e.key === 'Enter') confirmRename();
    if (e.key === 'Escape') {
      setTitleDraft(column.title);
      setRenamingTitle(false);
    }
  };

  const handleDeleteColumn = () => {
    if (
      totalCards > 0 &&
      !window.confirm(
        `「${column.title}」を削除しますか？\nこの列の ${totalCards} 枚のカードも削除されます。`
      )
    )
      return;
    dispatch({ type: 'DELETE_COLUMN', columnId: column.id });
  };

  return (
    <div
      className={`column${isOver ? ' dragover' : ''}${dropped ? ' drop-flash' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        {renamingTitle ? (
          <input
            className="column-title-input"
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={confirmRename}
            onKeyDown={handleRenameKeyDown}
          />
        ) : (
          <div
            className="column-title"
            onDoubleClick={() => {
              setTitleDraft(column.title);
              setRenamingTitle(true);
            }}
          >
            {column.title}
          </div>
        )}
        <button className="column-delete" onClick={handleDeleteColumn} aria-label="列を削除">
          ×
        </button>
      </div>
      <div className="column-cards">
        {cards.map((card) => (
          <Card key={card.id} card={card} dispatch={dispatch} />
        ))}
      </div>
      {adding ? (
        <div className="add-card-form">
          <input
            className="add-card-input"
            autoFocus
            placeholder="タイトルを入力"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <select
            className="add-card-select"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <input
            type="date"
            className="add-card-date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
          <div className="add-card-actions">
            <button className="btn-add-confirm" onClick={handleAdd}>
              追加
            </button>
            <button
              className="btn-add-cancel"
              onClick={() => {
                setAdding(false);
                setNewTitle('');
                setNewDueDate('');
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button className="add-card-btn" onClick={() => setAdding(true)}>
          ＋ カードを追加
        </button>
      )}
    </div>
  );
}
