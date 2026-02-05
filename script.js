const loveLanguages = [
    'Words of Affirmation', 
    'Acts of Service', 
    'Receiving Gifts', 
    'Quality Time', 
    'Physical Touch'
];

const descriptions = {
    0: "💬 You thrive on verbal encouragement! Compliments, 'I love you's, and words of affirmation fill your love tank.",
    1: "🛠️ Actions speak louder than words! Help with chores, errands, and thoughtful service shows you care.",
    2: "🎁 You feel most loved through thoughtful gifts that show someone was thinking of you.",
    3: "⏰ Quality time with undivided attention and meaningful conversation is your love language.",
    4: "🤗 Physical touch - hugs, cuddles, and holding hands make you feel truly connected."
};

const icons = {
    0: '<i class="fas fa-comment-dots text-primary me-2"></i>',
    1: '<i class="fas fa-hands-helping text-success me-2"></i>',
    2: '<i class="fas fa-gift text-warning me-2"></i>',
    3: '<i class="fas fa-clock text-info me-2"></i>',
    4: '<i class="fas fa-hands text-danger me-2"></i>'
};

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
        text: "What's your favorite way to celebrate special occasions?",
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
        text: "What's the best way to apologize to you?",
        options: [
            { text: "Sincere words explaining they're sorry", lang: 0 },
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
        text: "What's your ideal morning routine with a partner?",
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
let partnerMode = false;

function init() {
    generateQuestions();
    document.getElementById('startBtn').addEventListener('click', startQuiz);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('prevBtn').addEventListener('click', prevQuestion);
    document.getElementById('restartBtn').addEventListener('click', restartQuiz);
    document.getElementById('shareBtn')?.addEventListener('click', shareResult);
    document.getElementById('partnerMode')?.addEventListener('change', function() {
        partnerMode = this.checked;
    });
    document.getElementById('darkModeToggle')?.addEventListener('click', toggleDarkMode);
    document.getElementById('historyBtn')?.addEventListener('click', showHistory);
    document.getElementById('backToHomeBtn')?.addEventListener('click', backToHome);
    document.getElementById('clearHistoryBtn')?.addEventListener('click', clearHistory);
    loadPreviousResults();
    loadDarkModePreference();
}

function generateQuestions() {
    const container = document.getElementById('quizContainer');
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = `question-card ${index === 0 ? '' : 'hidden'}`;
        div.id = `question-${index}`;
        div.innerHTML = `
            <div class="question-counter">Q${index + 1}/10</div>
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
        answers[currentQuestion] = langIndex;
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
    
    // Save to history
    saveToHistory({
        scores: scores,
        topLanguage: topLang,
        topLanguageIndex: topLangIndex,
        date: new Date().toISOString(),
        timestamp: Date.now()
    });
    
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('resultText').innerHTML = `${icons[topLangIndex]} ${topLang}`;
    
    createResultsChart();
    createDescription();
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
        html += `
            <div class="col-md-6 col-lg-2-4">
                <div class="text-center">
                    <div class="fw-bold fs-6 mb-2">${icons[i]} ${lang}</div>
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

function createDescription() {
    const maxScore = Math.max(...scores);
    const topLangIndex = scores.indexOf(maxScore);
    
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'alert alert-info mt-4 p-4 rounded-4';
    descriptionDiv.innerHTML = `
        <h5 class="mb-3"><i class="fas fa-heart text-danger me-2"></i>Your Love Profile:</h5>
        <p class="mb-0 fs-6">${descriptions[topLangIndex]}</p>
    `;
    document.querySelector('#results .col-lg-10').insertBefore(descriptionDiv, document.getElementById('resultsChart'));
}

function createConfetti() {
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

function shareResult() {
    const topLang = loveLanguages[scores.indexOf(Math.max(...scores))];
    const text = `My love language is ${topLang}! 💕 What's yours? Try HeartSpeak quiz!`;
    
    if (navigator.share) {
        navigator.share({ title: 'HeartSpeak Quiz', text });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        alert('Results copied to clipboard! 📋');
    } else {
        prompt('Copy this text to share:', text);
    }
}

// Add CSS for confetti animation
if (!document.querySelector('style[data-confetti]')) {
    const style = document.createElement('style');
    style.setAttribute('data-confetti', 'true');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function restartQuiz() {
    currentQuestion = 0;
    scores = [0, 0, 0, 0, 0];
    answers = [];
    document.querySelectorAll('.question-card').forEach(q => {
        q.classList.add('hidden');
        q.querySelectorAll('input').forEach(input => input.checked = false);
    });
    document.querySelector('.alert')?.remove();
    document.getElementById('results').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('prevBtn').classList.add('hidden');
}

function loadPreviousResults() {
    const history = getQuizHistory();
    if (history.length > 0) {
        const latest = history[history.length - 1];
        console.log(`Previous result: ${latest.topLanguage} on ${new Date(latest.date).toLocaleDateString()}`);
    }
}

function getQuizHistory() {
    const history = localStorage.getItem('lavaQuizHistory');
    return history ? JSON.parse(history) : [];
}

function saveToHistory(result) {
    const history = getQuizHistory();
    history.push(result);
    localStorage.setItem('lavaQuizHistory', JSON.stringify(history));
}

function showHistory() {
    const history = getQuizHistory();
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('history').classList.remove('hidden');
    
    const content = document.getElementById('historyContent');
    
    if (history.length === 0) {
        content.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <h3>No Quiz History Yet</h3>
                <p class="lead mt-3">Take the quiz to start tracking your love language journey!</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="row g-4">';
    
    history.reverse().forEach((result, index) => {
        const actualIndex = history.length - 1 - index;
        const date = new Date(result.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Check if there's a trend
        let trendHtml = '';
        if (actualIndex < history.length - 1) {
            const nextResult = history[actualIndex + 1];
            if (result.topLanguage === nextResult.topLanguage) {
                trendHtml = '<div class="trend-indicator trend-same"><i class="fas fa-equals"></i> Consistent</div>';
            } else {
                trendHtml = '<div class="trend-indicator trend-up"><i class="fas fa-arrow-up"></i> Changed</div>';
            }
        }
        
        html += `
            <div class="col-12">
                <div class="history-card">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <div class="d-flex align-items-center mb-2">
                                <span class="fs-4 me-2">${icons[result.topLanguageIndex]}</span>
                                <h4 class="mb-0">${result.topLanguage}</h4>
                            </div>
                            <p class="text-muted mb-2">
                                <i class="fas fa-calendar me-2"></i>${formattedDate}
                            </p>
                            <div class="d-flex flex-wrap gap-2">
                                ${result.scores.map((score, i) => 
                                    `<span class="history-badge" style="background: ${score === Math.max(...result.scores) ? 'rgba(255,107,157,0.3)' : 'rgba(108,117,125,0.15)'}">
                                        ${loveLanguages[i]}: ${score}/10
                                    </span>`
                                ).join('')}
                            </div>
                            ${trendHtml}
                        </div>
                        <div class="col-md-4 text-md-end mt-3 mt-md-0">
                            <div class="fs-1 fw-bold" style="color: #ff6b9d;">${Math.max(...result.scores)}/10</div>
                            <small class="text-muted">Top Score</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Add summary statistics
    const topLanguages = history.map(h => h.topLanguage);
    const languageCounts = {};
    topLanguages.forEach(lang => {
        languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });
    const mostCommon = Object.keys(languageCounts).reduce((a, b) => 
        languageCounts[a] > languageCounts[b] ? a : b
    );
    
    html = `
        <div class="history-card mb-4">
            <div class="row text-center">
                <div class="col-md-4">
                    <h3 class="text-danger fw-bold">${history.length}</h3>
                    <p class="mb-0">Total Quizzes</p>
                </div>
                <div class="col-md-4">
                    <h3 class="text-danger fw-bold">${mostCommon}</h3>
                    <p class="mb-0">Most Common</p>
                </div>
                <div class="col-md-4">
                    <h3 class="text-danger fw-bold">${new Set(topLanguages).size}</h3>
                    <p class="mb-0">Different Languages</p>
                </div>
            </div>
        </div>
    ` + html;
    
    content.innerHTML = html;
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all quiz history? This cannot be undone.')) {
        localStorage.removeItem('lavaQuizHistory');
        showHistory(); // Refresh the view
    }
}

function backToHome() {
    document.getElementById('history').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    const icon = document.querySelector('#darkModeToggle i');
    
    if (isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('darkMode', 'disabled');
    }
}

function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#darkModeToggle i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

init();
