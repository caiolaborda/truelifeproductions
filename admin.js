/* ==========================================================================
   TRUE LIFE PRODUCTIONS - ADMIN PANEL CRUD OPERATIONS & AUTH
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Session check to maintain authentication state
    if (sessionStorage.getItem("tlp_admin_logged_in") === "true") {
        document.getElementById("login-overlay").classList.add("hidden");
        loadSiteSettingsForm();
        renderPlaysTable();
    }

    // Enter key support for passcode login
    const passcodeField = document.getElementById("passcode");
    if (passcodeField) {
        passcodeField.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                verifyPasscode();
            }
        });
    }
});

// Passcode Verification
function verifyPasscode() {
    const passcode = document.getElementById("passcode").value;
    const errorEl = document.getElementById("login-error");
    
    // Passcode default check
    if (passcode === "admin") {
        sessionStorage.setItem("tlp_admin_logged_in", "true");
        document.getElementById("login-overlay").classList.add("hidden");
        loadSiteSettingsForm();
        renderPlaysTable();
        errorEl.style.display = "none";
    } else {
        errorEl.style.display = "block";
    }
}

// Log Out Admin
function logoutAdmin() {
    sessionStorage.removeItem("tlp_admin_logged_in");
    document.getElementById("passcode").value = "";
    document.getElementById("login-overlay").classList.remove("hidden");
}

// Switching sidebar tabs
function switchTab(tabName) {
    // Buttons active state
    document.querySelectorAll(".admin-tab-btn").forEach(btn => {
        if (btn.outerHTML.includes(tabName)) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Panels active state
    document.querySelectorAll(".admin-tab-panel").forEach(panel => {
        if (panel.id === `panel-${tabName}`) {
            panel.classList.add("active");
        } else {
            panel.classList.remove("active");
        }
    });
}

/* ==========================================================================
   TAB 1: SITE SETTINGS OPERATIONS
   ========================================================================== */
function loadSiteSettingsForm() {
    const settings = TLP_DB.getSettings();
    document.getElementById("site-title").value = settings.title;
    document.getElementById("site-announcement").value = settings.announcement;
    document.getElementById("site-email").value = settings.email;
    document.getElementById("site-phone").value = settings.phone;
    document.getElementById("site-registration").value = settings.registration;
    document.getElementById("site-address").value = settings.address;
}

function saveSiteSettings(event) {
    event.preventDefault();
    
    const settings = {
        title: document.getElementById("site-title").value,
        announcement: document.getElementById("site-announcement").value || "",
        email: document.getElementById("site-email").value,
        phone: document.getElementById("site-phone").value,
        registration: document.getElementById("site-registration").value,
        address: document.getElementById("site-address").value
    };

    TLP_DB.saveSettings(settings);
    alert("Site settings saved successfully! These changes will reflect immediately across all pages.");
    
    // Toggle announcement banner visibility instantly
    const banner = document.querySelector(".announcement-banner");
    const bannerEl = document.querySelector(".announcement-banner p");
    if (banner && bannerEl) {
        if (!settings.announcement || settings.announcement.trim() === "" || settings.announcement.toUpperCase() === "NONE") {
            banner.style.display = "none";
            document.body.classList.remove("has-announcement");
            document.documentElement.style.setProperty("--banner-height", "0px");
        } else {
            banner.style.display = "block";
            bannerEl.textContent = settings.announcement;
            document.body.classList.add("has-announcement");
            setTimeout(() => {
                const bannerHeight = banner.offsetHeight;
                document.documentElement.style.setProperty("--banner-height", `${bannerHeight}px`);
            }, 50);
        }
    }
}

/* ==========================================================================
   TAB 2: MANAGE PLAYS CRUD OPERATIONS
   ========================================================================== */
