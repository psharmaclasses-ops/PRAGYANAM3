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
let currentClassKey = 'class10'; // Default class
let currentSubjectFilter = 'all'; // Default subject filter

// Subject Name Mapping for Assamese Display
const subjectDisplayNames = {
    'English': 'ইংৰাজী',
    'General_Science': 'বিজ্ঞান',
    'General_Mathematics': 'গণিত',
    'Social_Science': 'সমাজ বিজ্ঞান',
    'Assamese': 'অসমীয়া'
};

// Fetch content.json
async function loadContentData() {
    try {
        const response = await fetch('./data/content.json');
        appData = await response.json();
        console.log('App Data loaded successfully:', appData);
        updateNotificationBadge();
    } catch (error) {
        console.error('Error loading content.json:', error);
    }
}

// Update Notification Badge Count
function updateNotificationBadge() {
    if (appData && appData.notifications) {
        const badge = document.querySelector('.notif-wrapper .badge');
        if (badge) {
            badge.innerText = convertToAssameseNumber(appData.notifications.length);
        }
    }
}

function convertToAssameseNumber(num) {
    const assameseDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(d => assameseDigits[d] || d).join('');
}

// --- VIEW: NOTES ---
function renderNotesView(targetSubject = 'all') {
    currentSubjectFilter = targetSubject;
    const mainContainer = document.querySelector('.main-container');
    if (!mainContainer || !appData) return;

    const classNotes = (appData.notes && appData.notes[currentClassKey]) || {};
    
    // Build Subject Filters Bar
    let subjectFiltersHtml = `
        <div class="filter-scroll">
            <button class="filter-pill ${currentSubjectFilter === 'all' ? 'active' : ''}" onclick="filterBySubject('all')">সকলো</button>
            <button class="filter-pill ${currentSubjectFilter === 'General_Science' ? 'active' : ''}" onclick="filterBySubject('General_Science')">বিজ্ঞান</button>
            <button class="filter-pill ${currentSubjectFilter === 'General_Mathematics' ? 'active' : ''}" onclick="filterBySubject('General_Mathematics')">গণিত</button>
            <button class="filter-pill ${currentSubjectFilter === 'Assamese' ? 'active' : ''}" onclick="filterBySubject('Assamese')">অসমীয়া</button>
            <button class="filter-pill ${currentSubjectFilter === 'Social_Science' ? 'active' : ''}" onclick="filterBySubject('Social_Science')">সমাজ বিজ্ঞান</button>
            <button class="filter-pill ${currentSubjectFilter === 'English' ? 'active' : ''}" onclick="filterBySubject('English')">ইংৰাজী</button>
        </div>
    `;

    // Collect Notes based on selected subject
    let allItems = [];
    Object.keys(classNotes).forEach(subKey => {
        if (currentSubjectFilter === 'all' || currentSubjectFilter === subKey) {
            const list = classNotes[subKey] || [];
            list.forEach(item => {
                allItems.push({
                    ...item,
                    subjectKey: subKey,
                    subjectAssamese: subjectDisplayNames[subKey] || subKey
                });
            });
        }
    });

    let listHtml = '';
    if (allItems.length > 0) {
        allItems.forEach(item => {
            // Check if drive link needs direct preview
            const fileUrl = item.file.includes('drive.google.com/uc?id=') 
                ? item.file.replace('uc?id=', 'file/d/') + '/view' 
                : item.file;

            listHtml += `
                <div class="note-card-item">
                    <div class="note-icon-col">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <div class="note-details">
                        <span class="note-subject-tag">${item.subjectAssamese}</span>
                        <h4 class="note-item-title">${item.title}</h4>
                        <p class="note-item-desc">বিনামূলীয়া পিডিএফ ফাইল</p>
                    </div>
                    <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" class="download-pdf-btn">
                        <i class="fa-solid fa-eye"></i> চাওক
                    </a>
                </div>
            `;
        });
    } else {
        listHtml = `
            <div class="empty-state">
                <i class="fa-solid fa-folder-open"></i>
                <p>এই শ্ৰেণী বা বিষয়ত কোনো নোটছ উপলব্ধ নহয়।</p>
            </div>
        `;
    }

    mainContainer.innerHTML = `
        <div class="view-header">
            <button class="back-home-btn" onclick="renderHomeView()">
                <i class="fa-solid fa-arrow-left"></i> হোম
            </button>
            <h2 class="view-title"><i class="fa-solid fa-book-bookmark"></i> পাঠ্য নোটছ</h2>
        </div>

        <div class="class-selector">
            <button class="class-btn ${currentClassKey === 'class9' ? 'active' : ''}" onclick="switchClass('class9', 'notes')">নৱম শ্ৰেণী (Class 9)</button>
            <button class="class-btn ${currentClassKey === 'class10' ? 'active' : ''}" onclick="switchClass('class10', 'notes')">দশম শ্ৰেণী (Class 10)</button>
        </div>

        ${subjectFiltersHtml}

        <div class="notes-list-container">
            ${listHtml}
        </div>
    `;

    updateBottomNavState('notes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- VIEW: VIDEOS ---
function renderVideosView() {
    const mainContainer = document.querySelector('.main-container');
    if (!mainContainer || !appData) return;

    const classVideos = (appData.videos && appData.videos[currentClassKey]) || {};
    let allVideos = [];

    Object.keys(classVideos).forEach(subKey => {
        const list = classVideos[subKey] || [];
        list.forEach(item => {
            allVideos.push({
                ...item,
                subjectAssamese: subjectDisplayNames[subKey] || subKey
            });
        });
    });

    let listHtml = '';
    if (allVideos.length > 0) {
        allVideos.forEach(item => {
            listHtml += `
                <div class="note-card-item video-item">
                    <div class="note-icon-col video-icon">
                        <i class="fa-solid fa-circle-play"></i>
                    </div>
                    <div class="note-details">
                        <span class="note-subject-tag video-tag">${item.subjectAssamese}</span>
                        <h4 class="note-item-title">${item.title}</h4>
                        <p class="note-item-desc">শিক্ষামূলক ভিডিঅ' ক্লাছ</p>
                    </div>
                    <a href="${item.file}" target="_blank" rel="noopener noreferrer" class="download-pdf-btn video-btn">
                        <i class="fa-solid fa-play"></i> চাওক
                    </a>
                </div>
            `;
        });
    } else {
        listHtml = `
            <div class="empty-state">
                <i class="fa-solid fa-film"></i>
                <p>এই শ্ৰেণীত কোনো ভিডিঅ' উপলব্ধ নহয়।</p>
            </div>
        `;
    }

    mainContainer.innerHTML = `
        <div class="view-header">
            <button class="back-home-btn" onclick="renderHomeView()">
                <i class="fa-solid fa-arrow-left"></i> হোম
            </button>
            <h2 class="view-title"><i class="fa-solid fa-film"></i> ভিডিঅ' ক্লাছ</h2>
        </div>

        <div class="class-selector">
            <button class="class-btn ${currentClassKey === 'class9' ? 'active' : ''}" onclick="switchClass('class9', 'videos')">নৱম শ্ৰেণী (Class 9)</button>
            <button class="class-btn ${currentClassKey === 'class10' ? 'active' : ''}" onclick="switchClass('class10', 'videos')">দশম শ্ৰেণী (Class 10)</button>
        </div>

        <div class="notes-list-container">
            ${listHtml}
        </div>
    `;

    updateBottomNavState('videos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- VIEW: TESTS ---
function renderTestsView() {
    const mainContainer = document.querySelector('.main-container');
    if (!mainContainer || !appData) return;

    const classTests = (appData.tests && appData.tests[currentClassKey]) || {};
    let allTests = [];

    Object.keys(classTests).forEach(subKey => {
        const list = classTests[subKey] || [];
        list.forEach(item => {
            allTests.push({
                ...item,
                subjectAssamese: subjectDisplayNames[subKey] || subKey
            });
        });
    });

    let listHtml = '';
    if (allTests.length > 0) {
        allTests.forEach(item => {
            listHtml += `
                <div class="note-card-item test-item">
                    <div class="note-icon-col test-icon">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </div>
                    <div class="note-details">
                        <span class="note-subject-tag test-tag">${item.subjectAssamese}</span>
                        <h4 class="note-item-title">${item.title}</h4>
                        <p class="note-item-desc">অনলাইন টেষ্ট / প্ৰশ্নোত্তৰ</p>
                    </div>
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="download-pdf-btn test-btn">
                        <i class="fa-solid fa-play"></i> আৰম্ভ কৰক
                    </a>
                </div>
            `;
        });
    } else {
        listHtml = `
            <div class="empty-state">
                <i class="fa-solid fa-file-pen"></i>
                <p>এই শ্ৰেণীৰ বাবে কোনো অনলাইন টেষ্ট উপলব্ধ নহয়।</p>
            </div>
        `;
    }

    mainContainer.innerHTML = `
        <div class="view-header">
            <button class="back-home-btn" onclick="renderHomeView()">
                <i class="fa-solid fa-arrow-left"></i> হোম
            </button>
            <h2 class="view-title"><i class="fa-solid fa-file-signature"></i> পৰীক্ষাৰ প্ৰস্তুতি</h2>
        </div>

        <div class="class-selector">
            <button class="class-btn ${currentClassKey === 'class9' ? 'active' : ''}" onclick="switchClass('class9', 'tests')">নৱম শ্ৰেণী (Class 9)</button>
            <button class="class-btn ${currentClassKey === 'class10' ? 'active' : ''}" onclick="switchClass('class10', 'tests')">দশম শ্ৰেণী (Class 10)</button>
        </div>

        <div class="notes-list-container">
            ${listHtml}
        </div>
    `;

    updateBottomNavState('tests');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- VIEW: NOTIFICATIONS / UPDATES ---
function renderNotificationsView() {
    const mainContainer = document.querySelector('.main-container');
    if (!mainContainer || !appData) return;

    const notifs = appData.notifications || [];
    let notifHtml = '';

    if (notifs.length > 0) {
        notifs.forEach(n => {
            notifHtml += `
                <div class="note-card-item notif-item">
                    <div class="note-icon-col notif-icon">
                        <i class="fa-solid fa-bullhorn"></i>
                    </div>
                    <div class="note-details">
                        <span class="note-subject-tag notif-tag">${n.timestamp || ''}</span>
                        <h4 class="note-item-title">${n.title}</h4>
                        <p class="note-item-desc">${n.message}</p>
                    </div>
                </div>
            `;
        });
    } else {
        notifHtml = `<div class="empty-state"><p>কোনো নতুন ঘোষণা নাই।</p></div>`;
    }

    mainContainer.innerHTML = `
        <div class="view-header">
            <button class="back-home-btn" onclick="renderHomeView()">
                <i class="fa-solid fa-arrow-left"></i> হোম
            </button>
            <h2 class="view-title"><i class="fa-solid fa-bell"></i> ঘোষণা আৰু আপডেট</h2>
        </div>

        <div class="notes-list-container">
            ${notifHtml}
        </div>
    `;

    updateBottomNavState('updates');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global filter / Switch functions
window.switchClass = function(clsKey, currentView) {
    currentClassKey = clsKey;
    if (currentView === 'notes') renderNotesView(currentSubjectFilter);
    else if (currentView === 'videos') renderVideosView();
    else if (currentView === 'tests') renderTestsView();
};

window.filterBySubject = function(subKey) {
    renderNotesView(subKey);
};

window.renderHomeView = function() {
    window.location.reload();
};

function updateBottomNavState(activeTab) {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${activeTab}`) {
            item.classList.add('active');
        }
    });
}

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    await loadContentData();

    // 1. Four Main Cards
    const btnNotes = document.getElementById('btn-notes');
    const btnVideos = document.getElementById('btn-videos');
    const btnUpdates = document.getElementById('btn-updates');
    const btnTests = document.getElementById('btn-tests');

    if (btnNotes) btnNotes.addEventListener('click', () => renderNotesView('all'));
    if (btnVideos) btnVideos.addEventListener('click', () => renderVideosView());
    if (btnUpdates) btnUpdates.addEventListener('click', () => renderNotificationsView());
    if (btnTests) btnTests.addEventListener('click', () => renderTestsView());

    // 2. Notifications Bell Top Icon
    const notifTopBtn = document.querySelector('.notif-wrapper');
    if (notifTopBtn) notifTopBtn.addEventListener('click', () => renderNotificationsView());

    // 3. Subject Grid Click Listeners
    const subCards = document.querySelectorAll('.subjects-row .subject-card');
    subCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const subjectMap = ['General_Science', 'General_Mathematics', 'Assamese', 'English'];
            const targetSubject = subjectMap[index] || 'all';
            renderNotesView(targetSubject);
        });
    });

    // 4. Bottom Nav Bar Items
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(nav => {
        nav.addEventListener('click', (e) => {
            e.preventDefault();
            const target = nav.getAttribute('href').replace('#', '');
            if (target === 'home') renderHomeView();
            else if (target === 'notes') renderNotesView('all');
            else if (target === 'videos') renderVideosView();
            else if (target === 'updates') renderNotificationsView();
            else if (target === 'tests') renderTestsView();
        });
    });
});
                            
