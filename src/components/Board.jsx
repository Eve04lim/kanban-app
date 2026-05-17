import Column from './Column';

export default function Board({ columns, cards, onCardMove }) {
  return (
    <div className="board">
      {columns.map(col => (
        <Column
          key={col.id}
          column={col}
          cards={cards.filter(c => c.columnId === col.id)}
          onCardMove={onCardMove}
        />
      ))}
    </div>
  );
}
