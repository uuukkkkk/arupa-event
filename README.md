# いばらき ふるさと マルシェ

2026年11月8日（日）10:00–16:00  
おおたかの森S.C. 本館1F イーストプラザ

公開予定URL: https://event.arupa.or.jp/

予備URL: https://uuukkkkk.github.io/arupa-event/

## 公開手順（初回のみ）

GitHub App の権限では Pages のオン/オフと DNS 変更ができないため、次の2つだけ手動です。

### 1. GitHub Pages をオンにする

1. https://github.com/uuukkkkk/arupa-event/settings/pages を開く
2. Build and deployment → Source を **Deploy from a branch**
3. Branch を `main` / `/ (root)` にして Save
4. Custom domain に `event.arupa.or.jp` を入れて Save  
   （リポジトリ直下の `CNAME` ファイルと同じ値です）
5. DNS が通ったら **Enforce HTTPS** にチェック

### 2. DNS（GMOレンタルサーバー）に CNAME を追加する

`arupa.or.jp` のネームサーバーは `ns-rs1.gmoserver.jp` です。  
GMOレンタルサーバーの管理画面 → DNSレコード設定 で追加してください。

| ホスト名 | 種別 | 内容 | TTL |
|---|---|---|---|
| event | CNAME | uuukkkkk.github.io. | 3600 |

末尾の `.` がある場合はそのままで大丈夫です。  
反映は数分〜最大24時間かかることがあります。

確認コマンド:

```
nslookup event.arupa.or.jp
```

`uuukkkkk.github.io` にエイリアスされていればOKです。

## ファイル構成

- `index.html` … トップページ
- `assets/` … CSS / JS
- `images/` … 写真・ロゴ
- `CNAME` … GitHub Pages のカスタムドメイン

主催：ARUPA（一般社団法人地域資源活用推進協会）
