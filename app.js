// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered!'))
            .catch(err => console.log('SW Registration Failed!', err));
    });
}

// Global App State
let appData = null;
let currentClass = 'Class 10'; // Default class filter

// Fetch content.json
async function loadContentData() {
    try {
        const response = await fetch('./data/content.json');
        appData = await response.json();
        console.log('App Data loaded:', appData);
    } catch (error) {
        console.error('Error loading content.json:', error);
    }
}

// Render Notes Page
function renderNotesView() {
    const mainContainer = document.querySelector('.main-container');
    if (!mainContainer) return;

    // Filter notes if structure supports classes/notes
    let notes = [];
    if (appData) {
        if (Array.isArray(appData.notes)) {
            notes = appData.notes;
        } else if (Array.isArray(appData)) {
            notes = appData;
        }
    }

    let notesHtml = `
        <div class="view-header">
            <button class="back-home-btn" onclick="renderHomeView()">
                <i class="fa-solid fa-arrow-left"></i> উভতি যাওক
            </button>
            <h2 class="view-title"><i class="fa-solid fa-book-bookmark"></i> পাঠ্য নোটছ</h2>
        </div>

        <!-- Class Filter Buttons -->
        <div class="class-selector">
            <button class="class-btn ${currentClass === 'Class 9' ? 'active' : ''}" onclick="filterNotes('Class 9')">Class 9 (নৱম শ্ৰেণী)</button>
            <button class="class-btn ${currentClass === 'Class 10' ? 'active' : ''}" onclick="filterNotes('Class 10')">Class 10 (দশম শ্ৰেণী)</button>
        </div>

        <div class="notes-list-container">
    `;

    // Filtered by selected class
    const filteredNotes = notes.filter(n => !n.class || n.class.toLowerCase() === currentClass.toLowerCase());

    if (filteredNotes.length > 0) {
        filteredNotes.forEach(item => {
            notesHtml += `
                <div class="note-card-item">
                    <div class="note-icon-col">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <div class="note-details">
                        <span class="note-subject-tag">${item.subject || 'সাধাৰণ'}</span>
                        <h4 class="note-item-title">${item.title || item.name || 'নোটছ'}</h4>
                        <p class="note-item-desc">${item.description || item.chapter || 'সম্পূৰ্ণ অধ্যায়ৰ প্ৰশ্নোত্তৰ'}</p>
                    </div>
                    <a href="${item.link || item.url || '#'}" target="_blank" class="download-pdf-btn">
                        <i class="fa-solid fa-eye"></i> চাওক
                    </a>
                </div>
            `;
        });
    } else {
        notesHtml += `
            <div class="empty-state">
                <i class="fa-solid fa-folder-open"></i>
                <p>এই শ্ৰেণীৰ বাবে কোনো নোটছ উপলব্ধ নহয়।</p>
            </div>
        `;
    }

    notesHtml += `</div>`;
    mainContainer.innerHTML = notesHtml;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filter Function
window.filterNotes = function(cls) {
    currentClass = cls;
    renderNotesView();
};

// Render Home View
window.renderHomeView = function() {
    window.location.reload(); // Quick restore to home state
};

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    await loadContentData();

    // 1. Notes Card & Bottom Nav Notes
    const btnNotes = document.getElementById('btn-notes');
    const bottomNavNotes = document.querySelector('.bottom-nav a[href="#notes"]');

    if (btnNotes) {
        btnNotes.addEventListener('click', (e) => {
            e.preventDefault();
            renderNotesView();
        });
    }

    if (bottomNavNotes) {
        bottomNavNotes.addEventListener('click', (e) => {
            e.preventDefault();
            renderNotesView();
        });
    }

    // 2. Home Bottom Nav
    const bottomNavHome = document.querySelector('.bottom-nav a[href="#home"]');
    if (bottomNavHome) {
        bottomNavHome.addEventListener('click', (e) => {
            e.preventDefault();
            renderHomeView();
        });
    }

    // 3. Subject Click Listeners
    document.querySelectorAll('.subject-card').forEach(card => {
        card.addEventListener('click', () => {
            renderNotesView();
        });
    });
});
