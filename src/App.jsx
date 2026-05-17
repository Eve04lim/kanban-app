import { useReducer, useEffect } from 'react';
import Board from './components/Board';
import { reducer, initialState } from './reducer';
import './App.css';

function loadState() {
  try {
    const saved = localStorage.getItem('kanban-state');
    return saved ? JSON.parse(saved) : initialState;
  } catch {
    return initialState;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem('kanban-state', JSON.stringify(state));
  }, [state]);

  return (
    <div className="app">
      <h1 className="app-title">Kanban Board</h1>
      <Board
        columns={state.columns}
        cards={state.cards}
        filter={state.filter}
        dispatch={dispatch}
      />
    </div>
  );
}
