const startBtn = document.getElementById('start-button');
const resetBtn = document.getElementById('reset-button');
const wpm = document.getElementById('word-count');
const accuracy = document.getElementById('accuracy-percentage');
const time = document.getElementById('time');
const textDisplay = document.getElementById('text-display');
const userInput = document.getElementById('user-input');
const count = document.getElementById('count');
const error = document.getElementById('error');
const bestWpm = document.getElementById("bestWpm");
const bestAccuracy = document.getElementById("bestAccuracy");
const bestTime = document.getElementById("bestTime");

let startTime = null;
let timerInterval = null;

// Load best 
loadBestStats();

// start button -> loads a random quote -> resets UI -> enables typing
startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  resetBtn.disabled = false;
  fetch("JavaScript/quote.json")
    .then(res => res.json())
    .then(data => {
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      const quoteWords = randomQuote.text.split(' ');
      textDisplay.innerHTML = `
        <span class="quote-text">
          ${quoteWords.map(word => `<span class="quote-word">${word}</span>`).join(' ')}
        </span>
        <div class="author-section">
          ${randomQuote.author ? `<span class="author">— ${randomQuote.author}</span>` : ""}
        </div>
      `;
      userInput.value = '';
      userInput.disabled = false;
      userInput.placeholder = 'Start typing here...';
      userInput.focus();
      count.textContent = "0";
      accuracy.textContent = "0";
      error.textContent = "Error: 0";
      time.textContent = "00:00";
      startTime = null;
      clearInterval(timerInterval);
    })
    .catch(err => {
      textDisplay.textContent = "Failed to load quote.";
      console.error(err);
    });
});

// reset button -> resets UI and input fields to initial state
resetBtn.addEventListener("click", () => {
  startBtn.disabled = false;
  resetBtn.disabled = true;
  count.textContent = "0";
  accuracy.textContent = "0";
  error.textContent = "Error: 0";
  textDisplay.innerHTML = '<p>Press the "Start" button to begin.</p>';
  userInput.value = '';
  userInput.placeholder = 'Start typing here...';
  userInput.disabled = false;
  userInput.blur();
  startTime = null;
  clearInterval(timerInterval);
  time.textContent = "00:00"; 
});

// typing -> updates timer -> error count -> WPM and accuracy in real time
userInput.addEventListener("input", () => {
  const quoteTextElem = textDisplay.querySelector('.quote-text');
  if (!quoteTextElem) return;
  const text = quoteTextElem.textContent.trim();
  const input = userInput.value;

  // Start timer on first input
  if (!startTime && input.length > 0 && !userInput.disabled) {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
  }

  const inputWords = input.trim().split(/\s+/);
  const textWords = text.split(/\s+/);
  const lastChar = input.slice(-1);
  const completedWordsCount = lastChar === ' ' ? inputWords.length : inputWords.length - 1;

  // Error counting 
  let errorCount = 0;
  for (let i = 0; i < completedWordsCount; i++) {
    if (inputWords[i] !== textWords[i]) errorCount++;
  }
  error.textContent = `Error: ${errorCount}`;

  // WPM & Accuracy calculation
  const wordsTyped = inputWords.length;
  let correctWords = 0;
  for (let i = 0; i < inputWords.length; i++) {
    if (inputWords[i] === textWords[i]) correctWords++;
  }

  const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
  const elapsedMinutes = elapsedSeconds / 60;
  const wpmValue = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
  count.textContent = wpmValue;
  const accuracyValue = ((correctWords / wordsTyped) * 100 || 0).toFixed(2);
  accuracy.textContent = accuracyValue;

  updateTextColor(textWords, inputWords);

  // When user finishes typing
  const isCompleted = (
    input.trim().length >= text.trim().length &&
    input.trim().split(/\s+/).length >= text.trim().split(/\s+/).length
  );

  if (isCompleted) {
    userInput.disabled = true;
    startBtn.disabled = false;
    resetBtn.disabled = false;
    clearInterval(timerInterval);
    updateBestStats(wpmValue, accuracyValue, elapsedSeconds);
    showResultPopup(wpmValue, errorCount, accuracyValue);
  }
});

// Timer updater
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  time.textContent = `${minutes}:${seconds}`;
}

// Text color updater
function updateTextColor(textWords, inputWords) {
  const quoteWordSpans = textDisplay.querySelectorAll('.quote-word');
  for (let i = 0; i < quoteWordSpans.length; i++) {
    quoteWordSpans[i].classList.remove('error-word', 'correct-word');
    if (inputWords[i] !== undefined) {
      if (inputWords[i] === textWords[i]) {
        quoteWordSpans[i].classList.add('correct-word');
      } else {
        quoteWordSpans[i].classList.add('error-word');
      }
    }
  }
}

// disable copying
textDisplay.addEventListener('copy', e => e.preventDefault());
textDisplay.addEventListener('contextmenu', e => e.preventDefault());

document.getElementById('close-popup').onclick = function () {
  document.getElementById('result-popup').style.display = 'none';
};

// Update -> store best stats in localStorage
function updateBestStats(currentWpm, currentAccuracy, currentTime) {
  const bestWpmValue = parseInt(localStorage.getItem('bestWpm')) || 0;
  const bestAccuracyValue = parseFloat(localStorage.getItem('bestAccuracy')) || 0;
  const bestTimeValue = parseFloat(localStorage.getItem('bestTime')) || Infinity;

  if (currentWpm > bestWpmValue) {
    localStorage.setItem('bestWpm', currentWpm);
    document.getElementById('best-wpm').textContent = currentWpm;
  }
  if (parseFloat(currentAccuracy) > bestAccuracyValue) {
    localStorage.setItem('bestAccuracy', currentAccuracy);
    document.getElementById('best-accuracy').textContent = parseFloat(currentAccuracy).toFixed(2);
  }
  if (currentTime < bestTimeValue) {
    localStorage.setItem('bestTime', currentTime);
    document.getElementById('best-time').textContent = formatTime(currentTime);
  }
}

// Load best stats on page load
function loadBestStats() {
  const bestWpmValue = parseInt(localStorage.getItem('bestWpm')) || 0;
  const bestAccuracyValue = parseFloat(localStorage.getItem('bestAccuracy')) || 0;
  const bestTimeValue = parseFloat(localStorage.getItem('bestTime'));

  document.getElementById('best-wpm').textContent = bestWpmValue;
  document.getElementById('best-accuracy').textContent = bestAccuracyValue.toFixed(2);
  document.getElementById('best-time').textContent = !isNaN(bestTimeValue) ? formatTime(bestTimeValue) : "00:00";
}

// Time formatter
function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Result popup display
function showResultPopup(wpmValue, errorCount, accuracyValue) {
  const popup = document.getElementById('result-popup');
  const popupMsg = document.getElementById('popup-message');
  if (errorCount === 0) {
    popupMsg.textContent = `🎉 Perfect! Your typing speed is ${wpmValue} WPM with 100% accuracy.`;
  } else {
    popupMsg.textContent = `🎉 Your typing speed is ${wpmValue} WPM with ${errorCount} error(s) and an accuracy of ${accuracyValue}%.`;
  }
  popup.style.display = 'flex';
}
