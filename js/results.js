// Main results display function with enhanced error handling
const displayResults = () => {
    const rawData = localStorage.getItem('lava_results');
    
    // 1. Edge case: Check if data exists
    if (!rawData) {
        handleNoResults();
        return;
    }

    try {
        const resultData = JSON.parse(rawData);
        
        // Handle both old format (just scores) and new format (with metadata)
        const scores = resultData.scores || resultData;
        const timestamp = resultData.timestamp || new Date().toISOString();
        
        // Validate scores object
        if (!isValidScores(scores)) {
            throw new Error('Invalid scores format');
        }
        
        displayScoreResults(scores, timestamp);
        displayHistory();
        
    } catch (error) {
        console.error('Error displaying results:', error);
        handleCorruptedData();
    }
};

// Handle missing results
function handleNoResults() {
    const resultHero = document.querySelector('.result-hero');
    if (resultHero) {
        resultHero.innerHTML = `
            <h1 class="result-title">No Results Found</h1>
            <p>It looks like you haven't completed the quiz yet!</p>
            <a href="quiz.html" class="btn btn--primary" style="text-decoration:none; display:inline-block; margin-top:20px;">Take the Quiz</a>
        `;
    }
}

// Handle corrupted data
function handleCorruptedData() {
    const resultHero = document.querySelector('.result-hero');
    if (resultHero) {
        resultHero.innerHTML = `
            <h1 class="result-title">Oops! Something went wrong</h1>
            <p>Your results data appears to be corrupted.</p>
            <button class="btn btn--primary" onclick="clearAndRetake()" style="margin-top:20px;">Clear and Retake Quiz</button>
        `;
    }
}

// Validate scores object
function isValidScores(scores) {
    if (typeof scores !== 'object' || scores === null) return false;
    
    // Check if it has the expected structure
    const expectedKeys = ["0", "1", "2", "3", "4"];
    return expectedKeys.every(key => 
        scores.hasOwnProperty(key) && 
        typeof scores[key] === 'number' &&
        scores[key] >= 0 &&
        scores[key] <= 10
    );
}

// Display score results
function displayScoreResults(scores, timestamp) {
    // Labels must match the HTML order
    const labels = [
        "Words of Affirmation", 
        "Acts of Service", 
        "Receiving Gifts", 
        "Quality Time", 
        "Physical Touch"
    ];

    const descriptions = {
        "Words of Affirmation": "You feel most loved through encouraging and kind words! Verbal expressions of affection are your love language.",
        "Acts of Service": "For you, actions speak louder than words! You appreciate when people help with tasks and responsibilities.",
        "Receiving Gifts": "You value the thought and effort behind a meaningful gift! Physical symbols of love matter to you.",
        "Quality Time": "You feel most connected when spending undivided time together! Focused attention makes you feel valued.",
        "Physical Touch": "Hugs, holding hands, and closeness are your primary love language! Physical affection is essential for you."
    };

    const tips = {
        "Words of Affirmation": "💡 Tip: Be specific with compliments and express gratitude regularly.",
        "Acts of Service": "💡 Tip: Notice the little things others do for you and reciprocate thoughtfully.",
        "Receiving Gifts": "💡 Tip: Keep a wish list and share it with loved ones for special occasions.",
        "Quality Time": "💡 Tip: Schedule regular one-on-one time and minimize distractions.",
        "Physical Touch": "💡 Tip: Communicate your boundaries and preferences for physical affection."
    };

    let topScore = -1;
    let topLanguage = "";
    let topIndex = 0;

    // 2. Update the Score Grid with enhanced visualization
    const scoreCards = document.querySelectorAll('.score-card');
    
    scoreCards.forEach((card, index) => {
        const score = scores[index] || 0;
        const percentage = (score / 10) * 100;
        
        // Update the bar width with animation
        const fill = card.querySelector('.score-fill');
        if (fill) {
            setTimeout(() => { 
                fill.style.width = `${percentage}%`;
                
                // Add color gradient based on score
                if (percentage >= 70) {
                    fill.style.background = 'linear-gradient(90deg, #ff4d4d, #ff1a1a)';
                } else if (percentage >= 40) {
                    fill.style.background = 'linear-gradient(90deg, #ff9999, #ff6666)';
                } else {
                    fill.style.background = '#ffcccc';
                }
            }, 100 * (index + 1)); // Stagger animation
        }
        
        // Update the "X/10" text
        const textSpans = card.querySelectorAll('span');
        if (textSpans.length > 1) {
            textSpans[1].innerText = `${score}/10`;
        }

        // Find the winner (handle ties by selecting first)
        if (score > topScore) {
            topScore = score;
            topLanguage = labels[index];
            topIndex = index;
        }
    });

    // 3. Update the Hero Winner Section with enhanced info
    const heroTitle = document.getElementById('winner-name');
    const heroPara = document.getElementById('winner-desc');
    
    if (heroTitle) {
        heroTitle.innerText = topLanguage;
    }
    
    if (heroPara) {
        heroPara.innerHTML = `
            ${descriptions[topLanguage]}
            <br><br>
            <strong>${tips[topLanguage]}</strong>
            <br><br>
            <small>Completed on ${formatDate(timestamp)}</small>
        `;
    }
    
    // Add share functionality
    addShareButton(topLanguage, topScore);
}

