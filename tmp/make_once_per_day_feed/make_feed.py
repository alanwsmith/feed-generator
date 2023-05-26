#!/usr/bin/env python3

import json
import keyring
import pymysql.cursors

db_password = keyring.get_password(
            'alan--dojo--mysql--bluesky_feed--password', 
            'alan'
            )

connection = pymysql.connect(
            host='127.0.0.1', 
            user='bluesky_feed',
            password=db_password, 
            database='bluesky_alfa', 
            cursorclass=pymysql.cursors.DictCursor
            )
posts = {}

with connection:
    with connection.cursor() as cursor:
        sql = f"SELECT raw, timestamp FROM posts ORDER BY timestamp DESC LIMIT 1000"
        cursor.execute(sql)
        for result in cursor.fetchall():
            data = json.loads(result['raw'])
            author = data['author']
            if author not in posts:
                posts[author] = data['uri']
                print(author)

    feed = {"feed": []}
    for i in range(0,100):
        posts['feed'].append(
            {"post": posts.popitem()}
        )





