document.getElementById("urlForm")
.addEventListener("submit", function(e) {

    let urlInput = document.getElementById("urlInput").value.trim();

    // Empty check
    if (urlInput === "") {
        e.preventDefault();
        alert("Please enter a URL first!");
        return;
    }

    // Basic URL format check
    if (!urlInput.startsWith("http://") && 
        !urlInput.startsWith("https://")) {
        e.preventDefault();
        alert("Please enter a valid URL starting with http:// or https://");
        return;
    }

    let btn = document.getElementById("checkBtn");
    let spinner = document.getElementById("spinner");

    spinner.style.display = "block";
    btn.innerText = "Checking...";
    btn.disabled = true;
});