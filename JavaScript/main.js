const startBtn = document.getElementById('start-button');
const resetBtn = document.getElementById('reset-button');
const wpm = document.getElementById('word-count');
const accuracy = document.getElementById('accuracy-percentage');
const timer = document.getElementById('timer');
const textDisplay = document.getElementById('text-display');
const userInput = document.getElementById('user-input');

let startTime = null;
let timerInterval = null;

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
      document.getElementById('count').textContent = "0";
      document.getElementById('accuracy-percentage').textContent = "0";
      timer.textContent = "00:00";
      startTime = null;
      clearInterval(timerInterval);
    })
    .catch(err => {
      textDisplay.textContent = "Failed to load quote.";
      console.error(err);
    });
});

document.getElementById('count').textContent = "0";
document.getElementById('accuracy-percentage').textContent = "0";
timer.textContent = "00:00";

// reset button -> resets UI and input fields to initial state
resetBtn.addEventListener("click", () => {
  startBtn.disabled = false;
  resetBtn.disabled = true;
  document.getElementById('count').textContent = "0";
  document.getElementById('accuracy-percentage').textContent = "0";
  timer.textContent = "00:00";
  textDisplay.innerHTML = '<p>Press the "Start" button to begin.</p>';
  userInput.value = '';
  userInput.placeholder = 'Start typing here...';
  userInput.disabled = false;
  userInput.blur();
  startTime = null;
  clearInterval(timerInterval);
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
    timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const seconds = String(elapsed % 60).padStart(2, '0');
      timer.textContent = `${minutes}:${seconds}`;
    }, 1000);
  }

  // input and text into words
  const inputWords = input.trim().split(/\s+/);
  const textWords = text.split(/\s+/);

  // last word is completed ?
  const lastChar = input.slice(-1);
  const completedWordsCount = lastChar === ' ' ? inputWords.length : inputWords.length - 1;

  // Error counting 
  let errorCount = 0;
  for (let i = 0; i < completedWordsCount; i++) {
    if (inputWords[i] !== textWords[i]) errorCount++;
  }
  document.getElementById('error').textContent = `Error: ${errorCount}`;

  // words typed -> correct words -> WPM and accuracy
  const wordsTyped = inputWords.length;
  let correctWords = 0;
  for (let i = 0; i < inputWords.length; i++) {
    if (inputWords[i] === textWords[i]) correctWords++;
  }

  const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
  const elapsedMinutes = elapsedSeconds / 60;
  const wpmValue = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
  document.getElementById('count').textContent = wpmValue;

  accuracy.textContent = ((correctWords / wordsTyped) * 100 || 0).toFixed(2);

  //this need to be updated and the user will get the message as their typing speed 
  if (inputWords.length === textWords.length && inputWords.every((w, i) => w === textWords[i] || w !== undefined)) {
    userInput.disabled = true;
    startBtn.disabled = false;
    resetBtn.disabled = false;
    clearInterval(timerInterval);

    const popup = document.getElementById('result-popup');
    const popupMsg = document.getElementById('popup-message');
    if (errorCount === 0) {
      popupMsg.textContent = `🎉 Perfect! Your typing speed is ${wpmValue} WPM and an accuracy of ${accuracy.textContent}%.`;
    } else {
      popupMsg.textContent = `Your typing speed is ${wpmValue} WPM with ${errorCount} error(s) and an accuracy of ${accuracy.textContent}%.`;
    }
    popup.style.display = 'flex';
  }

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
});

document.getElementById('close-popup').onclick = function() {
  document.getElementById('result-popup').style.display = 'none';
};

textDisplay.addEventListener('copy', function(e) {
  e.preventDefault();
});
textDisplay.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

/* Things to improve:
1. Store user statistics (WPM, accuracy) in local storage or a database for future reference.
2. Time mods to be added  
*/