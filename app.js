// Global State
let appData = null;
let currentClass = 'class9';

// 1. Initialize App & Fetch JSON
async function initApp() {
    const greeting = document.getElementById('greeting');
    try {
        const response = await fetch('data/content.json');
        appData = await response.json();
        
        // Success animation
        greeting.innerText = "Namaste, Student!";
        console.log("Pragyanom Engine: Ready");
    } catch (error) {
        greeting.innerText = "Connection Error";
        console.error("Failed to load content data.");
    }
}

// 2. Navigation Controller
function loadSection(section) {
    const container = document.getElementById('view-container');
    
    // Smooth fade out
    container.style.opacity = '0';
    
    setTimeout(() => {
        if (section === 'notes') renderNotesMenu();
        else renderPlaceholder(section);
        
        // Smooth fade in
        container.style.opacity = '1';
    }, 300);
}

// 3. Render Notes View (Class Selection)
function renderNotesMenu() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="section-header">
            <button onclick="location.reload()" class="back-btn">← Back</button>
            <h2>Study Notes</h2>
        </div>
        <div class="class-toggle">
            <button class="${currentClass==='class9'?'active':''}" onclick="setClass('class9')">Class 9</button>
            <button class="${currentClass==='class10'?'active':''}" onclick="setClass('class10')">Class 10</button>
        </div>
        <div id="subject-list" class="nav-grid">
            ${['English', 'General_Science', 'General_Mathematics', 'Assamese', 'Social_Science'].map(sub => `
                <div class="nav-card small" onclick="viewSubject('${sub}')">
                    <h3>${sub.replace('_', ' ')}</h3>
                </div>
            `).join('')}
        </div>
    `;
}

// 4. Update Class Preference
function setClass(cls) {
    currentClass = cls;
    renderNotesMenu();
}

// 5. Render Placeholders for Videos/Tests
function renderPlaceholder(name) {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="section-header">
            <button onclick="location.reload()" class="back-btn">← Back</button>
            <h2>${name.toUpperCase()}</h2>
        </div>
        <div class="coming-soon-box">
            <div class="loader-icon">⚙️</div>
            <p>This section is being prepared for you.</p>
            <span>Coming Soon</span>
        </div>
    `;
}

// Run on startup
window.onload = initApp;
      
