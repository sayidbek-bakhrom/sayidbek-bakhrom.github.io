// 🌙 Theme Toggle
const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    toggle.textContent = 
        document.body.classList.contains("light") ? "☀️" : "🌙";
});

// 🎬 Scroll Reveal Animation
function reveal() {
    const reveals = document.querySelectorAll(".reveal");

    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", reveal);
reveal();