import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

describe('Kanban Board', () => {
  test('renders 3 columns', () => {
    render(<App />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  test('initial cards appear in correct columns', () => {
    render(<App />);
    expect(screen.getByText('ログイン画面の実装')).toBeInTheDocument();
    expect(screen.getByText('APIエンドポイント設計')).toBeInTheDocument();
    expect(screen.getByText('DB設計')).toBeInTheDocument();
    expect(screen.getByText('要件定義')).toBeInTheDocument();
  });

  test('filter by priority hides non-matching cards', () => {
    render(<App />);
    // 初期状態では全カード表示
    expect(screen.getByText('ログイン画面の実装')).toBeInTheDocument();
    expect(screen.getByText('APIエンドポイント設計')).toBeInTheDocument();

    // '高' フィルターボタン（button要素）をクリック
    const filterButtons = screen.getAllByRole('button', { name: '高' });
    fireEvent.click(filterButtons[0]);

    // highのカードは表示される
    expect(screen.getByText('ログイン画面の実装')).toBeInTheDocument();
    // mediumのカードは非表示
    expect(screen.queryByText('APIエンドポイント設計')).not.toBeInTheDocument();
  });

  test('add a new card to a column', () => {
    render(<App />);
    const addBtns = screen.getAllByText('＋ カードを追加');
    fireEvent.click(addBtns[0]);

    const input = screen.getByPlaceholderText('タイトルを入力');
    fireEvent.change(input, { target: { value: '新しいカード' } });
    fireEvent.click(screen.getByText('追加'));

    expect(screen.getByText('新しいカード')).toBeInTheDocument();
  });

  test('saves state to localStorage', () => {
    render(<App />);
    const saved = localStorage.getItem('kanban-state');
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved);
    expect(parsed.cards).toHaveLength(4);
    expect(parsed.filter).toBe('all');
  });
});
