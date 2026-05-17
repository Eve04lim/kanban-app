import { useState } from 'react';
import Board from './components/Board';
import './App.css';

const initialData = {
  columns: [
    { id: 'todo',       title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done',       title: 'Done' },
  ],
  cards: [
    { id: 'c1', columnId: 'todo',       title: 'ログイン画面の実装',   desc: 'メールアドレス＋パスワード' },
    { id: 'c2', columnId: 'todo',       title: 'APIエンドポイント設計', desc: 'RESTful設計' },
    { id: 'c3', columnId: 'inprogress', title: 'DB設計',              desc: 'スキーマ定義' },
    { id: 'c4', columnId: 'done',       title: '要件定義',             desc: '完了済み' },
  ],
};

export default function App() {
  const [data, setData] = useState(initialData);

  const handleCardMove = (cardId, targetColumnId) => {
    setData(prev => ({
      ...prev,
      cards: prev.cards.map(c =>
        c.id === cardId ? { ...c, columnId: targetColumnId } : c
      ),
    }));
  };

  return (
    <div className="app">
      <h1 className="app-title">Kanban Board</h1>
      <Board columns={data.columns} cards={data.cards} onCardMove={handleCardMove} />
    </div>
  );
}
