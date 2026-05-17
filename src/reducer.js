const presentInitial = {
  columns: [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ],
  cards: [
    { id: 'c1', columnId: 'todo', title: 'ログイン画面の実装', desc: 'メールアドレス＋パスワード', priority: 'high', dueDate: null },
    { id: 'c2', columnId: 'todo', title: 'APIエンドポイント設計', desc: 'RESTful設計', priority: 'medium', dueDate: null },
    { id: 'c3', columnId: 'inprogress', title: 'DB設計', desc: 'スキーマ定義', priority: 'medium', dueDate: null },
    { id: 'c4', columnId: 'done', title: '要件定義', desc: '完了済み', priority: 'low', dueDate: null },
  ],
  filter: 'all',
  search: '',
};

export const initialState = {
  past: [],
  present: presentInitial,
  future: [],
};

// undo スタックに積む操作
const UNDOABLE = new Set([
  'MOVE_CARD', 'ADD_CARD', 'DELETE_CARD', 'EDIT_CARD',
  'ADD_COLUMN', 'DELETE_COLUMN', 'RENAME_COLUMN',
]);

function presentReducer(present, action) {
  switch (action.type) {
    case 'MOVE_CARD':
      return {
        ...present,
        cards: present.cards.map((c) =>
          c.id === action.cardId ? { ...c, columnId: action.targetColumnId } : c
        ),
      };
    case 'ADD_CARD':
      return { ...present, cards: [...present.cards, action.card] };
    case 'DELETE_CARD':
      return { ...present, cards: present.cards.filter((c) => c.id !== action.cardId) };
    case 'EDIT_CARD':
      return {
        ...present,
        cards: present.cards.map((c) =>
          c.id === action.cardId ? { ...c, ...action.changes } : c
        ),
      };
    case 'SET_FILTER':
      return { ...present, filter: action.filter };
    case 'SET_SEARCH':
      return { ...present, search: action.search };
    case 'ADD_COLUMN':
      return {
        ...present,
        columns: [...present.columns, { id: action.id, title: action.title }],
      };
    case 'DELETE_COLUMN':
      return {
        ...present,
        columns: present.columns.filter((col) => col.id !== action.columnId),
        cards: present.cards.filter((c) => c.columnId !== action.columnId),
      };
    case 'RENAME_COLUMN':
      return {
        ...present,
        columns: present.columns.map((col) =>
          col.id === action.columnId ? { ...col, title: action.title } : col
        ),
      };
    default:
      return present;
  }
}

export function reducer(state, action) {
  if (action.type === 'UNDO') {
    if (state.past.length === 0) return state;
    const prev = state.past[state.past.length - 1];
    return {
      past: state.past.slice(0, -1),
      present: prev,
      future: [state.present, ...state.future],
    };
  }
  if (action.type === 'REDO') {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    return {
      past: [...state.past, state.present],
      present: next,
      future: state.future.slice(1),
    };
  }

  const newPresent = presentReducer(state.present, action);
  if (newPresent === state.present) return state;

  if (UNDOABLE.has(action.type)) {
    return {
      past: [...state.past, state.present],
      present: newPresent,
      future: [],
    };
  }
  // SET_FILTER / SET_SEARCH は undo 対象外
  return { ...state, present: newPresent };
}
