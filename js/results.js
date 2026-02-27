const displayResults = () => {
    const rawData = localStorage.getItem('lava_results');
    
    // 1. Check if data exists
    if (!rawData) {
        document.querySelector('.result-hero').innerHTML = `
            <h1 class="result-title">No Results Found</h1>
            <p>It looks like you haven't finished the quiz yet!</p>
            <a href="quiz.html" class="btn btn--primary" style="text-decoration:none; display:inline-block; margin-top:10px;">Go to Quiz</a>
        `;
        return;
    }

    const scores = JSON.parse(rawData);
    
    // Labels must match the HTML order
    const labels = [
        "Words of Affirmation", 
        "Acts of Service", 
        "Receiving Gifts", 
        "Quality Time", 
        "Physical Touch"
    ];

    const descriptions = {
        "Words of Affirmation": "You feel most loved through encouraging and kind words!",
        "Acts of Service": "For you, actions speak louder than words!",
        "Receiving Gifts": "You value the thought and effort behind a meaningful gift!",
        "Quality Time": "You feel most connected when spending undivided time together!",
        "Physical Touch": "Hugs, holding hands, and closeness are your primary love language!"
    };

    let topScore = -1;
    let topLanguage = "";

    // 2. Update the Score Grid
    const scoreCards = document.querySelectorAll('.score-card');
    
    scoreCards.forEach((card, index) => {
        const score = scores[index] || 0;
        const percentage = (score / 10) * 100;
        
        // Update the bar width
        const fill = card.querySelector('.score-fill');
        if (fill) {
            // Small timeout to allow the transition effect to trigger
            setTimeout(() => { fill.style.width = `${percentage}%`; }, 100);
        }
        
        // Update the "X/10" text
        const textSpan = card.querySelectorAll('span')[1];
        if (textSpan) textSpan.innerText = `${score}/10`;

        // Find the winner
        if (score > topScore) {
            topScore = score;
            topLanguage = labels[index];
        }
    });

    // 3. Update the Hero Winner Section
    const heroTitle = document.getElementById('winner-name');
    const heroPara = document.getElementById('winner-desc');
    
    if (heroTitle) heroTitle.innerText = topLanguage;
    if (heroPara) heroPara.innerText = descriptions[topLanguage];
};

document.addEventListener('DOMContentLoaded', displayResults);