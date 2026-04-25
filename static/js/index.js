let url = window.location.href;

/* 1. Browser URL Warning */
let banner = document.getElementById("warningBanner");

if (url.startsWith("https")) {
    banner.innerHTML = "green You are on a secure page";
    banner.style.background = "green";
} else {
    banner.innerHTML = "red This URL looks suspicious";
    banner.style.background = "red";
}

/* 2. Iframe Detection */
if (window.self !== window.top) {
    alert("⚠ This might be a phishing frame (iframe detected)");
}

/* 3. SSL Indicator */
let sslBox = document.getElementById("sslBox");

if (url.startsWith("https")) {
    sslBox.innerHTML = "Secure Connection (HTTPS)";
    sslBox.style.color = "green";
} else {
    sslBox.innerHTML = "⚠ Not Secure (HTTP)";
    sslBox.style.color = "red";
}