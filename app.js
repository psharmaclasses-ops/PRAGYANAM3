// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered!', reg))
            .catch(err => console.log('SW Registration Failed!', err));
    });
}

// Global App State & Data
let appData = null;

// Load Content Data
async function loadContentData() {
    try {
        const response = await fetch('./data/content.json');
        appData = await response.json();
        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Error loading content.json:', error);
    }
}

// Navigation / View Handler
function navigateTo(section) {
    console.log(`Navigating to: ${section}`);
    
    // Update bottom nav active state
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${section}`) {
            item.classList.add('active');
        }
    });

    // Action based on clicked module
    switch(section) {
        case 'notes':
            alert('নোটছ শাখা সোনকালে উপলব্ধ হ’ব।');
            break;
        case 'videos':
            alert('ভিডিঅ’ শাখা সোনকালে উপলব্ধ হ’ব।');
            break;
        case 'updates':
            alert('আপডেটছ: কোনো নতুন জাননী নাই।');
            break;
        case 'tests':
            alert('পৰীক্ষাৰ প্ৰস্তুতি শাখা সোনকালে উপলব্ধ হ’ব।');
            break;
        case 'home':
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        default:
            console.log('Default View');
    }
}

// Subject Click Handler
function openSubject(subjectName) {
    alert(`${subjectName} শাখা খোলক (Class 9-10)`);
}

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadContentData();

    // 1. Four Main Cards Click Listeners
    const btnNotes = document.getElementById('btn-notes');
    const btnVideos = document.getElementById('btn-videos');
    const btnUpdates = document.getElementById('btn-updates');
    const btnTests = document.getElementById('btn-tests');

    if (btnNotes) btnNotes.addEventListener('click', () => navigateTo('notes'));
    if (btnVideos) btnVideos.addEventListener('click', () => navigateTo('videos'));
    if (btnUpdates) btnUpdates.addEventListener('click', () => navigateTo('updates'));
    if (btnTests) btnTests.addEventListener('click', () => navigateTo('tests'));

    // 2. Subject Cards Click Listeners
    const subjectCards = document.querySelectorAll('.subject-card');
    subjectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h4')?.innerText || 'বিষয়';
            openSubject(title);
        });
    });

    // 3. Bottom Nav Click Listeners
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(nav => {
        nav.addEventListener('click', (e) => {
            e.preventDefault();
            const target = nav.getAttribute('href').replace('#', '');
            navigateTo(target);
        });
    });

    // 4. Promo Banner Button
    const promoBtn = document.querySelector('.promo-cta-btn');
    if (promoBtn) {
        promoBtn.addEventListener('click', () => {
            alert('প্ৰজ্ঞানমৰ বিশেষ প্ৰশিক্ষণলৈ স্বাগতম!');
        });
    }

    // 5. Notification & Profile Click
    const notifBtn = document.querySelector('.notif-wrapper');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            alert('আপোনাৰ ৩ টা নতুন জাননী আছে।');
        });
    }
});
