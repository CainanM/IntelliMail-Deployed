// IntelliMail/frontend/personalizacao.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('personalization-form');
    const userNameInput = document.getElementById('user-name');
    const userLastnameInput = document.getElementById('user-lastname');
    const companyNameInput = document.getElementById('company-name');
    const customPromptInput = document.getElementById('custom-prompt'); 
    const feedbackMessage = document.getElementById('feedback-message');

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('intelliMailSettings')) || {};
        userNameInput.value = settings.userName || '';
        userLastnameInput.value = settings.userLastname || '';
        companyNameInput.value = settings.companyName || '';
        customPromptInput.value = settings.customPrompt || ''; 
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const settings = {
            userName: userNameInput.value,
            userLastname: userLastnameInput.value,
            companyName: companyNameInput.value,
            customPrompt: customPromptInput.value, 
        };

        localStorage.setItem('intelliMailSettings', JSON.stringify(settings));

        feedbackMessage.classList.remove('hidden');
        setTimeout(() => {
            feedbackMessage.classList.add('hidden');
        }, 3000); 
    });

    loadSettings();
});