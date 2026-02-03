const loveLanguages = [
    'Words of Affirmation', 
    'Acts of Service', 
    'Receiving Gifts', 
    'Quality Time', 
    'Physical Touch'
];

const questions = [
    {
        text: "How do you prefer to receive appreciation?",
        options: [
            { text: "Verbal compliments and encouragement", lang: 0 },
            { text: "Help with chores or tasks", lang: 1 },
            { text: "Small thoughtful gifts", lang: 2 },
            { text: "Quality time together", lang: 3 },
            { text: "Physical affection like hugs", lang: 4 }
        ]
    },
    {
        text: "What makes you feel most loved by a partner?",
        options: [
            { text: "Hearing 'I love you' and specific praise", lang: 0 },
            { text: "When they cook dinner or run errands", lang: 1 },
            { text: "Surprise presents that show they listened", lang: 2 },
            { text: "Undivided attention during conversations", lang: 3 },
            { text: "Cuddling or holding hands", lang: 4 }
        ]
    },
    {
        text: "When you're feeling down, what cheers you up most?",
        options: [
            { text: "Encouraging words from loved ones", lang: 0 },
            { text: "Someone helping with my responsibilities", lang: 1 },
            { text: "A small gift or treat", lang: 2 },
            { text: "Spending focused time together", lang: 3 },
            { text: "Physical comfort like a hug", lang: 4 }
        ]
    },
    {
        text: "How do you feel most appreciated at work or home?",
        options: [
            { text: "Public recognition or thank you notes", lang: 0 },
            { text: "Team members helping with my workload", lang: 1 },
            { text: "Thoughtful gifts or bonuses", lang: 2 },
            { text: "Meaningful one-on-one discussions", lang: 3 },
            { text: "High fives or supportive touches", lang: 4 }
        ]
    },
    {
        text: "What’s your favorite way to celebrate special occasions?",
        options: [
            { text: "Heartfelt toasts and speeches", lang: 0 },
            { text: "Someone else handling all the planning", lang: 1 },
            { text: "Beautiful wrapping and perfect gifts", lang: 2 },
            { text: "Extended quality time with loved ones", lang: 3 },
            { text: "Lots of hugs and physical closeness", lang: 4 }
        ]
    },
    {
        text: "When you do something nice for someone, what response makes you happiest?",
        options: [
            { text: "Them verbally expressing gratitude", lang: 0 },
            { text: "Them returning the favor later", lang: 1 },
            { text: "Them giving me a thoughtful gift", lang: 2 },
            { text: "Them spending time with me", lang: 3 },
            { text: "Them giving me a hug or pat", lang: 4 }
        ]
    },
    {
        text: "What’s the best way to apologize to you?",
        options: [
            { text: "Sincere words explaining they’re sorry", lang: 0 },
            { text: "Making it up to me with helpful actions", lang: 1 },
            { text: "A peace offering gift", lang: 2 },
            { text: "Quality time to talk it through", lang: 3 },
            { text: "Physical affection and makeup cuddles", lang: 4 }
        ]
    },
    {
        text: "How do you recharge after a long day?",
        options: [
            { text: "Positive conversations with friends", lang: 0 },
            { text: "Having household tasks done for me", lang: 1 },
            { text: "Retail therapy with small purchases", lang: 2 },
            { text: "Deep conversations or shared activities", lang: 3 },
            { text: "Physical relaxation like massages", lang: 4 }
        ]
    },
    {
        text: "What makes a date night perfect for you?",
        options: [
            { text: "Flirty compliments throughout", lang: 0 },
            { text: "Everything planned so I can relax", lang: 1 },
            { text: "Thoughtful little gifts or treats", lang: 2 },
            { text: "Meaningful conversation all night", lang: 3 },
            { text: "Lots of touching and closeness", lang: 4 }
        ]
    },
    {
        text: "What’s your ideal morning routine with a partner?",
        options: [
            { text: "Sweet morning affirmations", lang: 0 },
            { text: "Making me coffee/breakfast", lang: 1 },
            { text: "Small morning surprises/gifts", lang: 2 },
            { text: "Cuddling and talking in bed", lang: 3 },
            { text: "Physical intimacy first thing", lang: 4 }
        ]
    }
];

let currentQuestion = 0;
let scores = [0, 0, 0, 0, 0];
let answers = [];

