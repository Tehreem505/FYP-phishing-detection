// Load data from backend
fetch('/report-data')
.then(res => res.json())
.then(data => {
    let logs = data.logs;

    if (!logs || logs.length === 0) {
        document.getElementById("totalScans").innerText = "0";
        document.getElementById("totalPhishing").innerText = "0";
        document.getElementById("totalSafe").innerText = "0";
        document.getElementById("totalSuspicious").innerText = "0";
        return;
    }

    generateReport(logs);
})
.catch(err => {
    console.log("Error loading report data:", err);
});


function generateReport(logs) {

    // CALCULATIONS
    let totalScans = logs.length;

    let phishing = logs.filter(l =>
        l.result && l.result.toLowerCase()
        .includes("phishing")
    ).length;

    let safe = logs.filter(l =>
        l.result && l.result.toLowerCase()
        .includes("safe")
    ).length;

    let suspicious = logs.filter(l =>
        l.result && l.result.toLowerCase()
        .includes("suspicious")
    ).length;

    // UPDATE STATS
    document.getElementById("totalScans").innerText = totalScans;
    document.getElementById("totalPhishing").innerText = phishing;
    document.getElementById("totalSafe").innerText = safe;
    document.getElementById("totalSuspicious").innerText = suspicious;

    // PIE CHART
    drawPieChart(safe, suspicious, phishing);

    // BAR CHART
    drawBarChart(logs);

    // PATTERNS
    showPatterns(logs);
}


function drawPieChart(safe, suspicious, phishing) {

    let canvas = document.getElementById("pieChart");
    let pie = canvas.getContext("2d");

    pie.clearRect(0, 0, 300, 300);

    let total = safe + suspicious + phishing;

    if (total === 0) {
        pie.fillStyle = "#ccc";
        pie.beginPath();
        pie.arc(150, 150, 100, 0, 2 * Math.PI);
        pie.fill();
        return;
    }

    let data = [
        { value: safe, color: "#2ecc71" },
        { value: suspicious, color: "#f39c12" },
        { value: phishing, color: "#e74c3c" }
    ];

    let start = 0;

    data.forEach(function(item) {
        let angle = (item.value / total) * 2 * Math.PI;
        pie.beginPath();
        pie.moveTo(150, 150);
        pie.arc(150, 150, 100, start, start + angle);
        pie.fillStyle = item.color;
        pie.fill();
        start += angle;
    });

    // LEGEND
    pie.fillStyle = "#2ecc71";
    pie.fillRect(10, 270, 15, 15);
    pie.fillStyle = "#000";
    pie.fillText("Safe: " + safe, 30, 282);

    pie.fillStyle = "#f39c12";
    pie.fillRect(100, 270, 15, 15);
    pie.fillStyle = "#000";
    pie.fillText("Suspicious: " + suspicious, 120, 282);

    pie.fillStyle = "#e74c3c";
    pie.fillRect(220, 270, 15, 15);
    pie.fillStyle = "#000";
    pie.fillText("Phishing: " + phishing, 240, 282);
}


function drawBarChart(logs) {

    let canvas = document.getElementById("barChart");
    let bar = canvas.getContext("2d");

    bar.clearRect(0, 0, 500, 300);

    // Get last 7 days
    let days = {};

    logs.forEach(function(l) {
        if (l.date) {
            let day = l.date.substring(0, 10);
            days[day] = (days[day] || 0) + 1;
        }
    });

    let keys = Object.keys(days).slice(-7);
    let values = keys.map(k => days[k]);

    if (keys.length === 0) {
        bar.fillStyle = "#ccc";
        bar.fillText("No data available", 200, 150);
        return;
    }

    let maxVal = Math.max(...values);

    // Draw bars
    keys.forEach(function(key, i) {
        let barHeight = (values[i] / maxVal) * 200;
        let x = i * 60 + 50;
        let y = 250 - barHeight;

        bar.fillStyle = "#00bcd4";
        bar.fillRect(x, y, 40, barHeight);

        // Day label
        bar.fillStyle = "#000";
        bar.font = "10px Arial";
        bar.fillText(key.substring(5), x, 270);

        // Value label
        bar.fillText(values[i], x + 15, y - 5);
    });
}


function showPatterns(logs) {

    let patterns = {};

    logs.forEach(function(l) {
        if (l.result) {
            let key = l.result.toLowerCase()
            .includes("phishing") ? "Phishing" :
            l.result.toLowerCase()
            .includes("safe") ? "Safe" : "Suspicious";

            patterns[key] = (patterns[key] || 0) + 1;
        }
    });

    let list = document.getElementById("patternsList");
    list.innerHTML = "";

    Object.keys(patterns).forEach(function(p) {
        let li = document.createElement("li");
        li.innerText = p + ": " + patterns[p] + " detections";
        list.appendChild(li);
    });
}


// EXPORT REPORT
function exportReport() {

    let total = document.getElementById("totalScans").innerText;
    let phishing = document.getElementById("totalPhishing").innerText;
    let safe = document.getElementById("totalSafe").innerText;
    let suspicious = document.getElementById("totalSuspicious").innerText;

    let text = `
PHISHGUARD - REPORT SUMMARY
============================
Generated: ${new Date().toLocaleString()}

Total Scans    : ${total}
Safe           : ${safe}
Suspicious     : ${suspicious}
Phishing       : ${phishing}
============================
PhishGuard Anti-Phishing System
    `;

    let blob = new Blob([text], {type: "text/plain"});
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "phishguard_report.txt";
    link.click();
}