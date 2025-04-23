## サービス名:新・学習記録アプリ
日々の学習内容と時間を記録できるアプリです。  
学習記録を一覧化することで、学習の進捗状況を確認することができます。  

## 使い方
1. [学習記録アプリ](https://new-study-record.web.app/)にアクセスする
2. 「登録」ボタン押下
3. 学習内容と学習時間を入力フォームに記入する
4. 「登録」ボタンを押して記録を保存する
5. 編集したい場合は、「編集」アイコンを押す
6. 削除したい場合は、「削除」アイコンを押す
## 使用技術
React + Vite + TypeScript
supabase  
jest  
react-testing-library
ChakraUI
react-hook-form
## インストール・セットアップ方法
1. リポジトリをクローン
 ```
 $ git clone https://github.com/asa129/new-study-record.git
 $ cd study-record
 ```

2. 必要なパッケージをインストール
 ```
 $ npm install
 ```

3. Supabaseの設定
 * [Supabase](https://supabase.com/)のアカウントを作成する
 * 新規プロジェクトを作成する(プロジェクト名はstudy-record、データベースパスワードは適当)
 * Table Editorで以下のテーブルを作成する

 テーブル名 : study-record
 
 | column | type | option |
 |:------|:-----|:-------|
 |id|uuid| |
 |title|varchar |non null|
 |time|int4 |non null|
 |created_at|timestamptz ||

4. プロジェクトのルートに`.env`ファイルを作成し、以下内容を追加する
 ```
 VITE_NEXT_PUBLIC_SUPABASE_URL=Project URL
 VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY=シークレットキー
 ```
 APIURLとシークレットキーの取得は[Dashboard](https://supabase.com/dashboard/project/_/settings/api)から可能  

5. アプリケーションの起動
```
npm run dev
```
