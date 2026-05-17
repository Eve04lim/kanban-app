import { useState } from 'react';
import Card from './Card';

export default function Column({ column, cards, dispatch }) {
  const [isOver, setIsOver] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');

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
      },
    });
    setNewTitle('');
    setNewPriority('medium');
    setAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setAdding(false); setNewTitle(''); }
  };

  return (
    <div
      className={`column${isOver ? ' dragover' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-title">{column.title}</div>
      <div className="column-cards">
        {cards.map(card => (
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
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <select
            className="add-card-select"
            value={newPriority}
            onChange={e => setNewPriority(e.target.value)}
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <div className="add-card-actions">
            <button className="btn-add-confirm" onClick={handleAdd}>追加</button>
            <button className="btn-add-cancel" onClick={() => { setAdding(false); setNewTitle(''); }}>キャンセル</button>
          </div>
        </div>
      ) : (
        <button className="add-card-btn" onClick={() => setAdding(true)}>＋ カードを追加</button>
      )}
    </div>
  );
}