function renderPlaysTable() {
    const tableBody = document.getElementById("plays-table-body");
    const productions = TLP_DB.getProductions();
    
    if (!tableBody) return;
    tableBody.innerHTML = "";

    productions.forEach(play => {
        // Status color badge settings
        let badgeColor = "background: var(--primary); color: var(--text-dark);";
        if (play.status === "upcoming") badgeColor = "background: var(--accent-red); color: var(--text-main);";
        if (play.status === "past") badgeColor = "background: rgba(255,255,255,0.1); color: var(--text-muted);";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="font-weight: 600;">${play.title}</td>
            <td>${play.author} <br><span style="font-size: 0.8rem; color: var(--text-muted);">Dir: ${play.director || 'N/A'}</span></td>
            <td>${play.year}</td>
            <td><span class="status-badge" style="${badgeColor}">${play.status}</span></td>
            <td><span class="color-preview-dot" style="background: ${play.accent};"></span>${play.accent}</td>
            <td style="font-size: 0.85rem; color: var(--primary); font-family: monospace;">${play.animationType || 'none'}</td>
            <td>
                <div class="td-actions">
                    <button class="action-icon-btn edit" onclick="openPlayModal('edit', '${play.id}')">Edit</button>
                    <button class="action-icon-btn delete" onclick="deletePlay('${play.id}')">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Modal open/close controls
function openPlayModal(mode, playId = '') {
    const overlay = document.getElementById("play-modal-overlay");
    const form = overlay.querySelector("form");
    const titleEl = document.getElementById("modal-action-title");
    
    form.reset();
    document.getElementById("play-form-mode").value = mode;
    document.getElementById("play-form-id").value = playId;

    if (mode === "create") {
        titleEl.textContent = "Add New Production";
        document.getElementById("play-accent").value = "#dfb75c";
        document.getElementById("play-animation").value = "none";
        document.getElementById("play-page-type").value = "pre-prod";
        document.getElementById("play-prod-type").value = "full";
        document.getElementById("play-show-hero").checked = false;
        document.getElementById("play-details-link").value = "";
        document.getElementById("play-venues").value = JSON.stringify([
            {
                "name": "Cockpit Theatre, London",
                "dates": "Summer 2026",
                "reviews": [],
                "images": []
            }
        ], null, 2);
    } else if (mode === "edit" && playId) {
        titleEl.textContent = "Edit Production";
        
        const productions = TLP_DB.getProductions();
        const play = productions.find(p => p.id === playId);
        
        if (play) {
            document.getElementById("play-title").value = play.title;
            document.getElementById("play-author").value = play.author;
            document.getElementById("play-director").value = play.director || '';
            document.getElementById("play-year").value = play.year;
            document.getElementById("play-status").value = play.status;
            document.getElementById("play-accent").value = play.accent || '#dfb75c';
            document.getElementById("play-animation").value = play.animationType || 'none';
            document.getElementById("play-image").value = play.image;
            document.getElementById("play-cast").value = play.cast || '';
            document.getElementById("play-set").value = play.setDesign || '';
            document.getElementById("play-synopsis").value = play.synopsis;
            
            // Phase 2 additions
            document.getElementById("play-page-type").value = play.pageType || 'pre-prod';
            document.getElementById("play-prod-type").value = play.isStudio ? 'studio' : 'full';
            document.getElementById("play-show-hero").checked = !!play.showInHero;
            document.getElementById("play-details-link").value = play.detailsLink || '';
            document.getElementById("play-venues").value = play.venues ? JSON.stringify(play.venues, null, 2) : '[]';
        }
    }

    overlay.classList.add("open");
}

function closePlayModal() {
    document.getElementById("play-modal-overlay").classList.remove("open");
}

// Create & Update Form submission
function handlePlaySubmit(event) {
    event.preventDefault();
    
    const mode = document.getElementById("play-form-mode").value;
    const playId = document.getElementById("play-form-id").value;
    
    const title = document.getElementById("play-title").value;
    const author = document.getElementById("play-author").value;
    const director = document.getElementById("play-director").value;
    const year = document.getElementById("play-year").value;
    const status = document.getElementById("play-status").value;
    const accent = document.getElementById("play-accent").value;
    const animation = document.getElementById("play-animation").value;
    const image = document.getElementById("play-image").value;
    const cast = document.getElementById("play-cast").value;
    const set = document.getElementById("play-set").value;
    const synopsis = document.getElementById("play-synopsis").value;

    // Phase 2 inputs
    const pageType = document.getElementById("play-page-type").value;
    const prodType = document.getElementById("play-prod-type").value;
    const isStudio = prodType === "studio";
    const showInHero = document.getElementById("play-show-hero").checked;
    const detailsLink = document.getElementById("play-details-link").value;
    const venuesRaw = document.getElementById("play-venues").value;

    // JSON Validation for Venues
    let venues = [];
    try {
        venues = JSON.parse(venuesRaw);
        if (!Array.isArray(venues)) {
            throw new Error("Venues details must be an outer JSON Array.");
        }
    } catch (e) {
        alert("Invalid Venues format: " + e.message + "\nPlease make sure it is a valid JSON Array of objects.");
        return;
    }

    const productions = TLP_DB.getProductions();

    if (mode === "create") {
        // Generate an ID based on title slug
        const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Check for duplicate ID
        if (productions.some(p => p.id === newId)) {
            alert("A play with this title or similar ID already exists. Please choose a different title.");
            return;
        }

        const newPlay = {
            id: newId,
            title,
            author,
            director,
            year,
            status,
            synopsis,
            image,
            accent,
            animationType: animation,
            cast,
            setDesign: set,
            pageType,
            isStudio,
            showInHero,
            detailsLink,
            venues,
            reviews: [] // Fallback for old templates
        };

        productions.push(newPlay);
        alert(`Production "${title}" successfully added!`);
    } else if (mode === "edit" && playId) {
        const playIdx = productions.findIndex(p => p.id === playId);
        
        if (playIdx !== -1) {
            // Update fields
            productions[playIdx].title = title;
            productions[playIdx].author = author;
            productions[playIdx].director = director;
            productions[playIdx].year = year;
            productions[playIdx].status = status;
            productions[playIdx].accent = accent;
            productions[playIdx].animationType = animation;
            productions[playIdx].image = image;
            productions[playIdx].cast = cast;
            productions[playIdx].setDesign = set;
            productions[playIdx].synopsis = synopsis;
            
            // Phase 2 additions
            productions[playIdx].pageType = pageType;
            productions[playIdx].isStudio = isStudio;
            productions[playIdx].showInHero = showInHero;
            productions[playIdx].detailsLink = detailsLink;
            productions[playIdx].venues = venues;
            
            alert(`Production "${title}" successfully updated!`);
        }
    }

    TLP_DB.saveProductions(productions);
    renderPlaysTable();
    closePlayModal();
}

// Delete Operation
function deletePlay(playId) {
    const productions = TLP_DB.getProductions();
    const play = productions.find(p => p.id === playId);
    
    if (!play) return;

    const confirmDelete = confirm(`Are you absolutely sure you want to delete "${play.title}"?\nThis cannot be undone.`);
    if (confirmDelete) {
        const updated = productions.filter(p => p.id !== playId);
        TLP_DB.saveProductions(updated);
        renderPlaysTable();
        alert(`Production "${play.title}" deleted.`);
    }
}
