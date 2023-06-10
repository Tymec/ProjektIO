# read csv and insert into database

import csv
import io
import os
import random

import click
import requests


def auth():
    session = requests.Session()
    res = session.post(
        "http://localhost:8000/api/users/login/",
        data={"email": os.getenv("ADMIN_EMAIL"), "password": os.getenv("ADMIN_PASS")},
    )

    if res.status_code != 200:
        print("Failed to authenticate")
        exit(1)

    session.headers["Authorization"] = f"Bearer {res.json()['access']}"
    return session


def get_image(query):
    res = requests.get(
        "https://api.unsplash.com/search/photos",
        params={
            "query": query,
            "per_page": 1,
        },
        headers={
            "Authorization": f"Client-ID {os.getenv('UNSPLASH_ACCESS_KEY')}",
        },
    )
    res.raise_for_status()

    url = res.json()["results"][0]["urls"]["regular"]
    img = requests.get(url)
    return io.BytesIO(img.content)


def send(session, data, reviews, names) -> bool:
    img = (
        "image.png",
        get_image(data["name"]),
        "application/octet-stream",
        {},
    )
    res = session.post(
        "http://localhost:8000/api/products/",
        data={
            "name": data["name"],
            "brand": data["brand"],
            "category": data["category"],
            "description": data["description"],
            "price": round(float(data["price"]) / 20.0, 2),
            "countInStock": int(data["countInStock"]),
        },
        files={"image": img},
    )

    success = res.status_code == 201
    if not success:
        print(res.json())
        exit(1)
    _id = res.json()["_id"] if success else None

    past_reviews = []
    past_names = []
    for i in range(0, random.randint(0, 10)):
        review = random.choice(reviews)
        while review in past_reviews:
            review = random.choice(reviews)
        past_reviews.append(review)

        name = random.choice(names)
        while name in past_names:
            name = random.choice(names)
        past_names.append(name)

        res = session.post(
            "http://localhost:8000/api/reviews/",
            json={
                "name": f"{name['first_name']} {name['last_name']}",
                "rating": int(float(review["rating"])),
                "comment": review["text_"],
                "product": _id,
            },
        )

        success = res.status_code == 201
        if not success:
            print(res.json())
            exit(1)

    return _id, success


def parse_data(path) -> list[dict]:
    f = open(path, "r", encoding="utf-8")
    reader = csv.reader(f)
    header = next(reader)

    final = []
    for row in reader:
        data = dict(zip(header, row))
        final.append(data)

    f.close()
    return final


@click.command()
@click.argument("data_csv_file", type=click.Path(exists=True))
@click.argument("reviews_csv_file", type=click.Path(exists=True))
@click.argument("names_csv_file", type=click.Path(exists=True))
def main(data_csv_file, reviews_csv_file, names_csv_file):
    session = auth()
    data = parse_data(data_csv_file)
    reviews = parse_data(reviews_csv_file)
    names = parse_data(names_csv_file)

    i = 0
    for d in data:
        i += 1
        _id, status = send(session, d, reviews, names)
        print(f"Sending {i}/{len(data)}: {'success' if status else 'failed'}")


if __name__ == "__main__":
    main()
