// =============================
// ADMIN LOGIN CHECK
// =============================
let isAdmin = localStorage.getItem("admin");

if (isAdmin !== "true") {
    let username = prompt("Enter Admin Username:");
    let password = prompt("Enter Admin Password:");

    if (username === "admin" && password === "admin123") {
        localStorage.setItem("admin", "true");
    } else {
        alert("Access Denied!");
        window.location.href = "/";
    }
}


// =============================
//  LOAD LOGS FROM BACKEND
// =============================
let logs = []; // global variable (backend se fill hoga)

fetch('/get_logs')
.then(res => res.json())
.then(data => {
    logs = data;        // store globally
    loadTable(logs);    // initial load
});


// =============================
// 📋 LOAD TABLE FUNCTION
// =============================
function loadTable(data) {
    let table = document.getElementById("logBody");
    table.innerHTML = "";

    data.forEach(log => {
        table.innerHTML += `
            <tr>
                <td>${log.user}</td>
                <td>${log.type}</td>
                <td>${log.input}</td>
                <td>${log.result}</td>
                <td>${log.date}</td>
            </tr>
        `;
    });

    // =============================
    // STATS UPDATE
    // =============================
    document.getElementById("totalUsers").innerText =
        new Set(data.map(l => l.user)).size;

    document.getElementById("totalScans").innerText =
        data.length;

    document.getElementById("totalThreats").innerText =
        data.filter(l => l.result === "Phishing").length;
}


// =============================
// 🔍 SEARCH FILTER
// =============================
document.getElementById("searchInput").addEventListener("keyup", function() {
    let value = this.value.toLowerCase();

    let filtered = logs.filter(log =>
        log.user.toLowerCase().includes(value) ||
        log.type.toLowerCase().includes(value) ||
        log.input.toLowerCase().includes(value) ||
        log.result.toLowerCase().includes(value)
    );

    loadTable(filtered);
});


// =============================
// ➕ ADD KEYWORD (BACKEND)
// =============================
function addKeyword() {
    let keyword = document.getElementById("keyword").value;
    let category = document.getElementById("category").value;

    if (keyword === "") {
        alert("Enter keyword");
        return;
    }

    fetch('/add_keyword', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `keyword=${keyword}&category=${category}`
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        document.getElementById("keyword").value = "";
    });
}


// =============================
// 🚫 ADD BLACKLIST (BACKEND)
// =============================
function addBlacklist() {
    let url = document.getElementById("blacklistUrl").value;

    if (url === "") {
        alert("Enter URL");
        return;
    }

    fetch('/add_blacklist', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `url=${url}`
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        document.getElementById("blacklistUrl").value = "";
    });
}