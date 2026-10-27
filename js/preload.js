document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("main-content").style.display = "block";
    }, 3000);
});