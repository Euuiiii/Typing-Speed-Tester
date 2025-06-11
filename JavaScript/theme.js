const themeToggle = document.getElementById('theme-toggle');
const darkTheme = document.getElementById('dark-theme');


function setThemeIcon() {
    themeToggle.textContent = darkTheme.disabled ? '🌙' : '🔆';
    themeToggle.title = darkTheme.disabled ? 'Switch to dark mode' : 'Switch to light mode';
}

themeToggle.addEventListener('click', () => {
    darkTheme.disabled = !darkTheme.disabled;
    setThemeIcon();
});

setThemeIcon();