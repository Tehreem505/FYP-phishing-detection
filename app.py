from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime

# AI modules
from ai_engine_email import analyze_email
from ai_engine import analyze_url

app = Flask(__name__)

# ---------------- HOME ----------------
@app.route('/')
def home():
    return render_template('index.html')


# ---------------- LOGIN ----------------
@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':
        username = request.form['username']

        conn = sqlite3.connect('phishing.db')
        cursor = conn.cursor()

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS login_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            timestamp TEXT,
            status TEXT
        )
        ''')

        cursor.execute(
            "INSERT INTO login_logs (username, timestamp, status) VALUES (?, ?, ?)",
            (username, str(datetime.now()), "attempted")
        )

        conn.commit()
        conn.close()

    return render_template('login.html')


# ---------------- URL CHECKER PAGE ----------------
@app.route('/url-checker')
def url_checker():
    return render_template('url_checker.html')


# ---------------- URL CHECK LOGIC ----------------
@app.route('/check-url', methods=['POST'])
def check_url():

    url = request.form['url']

    result = analyze_url(url)

    #  convert dict to string safely
    if isinstance(result, dict):
        result = result.get("label", str(result))

    # SAVE TO DATABASE
    conn = sqlite3.connect('phishing.db')
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO logs (user, type, input, result, date)
        VALUES (?, ?, ?, ?, ?)
    """, (
        "User",
        "URL",
        url,
        str(result),   
        str(datetime.now())
    ))

    conn.commit()
    conn.close()

    return render_template('url_checker.html', result=result)


# ---------------- EMAIL SCANNER PAGE ----------------
@app.route('/email-scanner')
def email_scanner():
    return render_template('email_scanner.html')


# ---------------- EMAIL SCAN LOGIC ----------------
@app.route('/scan-email', methods=['POST'])
def scan_email():

    sender = request.form['sender']
    subject = request.form['subject']
    body = request.form['body']

    result = analyze_email(sender, subject, body)

    return render_template('email_scanner.html', result=result)


# ---------------- DASHBOARD ----------------
@app.route('/dashboard')
def dashboard():

    conn = sqlite3.connect('phishing.db')
    cursor = conn.cursor()

    # total emails scanned
    cursor.execute("SELECT COUNT(*) FROM login_logs")
    email_scanned = cursor.fetchone()[0]

    # temporary stats
    urls_checked = 5
    threats_blocked = 2

    # recent activity
    cursor.execute("SELECT * FROM login_logs ORDER BY id DESC LIMIT 5")
    logs = cursor.fetchall()

    conn.close()

    return render_template(
        'dashboard.html',
        urls=urls_checked,
        emails=email_scanned,
        threats=threats_blocked,
        logs=logs
    )


# ---------------- EDUCATION PAGE ----------------
@app.route('/education')
def education():
    return render_template('education.html')


# ================= ADMIN PANEL =================

# ADMIN PAGE
@app.route('/admin')
def admin():
    return render_template("admin.html")


# GET LOGS
@app.route('/get_logs')
def get_logs():
    conn = sqlite3.connect("phishing.db")
    cursor = conn.cursor()

    cursor.execute("SELECT user, type, input, result, date FROM logs")
    rows = cursor.fetchall()

    conn.close()

    logs = []
    for r in rows:
        logs.append({
            "user": r[0],
            "type": r[1],
            "input": r[2],
            "result": r[3],
            "date": r[4]
        })

    return jsonify(logs)


# ADD KEYWORD
@app.route('/add_keyword', methods=['POST'])
def add_keyword():
    keyword = request.form['keyword']
    category = request.form['category']

    conn = sqlite3.connect("phishing.db")
    cursor = conn.cursor()

    cursor.execute("INSERT INTO keywords (keyword, category) VALUES (?, ?)",
                   (keyword, category))

    conn.commit()
    conn.close()

    return "Keyword Added Successfully"


# ADD BLACKLIST
@app.route('/add_blacklist', methods=['POST'])
def add_blacklist():
    url = request.form['url']

    conn = sqlite3.connect("phishing.db")
    cursor = conn.cursor()

    cursor.execute("INSERT INTO blacklist (url) VALUES (?)", (url,))

    conn.commit()
    conn.close()

    return "URL Blacklisted Successfully"

@app.route('/report')
def report():
    return render_template('report.html')

@app.route('/report-data')
def report_data():
    conn = sqlite3.connect("phishing.db")
    cursor = conn.cursor()

    cursor.execute("SELECT result, date, input FROM logs")
    rows = cursor.fetchall()
    conn.close()

    logs = []
    for r in rows:
        logs.append({
            "result": r[0],
            "date": r[1],
            "input": r[2]
        })

    return jsonify(logs)


# ---------------- RUN APP ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5001)