// Format date helper
function formatDate(isoString) {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Recently';
    }
}

// Add share button
function addShareButton(language, score) {
    const resultsActions = document.querySelector('.results-actions');
    if (!resultsActions) return;
    
    // Check if share button already exists
    if (document.getElementById('share-btn')) return;
    
    const shareBtn = document.createElement('button');
    shareBtn.id = 'share-btn';
    shareBtn.className = 'btn btn--secondary';
    shareBtn.textContent = '📤 Share Results';
    shareBtn.style.marginLeft = '10px';
    
    shareBtn.addEventListener('click', () => {
        const shareText = `I just discovered my love language is ${language} (${score}/10)! 💖 Take the Lava Love Language Quiz to find yours!`;
        const shareUrl = window.location.href;
        
        // Try native share API first
        if (navigator.share) {
            navigator.share({
                title: 'My Love Language Results',
                text: shareText,
                url: shareUrl
            }).catch(err => console.log('Share cancelled', err));
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
                .then(() => {
                    alert('Results copied to clipboard! 📋');
                })
                .catch(() => {
                    alert(`Share this: ${shareText}`);
                });
        }
    });
    
    resultsActions.appendChild(shareBtn);
}

// Display history section
function displayHistory() {
    try {
        const history = JSON.parse(localStorage.getItem('lava_quiz_history') || '[]');
        
        if (history.length === 0) return;
        
        // Create or update history section
        let historySection = document.getElementById('history-section');
        
        if (!historySection) {
            historySection = document.createElement('section');
            historySection.id = 'history-section';
            historySection.className = 'history-section';
            historySection.style.cssText = 'margin-top: 40px; padding: 20px; background: #fff5f5; border-radius: 10px;';
            
            const resultsSection = document.querySelector('.results-section');
            if (resultsSection) {
                resultsSection.appendChild(historySection);
            }
        }
        
        historySection.innerHTML = `
            <h2 style="margin-bottom: 20px;">📊 Your Quiz History</h2>
            <div class="history-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                ${generateHistoryStats(history)}
            </div>
            <div class="history-list">
                <h3 style="margin-bottom: 15px;">Recent Results:</h3>
                ${generateHistoryList(history)}
            </div>
            <button class="btn btn--secondary" onclick="clearHistory()" style="margin-top: 15px;">Clear History</button>
        `;
        
    } catch (error) {
        console.error('Error displaying history:', error);
    }
}

// Generate history statistics
function generateHistoryStats(history) {
    const languageCounts = {};
    history.forEach(entry => {
        languageCounts[entry.primaryLanguage] = (languageCounts[entry.primaryLanguage] || 0) + 1;
    });
    
    const mostCommon = Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0];
    
    return `
        <div style="padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-size: 24px; font-weight: bold; color: #ff4d4d;">${history.length}</div>
            <div style="color: #666;">Total Quizzes</div>
        </div>
        <div style="padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-size: 16px; font-weight: bold; color: #ff4d4d;">${mostCommon ? mostCommon[0] : 'N/A'}</div>
            <div style="color: #666;">Most Common Result</div>
        </div>
    `;
}

// Generate history list
function generateHistoryList(history) {
    return history.slice().reverse().slice(0, 5).map((entry, index) => `
        <div style="padding: 12px; margin-bottom: 10px; background: white; border-radius: 6px; border-left: 4px solid #ff4d4d;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${entry.primaryLanguage}</strong>
                    <div style="font-size: 12px; color: #666; margin-top: 4px;">
                        ${formatDate(entry.date)}
                    </div>
                </div>
                <div style="font-size: 14px; color: #ff4d4d; font-weight: bold;">
                    ${Object.values(entry.scores)[Object.keys(entry.scores).find(k => entry.scores[k] === Math.max(...Object.values(entry.scores)))]/10 * 100}%
                </div>
            </div>
        </div>
    `).join('');
}

// Clear history function
window.clearHistory = function() {
    if (confirm('Are you sure you want to clear your quiz history? This cannot be undone.')) {
        localStorage.removeItem('lava_quiz_history');
        const historySection = document.getElementById('history-section');
        if (historySection) {
            historySection.remove();
        }
        alert('History cleared successfully!');
    }
};

// Clear and retake function
window.clearAndRetake = function() {
    localStorage.removeItem('lava_results');
    localStorage.removeItem('lava_quiz_progress');
    window.location.href = 'quiz.html';
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', displayResults);