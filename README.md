# kagayoi-handson-kakeibo

KAGAYOI Engineering のハンズオン用のサンプルリポジトリ。ブラウザだけで動く家計簿を、AI に Issue 単位で作らせる。

いまできるのは「収支の記録」と「取引の一覧」だけで、残りの機能は仕様（[`docs/product/spec.md`](docs/product/spec.md)）に書いてある。

## はじめに

1. このページの **Use this template** から、自分のアカウントにリポジトリを作る（公開・非公開どちらでもよい）
2. https://eng.kagayoi.pro/ にログインし、GitHub App を入れて、作ったリポジトリを選ぶ
3. Host を接続する

```sh
curl -fsSL https://cli.kagayoi.pro/install.sh | sh
kagayoi login
kagayoi start
```

## ハンズオン

Issue は **New issue** から雛形を選ぶだけで作れる。

### 1. Issue を 1 本、マージまで任せる

- 雛形「月の要約」で Issue を作り、Board で「担当する」を押す
- 確認ポイントは、Design と Review を **人が確認する** にする
- Design では AI の設計を読んで承認する。Review では **プレビュー** を開き、記録を足して要約が変わるのを確かめてからマージする

### 2. 並列に実装する

- 雛形「カテゴリ別の内訳」「月ごとの推移」「CSV の書き出し」で Issue を 3 つ作り、それぞれ「担当する」を押す
- 3 つは画面の別の場所に載るので、同時に進めても衝突しない
- 色が付いたカードにだけ対応する

### 3. 新しいタスクを「依頼」する

Board の「依頼」から、仕様に無いことを文章で頼む。たとえば次のようなもの。

- 月の予算を決めて、超えたら知らせてほしい
- 取引を間違えて記録したので、直したり消したりしたい
- よく使うメモを、次から選べるようにしたい

### 早く終わったら

雛形「月の切り替え」も試せる。

## 手元で動かす

```sh
mise install
mise run setup
mise run dev     # http://127.0.0.1:5173
```

詳しくは [`docs/development/setup.md`](docs/development/setup.md)。