function init() {
    generateQuestions();
    document.getElementById('startBtn').addEventListener('click', startQuiz);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('prevBtn').addEventListener('click', prevQuestion);
    document.getElementById('restartBtn').addEventListener('click', restartQuiz);
}

function generateQuestions() {
    const container = document.getElementById('quizContainer');
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = `question-card ${index === 0 ? '' : 'hidden'}`;
        div.id = `question-${index}`;
        div.innerHTML = `
            <h3 class="mb-4">${index + 1}. ${q.text}</h3>
            ${q.options.map((opt, optIndex) => 
                `<label class="option-label">
                    <input type="radio" name="q${index}" value="${opt.lang}" data-lang="${opt.lang}">
                    <span>${opt.text}</span>
                </label>`
            ).join('')}
        `;
        container.appendChild(div);
    });
}

function startQuiz() {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
    updateProgress();
}

function nextQuestion() {
    const current = document.querySelector('.question-card:not(.hidden)');
    const selected = current.querySelector('input:checked');
    
    if (!selected && currentQuestion === 0) {
        alert('Please select an answer before continuing!');
        return;
    }
    
    if (selected) {
        const langIndex = parseInt(selected.value);
        scores[langIndex]++;
        currentQuestion++;
        
        current.classList.add('hidden');
        
        if (currentQuestion < questions.length) {
            document.getElementById(`question-${currentQuestion}`).classList.remove('hidden');
            updateProgress();
        } else {
            showResults();
        }
    } else {
        alert('Please select an answer!');
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        document.querySelector('.question-card:not(.hidden)').classList.add('hidden');
        currentQuestion--;
        document.getElementById(`question-${currentQuestion}`).classList.remove('hidden');
        updateProgress();
    }
}

function updateProgress() {
    const progress = ((currentQuestion) / questions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('prevBtn').classList.toggle('hidden', currentQuestion === 0);
    
    const nextBtn = document.getElementById('nextBtn');
    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = 'Finish Quiz';
    } else {
        nextBtn.textContent = 'Next';
    }
}

function showResults() {
    const maxScore = Math.max(...scores);
    const topLangIndex = scores.indexOf(maxScore);
    const topLang = loveLanguages[topLangIndex];
    
    // Save to localStorage
    localStorage.setItem('heartspeakResults', JSON.stringify({
        scores: scores,
        topLanguage: topLang,
        date: new Date().toLocaleDateString()
    }));
    
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultText').textContent = topLang;
    
    createResultsChart();
    createConfetti();
}

function createResultsChart() {
    const chartDiv = document.getElementById('resultsChart');
    let html = `
        <h4 class="text-center mb-4">Your Love Language Scores</h4>
        <div class="row g-4">
    `;
    
    loveLanguages.forEach((lang, i) => {
        const percentage = (scores[i] / 10) * 100;
        const barColor = i === scores.indexOf(Math.max(...scores)) ? '#ff4757' : '#ff6b9d';
        html += `
            <div class="col-md-6 col-lg-2-4">
                <div class="text-center">
                    <div class="fw-bold fs-6 mb-2">${lang}</div>
                    <div class="progress mx-auto" style="width: 80%; height: 20px;">
                        <div class="progress-bar bg-danger" style="width: ${percentage}%"></div>
                    </div>
                    <div class="mt-2 fw-bold fs-6">${scores[i]}/10</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    chartDiv.innerHTML = html;
}

function createConfetti() {
    // more elaborate effects

    const colors = ['#ff6b9d', '#ff8e8e', '#ff4757', '#ff6b9d', '#fecfef'];
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    for (let i = 0; i < 100; i++) {
        const confetto = document.createElement('div');
        confetto.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: -10px;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: fall ${2 + Math.random() * 3}s linear forwards;
            animation-delay: ${Math.random() * 2}s;
        `;
        confetti.appendChild(confetto);
    }
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 6000);
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function restartQuiz() {
    currentQuestion = 0;
    scores = [0, 0, 0, 0, 0];
    document.querySelectorAll('.question-card').forEach(q => {
        q.classList.add('hidden');
        q.querySelectorAll('input').forEach(input => input.checked = false);
    });
    document.getElementById('results').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('prevBtn').classList.add('hidden');
}

// Load previous results if available
function loadPreviousResults() {
    const saved = localStorage.getItem('heartspeakResults');
    if (saved) {
        const results = JSON.parse(saved);
        console.log(`Previous result: ${results.topLanguage} on ${results.date}`);
    }
}

init();
loadPreviousResults();
