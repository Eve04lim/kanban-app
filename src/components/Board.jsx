import { useMemo, useState } from 'react';
import Column from './Column';

const PRIORITY_LABELS = { high: '高', medium: '中', low: '低' };

export default function Board({
  columns, cards, filter, search,
  canUndo, canRedo, theme, onToggleTheme, dispatch,
}) {
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');

  const filteredCards = useMemo(() => {
    let result = cards;
    if (filter !== 'all') result = result.filter((c) => c.priority === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.title.toLowerCase().includes(q) || (c.desc || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [cards, filter, search]);

  const progress = useMemo(() => {
    const total = cards.length;
    const done = cards.filter((c) => c.columnId === 'done').length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }, [cards]);

  const cardCountByColumn = useMemo(() => {
    const map = {};
    for (const c of cards) map[c.columnId] = (map[c.columnId] || 0) + 1;
    return map;
  }, [cards]);

  const handleAddColumn = () => {
    if (!newColTitle.trim()) return;
    dispatch({ type: 'ADD_COLUMN', id: `col-${Date.now()}`, title: newColTitle.trim() });
    setNewColTitle('');
    setAddingColumn(false);
  };

  const handleColKeyDown = (e) => {
    if (e.key === 'Enter') handleAddColumn();
    if (e.key === 'Escape') {
      setAddingColumn(false);
      setNewColTitle('');
    }
  };

  return (
    <div>
      <div className="board-controls">
        <div className="undo-redo-buttons">
          <button
            className="undo-btn"
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={!canUndo}
            aria-label="元に戻す"
          >
            ↩ Undo
          </button>
          <button
            className="redo-btn"
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={!canRedo}
            aria-label="やり直す"
          >
            ↪ Redo
          </button>
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
        <div className="filter-buttons">
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => dispatch({ type: 'SET_FILTER', filter: f })}
            >
              {f === 'all' ? '全て' : PRIORITY_LABELS[f]}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="search"
          placeholder="カードを検索…"
          value={search}
          onChange={(e) => dispatch({ type: 'SET_SEARCH', search: e.target.value })}
          aria-label="カード検索"
        />
        <div className="progress-bar-wrap">
          <div className="progress-info">
            <span>
              {progress.done} / {progress.total} 完了
            </span>
            <span>{progress.pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
      </div>
      <div className="board">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            cards={filteredCards.filter((c) => c.columnId === col.id)}
            totalCards={cardCountByColumn[col.id] ?? 0}
            dispatch={dispatch}
          />
        ))}
        {addingColumn ? (
          <div className="add-column-form">
            <input
              className="add-column-input"
              autoFocus
              placeholder="列名を入力"
              value={newColTitle}
              onChange={(e) => setNewColTitle(e.target.value)}
              onKeyDown={handleColKeyDown}
            />
            <div className="add-column-actions">
              <button className="btn-add-confirm" onClick={handleAddColumn}>
                追加
              </button>
              <button
                className="btn-add-cancel"
                onClick={() => {
                  setAddingColumn(false);
                  setNewColTitle('');
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <button className="add-column-btn" onClick={() => setAddingColumn(true)}>
            ＋ 列を追加
          </button>
        )}
      </div>
    </div>
  );
}
