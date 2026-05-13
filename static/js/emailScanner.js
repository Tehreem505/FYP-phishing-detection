document.getElementById("emailForm")
.addEventListener("submit", function(e) {

    let sender = document.querySelector(
        "input[name='sender']"
    ).value.trim();

    let subject = document.querySelector(
        "input[name='subject']"
    ).value.trim();

    let body = document.querySelector(
        "textarea[name='body']"
    ).value.trim();

    // Empty check
    if (sender === "" || subject === "" || body === "") {
        e.preventDefault();
        alert("Please fill all fields!");
        return;
    }

    // Email format check
    if (!sender.includes("@")) {
        e.preventDefault();
        alert("Please enter a valid email address!");
        return;
    }

    let btn = document.getElementById("scanBtn");
    let spinner = document.getElementById("spinner");

    spinner.style.display = "block";
    btn.innerText = "Scanning...";
    btn.disabled = true;
});