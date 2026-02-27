document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Elements
    const progressText = document.getElementById('current-progress');
    const progressFill = document.querySelector('.progress-fill');
    const allQuestions = document.querySelectorAll('.question-group');
    const finishBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    // 2. Data state
    let currentStep = 1;
    const totalQuestions = allQuestions.length;
    
    function init() {
        if (allQuestions.length === 0) return;
        
        allQuestions.forEach((q, index) => {
            q.style.display = (index === 0) ? 'block' : 'none';
        });
        updateUI();
    }

    // 3. UI Update Logic
    function updateUI() {
        const percent = (currentStep / totalQuestions) * 100;
        
        if (progressText) progressText.innerText = currentStep;
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }

        // Button Visibility
        if (prevBtn) prevBtn.disabled = (currentStep === 1);
        
        if (currentStep === totalQuestions) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (finishBtn) finishBtn.style.display = 'inline-block';
        } else {
            if (nextBtn) nextBtn.style.display = 'inline-block';
            if (finishBtn) finishBtn.style.display = 'none';
        }
    }

    // 4. Next Button Logic
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentInputs = allQuestions[currentStep - 1].querySelectorAll('input[type="radio"]');
            const isChecked = Array.from(currentInputs).some(input => input.checked);

            if (!isChecked) {
                alert("Please pick an answer! 💖");
                return;
            }

            if (currentStep < totalQuestions) {
                allQuestions[currentStep - 1].style.display = 'none';
                currentStep++;
                allQuestions[currentStep - 1].style.display = 'block';
                updateUI();
            }
        });
    }

    // 5. Previous Button Logic
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                allQuestions[currentStep - 1].style.display = 'none';
                currentStep--;
                allQuestions[currentStep - 1].style.display = 'block';
                updateUI();
            }
        });
    }

    // 6. Finish Button Logic
    if (finishBtn) {
        finishBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const answers = document.querySelectorAll('input[type="radio"]:checked');

            if (answers.length < totalQuestions) {
                alert("Please answer all questions first!");
                return;
            }

            const finalScores = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0 };
            answers.forEach(answer => { finalScores[answer.value]++; });

            localStorage.setItem('lava_results', JSON.stringify(finalScores));
            window.location.href = 'results.html';
        });
    }

    init();
});