// Authentication Form Validation and Handling
// This provides client-side validation without actual backend authentication

document.addEventListener('DOMContentLoaded', () => {
    // Initialize forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) initializeLoginForm();
    if (signupForm) initializeSignupForm();
    
    // Initialize password toggles
    initializePasswordToggles();
});

// ===== LOGIN FORM =====
function initializeLoginForm() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    // Real-time validation
    emailInput?.addEventListener('blur', () => {
        validateEmail(emailInput, emailError);
    });
    
    passwordInput?.addEventListener('blur', () => {
        validatePassword(passwordInput, passwordError, 6);
    });
    
    // Form submission
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isEmailValid = validateEmail(emailInput, emailError);
        const isPasswordValid = validatePassword(passwordInput, passwordError, 6);
        
        if (!isEmailValid || !isPasswordValid) {
            showNotification('Please fix the errors before continuing', 'error');
            return;
        }
        
        // Simulate login process
        handleLogin(emailInput.value, passwordInput.value);
    });
}

// Handle login (simulated)
function handleLogin(email, password) {
    // Show loading state
    const submitBtn = document.querySelector('#loginForm .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    
    // Simulate API call delay
    setTimeout(() => {
        // Check if user exists in mock database
        const users = JSON.parse(localStorage.getItem('lava_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store session
            localStorage.setItem('lava_current_user', JSON.stringify({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                loginTime: new Date().toISOString()
            }));
            
            showNotification('Login successful! Welcome back! 💖', 'success');
            
            // Redirect to quiz or home
            setTimeout(() => {
                window.location.href = '../pages/quiz.html';
            }, 1000);
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            showNotification('Invalid email or password. Please try again.', 'error');
        }
    }, 1000);
}

// ===== SIGNUP FORM =====
function initializeSignupForm() {
    const form = document.getElementById('signupForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    
    // Real-time validation
    emailInput?.addEventListener('blur', () => {
        const errorDiv = document.getElementById('signupEmailError');
        validateEmail(emailInput, errorDiv);
    });
    
    passwordInput?.addEventListener('blur', () => {
        const errorDiv = document.getElementById('signupPasswordError');
        validatePassword(passwordInput, errorDiv, 6);
    });
    
    confirmPasswordInput?.addEventListener('blur', () => {
        const errorDiv = document.getElementById('confirmError');
        validatePasswordMatch(passwordInput, confirmPasswordInput, errorDiv);
    });
    
    // Form submission
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isFirstNameValid = validateRequired(firstNameInput, 'First name is required');
        const isLastNameValid = validateRequired(lastNameInput, 'Last name is required');
        const isEmailValid = validateEmail(emailInput, document.getElementById('signupEmailError'));
        const isPasswordValid = validatePassword(passwordInput, document.getElementById('signupPasswordError'), 6);
        const isConfirmValid = validatePasswordMatch(passwordInput, confirmPasswordInput, document.getElementById('confirmError'));
        const isTermsAccepted = termsCheckbox?.checked;
        
        if (!isTermsAccepted) {
            showNotification('Please accept the Terms & Conditions', 'error');
            return;
        }
        
        if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
            showNotification('Please fix all errors before continuing', 'error');
            return;
        }
        
        // Handle signup
        handleSignup({
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim().toLowerCase(),
            password: passwordInput.value
        });
    });
}

// Handle signup (simulated)
function handleSignup(userData) {
    const submitBtn = document.querySelector('#signupForm .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
    
    setTimeout(() => {
        try {
            // Check if user already exists
            let users = JSON.parse(localStorage.getItem('lava_users') || '[]');
            
            if (users.some(u => u.email === userData.email)) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                showNotification('An account with this email already exists', 'error');
                return;
            }
            
            // Add new user
            users.push({
                ...userData,
                createdAt: new Date().toISOString()
            });
            
            localStorage.setItem('lava_users', JSON.stringify(users));
            
            // Auto login
            localStorage.setItem('lava_current_user', JSON.stringify({
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                loginTime: new Date().toISOString()
            }));
            
            showNotification('Account created successfully! Welcome to Lava! 💖', 'success');
            
            // Redirect to quiz
            setTimeout(() => {
                window.location.href = 'quiz.html';
            }, 1500);
            
        } catch (error) {
            console.error('Signup error:', error);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            showNotification('An error occurred. Please try again.', 'error');
        }
    }, 1000);
}

// ===== VALIDATION HELPERS =====

function validateEmail(input, errorDiv) {
    if (!input) return false;
    
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError(input, errorDiv, 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showFieldError(input, errorDiv, 'Please enter a valid email address');
        return false;
    }
    
    hideFieldError(input, errorDiv);
    return true;
}

function validatePassword(input, errorDiv, minLength = 6) {
    if (!input) return false;
    
    const password = input.value;
    
    if (!password) {
        showFieldError(input, errorDiv, 'Password is required');
        return false;
    }
    
    if (password.length < minLength) {
        showFieldError(input, errorDiv, `Password must be at least ${minLength} characters`);
        return false;
    }
    
    hideFieldError(input, errorDiv);
    return true;
}

function validatePasswordMatch(passwordInput, confirmInput, errorDiv) {
    if (!passwordInput || !confirmInput) return false;
    
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    
    if (!confirm) {
        showFieldError(confirmInput, errorDiv, 'Please confirm your password');
        return false;
    }
    
    if (password !== confirm) {
        showFieldError(confirmInput, errorDiv, 'Passwords do not match');
        return false;
    }
    
    hideFieldError(confirmInput, errorDiv);
    return true;
}

function validateRequired(input, message) {
    if (!input) return false;
    
    const value = input.value.trim();
    const errorDiv = input.parentElement?.querySelector('.error-msg');
    
    if (!value) {
        showFieldError(input, errorDiv, message);
        return false;
    }
    
    hideFieldError(input, errorDiv);
    return true;
}

function showFieldError(input, errorDiv, message) {
    if (input) {
        input.style.borderColor = '#ff4d4d';
        input.classList.add('error');
    }
    
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function hideFieldError(input, errorDiv) {
    if (input) {
        input.style.borderColor = '';
        input.classList.remove('error');
    }
    
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// ===== PASSWORD TOGGLE =====
function initializePasswordToggles() {
    const toggles = document.querySelectorAll('.password-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            
            if (!input || input.type !== 'password' && input.type !== 'text') return;
            
            if (input.type === 'password') {
                input.type = 'text';
                toggle.textContent = '🙈';
            } else {
                input.type = 'password';
                toggle.textContent = '👁️';
            }
        });
        
        // Make toggle clickable with keyboard
        toggle.setAttribute('tabindex', '0');
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('aria-label', 'Toggle password visibility');
        
        toggle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.auth-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.textContent = message;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = '#4CAF50';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = '#ff4d4d';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#2196F3';
        notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animation styles
if (!document.getElementById('auth-animations')) {
    const style = document.createElement('style');
    style.id = 'auth-animations';
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            to {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
        }
        
        .input-field.error {
            border-color: #ff4d4d !important;
        }
        
        .error-msg {
            display: none;
            color: #ff4d4d;
            font-size: 12px;
            margin-top: 5px;
        }
        
        .password-toggle {
            cursor: pointer;
            user-select: none;
        }
        
        .password-toggle:hover {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
}

// ===== CHECK IF USER IS LOGGED IN =====
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('lava_current_user'));
    } catch {
        return null;
    }
}

function logout() {
    localStorage.removeItem('lava_current_user');
    window.location.href = '../pages/login.html';
}

// Export for use in other scripts
window.LavaAuth = {
    getCurrentUser,
    logout,
    showNotification
};
