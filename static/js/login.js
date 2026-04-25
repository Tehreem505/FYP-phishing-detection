// =========================
// URL SAFETY CHECK
// =========================

let url = window.location.href;
let banner = document.getElementById("securityBanner");

if (url.startsWith("https")) {
    banner.innerHTML = "You are on a secure page";
    banner.classList.add("secure");
} else {
    banner.innerHTML = "⚠ This URL looks suspicious";
    banner.classList.add("warning");
}

// =========================
// IFRAME DETECTION
// =========================

if (window.self !== window.top) {
    alert("⚠ This page might be loaded inside a phishing iframe!");
}

// =========================
// SSL INDICATOR
// =========================

let ssl = document.getElementById("sslStatus");

if (url.startsWith("https")) {
    ssl.innerHTML = " Secure Connection";
    ssl.style.color = "green";
} else {
    ssl.innerHTML = " Not Secure Connection";
    ssl.style.color = "red";
}