const params = new URLSearchParams(window.location.search);
const topic = params.get('topic');
const level = params.get('level');
let questions = [], currentQuestion = 0, selectedOption = null;

const questionText = document.getElementById('questionText');
const questionNumber = document.getElementById('questionNumber');
const optionsContainer = document.getElementById('optionsContainer');
const checkBtn = document.getElementById('checkAnswer');
const skipBtn = document.getElementById('skipQuestion');
const nextBtn = document.getElementById('nextQuestion');

// 🔄 NEW: Shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

fetch(`${topic}.json`)
  .then(res => res.json())
  .then(data => {
    questions = shuffleArray(data[level]); // 🔄 NEW: Shuffle questions before using
    loadQuestion();
  });

function loadQuestion() {
  const q = questions[currentQuestion];
  questionText.textContent = q.question;
  questionNumber.textContent = `Question ${currentQuestion + 1}`;
  optionsContainer.innerHTML = '';
  selectedOption = null;
  checkBtn.disabled = true;
  nextBtn.style.display = 'none';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.className = 'option-button';
    btn.onclick = () => {
      selectedOption = idx;
      document.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      checkBtn.disabled = false;
    };
    optionsContainer.appendChild(btn);
  });
}

checkBtn.onclick = () => {
  if (selectedOption === null) {
    alert("Please select an option first.");
    return;
  }

  const correctIndex = questions[currentQuestion].answer;
  const buttons = document.querySelectorAll('.option-button');
  const isCorrect = selectedOption === correctIndex;

  const selectedBtn = buttons[selectedOption];

  if (isCorrect) {
    selectedBtn.classList.add('correct');
    buttons.forEach(btn => btn.disabled = true);
    checkBtn.disabled = true;
    skipBtn.disabled = true;
    nextBtn.style.display = 'inline-block';

    const feedback = document.getElementById('feedback');
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "green";
  } else {
    selectedBtn.classList.add('wrong');
    selectedBtn.disabled = true;
    selectedBtn.classList.remove('selected');

    const feedback = document.getElementById('feedback');
    feedback.textContent = "❌ Wrong! Try again.";
    feedback.style.color = "red";
  }
};

nextBtn.onclick = () => {
  const feedback = document.getElementById('feedback');
  feedback.textContent = "👈(⌒▽⌒)👉";
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    alert('🎉 You have completed this round!');
    window.location.href = 'index.html';
  } else {
    skipBtn.disabled = false;
    loadQuestion();
  }
};

skipBtn.onclick = () => {
  const feedback = document.getElementById('feedback');
  feedback.textContent = "LOL Loser!";
  nextBtn.style.display = 'inline-block';
  checkBtn.disabled = true;
  document.querySelectorAll('.option-button').forEach(btn => btn.disabled = true);
  skipBtn.disabled = true;
};

// Apply saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-theme');
}
