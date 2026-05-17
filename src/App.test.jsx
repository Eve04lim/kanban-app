import { render, screen } from '@testing-library/react';
import App from './App';

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
});
