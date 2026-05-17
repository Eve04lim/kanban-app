import { useMemo } from 'react';
import Column from './Column';

const PRIORITY_LABELS = { high: '高', medium: '中', low: '低' };

export default function Board({ columns, cards, filter, dispatch }) {
  const filteredCards = useMemo(() => {
    if (filter === 'all') return cards;
    return cards.filter(c => c.priority === filter);
  }, [cards, filter]);

  const progress = useMemo(() => {
    const total = cards.length;
    const done = cards.filter(c => c.columnId === 'done').length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }, [cards]);

  return (
    <div>
      <div className="board-controls">
        <div className="filter-buttons">
          {['all', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => dispatch({ type: 'SET_FILTER', filter: f })}
            >
              {f === 'all' ? '全て' : PRIORITY_LABELS[f]}
            </button>
          ))}
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-info">
            <span>{progress.done} / {progress.total} 完了</span>
            <span>{progress.pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
      </div>
      <div className="board">
        {columns.map(col => (
          <Column
            key={col.id}
            column={col}
            cards={filteredCards.filter(c => c.columnId === col.id)}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  );
}
