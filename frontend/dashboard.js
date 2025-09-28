// IntelliMail/frontend/dashboard.js

const modal = document.getElementById('details-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalSubject = document.getElementById('modal-subject');
const modalCategory = document.getElementById('modal-category');
const modalSuggestion = document.getElementById('modal-suggestion');
const modalContent = document.getElementById('modal-content');
const sortBySelect = document.getElementById('sort-by');
const tableBody = document.getElementById('recent-emails-table-body');

function renderTable(emails) {
    tableBody.innerHTML = ''; 

    if (emails.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum e-mail processado nesta sessão.</td></tr>';
        return; 
    }

    emails.forEach(email => {
        const row = document.createElement('tr');
        const categoryClass = email.category === 'Produtivo' ? 'tag-produtivo' : 'tag-improdutivo';
        row.innerHTML = `
            <td>${email.subject || 'N/A'}</td>
            <td><span class="category-tag ${categoryClass}">${email.category}</span></td>
            <td>${email.created_at}</td>
            <td>${email.status}</td>
            <td>
                <button class="action-btn view-btn" data-email-id="${email.id}" title="Ver Detalhes">👁️</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


function updateStats(emails) {
    const totalEmails = emails.length;
    const produtivosCount = emails.filter(e => e.category === 'Produtivo').length;
    const improdutivosCount = emails.filter(e => e.category === 'Improdutivo').length;
    const taxaProdutividade = totalEmails > 0 ? Math.round((produtivosCount / totalEmails) * 100) : 0;

    document.getElementById('total-emails').textContent = totalEmails;
    document.getElementById('produtivos-count').textContent = produtivosCount;
    document.getElementById('improdutivos-count').textContent = improdutivosCount;
    document.getElementById('taxa-produtividade').textContent = `${taxaProdutividade}%`;
}


function sortAndRender() {
    const emails = JSON.parse(sessionStorage.getItem('processedEmails')) || [];
    const sortBy = sortBySelect.value;

    const sortedEmails = [...emails].sort((a, b) => {
        switch (sortBy) {
            case 'category_asc':
                return a.category.localeCompare(b.category); 
            case 'category_desc':
                return b.category.localeCompare(a.category); 
            default:
                return 0; 
        }
    });

    renderTable(sortedEmails);
}


function showEmailDetails(emailId) {
    const emails = JSON.parse(sessionStorage.getItem('processedEmails')) || [];
    const email = emails.find(e => String(e.id) === String(emailId));

    if (email) {
        modalSubject.textContent = email.subject;
        modalCategory.textContent = email.category;
        modalSuggestion.textContent = email.suggestion;
        modalContent.textContent = email.content;
        modal.classList.add('visible');
    } else {
        alert('Não foi possível encontrar os detalhes do e-mail.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const initialEmails = JSON.parse(sessionStorage.getItem('processedEmails')) || [];
    updateStats(initialEmails);
    sortAndRender(); 
    tableBody.addEventListener('click', (event) => {
        const target = event.target.closest('.view-btn');
        if (target) {
            const emailId = target.getAttribute('data-email-id');
            showEmailDetails(emailId);
        }
    });

    sortBySelect.addEventListener('change', sortAndRender);

    modalCloseBtn.addEventListener('click', () => modal.classList.remove('visible'));
    modal.addEventListener('click', (event) => {
        if (event.target === modal) modal.classList.remove('visible');
    });

    document.getElementById('clear-history-btn').addEventListener('click', () => {
        if (confirm('Você tem certeza que deseja apagar o histórico desta sessão?')) {
            sessionStorage.removeItem('processedEmails');
            const emptyEmails = [];
            updateStats(emptyEmails);
            renderTable(emptyEmails);
            alert('Histórico da sessão limpo com sucesso.');
        }
    });
});