# TAICHI 2026 網站交接文件（給下屆 Web Chair）

活動於 2026/08/06 落幕後，站台已於 2026/08 **全面靜態化**：不再依賴任何外部 API（Notion、Supabase），
所有資料與圖片都存在 repo 內。GitHub Pages 部署流程不變（push `main` 即上線 `taichi2026.taiwanchi.org`）。

## 1. 現況架構

- Vite 6 + React 19 + TypeScript SPA，`react-router-dom` 前端路由。
- 部署：`.github/workflows/deploy.yml`（`vite build` → GitHub Pages），build 已不需任何環境變數。
- `vite.config.ts` 的 `spaRoutesPlugin` 為每個 route 複製 `index.html`，讓 GitHub Pages 直連子路徑回 200。

### 資料來源（全靜態）

| 資料 | 檔案 | 維護方式 |
|------|------|----------|
| 委員會成員、議程 sessions | `src/frozenData.ts` | 自動產生（見下方凍結腳本），**勿手動編輯** |
| 站上公告（/news、首頁） | `src/announcementsData.ts` | 直接在 code 內編輯（含 modal 名單、linkLabel 等欄位） |
| 各頁文案（雙語） | `src/content.zh.ts` / `src/content.en.ts` | 直接編輯 |
| 得獎名單（/awards） | `src/content.zh.ts` 的 `awardsPageSection` | 直接編輯 |
| 成員/新聞圖片 | `public/images/people/`、`public/images/news/` | 凍結腳本自動下載 |
| 成員頭像裁切設定 | `src/content.shared.ts` 的 `CONFIG.imageAdjustments` | `/organization?edit=true` 內建工具產生後貼回 |

## 2. 退役（但保留程式碼）的功能

活動期間的兩個互動功能已收站，route 改掛 `src/pages/EventEndedPage.tsx`（活動已結束頁），
**程式碼原封保留**，明年可直接沿用架構：

### /q — 數位通行證查詢
- 頁面：`src/pages/QPage.tsx`（查詢報名 → 產生 QR 通行證 → 解鎖投票入口，全部打 Supabase RPC）
- 相關：`src/services/votingService.ts`（資料層）、`src/services/supabaseRest.ts`（PostgREST 薄封裝）
- 後端 schema 與報到後台在**另一個 repo `Taichi_check_in`**（`supabase/schema.sql`、ADR 文件）

### /vote — Poster / Demo 投票
- 頁面：`src/pages/VotePage.tsx`（回合制投票，時間窗/票數上限全由 server 端 RPC 強制）
- 投票統計後台同樣在 `Taichi_check_in`（votes 表不開放公開讀取）

### Notion 同步（people / sessions / news）
- `src/services/notionService.ts`：經 Cloudflare Worker proxy（`taichi-notion-proxy`）打 Notion API
- 原本的背景同步 Provider 在 `src/context/DataContext.tsx` 的 git 歷史裡（現已改為純靜態版）

## 3. 重新啟用步驟（明年沿用時）

1. `src/App.tsx`：把 `QPage` / `VotePage` 兩行 lazy import 的註解拿掉，`q`、`vote` 兩個 route 換回原元件。
2. Supabase：沿用或重建專案（schema 在 `Taichi_check_in` repo），在 GitHub repo settings 加回 secrets
   `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`，並在 `deploy.yml` 的 Build step 補回 `env:` 區塊。
3. Notion 同步（若要用）：重建 integration token 與 Worker proxy，加回 `VITE_NOTION_PROXY_URL`，
   並從 git 歷史還原 `DataContext.tsx` 的同步版 Provider。
4. 本地開發參考 `.env.example`。

## 4. 資料凍結腳本

```bash
node scripts/freeze-notion-data.mjs --dry-run   # 只抓資料印統計
node scripts/freeze-notion-data.mjs             # 下載圖片 + 重新產出 src/frozenData.ts
```

- 走與前端相同的 Worker proxy，不需 token；proxy 下架後需改走官方 API（自行加 Authorization header）。
- 會把所有成員/新聞圖片下載到 `public/images/`，並驗證產出資料無外部圖片連結殘留。
- Notion `files` 型欄位的 URL 約 1 小時過期，**抓資料與下載圖片必須同次執行**（腳本已如此設計）。

## 5. 站外服務下架清單（手動，確認新版網站上線正常後再做）

- [ ] Cloudflare Worker `taichi-notion-proxy`（miislab-ntust account）停用或刪除
- [ ] Notion integration token 撤銷
- [ ] Supabase 專案暫停 —— **先與 `Taichi_check_in`（報到系統）管理者確認**，兩邊共用同一專案
- [ ] GitHub repo secrets 刪除：`VITE_NOTION_PROXY_URL`、`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`

## 6. 測試

無 test runner 套件，直接用 Node 內建：

```bash
node --import tsx --test src/content.fallback.test.ts src/pages/*.test.tsx src/**/*.test.ts
```

- `src/content.fallback.test.ts`：守護靜態資料完整性（含「圖片不得為外部連結」不變量）
- `src/pages/EventEndedPage.test.tsx`：守護收站狀態（route 掛收站頁、退役檔案仍在）
- `src/pages/QPage.layout.test.tsx` 等：退役功能的版面回歸測試，隨程式碼一併保留
