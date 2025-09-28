// IntelliMail/frontend/processador.js

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://intellimail-i2jx.onrender.com'; 

    const form = document.getElementById('email-form');
    const emailTextInput = document.getElementById('email-text');
    const emailFileInput = document.getElementById('email-file');
    const submitButton = document.getElementById('submit-btn');
    const errorContainer = document.getElementById('error-container');
    const errorMessageP = document.getElementById('error-message');
    const successModal = document.getElementById('success-modal');
    const successModalCloseBtn = document.getElementById('success-modal-close-btn');
    const fileNameDisplay = document.querySelector('.file-name-display');
    const loadingOverlay = document.getElementById('loading-overlay');

    // --- MUDANÇA PRINCIPAL AQUI ---
    // Removemos o listener de 'click' da dropZone.
    // O listener de 'change' é o único necessário.
    if (emailFileInput) {
        emailFileInput.addEventListener('change', () => {
            if (emailFileInput.files && emailFileInput.files.length > 0) {
                fileNameDisplay.textContent = emailFileInput.files[0].name;
                emailTextInput.value = '';
            } else {
                fileNameDisplay.textContent = '';
            }
        });
    }

    function clearFormFields() {
        emailTextInput.value = '';
        emailFileInput.value = '';
        if (fileNameDisplay) {
            fileNameDisplay.textContent = '';
        }
    }

    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const emailText = emailTextInput.value;
        const emailFile = emailFileInput.files[0];

        if (!emailText && !emailFile) {
            alert('Por favor, insira um texto ou selecione um arquivo.');
            return;
        }

        loadingOverlay.classList.remove('hidden');
        submitButton.disabled = true;
        errorContainer.classList.add('hidden');

        const responseMode = document.querySelector('input[name="response-mode"]:checked').value;
        const settings = JSON.parse(localStorage.getItem('intelliMailSettings')) || {};

        const formData = new FormData();
        if (emailFile) {
            formData.append('file', emailFile);
        } else {
            formData.append('email_text', emailText);
        }

        formData.append('mode', responseMode);
        formData.append('userName', settings.userName || '');
        formData.append('userLastname', settings.userLastname || '');
        formData.append('companyName', settings.companyName || '');
        formData.append('custom_prompt', settings.customPrompt || '');

        try {
            const response = await fetch(`${API_BASE_URL}/api/process`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Ocorreu um erro desconhecido.');
            }
            
            let currentHistory = JSON.parse(sessionStorage.getItem('processedEmails')) || [];
            
            data.processed_emails.forEach(email => {
                email.id = Date.now() + Math.random();
                currentHistory.unshift(email);
            });

            sessionStorage.setItem('processedEmails', JSON.stringify(currentHistory));
            
            successModal.classList.add('visible');

        } catch (error) {
            errorMessageP.textContent = error.message;
            errorContainer.classList.remove('hidden');
        } finally {
            loadingOverlay.classList.add('hidden');
            submitButton.disabled = false;
        }
    });

    function closeModal() {
        successModal.classList.remove('visible');
        clearFormFields();
    }

    successModalCloseBtn.addEventListener('click', closeModal);
    successModal.addEventListener('click', (event) => {
        if (event.target === successModal) {
            closeModal();
        }
    });

    emailTextInput.addEventListener('input', () => {
        if (emailTextInput.value && emailFileInput.files.length > 0) {
            emailFileInput.value = '';
            if (fileNameDisplay) fileNameDisplay.textContent = '';
        }
    });
});
