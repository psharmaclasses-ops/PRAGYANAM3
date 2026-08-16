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

function convertToAssameseNumber(num) {
    const assameseDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(d => assameseDigits[d] || d).join('');
}

// Load Content Data
async function loadContentData() {
    try {
        const response = await fetch('./data/content.json');
        appData = await response.json();
        console.log('App Data loaded successfully:', appData);
        updateNotificationBadge();
        renderHomeView();
    } catch (error) {
        console.error('Error loading content.json:', error);
        renderHomeView();
    }
}

// Update Top Notification Badge
function updateNotificationBadge() {
    if (appData && appData.notifications) {
        const badge = document.querySelector('.notif-wrapper .badge');
        if (badge) {
            badge.innerText = convertToAssameseNumber(appData.notifications.length);
        }
    }
}

// Update Bottom Nav Status
function updateBottomNavState(activeTab) {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === activeTab) {
            item.classList.add('active');
        }
    });
}

// --- 1. HOME VIEW ---
function renderHomeView() {
    const mainContainer = document.getElementById('main-view');
    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="logo-glow-ring">
                <img src="logopng.webp?v=1" alt="প্ৰজ্ঞানম ল'গ'" class="main-logo" onerror="this.src='https://via.placeholder.com/100/0f172a/00d2ff?text=PRAGYANAM'">
            </div>
            <h1 class="brand-title">প্ৰজ্ঞানম</h1>
            <p class="brand-tagline">জ্ঞানেই শক্তি • প্ৰগতিৰ মূল</p>
            
            <div class="quote-pill">
                <span class="quote-icon">“</span>
                <span class="quote-text">বিশ্বাস, কঠোৰ শ্ৰম আৰু অনুশীলন</span>
                <i class="fa-solid fa-graduation-cap grad-cap"></i>
            </div>
        </section>

        <!-- 4 Main Cards -->
        <section class="action-grid">
            <div class="action-card card-blue" id="btn-notes">
                <div class="card-icon-box"><i class="fa-solid fa-book-bookmark"></i></div>
                <div class="card-info">
                    <h3>নোটছ</h3>
                    <p>সকল বিষয়ৰ পূৰ্ণাংগ নোটছ</p>
                </div>
                <i class="fa-solid fa-chevron-right card-arrow"></i>
            </div>

            <div class="action-card card-purple" id="btn-videos">
                <div class="card-icon-box"><i class="fa-solid fa-film"></i></div>
                <div class="card-info">
                    <h3>ভিডিঅ’ছ</h3>
                    <p>বোধগম্য আৰু সহজ ভাষাত</p>
                </div>
                <i class="fa-solid fa-chevron-right card-arrow"></i>
            </div>

            <div class="action-card card-amber" id="btn-updates">
                <div class="card-icon-box"><i class="fa-solid fa-bell"></i></div>
                <div class="card-info">
                    <h3>আপডেটছ</h3>
                    <p>গুৰুত্বপূৰ্ণ খবৰ আৰু ঘোষণা</p>
                </div>
                <i class="fa-solid fa-chevron-right card-arrow"></i>
            </div>

            <div class="action-card card-cyan" id="btn-tests">
                <div class="card-icon-box"><i class="fa-solid fa-file-signature"></i></div>
                <div class="card-info">
                    <h3>পৰীক্ষাৰ প্ৰস্তুতি</h3>
                    <p>মক টেষ্ট, প্ৰশ্নোত্তৰ, টিপছ</p>
                </div>
                <i class="fa-solid fa-chevron-right card-arrow"></i>
            </div>
        </section>

        <!-- Subject Grid -->
        <section class="section-container">
            <div class="section-header">
                <div class="section-title-wrap">
                    <i class="fa-solid fa-graduation-cap section-icon"></i>
                    <h2>বিষয়ভিত্তিক অধ্যয়ন</h2>
                </div>
                <button class="see-all-btn" id="btn-see-all">সকলো চাওক <i class="fa-solid fa-arrow-right"></i></button>
            </div>

            <div class="subjects-row">
                <div class="subject-card sc-blue" data-sub="General_Science">
                    <i class="fa-solid fa-flask-vial sub-icon"></i>
                    <h4>বিজ্ঞান</h4>
                    <span class="sub-class">Class 9-10</span>
                </div>
                <div class="subject-card sc-purple" data-sub="General_Mathematics">
                    <i class="fa-solid fa-square-root-variable sub-icon"></i>
                    <h4>গণিত</h4>
                    <span class="sub-class">Class 9-10</span>
                </div>
                <div class="subject-card sc-cyan" data-sub="Assamese">
                    <i class="fa-solid fa-book-open sub-icon"></i>
                    <h4>অসমীয়া</h4>
                    <span class="sub-class">Class 9-10</span>
                </div>
                <div class="subject-card sc-amber" data-sub="English">
                    <i class="fa-solid fa-globe sub-icon"></i>
                    <h4>ইংৰাজী</h4>
                    <span class="sub-class">Class 9-10</span>
                </div>
            </div>
        </section>

        <!-- Promotion Banner -->
        <section class="promo-banner">
            <div class="promo-content">
                <h3>প্ৰজ্ঞানমৰ বিশেষ প্ৰশিক্ষণ</h3>
                <p>বৰ্ড পৰীক্ষাত উত্তীৰ্ণ হ'বলৈ সম্পূৰ্ণ সহায়</p>
            </div>
            <button class="promo-cta-btn" id="btn-promo">এতিয়া চাওক <i class="fa-solid fa-arrow-right"></i></button>
        </section>
    `;

    updateBottomNavState('home');
    attachHomeEventListeners();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Attach Event Listeners to Home Elements
function attachHomeEventListeners() {
    document.getElementById('btn-notes')?.addEventListener('click', () => renderNotesView('all'));
    document.getElementById('btn-videos')?.addEventListener('click', () => renderVideosView());
    document.getElementById('btn-updates')?.addEventListener('click', () => renderNotificationsView());
    document.getElementById('btn-tests')?.addEventListener('click', () => renderTestsView());
    document.getElementById('btn-see-all')?.addEventListener('click', () => renderNotesView('all'));

    document.querySelectorAll('.subjects-row .subject-card').forEach(card => {
        card.addEventListener('click', () => {
            const sub = card.getAttribute('data-sub');
            renderNotesView(sub);
        });
    });

    document.getElementById('btn-promo')?.addEventListener('click', () => {
        renderNotesView('all');
    });
}

// --- 2. NOTES VIEW ---
function renderNotesView(targetSubject = 'all') {
    currentSubjectFilter = targetSubject;
    const mainContainer = document.getElementById('main-view');
    if (!mainContainer || !appData) return;

    const classNotes = (appData.notes && appData.notes[currentClassKey]) || {};
    
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
            const fileUrl = item.file.includes('drive.google.com/uc?id=') 
                ? item.file.replace('uc?id=', 'file/d/') + '/view' 
                : item.file;

            listHtml += `
                <div class="note-card-item">
                    <div class="note-icon-col"><i class="fa-solid fa-file-pdf"></i></div>
                    <div class="note-details">
                        <span class="note-subject-tag">${item.subjectAssamese}</span>
                        <h4 class="note-item-title">${item.title}</h4>
                        <p class="note-item-desc">বিনামূলীয়া পিডিএফ নোটছ</p>
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

// --- 3. VIDEOS VIEW ---
function renderVideosView() {
    const mainContainer = document.getElementById('main-view');
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
                    <div class="note-icon-col video-icon"><i class="fa-solid fa-circle-play"></i></div>
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

// --- 4. TESTS VIEW ---
function renderTestsView() {
    const mainContainer = document.getElementById('main-view');
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
                    <div class="note-icon-col test-icon"><i class="fa-solid fa-pen-to-square"></i></div>
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

// --- 5. NOTIFICATIONS / UPDATES VIEW ---
function renderNotificationsView() {
    const mainContainer = document.getElementById('main-view');
    if (!mainContainer || !appData) return;

    const notifs = appData.notifications || [];
    let notifHtml = '';

    if (notifs.length > 0) {
        notifs.forEach(n => {
            notifHtml += `
                <div class="note-card-item notif-item">
                    <div class="note-icon-col notif-icon"><i class="fa-solid fa-bullhorn"></i></div>
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

// Global Switch / Filter Handlers
window.switchClass = function(clsKey, currentView) {
    currentClassKey = clsKey;
    if (currentView === 'notes') renderNotesView(currentSubjectFilter);
    else if (currentView === 'videos') renderVideosView();
    else if (currentView === 'tests') renderTestsView();
};

window.filterBySubject = function(subKey) {
    renderNotesView(subKey);
};

window.renderHomeView = renderHomeView;

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadContentData();

    // Top Bar Buttons
    document.getElementById('btn-top-notif')?.addEventListener('click', () => renderNotificationsView());
    document.getElementById('btn-top-profile')?.addEventListener('click', () => {
        alert('প্ৰজ্ঞানম শিক্ষাৰ্থী প্ৰফাইল শীঘ্ৰেই উপলব্ধ হ’ব।');
    });
    document.getElementById('btn-hamburger')?.addEventListener('click', () => {
        alert('প্ৰজ্ঞানম মেনু (Menu)');
    });

    // Bottom Navigation Items
    document.querySelectorAll('.bottom-nav .nav-item').forEach(nav => {
        nav.addEventListener('click', (e) => {
            e.preventDefault();
            const target = nav.getAttribute('data-tab');
            if (target === 'home') renderHomeView();
            else if (target === 'notes') renderNotesView('all');
            else if (target === 'videos') renderVideosView();
            else if (target === 'updates') renderNotificationsView();
            else if (target === 'tests') renderTestsView();
        });
    });
});
