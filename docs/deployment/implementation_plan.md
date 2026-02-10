# GitHub Pages デプロイ実装計画

## ゴール
Web Stock App を `gh-pages` 経由で GitHub Pages にデプロイし、公開URL (`https://kitchen1983812.github.io/web-stock-app/`) で利用可能にすること。

## 問題点の説明
現在はソースコードのみ公開されており、ビルドされたアプリケーションはホスティングされていない。Viteプロジェクトはデフォルトでルートパス (`/`) を想定しているが、GitHub Pagesのリポジトリページではサブディレクトリ (`/repository-name/`) で配信されるため、パス設定が必要。

## ユーザーレビューが必要な項目
なし。

## 提案される変更点

### 設定の更新
#### [MODIFY] [vite.config.js](file:///C:/Users/kitch/OneDrive/Apps/remotely-save/web-stock-app/vite.config.js)
- `base: '/web-stock-app/'` を追加（リポジトリ名に合わせる）。

#### [MODIFY] [package.json](file:///C:/Users/kitch/OneDrive/Apps/remotely-save/web-stock-app/package.json)
- `gh-pages` パッケージを devDependencies に追加。
- `predeploy`: `npm run build`
- `deploy`: `gh-pages -d dist`

## 検証計画
### 手動検証
1.  ローカルで `npm run build` がエラーなく完了することを確認。
2.  `npm run deploy` が成功することを確認。
3.  GitHub のリポジトリ設定 > Pages で `gh-pages` ブランチがソースになっているか確認。
4.  公開URLにアクセスし、アプリが正しくロードされるか確認（404エラーや白い画面にならないか）。
