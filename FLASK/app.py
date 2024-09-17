from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
CORS(app)  # 全てのオリジンを許可

@app.route('/api/search', methods=['GET'])
def search_kimono():
    print("スクレイピング開始")
    keyword = request.args.get('keyword', '').strip()

    if not keyword:
        return jsonify({'error': '検索ワードが空です。'}), 400

    data = scrape_minne(keyword)
    return jsonify(data)

def scrape_minne(keyword):
    url = f'https://minne.com/category/saleonly?input_method=typing&q={keyword}&commit=%E6%A4%9C%E7%B4%A2'
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')

    products = []
    items = soup.find_all('div', class_='MinneProductCardList_list-item__TMXly')
    
    # 並列処理で各商品の詳細ページから情報を取得
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(get_product_details, item) for item in items]
        for future in futures:
            product = future.result()
            products.append(product)

    print(products)
    return products

def get_product_details(item):
    name = item.find('span', class_='MinneProductCard_product-title-text__IpXRH').get_text()
    price = item.find('div', class_='MinneProductCard_product-price-tag__xWZpW').get_text()
    item_url = "https://minne.com" + item.find('a', class_='MinneProductCard_grid__u4vOU')['href']
    img = item.find('img', src=re.compile('^https://image.minne.com/minne/mobile_app_product/480x480cq85'))['src']
    ratingcount = item.find('span', class_="MinneStarRating_average-rating__L1Vs3").get_text()
    reviewcount = item.find('span', class_="MinneStarRating_reviews-count-pc__a6Qt2").get_text()
    favoritecount = get_favorite(item_url)
    
    return {
        'name': name,
        'price': price,
        'url': item_url,
        'img': img,
        'ratingcount': ratingcount,
        'reviewcount': reviewcount,
        'favoritecount': favoritecount,
    }

def get_favorite(url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')

    favorite_count = soup.find('div', class_="MinneProductSummary_favorite-count__Xa37W").get_text()

    return favorite_count

if __name__ == '__main__':
    app.run(debug=True)
