function createLogoutUI() {
    if (!localStorage.getItem('jwt-token')) {
        return;
    }
    const logoutContainer = document.createElement('div');
    logoutContainer.className = 'container';

    const logoutBoxHTML = `
        <div class="logout-box">
            <button id="logout-btn" class="btn">⛔</button>
        </div>
    `;

    logoutContainer.innerHTML = logoutBoxHTML;
    document.body.appendChild(logoutContainer);

    const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('jwt-token');
        document.querySelectorAll('.container').forEach(container => container.remove());
        location.reload();
    });
}

createLogoutUI();
