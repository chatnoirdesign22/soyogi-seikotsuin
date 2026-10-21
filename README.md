# そよぎ整骨院・整体院（ポートフォリオ用・架空サイト）

デスクワークで肩こり・腰痛に悩む30〜50代の会社員をターゲットにした、**架空の地元密着型 整骨院**のホームページです。
Web制作のポートフォリオとして制作しました。院名・住所・電話番号・人物はすべて架空です。

- 公開URL：https://penguin08xx.github.io/soyogi-seikotsuin/ （検索結果には出ないよう noindex 設定済み）
- 仕様書：[docs/SPEC.md](docs/SPEC.md)
- 技術：HTML / CSS / JavaScript（フレームワーク・ビルドなし）、GSAP + ScrollTrigger（CDN）、Google Fonts

---

## 1. ページ構成

| ファイル | ページ | 主な内容 |
|---|---|---|
| `index.html` | トップ | ヒーロー、お悩み、選ばれる理由、メニュー、院長メッセージ、お客様の声（架空）、営業時間・アクセス、予約CTA |
| `first.html` | 初めての方へ | 施術の流れ（5ステップ）、服装・持ち物、よくある質問 |
| `menu.html` | メニュー・料金 | 自費メニュー、初回特典、回数券、回数券おトク計算、保険施術、注意書き |
| `about.html` | 院の紹介 | 院長あいさつ、スタッフ紹介、院内紹介、院の想い |
| `access.html` | アクセス | 所在地、イラスト地図（仮）、駅からの道順（3ステップ）、営業時間 |
| `contact.html` | 予約・お問い合わせ | 電話・LINE・Web予約の案内、予約フォーム（デモ） |

## 2. フォルダ構成

```
├── index.html / first.html / menu.html / about.html / access.html / contact.html
├── css/style.css      … 全ページ共通のスタイル（色・余白・フォントはCSS変数）
├── js/
│   ├── main.js        … ハンバーガーメニュー、ヘッダー、営業中バッジ、電話/LINEのデモ表示
│   ├── animation.js   … GSAP のアニメーション（木漏れ日エフェクトを含む）
│   ├── form.js        … 予約フォームの入力チェック・デモ送信
│   └── calc.js        … 回数券おトク計算（menu.html のみ）
├── images/            … 写真（WebP）、イラスト地図・ファビコン（SVG）、ogp.png
├── docs/SPEC.md       … 仕様書
└── .claude/           … 確認用の簡易サーバー（serve.ps1）と設定。公開には不要
```

## 3. 見どころ（実装したこと）

- **集客・予約までの導線**：全ページに予約ボタン、スマホでは画面下に「電話」「Web予約」を固定表示
- **アニメーション（GSAP）**
  - キャッチコピーが1行ずつふわっと表示 → ボタン
  - スクロールで見出し・カードが下からフェードイン（カードは時間差）
  - ヒーロー画像の控えめなパララックス
  - 院名「そよぎ」にちなんだ、ゆらゆら揺れる葉っぱ
  - スクロールするとヘッダーが白くなり影がつく
- **写真**：Unsplash の無料写真16枚（クレジットは5章）
- **追加ギミック**
  - **ただいま営業中バッジ**：今の時刻から「受付中／お昼休み中／本日の受付は終了・次回は○曜」を自動表示（トップ・アクセス・予約ページ）
  - **木漏れ日エフェクト**：ヒーローに、ゆっくり明滅する光の粒と、そよぐ葉影を重ねる演出
  - **回数券おトク計算**：メニューと通う回数を選ぶと、都度払いとの差額を表示（メニューページ）
- **アクセシビリティ**
  - 「視差効果を減らす」設定ではアニメーションを止め、最初から表示
  - JavaScript が動かなくても全コンテンツが表示される
  - キーボード操作対応（メニューは Esc で閉じる、フォーカス枠を表示）
  - 文字色は WCAG AA（4.5:1以上）を満たすよう調整（下記）
- **予約フォーム（デモ）**：入力中・送信時のチェック、エラー項目へのスクロール・フォーカス、デモ完了画面。**入力内容はどこにも送信・保存しません**

### 仕様書の色から調整したところ（コントラスト確保のため）

| 用途 | 仕様書 | 実装 |
|---|---|---|
| オレンジのボタンの文字 | 白 | こげ茶 `#3A2414`（白だと 2.5:1 で基準未満） |
| 緑のボタン | `#6BA37A` に白文字 | 濃いグリーン `#3E6B4C` に白文字（`#6BA37A` は装飾用に使用） |
| 緑の文字 | `#6BA37A` | `#437A55` |
| 補足テキスト | `#6B756E` | `#646E67`（サブ背景の上でも 4.5:1 以上） |

---

## 4. ローカルでの確認方法

`index.html` をダブルクリックしても見られますが、ブラウザによってはアイコンなどが正しく表示されないため、**簡易サーバーで開く**のがおすすめです。

### 方法A：VS Code の拡張機能「Live Server」
1. VS Code でこのフォルダを開く
2. `index.html` を右クリック →「Open with Live Server」

