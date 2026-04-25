import re

suspicious_keywords = [
"login","verify","update","secure","account",
"banking","confirm","signin","password"
]

suspicious_extensions = [".xyz",".tk",".ml",".ga",".cf",".buzz",".top"]

shorteners = ["bit.ly","tinyurl.com","t.co"]

def analyze_url(url):

    score = 0
    reasons = []

    # Rule 1: IP address
    if re.search(r'\d+\.\d+\.\d+\.\d+', url):
        score += 2
        reasons.append("Contains IP address")

    # Rule 2: length
    if len(url) > 100:
        score += 2
        reasons.append("URL too long (>100 chars)")
    elif len(url) > 75:
        score += 1
        reasons.append("URL moderately long")

    # Rule 3: subdomains
    if url.count('.') > 4:
        score += 1
        reasons.append("Too many subdomains")

    # Rule 4: HTTP
    if url.startswith("http://"):
        score += 1
        reasons.append("Uses HTTP instead of HTTPS")

    # Rule 5: suspicious extensions
    for ext in suspicious_extensions:
        if ext in url:
            score += 2
            reasons.append(f"Suspicious extension {ext}")

    # Rule 6: keywords
    for kw in suspicious_keywords:
        if kw in url.lower():
            score += 1
            reasons.append(f"Suspicious keyword: {kw}")

    # Rule 7: @ symbol
    if "@" in url:
        score += 2
        reasons.append("Contains @ symbol")

    # Rule 8: shorteners
    for s in shorteners:
        if s in url:
            score += 2
            reasons.append("URL shortener detected")

    # Rule 10: double slash path
    if url.count("//") > 1:
        score += 1
        reasons.append("Double slashes in URL")

    # Rule 11: hyphen domain
    if "-" in url.split("//")[-1].split("/")[0]:
        score += 1
        reasons.append("Hyphen in domain")

    # RESULT LOGIC
    if score <= 2:
        status = "SAFE"
        confidence = 90
    elif score <= 5:
        status = "SUSPICIOUS"
        confidence = 65
    else:
        status = "PHISHING"
        confidence = 90

    return {
        "status": status,
        "confidence": confidence,
        "reasons": reasons
    }