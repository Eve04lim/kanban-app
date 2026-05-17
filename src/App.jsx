import { useReducer, useEffect, useState } from 'react';
import Board from './components/Board';
import { reducer, initialState } from './reducer';
import './App.css';

function loadState() {
  try {
    const saved = localStorage.getItem('kanban-state');
    const present = saved
      ? { ...initialState.present, ...JSON.parse(saved) }
      : initialState.present;
    return { past: [], present, future: [] };
  } catch {
    return initialState;
  }
}

function getInitialTheme() {
  const saved = localStorage.getItem('kanban-theme');
  if (saved) return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('kanban-state', JSON.stringify(state.present));
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kanban-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app">
      <h1 className="app-title">Kanban Board</h1>
      <Board
        columns={state.present.columns}
        cards={state.present.cards}
        filter={state.present.filter}
        search={state.present.search ?? ''}
        canUndo={state.past.length > 0}
        canRedo={state.future.length > 0}
        theme={theme}
        onToggleTheme={toggleTheme}
        dispatch={dispatch}
      />
    </div>
  );
}
