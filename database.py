import sqlite3

# Connect database
conn = sqlite3.connect('phishing.db')
cursor = conn.cursor()

# Create tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS phishing_keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS blacklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT
)
''')

# OPTIONAL: clear old data (taake duplicate na ho)
cursor.execute("DELETE FROM phishing_keywords")
cursor.execute("DELETE FROM blacklist")

# Insert phishing keywords
keywords = [
"verify account", "update password", "login now", "urgent action",
"bank alert", "security alert", "click here", "confirm identity",
"suspended account", "unauthorized login"
]

cursor.executemany(
    "INSERT INTO phishing_keywords (keyword) VALUES (?)",
    [(k,) for k in keywords]
)

# Insert blacklist URLs
urls = [
"http://fakebank.com", "http://login-secure.net",
"http://verify-account.com", "http://paypal-alert.net"
]

cursor.executemany(
    "INSERT INTO blacklist (url) VALUES (?)",
    [(u,) for u in urls]
)

cursor.execute("SELECT * FROM phishing_keywords")
print(cursor.fetchall())



# SAVE + CLOSE (IMPORTANT: LAST me hi hoga)
conn.commit()
conn.close()

print("Database and tables created successfully!")

