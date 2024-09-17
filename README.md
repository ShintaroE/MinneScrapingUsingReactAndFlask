# MinneScrapingUsingReactAndFlask
ハンドメイドサイトMinneのWebアプリ

#起動方法
1.ScrapingForPythonのフォルダに行き、仮想環境を立ててrequirementsファイルから必要なモジュールをインストール
command : cd ScrapingForPython
command : python -m venv venv
command : venv/Scripts/activate
command : pip install -r requirements.txt

2.ScrapingForReactのフォルダに行き、package.jsonから必要なモジュールをインストール
command : npm install

3.ScrapingForPythonフォルダでバックエンドのサーバーを立ち上げる
command : python app.py

4. ScrapingForReactのフォルダに行き、Webアプリを立ち上げる
command : npm start