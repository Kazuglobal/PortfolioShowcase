# Portfolio Showcase

イベント管理システムを備えたポートフォリオウェブサイト

## 概要

このプロジェクトは、イベント管理機能を持つポートフォリオウェブサイトです。Flask/SQLAlchemyを使用したバックエンド、モダンなUIを実現するフロントエンドで構成されています。

## 機能

- イベントの表示と管理
- カテゴリー別イベント分類
- レスポンシブデザイン
- アニメーション効果

## 技術スタック

- バックエンド: Python/Flask
- データベース: SQLite
- フロントエンド: HTML/CSS/JavaScript

## セットアップ

1. リポジトリのクローン:
```bash
git clone https://github.com/Kazuglobal/PortfolioShowcase.git
cd PortfolioShowcase
```

2. 依存関係のインストール:
```bash
pip install -r requirements.txt
```

3. アプリケーションの実行:
```bash
python run_app.py
```

4. ブラウザでアクセス:
```
http://127.0.0.1:5000
```

## 環境変数

`.env`ファイルを作成し、以下の変数を設定してください：

```
FLASK_APP=new_app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
```

## ライセンス

MITライセンスの下で公開されています。