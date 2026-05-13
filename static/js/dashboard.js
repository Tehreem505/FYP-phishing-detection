// Dashboard auto refresh stats every 30 seconds
setInterval(function() {
    location.reload();
}, 30000);

// Highlight phishing results in table red color
window.onload = function() {
    let rows = document.querySelectorAll('table tr');
    
    rows.forEach(function(row) {
        let cells = row.querySelectorAll('td');
        cells.forEach(function(cell) {
            if (cell.innerText.toLowerCase()
            .includes('phishing')) {
                cell.style.color = 'red';
                cell.style.fontWeight = 'bold';
            }
            if (cell.innerText.toLowerCase()
            .includes('safe')) {
                cell.style.color = 'green';
                cell.style.fontWeight = 'bold';
            }
            if (cell.innerText.toLowerCase()
            .includes('suspicious')) {
                cell.style.color = 'orange';
                cell.style.fontWeight = 'bold';
            }
        });
    });
};