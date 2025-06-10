const startBtn = document.getElementById('start-button');
const resetBtn = document.getElementById('reset-button');
const wpm = document.getElementById('word-count');
const accuracy = document.getElementById('accuracy-percentage');
const timer = document.getElementById('timer');
const textDisplay = document.getElementById('text-display');

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  resetBtn.disabled = false;
  fetch("JavaScript/quote.json")
    .then(res => res.json())
    .then(data => {
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      textDisplay.textContent = randomQuote.text + (randomQuote.author ? ` — ${randomQuote.author}` : "");
    })
    .catch(err => {
      textDisplay.textContent = "Failed to load quote.";
      console.error(err);
    });
});

wpm.textContent = "WPM : 0";
accuracy.textContent = "0";
timer.textContent = "00:00";


resetBtn.addEventListener("click", () => {
  startBtn.disabled = false;
  resetBtn.disabled = true;
  wpm.textContent = "0";
  accuracy.textContent = "0%";
  timer.textContent = "00:00";
  textDisplay.textContent = "";
});