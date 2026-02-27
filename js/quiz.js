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
    
    // 3. Edge case: Check if quiz has questions
    function init() {
        if (allQuestions.length === 0) {
            console.error('No questions found in quiz!');
            if (nextBtn) nextBtn.disabled = true;
            if (finishBtn) finishBtn.disabled = true;
            alert('Quiz questions could not be loaded. Please refresh the page.');
            return;
        }
        
        // Load saved progress if exists (recovery feature)
        loadSavedProgress();
        
        allQuestions.forEach((q, index) => {
            q.style.display = (index === 0) ? 'block' : 'none';
        });
        updateUI();
        
        // Auto-save on answer selection
        attachAutoSave();
    }
    
    // Auto-save feature for recovery
    function attachAutoSave() {
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', saveProgress);
        });
    }
    
    function saveProgress() {
        const answers = {};
        document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
            answers[input.name] = input.value;
        });
        localStorage.setItem('lava_quiz_progress', JSON.stringify({
            answers,
            currentStep,
            timestamp: new Date().toISOString()
        }));
    }
    
    function loadSavedProgress() {
        const saved = localStorage.getItem('lava_quiz_progress');
        if (!saved) return;
        
        try {
            const { answers, currentStep: savedStep, timestamp } = JSON.parse(saved);
            
            // Only restore if saved within last 24 hours
            const saveTime = new Date(timestamp);
            const hoursSince = (Date.now() - saveTime.getTime()) / (1000 * 60 * 60);
            
            if (hoursSince < 24 && Object.keys(answers).length > 0) {
                const resume = confirm('We found an incomplete quiz. Would you like to resume where you left off?');
                if (resume) {
                    // Restore answers
                    Object.entries(answers).forEach(([name, value]) => {
                        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
                        if (radio) radio.checked = true;
                    });
                    
                    // Restore step
                    currentStep = savedStep;
                } else {
                    localStorage.removeItem('lava_quiz_progress');
                }
            }
        } catch (error) {
            console.error('Error loading saved progress:', error);
            localStorage.removeItem('lava_quiz_progress');
        }
    }

    // 4. UI Update Logic with enhanced error handling
    function updateUI() {
        // Edge case: Ensure currentStep is within bounds
        if (currentStep < 1) currentStep = 1;
        if (currentStep > totalQuestions) currentStep = totalQuestions;
        
        const percent = (currentStep / totalQuestions) * 100;
        
        // Safe DOM updates with null checks
        if (progressText) {
            progressText.innerText = currentStep;
            progressText.setAttribute('aria-valuenow', currentStep);
        }
        
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
            progressFill.setAttribute('aria-valuenow', percent);
        }

        // Button Visibility with enhanced logic
        if (prevBtn) {
            prevBtn.disabled = (currentStep === 1);
            prevBtn.setAttribute('aria-disabled', currentStep === 1);
        }
        
        // Check if current question is answered for highlighting
        updateNextButtonState();
        
        if (currentStep === totalQuestions) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (finishBtn) finishBtn.style.display = 'inline-block';
        } else {
            if (nextBtn) nextBtn.style.display = 'inline-block';
            if (finishBtn) finishBtn.style.display = 'none';
        }
    }
    
    // Check if current question is answered
    function updateNextButtonState() {
        if (!nextBtn || currentStep > totalQuestions) return;
        
        const currentInputs = allQuestions[currentStep - 1]?.querySelectorAll('input[type="radio"]');
        if (!currentInputs) return;
        
        const isAnswered = Array.from(currentInputs).some(input => input.checked);
        // Visual feedback for unanswered questions
        if (isAnswered) {
            nextBtn.style.opacity = '1';
        } else {
            nextBtn.style.opacity = '0.7';
        }
    }

    // 5. Next Button Logic with enhanced validation
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            // Edge case: Validate current question exists
            if (!allQuestions[currentStep - 1]) {
                console.error('Current question not found');
                return;
            }
            
            const currentInputs = allQuestions[currentStep - 1].querySelectorAll('input[type="radio"]');
            
            // Edge case: Check if question has options
            if (currentInputs.length === 0) {
                console.error('No options found for current question');
                alert('This question is missing options. Please contact support.');
                return;
            }
            
            const isChecked = Array.from(currentInputs).some(input => input.checked);

            if (!isChecked) {
                // Provide helpful feedback
                alert("Please select an answer before continuing! 💖");
                
                // Scroll to top of question for better UX
                allQuestions[currentStep - 1].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                return;
            }

            if (currentStep < totalQuestions) {
                allQuestions[currentStep - 1].style.display = 'none';
                currentStep++;
                allQuestions[currentStep - 1].style.display = 'block';
                
                // Scroll to new question
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                updateUI();
                saveProgress();
            }
        });
    }

    // 6. Previous Button Logic with enhanced navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                allQuestions[currentStep - 1].style.display = 'none';
                currentStep--;
                
                // Edge case: Ensure target question exists
                if (allQuestions[currentStep - 1]) {
                    allQuestions[currentStep - 1].style.display = 'block';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    console.error('Target question not found');
                    currentStep++; // Revert
                }
                
                updateUI();
                saveProgress();
            }
        });
    }

    // 7. Finish Button Logic with comprehensive validation
    if (finishBtn) {
        finishBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Prevent double submission
            if (finishBtn.disabled) return;
            finishBtn.disabled = true;
            
            const answers = document.querySelectorAll('input[type="radio"]:checked');

            // Edge case: Validate all questions answered
            if (answers.length < totalQuestions) {
                const unansweredCount = totalQuestions - answers.length;
                alert(`Please answer all questions! You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}.`);
                finishBtn.disabled = false;
                
                // Find and navigate to first unanswered question
                for (let i = 0; i < totalQuestions; i++) {
                    const questionInputs = allQuestions[i].querySelectorAll('input[type="radio"]');
                    const isAnswered = Array.from(questionInputs).some(input => input.checked);
                    
                    if (!isAnswered) {
                        allQuestions.forEach(q => q.style.display = 'none');
                        allQuestions[i].style.display = 'block';
                        currentStep = i + 1;
                        updateUI();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        break;
                    }
                }
                return;
            }

            try {
                // Calculate scores
                const finalScores = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0 };
                answers.forEach(answer => { 
                    const value = answer.value;
                    if (finalScores.hasOwnProperty(value)) {
                        finalScores[value]++;
                    }
                });

                // Save results with metadata
                const resultData = {
                    scores: finalScores,
                    timestamp: new Date().toISOString(),
                    totalQuestions: totalQuestions
                };
                
                localStorage.setItem('lava_results', JSON.stringify(resultData));
                
                // Clear progress after completion
                localStorage.removeItem('lava_quiz_progress');
                
                // Save to history
                saveToHistory(finalScores);
                
                // Redirect with slight delay for better UX
                setTimeout(() => {
                    window.location.href = 'results.html';
                }, 300);
                
            } catch (error) {
                console.error('Error saving results:', error);
                alert('An error occurred while saving your results. Please try again.');
                finishBtn.disabled = false;
            }
        });
    }
    
    // 8. Save quiz result to history
    function saveToHistory(scores) {
        try {
            let history = JSON.parse(localStorage.getItem('lava_quiz_history') || '[]');
            
            // Determine primary love language
            const labels = [
                "Words of Affirmation", 
                "Acts of Service", 
                "Receiving Gifts", 
                "Quality Time", 
                "Physical Touch"
            ];
            
            let topScore = -1;
            let topIndex = 0;
            Object.entries(scores).forEach(([index, score]) => {
                if (score > topScore) {
                    topScore = score;
                    topIndex = parseInt(index);
                }
            });
            
            history.push({
                date: new Date().toISOString(),
                primaryLanguage: labels[topIndex],
                scores: scores,
                timestamp: Date.now()
            });
            
            // Keep only last 20 results
            if (history.length > 20) {
                history = history.slice(-20);
            }
            
            localStorage.setItem('lava_quiz_history', JSON.stringify(history));
        } catch (error) {
            console.error('Error saving to history:', error);
        }
    }

    // 9. Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && nextBtn && !nextBtn.disabled && nextBtn.style.display !== 'none') {
            nextBtn.click();
        } else if (e.key === 'ArrowLeft' && prevBtn && !prevBtn.disabled) {
            prevBtn.click();
        }
    });
    
    // 10. Warning before leaving incomplete quiz
    window.addEventListener('beforeunload', (e) => {
        const answers = document.querySelectorAll('input[type="radio"]:checked');
        if (answers.length > 0 && answers.length < totalQuestions) {
            e.preventDefault();
            e.returnValue = 'You have an incomplete quiz. Your progress will be saved for 24 hours.';
            return e.returnValue;
        }
    });

    init();
});