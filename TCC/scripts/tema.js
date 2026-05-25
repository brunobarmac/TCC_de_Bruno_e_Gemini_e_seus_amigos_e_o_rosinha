// =========================================
// APLICA O TEMA SALVO
// =========================================
function applyTheme(theme) {

    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } 
    
    else {
        document.body.classList.remove('dark-theme');
    }
}

// =========================================
// CARREGA TEMA AO ABRIR A PÁGINA
// =========================================
document.addEventListener('DOMContentLoaded', () => {

    const savedTheme = localStorage.getItem('theme') || 'light';

    applyTheme(savedTheme);

    // Marca o radio correto automaticamente
    const selectedInput = document.querySelector(
        `input[name="theme"][value="${savedTheme}"]`
    );

    if (selectedInput) {
        selectedInput.checked = true;
    }

    // =========================================
    // BOTÃO SALVAR
    // =========================================
    const saveButton = document.getElementById('saveThemeBtn');

    if (saveButton) {

        saveButton.addEventListener('click', () => {

            const selectedTheme =
                document.querySelector('input[name="theme"]:checked').value;

            applyTheme(selectedTheme);

            localStorage.setItem('theme', selectedTheme);

            alert('Tema salvo com sucesso!');
        });
    }
});