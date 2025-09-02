# uec-fuka2ka

電通大の成績の不可を可にする拡張機能

## 機能・特徴

- PC版Chrome系、Firefox系ブラウザで動作
- 成績の評価部分を置換し、それに合わせて修得単位数やGPAを自動計算
- 科目区分ごとの修得単位数は表記揺れのため一部非対応

## 導入方法
### Chrome系

1. [Releases](releases)からダウンロードした`uec-fuka2ka_{version}.zip`を展開
2. `拡張機能を管理`([chrome://extensions](chrome://extensions))でデベロッパーモードを有効化
3. `パッケージ化されていない拡張機能を読み込む`から展開したディレクトリを開く

### Firefox系

1. [Releases](releases)から`uec-fuka2ka_{version}.zip`をダウンロード
2. アドレスバーに`about:debugging#/runtime/this-firefox`と入力して開く
3. `一時的なアドオンを読み込む`からzipファイルを開く

## ライセンス

[MIT LICENSE](LICENSE)

## 作者

[Laddge](https://github.com/laddge)
