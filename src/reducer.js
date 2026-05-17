export const initialState = {
  columns: [
    { id: 'todo',       title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done',       title: 'Done' },
  ],
  cards: [
    { id: 'c1', columnId: 'todo',       title: 'ログイン画面の実装',   desc: 'メールアドレス＋パスワード', priority: 'high' },
    { id: 'c2', columnId: 'todo',       title: 'APIエンドポイント設計', desc: 'RESTful設計',              priority: 'medium' },
    { id: 'c3', columnId: 'inprogress', title: 'DB設計',              desc: 'スキーマ定義',              priority: 'medium' },
    { id: 'c4', columnId: 'done',       title: '要件定義',             desc: '完了済み',                 priority: 'low' },
  ],
  filter: 'all',
};

export function reducer(state, action) {
  switch (action.type) {
    case 'MOVE_CARD':
      return {
        ...state,
        cards: state.cards.map(c =>
          c.id === action.cardId ? { ...c, columnId: action.targetColumnId } : c
        ),
      };
    case 'ADD_CARD':
      return { ...state, cards: [...state.cards, action.card] };
    case 'DELETE_CARD':
      return { ...state, cards: state.cards.filter(c => c.id !== action.cardId) };
    case 'EDIT_CARD':
      return {
        ...state,
        cards: state.cards.map(c =>
          c.id === action.cardId ? { ...c, ...action.changes } : c
        ),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}
