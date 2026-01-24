# Google Apps Script CI/CD with clasp

使用 clasp CLI 搭配 GitHub Actions 實現 GAS 自動部署。

## 概述

手動複製貼上 GAS 代碼容易遺漏文件或覆蓋錯誤。使用 clasp 搭配 GitHub Actions 可以：
- 確保所有文件同步
- 推送到 main 分支時自動部署
- 版本控制清晰

## 什麼是 clasp？

clasp (Command Line Apps Script Projects) 是 Google 官方提供的 CLI 工具，讓你可以在本地開發和管理 Apps Script 專案。

主要功能：
- `clasp push` - 推送本地代碼到 GAS
- `clasp pull` - 從 GAS 拉取代碼到本地
- `clasp deploy` - 建立新版本部署
- `clasp open` - 在瀏覽器開啟 GAS 編輯器

## 設置步驟

### Step 1: 安裝 clasp

```bash
npm install -g @google/clasp
```

### Step 2: 登入並取得 token

```bash
clasp login
```

登入後，token 會儲存在 `~/.clasprc.json`。

### Step 3: 啟用 GAS API

1. 前往 https://script.google.com/home/usersettings
2. 開啟「Google Apps Script API」

### Step 4: 設定專案

編輯 `gas/.clasp.json`，填入你的腳本 ID：

```json
{
  "scriptId": "你的GAS腳本ID",
  "rootDir": "."
}
```

腳本 ID 在 GAS 編輯器 → 專案設定 → 腳本 ID。

### Step 5: 設置 GitHub Secret

1. 到 GitHub repo → Settings → Secrets and variables → Actions
2. 新增 secret：`CLASP_TOKEN`
3. 貼上 `~/.clasprc.json` 的完整內容

```bash
cat ~/.clasprc.json
```

## 工作流程說明

`.github/workflows/deploy-gas.yml` 定義了自動部署流程：

```yaml
name: Deploy to Google Apps Script

on:
  push:
    branches: [main]
    paths: ['gas/**']
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install clasp
        run: npm install -g @google/clasp

      - name: Setup clasp credentials
        run: echo '${{ secrets.CLASP_TOKEN }}' > ~/.clasprc.json

      - name: Push to GAS
        run: cd gas && clasp push --force
```

### 觸發條件

- 推送到 `main` 分支且 `gas/` 目錄有變更
- 手動觸發（workflow_dispatch）

### 執行步驟

1. Checkout 代碼
2. 設置 Node.js 環境
3. 安裝 clasp CLI
4. 寫入認證 token
5. 推送代碼到 GAS

## 本地開發命令

```bash
# 進入 gas 目錄
cd gas

# 推送代碼到 GAS
clasp push

# 強制推送（覆蓋遠端）
clasp push --force

# 從 GAS 拉取代碼
clasp pull

# 在瀏覽器開啟 GAS 編輯器
clasp open

# 查看部署列表
clasp deployments

# 建立新版本部署
clasp deploy -d "v1.0 description"
```

## 注意事項

### Token 過期

clasp token 會自動刷新，但如果長時間未使用可能需要重新登入：

```bash
clasp logout
clasp login
```

然後更新 GitHub Secret。

### .claspignore

如果有不想推送到 GAS 的文件，可以建立 `gas/.claspignore`：

```
# 忽略測試文件
*_test.gs
test_*.gs

# 忽略文檔
*.md
```

### 權限範圍

clasp login 需要以下 Google 權限：
- Google Apps Script API（讀寫專案）
- Google Drive API（存取專案文件）

## 驗證部署

1. 修改任一 `gas/*.gs` 文件
2. 推送到 main 分支
3. 到 GitHub → Actions 確認執行成功
4. 到 GAS 編輯器確認代碼已更新

## 故障排除

### Q: GitHub Actions 失敗，顯示 401 Unauthorized？

A: CLASP_TOKEN 可能過期或格式錯誤。重新執行 `clasp login` 並更新 GitHub Secret。

### Q: 推送後 GAS 沒有更新？

A: 確認：
1. 腳本 ID 正確
2. GAS API 已啟用
3. GitHub Actions 顯示成功

### Q: 如何確認 clasp 連接正確？

A: 本地執行測試：
```bash
cd gas
clasp push --force
```

## 參考資源

### 官方文檔

- [clasp GitHub Repository](https://github.com/google/clasp) - Google 官方 clasp 專案
- [Apps Script clasp Guide](https://developers.google.com/apps-script/guides/clasp) - Google 官方使用指南
- [clasp Codelab](https://codelabs.developers.google.com/codelabs/clasp) - Google 官方教學

### GitHub Actions

- [Clasp Action](https://github.com/marketplace/actions/clasp-action) - GitHub Marketplace 上的 clasp action
- [GitHub Actions Documentation](https://docs.github.com/en/actions) - GitHub Actions 官方文檔

### 相關資源

- [Apps Script Manifest](https://developers.google.com/apps-script/concepts/manifests) - appsscript.json 設定說明
- [Script Projects](https://developers.google.com/apps-script/guides/projects) - GAS 專案管理指南
