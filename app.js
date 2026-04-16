let appData = null;
let currentClass = 'class10';

async function initApp() {
    try {
        const response = await fetch('data/content.json');
        appData = await response.json();
        renderHome();
        addWhatsAppButton();
    } catch (e) { console.error("Load failed"); }
}

function renderHome() {
    const container = document.getElementById('view-container');
    // Logic for the 'NEW' badge (shows for 3 days after update)
    const isNew = (new Date() - new Date(appData.lastUpdate)) / (1000 * 60 * 60 * 24) < 3;
    
    container.innerHTML = `
        <div class="welcome-text">
            <h2>Namaste, Student!</h2>
            <p class="quote">"Gateway to Excellence"</p>
        </div>
        <div class="nav-grid">
            <div class="nav-card" onclick="loadSection('notes')">
                ${isNew ? '<span class="new-tag">NEW</span>' : ''}
                <span class="icon">📚</span><h3>Notes</h3>
            </div>
            <div class="nav-card" onclick="loadSection('videos')"><span class="icon">🎥</span><h3>Videos</h3></div>
            <div class="nav-card" onclick="loadSection('updates')"><span class="icon">🔔</span><h3>Updates</h3></div>
            <div class="nav-card" onclick="loadSection('tests')"><span class="icon">✍️</span><h3>Tests</h3></div>
        </div>
    `;
}

function addWhatsAppButton() {
    const btn = document.createElement('a');
    btn.href = "https://wa.me/918638361876?text=Hello%20Pallab%20Sir,%20I%20have%20a%20doubt%20in%20PRAGYANOM...";
    btn.className = "whatsapp-float";
    btn.innerHTML = "💬";
    document.body.appendChild(btn);
}

function loadSection(section) {
    if (section === 'notes') renderNotesMenu();
    else if (section === 'updates') renderNotifications();
    else if (section === 'tests') renderTestsMenu();
    else if (section === 'videos') renderVideoMenu();
}

function renderVideoMenu() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="section-header"><button onclick="renderHome()" class="back-btn">← Home</button><h2>Video Lectures</h2></div>
        <div class="class-toggle">
            <button class="${currentClass==='class9'?'active':''}" onclick="currentClass='class9';renderVideoMenu()">Class 9</button>
            <button class="${currentClass==='class10'?'active':''}" onclick="currentClass='class10';renderVideoMenu()">Class 10</button>
        </div>
        <div class="pdf-list">
            ${appData.videos[currentClass].General_Science.map(v => `
                <div class="nav-card pdf-card" style="flex-direction:column">
                    <iframe width="100%" height="200" src="${v.file}" frameborder="0" allowfullscreen style="border-radius:10px"></iframe>
                    <h3 style="margin-top:10px">${v.title}</h3>
                </div>
            `).join('') || '<p class="coming-soon">Videos coming soon!</p>'}
        </div>
    `;
}

// ... Keep your existing renderNotesMenu, renderNotifications, and renderTestsMenu functions below ...
