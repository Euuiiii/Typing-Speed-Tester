const themeToggle = document.getElementById('theme-toggle');
const darkTheme = document.getElementById('dark-theme');

function setThemeIcon() {
    themeToggle.textContent = darkTheme.disabled ? '🌙' : '🔆';
    themeToggle.title = darkTheme.disabled ? 'Switch to dark mode' : 'Switch to light mode';
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    darkTheme.disabled = false;
} else if (savedTheme === 'light') {
    darkTheme.disabled = true;
}
setThemeIcon();

themeToggle.addEventListener('click', () => {
    darkTheme.disabled = !darkTheme.disabled;
    setThemeIcon();
    localStorage.setItem('theme', darkTheme.disabled ? 'light' : 'dark');
});

setThemeIcon();