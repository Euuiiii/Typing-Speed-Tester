const startBtn = document.getElementById('start-button');
const resetBtn = document.getElementById('reset-button');
const wpm = document.getElementById('word-count');
const accuracy = document.getElementById('accuracy-percentage');
const timer = document.getElementById('timer');
const textDisplay = document.getElementById('text-display');
const userInput = document.getElementById('user-input');

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

document.getElementById('count').textContent = "0";
document.getElementById('accuracy-percentage').textContent = "0";
timer.textContent = "00:00";


resetBtn.addEventListener("click", () => {
  startBtn.disabled = false;
  resetBtn.disabled = true;
  document.getElementById('count').textContent = "0";
  document.getElementById('accuracy-percentage').textContent = "0";
  timer.textContent = "00:00";
  textDisplay.innerHTML = '<p>Press the "Start" button to begin.</p>';
  userInput.value = '';
  userInput.placeholder = 'Start typing here...';
});