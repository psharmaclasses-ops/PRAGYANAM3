let appData = null;
let currentClass = 'class9';

async function initApp() {
    try {
        const response = await fetch('data/content.json');
        appData = await response.json();
        renderHome();
    } catch (e) {
        document.getElementById('greeting').innerText = "Offline Mode";
    }
}

function renderHome() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="welcome-text">
            <h2 id="greeting">Namaste, Student!</h2>
            <p class="quote">"Gateway to Excellence"</p>
        </div>
        <div class="nav-grid">
            <div class="nav-card" onclick="loadSection('notes')"><span class="icon">📚</span><h3>Notes</h3></div>
            <div class="nav-card" onclick="loadSection('videos')"><span class="icon">🎥</span><h3>Videos</h3></div>
            <div class="nav-card" onclick="loadSection('updates')"><span class="icon">🔔</span><h3>Updates</h3></div>
            <div class="nav-card" onclick="loadSection('tests')"><span class="icon">✍️</span><h3>Tests</h3></div>
        </div>
    `;
}

function loadSection(section) {
    if (section === 'notes') renderNotesMenu();
    else renderPlaceholder(section);
}

function renderNotesMenu() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="section-header">
            <button onclick="renderHome()" class="back-btn">← Home</button>
            <h2>Study Notes</h2>
        </div>
        <div class="class-toggle">
            <button class="${currentClass==='class9'?'active':''}" onclick="setClass('class9')">Class 9</button>
            <button class="${currentClass==='class10'?'active':''}" onclick="setClass('class10')">Class 10</button>
        </div>
        <div class="nav-grid">
            ${['English', 'General_Science', 'General_Mathematics', 'Assamese', 'Social_Science'].map(sub => `
                <div class="nav-card small" onclick="viewSubject('${sub}')">
                    <h3>${sub.replace('_', ' ')}</h3>
                </div>
            `).join('')}
        </div>
    `;
}

function setClass(cls) { currentClass = cls; renderNotesMenu(); }

function viewSubject(subject) {
    const container = document.getElementById('view-container');
    const items = appData.notes[currentClass][subject] || [];
    container.innerHTML = `
        <div class="section-header">
            <button onclick="renderNotesMenu()" class="back-btn">← Back</button>
            <h2 style="margin-top:10px">${subject.replace('_', ' ')}</h2>
        </div>
        <div class="pdf-list">
            ${items.length > 0 ? items.map(item => `
                <div class="nav-card pdf-card">
                    <h3>${item.title}</h3>
                    <span class="badge ${item.status}">${item.status.toUpperCase()}</span>
                    <a href="${item.file}" target="_blank" class="view-btn">View PDF</a>
                </div>
            `).join('') : '<p class="coming-soon">Content coming soon!</p>'}
        </div>
    `;
}

function renderPlaceholder(name) {
    const container = document.getElementById('view-container');
    container.innerHTML = `<div class="section-header"><button onclick="renderHome()" class="back-btn">← Back</button></div>
    <div class="coming-soon-box"><div class="loader-icon">⚙️</div><p>${name.toUpperCase()} Section Coming Soon</p></div>`;
}

window.onload = initApp;
