document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeStatus = document.getElementById('theme-status');
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.setAttribute('aria-pressed', 'true');
        themeStatus.textContent = 'Włączony';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.setAttribute('aria-pressed', 'false');
        themeStatus.textContent = 'Wyłączony';
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'light';
        let ariaPressed = 'false';
        let statusText = 'Wyłączony';

        if (currentTheme === 'light') {
            newTheme = 'dark';
            ariaPressed = 'true';
            statusText = 'Włączony';
        }

        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggleBtn.setAttribute('aria-pressed', ariaPressed);
        themeStatus.textContent = statusText;
        localStorage.setItem('theme', newTheme);
    });


    const form = document.getElementById('security-quiz');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const stepIndicator = document.getElementById('step-indicator');
    const resultContainer = document.getElementById('quiz-result');
    const resultText = document.getElementById('result-text');
    const restartBtn = document.getElementById('btn-restart');

    let currentStepIndex = 0;

    function updateStepVisibility() {
        steps.forEach((step, index) => {
            if (index === currentStepIndex) {
                step.classList.remove('hidden-step');
                step.classList.add('current-step');
                const stepTitle = step.querySelector('h3');
                if (stepTitle) {
                    stepTitle.setAttribute('tabindex', '-1');
                    stepTitle.focus();
                }
            } else {
                step.classList.add('hidden-step');
                step.classList.remove('current-step');
            }
        });

        stepIndicator.textContent = `Krok ${currentStepIndex + 1} z ${steps.length}`;
    }

    function validateCurrentStep() {
        const currentStep = steps[currentStepIndex];
        const select = currentStep.querySelector('select');
        
        if (select && select.hasAttribute('required') && select.value === "") {
            select.setCustomValidity('Proszę wybrać jedną z opcji przed przejściem dalej.');
            select.reportValidity();
            return false;
        }
        if (select) {
            select.setCustomValidity('');
        }
        return true;
    }

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateCurrentStep()) {
                if (currentStepIndex < steps.length - 1) {
                    currentStepIndex++;
                    updateStepVisibility();
                }
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStepIndex > 0) {
                currentStepIndex--;
                updateStepVisibility();
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateCurrentStep()) return;

        const formData = new FormData(form);
        const router = formData.get('routerUpdate');
        const mfa = formData.get('mfaStatus');
        const password = formData.get('passwordStrategy');

        let score = 0;
        if (router === 'auto') score += 1;
        if (mfa === 'all') score += 1;
        if (password === 'manager') score += 1;

        form.classList.add('hidden-step');
        stepIndicator.parentElement.classList.add('hidden-step');
        resultContainer.classList.remove('hidden-step');

        let feedback = '';
        if (score === 3) {
            feedback = 'Doskonale! Twoje nawyki w sieci są na bardzo wysokim poziomie. Dbasz o automatyczne aktualizacje, używasz menedżera haseł i chronisz konta za pomocą 2FA. Tak trzymać!';
        } else if (score === 2 || score === 1) {
            feedback = 'Dobry początek, ale Twoja sieć i dane posiadają luki. Zwróć szczególną uwagę na obszary, w których wybrano negatywne odpowiedzi. Warto wdrożyć menedżer haseł oraz upewnić się, że dwuetapowa weryfikacja chroni Twoją główną skrzynkę e-mail.';
        } else {
            feedback = 'Uwaga: Twoje cyfrowe bezpieczeństwo jest poważnie zagrożone. Brak aktualizacji routera, unikanie 2FA oraz powtarzanie haseł ułatwia zadanie cyberprzestępcom. Rekomendujemy natychmiastowe włączenie uwierzytelniania dwuskładnikowego w banku i poczcie oraz zmianę haseł na unikalne.';
        }

        resultText.textContent = feedback;
        
        const resultHeader = resultContainer.querySelector('h3');
        if (resultHeader) {
            resultHeader.setAttribute('tabindex', '-1');
            resultHeader.focus();
        }
    });

    restartBtn.addEventListener('click', () => {
        form.reset();
        currentStepIndex = 0;
        resultContainer.classList.add('hidden-step');
        form.classList.remove('hidden-step');
        stepIndicator.parentElement.classList.remove('hidden-step');
        updateStepVisibility();
    });


    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Wiadomość została wysłana pomyślnie. (To jest demonstracja formularza zgodnego z WCAG)');
            contactForm.reset();
        });
    }
});
