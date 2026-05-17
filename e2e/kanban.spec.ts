import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('.column');
});

test('ページが表示され列が3つ以上存在する', async ({ page }) => {
  const columns = page.locator('.column');
  const count = await columns.count();
  expect(count).toBeGreaterThanOrEqual(3);
});

test('カード追加フォームを開いてタイトルを入力し追加ボタンを押すとカードが増える', async ({
  page,
}) => {
  const cards = page.locator('.card');
  const initialCount = await cards.count();

  await page.locator('.add-card-btn').first().click();
  await page.getByPlaceholder('タイトルを入力').fill('E2Eテストカード');
  await page.locator('.btn-add-confirm').first().click();

  await expect(cards).toHaveCount(initialCount + 1);
});

test('検索バーにテキストを入力するとカードが絞り込まれる', async ({ page }) => {
  const cards = page.locator('.card');
  await expect(cards).toHaveCount(4);

  // aria-label で検索 input を特定（placeholder の省略記号エンコーディングを回避）
  await page.locator('.search-input').fill('ログイン');

  await expect(cards).toHaveCount(1);
  await expect(page.getByText('ログイン画面の実装')).toBeVisible();
});

test('優先度フィルター「高」をクリックすると高優先度カードのみ表示される', async ({ page }) => {
  await page.locator('.filter-buttons').getByRole('button', { name: '高' }).click();

  const cards = page.locator('.card');
  await expect(cards).toHaveCount(1);
  await expect(page.getByText('ログイン画面の実装')).toBeVisible();
  await expect(page.getByText('APIエンドポイント設計')).not.toBeVisible();
});

test('Undo ボタンが表示されクリックできる', async ({ page }) => {
  // CSS クラスで直接特定（日本語 aria-label のエンコーディングを回避）
  const undoBtn = page.locator('.undo-btn');
  await expect(undoBtn).toBeVisible();
  await expect(undoBtn).toBeDisabled();

  // カード追加で undo 履歴を作る
  await page.locator('.add-card-btn').first().click();
  await page.getByPlaceholder('タイトルを入力').fill('Undoテスト');
  await page.locator('.btn-add-confirm').first().click();
  await expect(page.getByText('Undoテスト')).toBeVisible();

  await expect(undoBtn).toBeEnabled();
  await undoBtn.click();

  await expect(page.getByText('Undoテスト')).not.toBeVisible();
});
