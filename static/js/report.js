
// ---------------- LOAD DATA FROM BACKEND ----------------
let logs = [];

fetch('/report-data')
.then(res => res.json())
.then(data => {
    logs = data;
    generateReport();
});

function generateReport() {

    // ---------------- CALCULATIONS ----------------
    let totalScans = logs.length;
    let phishing = logs.filter(l => l.result === "Phishing").length;
    let safe = logs.filter(l => l.result === "Safe").length;
    let suspicious = logs.filter(l => l.result === "Suspicious").length;

    // ---------------- UPDATE STATS ----------------
    document.getElementById("totalScans").innerText = totalScans;
    document.getElementById("totalPhishing").innerText = phishing;
    document.getElementById("totalSafe").innerText = safe;
    document.getElementById("totalSuspicious").innerText = suspicious;

    // ---------------- PIE CHART ----------------
    let pie = document.getElementById("pieChart").getContext("2d");
    pie.clearRect(0, 0, 300, 300);

    let total = phishing + safe + suspicious || 1;

    let angles = [
        (safe / total) * 2 * Math.PI,
        (suspicious / total) * 2 * Math.PI,
        (phishing / total) * 2 * Math.PI
    ];

    let colors = ["green", "orange", "red"];

    let start = 0;
    for (let i = 0; i < angles.length; i++) {
        pie.beginPath();
        pie.moveTo(150, 150);
        pie.arc(150, 150, 100, start, start + angles[i]);
        pie.fillStyle = colors[i];
        pie.fill();
        start += angles[i];
    }

    // ---------------- BAR CHART (last 7 days) ----------------
    let bar = document.getElementById("barChart").getContext("2d");
    bar.clearRect(0, 0, 500, 300);

    let days = {};

    logs.forEach(l => {
        days[l.date] = (days[l.date] || 0) + 1;
    });

    let keys = Object.keys(days).slice(-7);
    let values = keys.map(k => days[k]);

    for (let i = 0; i < values.length; i++) {
        bar.fillRect(i * 60 + 50, 300 - values[i] * 30, 40, values[i] * 30);
    }

    // ---------------- PATTERNS ----------------
    let patterns = {};
    logs.forEach(l => {
        patterns[l.input] = (patterns[l.input] || 0) + 1;
    });

    let list = document.getElementById("patternsList");
    list.innerHTML = "";

    Object.keys(patterns).forEach(p => {
        let li = document.createElement("li");
        li.innerText = p + " (" + patterns[p] + ")";
        list.appendChild(li);
    });
}


// ---------------- EXPORT REPORT ----------------
function exportReport() {

    let safe = logs.filter(l => l.result === "Safe").length;
    let phishing = logs.filter(l => l.result === "Phishing").length;
    let suspicious = logs.filter(l => l.result === "Suspicious").length;

    let text = `
REPORT SUMMARY
--------------
Total Scans: ${logs.length}
Safe: ${safe}
Suspicious: ${suspicious}
Phishing: ${phishing}
`;

    let blob = new Blob([text], {type: "text/plain"});
    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "phishing_report.txt";
    link.click();
}