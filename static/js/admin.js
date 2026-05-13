
function searchTable() {
    let input = document.getElementById("search").value.toLowerCase();
    let rows = document.getElementById("logTable").getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        let text = rows[i].innerText.toLowerCase();
        rows[i].style.display = text.includes(input) ? "" : "none";
    }
}