### 方法B：同梱の PowerShell サーバー（Windows）
フォルダ内で次を実行し、ブラウザで http://localhost:8080/ を開きます（終了は Ctrl + C）。

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File .claude/serve.ps1
```

### 方法C：Python がある場合
```bash
python -m http.server 8080
```

---

## 5. 画像とクレジット

写真はすべて [Unsplash](https://unsplash.com/) の無料写真（[Unsplash License](https://unsplash.com/license)）を使っています。
商用・非商用を問わず無料で使え、クレジット表記は必須ではありませんが、撮影者への感謝として記載します。
各写真は表示枠の比率に合わせて切り抜き、WebP 形式で保存しています。

| ファイル名 | 使用場所 | 撮影者 | 元の写真 |
|---|---|---|---|
| `hero.webp` | トップ ヒーロー（`ogp.png` にも使用） | Cherosi | [AV0KNliGvQc](https://unsplash.com/photos/AV0KNliGvQc) |
| `reason-01.webp` | 選ばれる理由1 | Andre Benz | [PpsgIw3iWZ4](https://unsplash.com/photos/PpsgIw3iWZ4) |
| `reason-02.webp` | 選ばれる理由2 | Sincerely Media | [CexT3n-04iw](https://unsplash.com/photos/CexT3n-04iw) |
| `reason-03.webp` | 選ばれる理由3 | Sincerely Media | [wGFibXDQlBI](https://unsplash.com/photos/wGFibXDQlBI) |
| `menu-shoulder.webp` | メニュー（肩・首） | yury kirillov | [Y1JKxNFwZx4](https://unsplash.com/photos/Y1JKxNFwZx4) |
| `menu-back.webp` | メニュー（腰） | Benjamin Wedemeyer | [1rdB14ttWgQ](https://unsplash.com/photos/1rdB14ttWgQ) |
| `menu-posture.webp` | メニュー（姿勢・骨盤） | Marc Zeman | [uLWW09LLG04](https://unsplash.com/photos/uLWW09LLG04) |
| `menu-stretch.webp` | メニュー（ストレッチ） | yury kirillov | [pbUWW-CBoqY](https://unsplash.com/photos/pbUWW-CBoqY) |
| `director.webp` | 院長紹介 | Russell Barrientos | [EGDTlFaO0mk](https://unsplash.com/photos/EGDTlFaO0mk) |
| `staff.webp` | スタッフ紹介 | Vitaly Gariev | [qhrhmDZ6DTY](https://unsplash.com/photos/qhrhmDZ6DTY) |
| `clinic-reception.webp` | 院内紹介（受付） | Maverick Frame | [VRoK8MxTlHY](https://unsplash.com/photos/VRoK8MxTlHY) |
| `clinic-waiting.webp` | 院内紹介（待合） | Nguyễn Duy Hưng | [VEYPG3hY0eI](https://unsplash.com/photos/VEYPG3hY0eI) |
| `clinic-room.webp` | 院内紹介（施術室） | Nightingale Home nurse | [4e017fuMeXE](https://unsplash.com/photos/4e017fuMeXE) |
| `access-01.webp` | アクセス道順1 | TopoloGiraffe | [8DHMnWPhVpw](https://unsplash.com/photos/8DHMnWPhVpw) |
| `access-02.webp` | アクセス道順2 | Qonita Afnani Firdaus | [XB2pBWNrhSI](https://unsplash.com/photos/XB2pBWNrhSI) |
| `access-03.webp` | アクセス道順3 | Anya Chernykh | [kur6nW73WoQ](https://unsplash.com/photos/kur6nW73WoQ) |

自作の画像：`map.svg`（イラスト地図）、`favicon.svg`（ファビコン）、`ogp.png`（SNS共有用。ヒーロー写真に院名とキャッチコピーを重ねたもの）

### 注意
- 写真に写っている人物・場所は実在のもので、このサイトの院・人物・場所とは関係ありません（院長・スタッフの名前や紹介文は架空です）。
- 写真を差し替えるときは、同じファイル名で `images/` に上書きすれば HTML の変更は不要です。

---

## 6. 公開手順（GitHub Pages・おすすめ）

1. [GitHub](https://github.com/) でアカウントを作り、新しいリポジトリ（例：`soyogi-seikotsuin`）を **Public** で作成
2. このフォルダの中身をリポジトリにアップロード
   - ブラウザだけで行う場合：リポジトリ画面の「Add file」→「Upload files」にファイル・フォルダをドラッグ＆ドロップ →「Commit changes」
3. リポジトリの「Settings」→「Pages」を開く
4. 「Build and deployment」の Source を「Deploy from a branch」、Branch を `main` ／ `/ (root)` にして「Save」
5. 数分後、`https://ユーザー名.github.io/soyogi-seikotsuin/` で公開されます

> このサイトは上の手順で https://penguin08xx.github.io/soyogi-seikotsuin/ に公開済みです。
> 更新するときは、変更を `main` ブランチに push すると数分で反映されます。

### OGP（SNS共有時の表示）の設定
SNSは相対パスを読めないため、各HTMLの `<head>` にある次の2行は公開URLの**絶対パス**で書いています（設定済み）。
公開先やリポジトリ名を変えた場合は、ここも書き換えてください。

```html
<meta property="og:url" content="https://penguin08xx.github.io/soyogi-seikotsuin/index.html">
<meta property="og:image" content="https://penguin08xx.github.io/soyogi-seikotsuin/images/ogp.png">
```

### 代替：Netlify
1. [Netlify](https://www.netlify.com/) にログイン
2. 「Add new site」→「Deploy manually」を開き、このフォルダをドラッグ＆ドロップ
3. 発行されたURLで公開されます（サイト名は「Site configuration」で変更可）

### 注意
- 架空サイトのため、全ページに `<meta name="robots" content="noindex">` を入れて検索結果に出ないようにしています。**消さないでください。**
- `.claude/` フォルダは確認用なので、公開時にアップロードしなくても問題ありません。
