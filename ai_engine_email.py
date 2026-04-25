import re

urgency_words = [
"immediately","urgent","suspended","24 hours",
"act now","limited time","expire","warning"
]

sensitive_words = [
"password","ssn","credit card","bank account",
"verify your identity","confirm your account"
]

threat_words = [
"unauthorized","locked","disabled","fraud detected"
]

action_words = [
"click here","click below","download attachment",
"open attachment","update now"
]

def analyze_email(sender, subject, body):

    score = 0
    flags = []
    text = body.lower()

    #  URGENCY
    for w in urgency_words:
        if w in text:
            score += 2
            flags.append("Urgency language detected")

    # SENSITIVE DATA
    for w in sensitive_words:
        if w in text:
            score += 2
            flags.append("Requests sensitive data")

    #  THREAT
    for w in threat_words:
        if w in text:
            score += 2
            flags.append("Threat language detected")

    #  ACTION PHRASES
    for w in action_words:
        if w in text:
            score += 2
            flags.append("Suspicious action request")

    #  EXCLAMATION MARKS
    if body.count("!") > 3:
        score += 1
        flags.append("Excessive exclamation marks")

    #  ALL CAPS
    if body.isupper():
        score += 1
        flags.append("Excessive ALL CAPS usage")

    #  SIMPLE SENDER CHECK
    if "gmail" in sender or "yahoo" in sender:
        if "bank" in subject.lower():
            score += 2
            flags.append("Free email pretending to be bank")

    #  GREETING CHECK
    if "dear customer" in text:
        score += 1
        flags.append("Generic greeting detected")

    # SCORE RESULT
    if score <= 2:
        verdict = "LIKELY SAFE"
    elif score <= 5:
        verdict = "SUSPICIOUS EMAIL"
    else:
        verdict = "PHISHING EMAIL"

    # HIGHLIGHT EMAIL
    highlighted = body
    for w in urgency_words + sensitive_words:
        highlighted = re.sub(w, f"<span class='red'>{w}</span>", highlighted, flags=re.I)

    return {
        "verdict": verdict,
        "score": score,
        "flags": flags,
        "highlighted": highlighted
    }