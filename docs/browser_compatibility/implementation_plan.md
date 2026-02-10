# モバイルブラウザ互換性実装計画

## ゴール
web-stock-appをモバイルブラウザ（スマートフォン）で正しく動作させること。

## 問題点の説明
ユーザーは、現在アプリがスマートフォンで動作しないと報告しています。主な原因として以下が考えられます：
1.  **ネットワークアクセス**: 開発サーバーへのアクセスが容易でない、または自己署名SSL証明書がブロックされている可能性があります。
2.  **レスポンシブ性**: 現在のCSSには大きなパディング（`2rem`）があり、モバイル画面のスペースを無駄にしています。
3.  **UI/UX**: モバイル端末では要素が小さすぎたり、隠れてしまったりする可能性があります。

## ユーザーレビューが必要な項目
なし。

## 提案される変更点

### CSSの改善
#### [MODIFY] [src/index.css](file:///C:/Users/kitch/OneDrive/Apps/remotely-save/web-stock-app/src/index.css)
- `#root` のパディングをレスポンシブに変更する（例：モバイルでは `1rem`、デスクトップでは `2rem`）。
-  `.container` の幅が小さな画面でも最適になるように調整する。

### 設定の更新
#### [MODIFY] [package.json](file:///C:/Users/kitch/OneDrive/Apps/remotely-save/web-stock-app/package.json)
- ホストを明示的に有効にして実行するための `"dev:host"` スクリプトを追加する（冗長ですが明示的）。
- 自己署名証明書を厳格にブロックするデバイス（デバッグ用）のために、SSLなしで実行する `"dev:http"` スクリプトを追加する。

### ドキュメント作成
#### [NEW] [docs/browser_compatibility/README_MOBILE.md](file:///C:/Users/kitch/OneDrive/Apps/remotely-save/web-stock-app/docs/browser_compatibility/README_MOBILE.md)
- ローカルネットワーク上のスマートフォンからアプリにアクセスする方法の説明。
- 「この接続はプライバシーが保護されていません」という警告を回避する方法の説明。

## 検証計画

### 自動テスト
- なし（視覚的な変更のため）。

### 手動検証
1.  **サーバーの起動**: `npm run dev` を実行する（SSLを使用）。
2.  **モバイルアクセス**:
    - スマートフォンを同じWi-Fiに接続する。
    - `https://<PC-IP-ADDRESS>:5173` にアクセスする。
    - SSL警告を許可する。
    - レイアウトが正しく見えることを確認する（パディングが減少しているか）。
    - ストックアイテムの追加をテストする。
3.  **HTTPフォールバック**:
    - `npm run dev:http` を実行する（実装されている場合）。
    - `http://<PC-IP-ADDRESS>:5173` にアクセスする。
    - SSL警告なしでアクセスできることを確認する（注：このモードではPWA/共有ターゲット機能が動作しない可能性があります）。
