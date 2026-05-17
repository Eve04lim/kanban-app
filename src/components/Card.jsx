import { useState } from 'react';

export default function Card({ card }) {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('cardId', card.id);
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  return (
    <div
      className={`card${dragging ? ' dragging' : ''}`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="card-title">{card.title}</div>
      <div className="card-desc">{card.desc}</div>
    </div>
  );
}
