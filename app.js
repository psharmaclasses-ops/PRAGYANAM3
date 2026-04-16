let appData = null;
let currentClass = 'class10';

async function initApp() {
    try {
        const response = await fetch('data/content.json');
        if (!response.ok) throw new Error('Network response was not ok');
        appData = await response.json();
        renderHome();
        addWhatsAppButton();
    } catch (e) {
        document.getElementById('view-container').innerHTML = `
            <div style="padding:20px; text-align:center; color:white;">
                <h3>⚠️ Connection Error</h3>
                <p>Please check your internet or clear browser cache.</p>
            </div>`;
    }
}

function renderHome() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="welcome-text">
            <h2>Namaste, Student!</h2>
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

function addWhatsAppButton() {
    const btn = document.createElement('a');
    btn.href = "https://wa.me/918638361876?text=Hello%20Pallab%20Sir...";
    btn.className = "whatsapp-float";
    btn.target = "_blank";
    btn.innerHTML = "💬";
    document.body.appendChild(btn);
}

function loadSection(section) {
    if (section === 'notes') renderNotesMenu();
    else if (section === 'updates') renderNotifications();
    else if (section === 'tests') renderTestsMenu();
    else if (section === 'videos') renderVideoMenu();
}

function renderNotesMenu() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="section-header"><button onclick="renderHome()" class="back-btn">← Home</button><h2>Study Notes</h2></div>
        <div class="class-toggle">
            <button class="${currentClass==='class9'?'active':''}" onclick="setClass('class9')">Class 9</button>
            <button class="${currentClass==='class10'?'active':''}" onclick="setClass('class10')">Class 10</button>
        </div>
        <div class="nav-grid">
            ${['English', 'General_Science', 'General_Mathematics', 'Assamese', 'Social_Science'].map(sub => `
                <div class="nav-card small" onclick="viewSubject('${sub}')"><h3>${sub.replace('_', ' ')}</h3></div>
            `).join('')}
        </div>
    `;
}

function setClass(cls) { currentClass = cls; renderNotesMenu(); }

function viewSubject(subject) {
    const container = document.getElementById('view-container');
    const items = appData.notes[currentClass][subject] || [];
    container.innerHTML = `
        <div class="section-header"><button onclick="renderNotesMenu()" class="back-btn">← Back</button><h2 style="margin-top:10px">${subject.replace('_', ' ')}</h2></div>
        <div class="pdf-list">
            ${items.length > 0 ? items.map(item => `
                <div class="nav-card pdf-card">
                    <h3 style="font-size:0.9rem">${item.title}</h3>
                    <a href="${item.file}" target="_blank" class="view-btn">View PDF</a>
                </div>
            `).join('') : '<p class="coming-soon">Content coming soon!</p>'}
        </div>
    `;
}

function renderNotifications() {
    const container = document.getElementById('view-container');
    const list = appData.notifications ? [...appData.notifications].reverse() : [];
    container.innerHTML = `
        <div class="section-header"><button onclick="renderHome()" class="back-btn">← Home</button><h2>Notifications</h2></div>
        <div class="pdf-list">
            ${list.map(n => `
                <div class="nav-card pdf-card" style="flex-direction:column !important; align-items:flex-start !important;">
                    <div style="display:flex; justify-content:space-between; width:100%;">
                        <span class="badge ${n.type}">${n.type.toUpperCase()}</span>
                        <small style="color:rgba(255,255,255,0.4)">${n.timestamp}</small>
                    </div>
                    <h3 style="margin-top:10px">${n.title}</h3>
                    <p style="font-size:0.85rem; color:rgba(255,255,255,0.7); margin-top:5px;">${n.message}</p>
                </div>
            `).join('')}
        </div>
    `;
}

function renderTestsMenu() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="section-header"><button onclick="renderHome()" class="back-btn">← Home</button><h2>Practice Tests</h2></div>
        <div class="class-toggle">
            <button class="${currentClass==='class9'?'active':''}" onclick="setTestClass('class9')">Class 9</button>
            <button class="${currentClass==='class10'?'active':''}" onclick="setTestClass('class10')">Class 10</button>
        </div>
        <div class="nav-grid">
            ${['English', 'General_Science', 'General_Mathematics'].map(sub => `
                <div class="nav-card small" onclick="viewTestSubject('${sub}')"><h3>${sub.replace('_', ' ')}</h3></div>
            `).join('')}
        </div>
    `;
}

function setTestClass(cls) { currentClass = cls; renderTestsMenu(); }

function viewTestSubject(subject) {
    const container = document.getElementById('view-container');
    const items = appData.tests[currentClass][subject] || [];
    container.innerHTML = `
        <div class="section-header"><button onclick="renderTestsMenu()" class="back-btn">← Back</button><h2 style="margin-top:10px">${subject.replace('_', ' ')} Tests</h2></div>
        <div class="pdf-list">
            ${items.length > 0 ? items.map(item => `
                <div class="nav-card pdf-card">
                    <h3 style="font-size:0.9rem">${item.title}</h3>
                    <a href="${item.link}" target="_blank" class="view-btn">Start Test</a>
                </div>
            `).join('') : '<p class="coming-soon">No tests available yet!</p>'}
        </div>
    `;
}

function renderVideoMenu() {
    const container = document.getElementById('view-container');
    const videos = appData.videos[currentClass]?.General_Science || [];
    container.innerHTML = `
        <div class="section-header"><button onclick="renderHome()" class="back-btn">← Home</button><h2>Video Lectures</h2></div>
        <div class="class-toggle">
            <button class="${currentClass==='class9'?'active':''}" onclick="setVideoClass('class9')">Class 9</button>
            <button class="${currentClass==='class10'?'active':''}" onclick="setVideoClass('class10')">Class 10</button>
        </div>
        <div class="pdf-list">
            ${videos.length > 0 ? videos.map(v => `
                <div class="nav-card pdf-card" style="flex-direction:column !important; align-items:flex-start !important;">
                    <iframe width="100%" height="200" src="${v.file}" frameborder="0" allowfullscreen style="border-radius:10px; margin-bottom:10px;"></iframe>
                    <h3>${v.title}</h3>
                </div>
            `).join('') : '<p class="coming-soon">Videos coming soon!</p>'}
        </div>
    `;
}

function setVideoClass(cls) { currentClass = cls; renderVideoMenu(); }

window.onload = initApp;
