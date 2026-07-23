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
        
        // Clear list and add default venue card
        document.getElementById("venues-editor-list").innerHTML = "";
        addVenueField({
            name: "The Cockpit, London",
            dates: "Summer 2026",
            reviews: [],
            images: []
        });
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
            
            // Render venue editor cards
            document.getElementById("venues-editor-list").innerHTML = "";
            const venuesList = play.venues || [];
            venuesList.forEach(v => addVenueField(v));
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
    
    // Read from visual builder
    const venues = getVenuesData();

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

// ==========================================================================
// VISUAL VENUES & REVIEWS FORM BUILDER HELPERS
// ==========================================================================

function addVenueField(data = null) {
    const container = document.getElementById("venues-editor-list");
    const venueId = 'venue-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
    
    const card = document.createElement("div");
    card.className = "glass-card venue-editor-card";
    card.id = venueId;
    card.style.padding = "2rem";
    card.style.background = "rgba(255,255,255,0.02)";
    card.style.border = "1px solid rgba(255,255,255,0.06)";
    card.style.borderRadius = "8px";
    card.style.position = "relative";
    card.style.marginBottom = "1.5rem";
    
    const name = data ? data.name || '' : '';
    const dates = data ? data.dates || '' : '';
    const images = data ? data.images || [] : [];
    const reviews = data ? data.reviews || [] : [];
    
    card.innerHTML = `
        <button type="button" class="close-modal" style="position: absolute; top: 1rem; right: 1.5rem; color: #d9534f; font-size: 1.5rem;" onclick="removeVenueField('${venueId}')">×</button>
        <h4 style="font-family: var(--font-heading); color: var(--primary); margin-bottom: 1.5rem; font-weight: normal; text-transform: uppercase; font-size: 1.05rem;">Venue Details</h4>
        
        <div class="form-grid-2">
            <div class="admin-form-group" style="margin-bottom: 0;">
                <label>Venue Name</label>
                <input type="text" class="admin-control venue-name" value="${name.replace(/"/g, '&quot;')}" placeholder="e.g. Cambridge Junction" required>
            </div>
            <div class="admin-form-group" style="margin-bottom: 0;">
                <label>Show Dates</label>
                <input type="text" class="admin-control venue-dates" value="${dates.replace(/"/g, '&quot;')}" placeholder="e.g. Spring 2026" required>
            </div>
        </div>
        
        <!-- Images Sub-Section -->
        <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <label style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0;">Scenic / Performance Images</label>
                <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; border-color: rgba(255,255,255,0.15);" onclick="addVenueImageInput('${venueId}')">+ Add Scenic Image</button>
            </div>
            <div class="venue-images-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <!-- Dynamically added image inputs -->
            </div>
        </div>

        <!-- Reviews Sub-Section -->
        <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <label style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0;">Critical Review Quotes</label>
                <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; border-color: rgba(255,255,255,0.15);" onclick="addVenueReviewInput('${venueId}')">+ Add Review Quote</button>
            </div>
            <div class="venue-reviews-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <!-- Dynamically added review quote blocks -->
            </div>
        </div>
    `;
    
    container.appendChild(card);
    
    // Add existing images
    images.forEach(imgUrl => addVenueImageInput(venueId, imgUrl));
    
    // Add existing reviews
    reviews.forEach(rev => addVenueReviewInput(venueId, rev));
}

function addVenueImageInput(venueId, value = '') {
    const venueCard = document.getElementById(venueId);
    const imagesList = venueCard.querySelector(".venue-images-list");
    const inputId = 'image-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    const wrapper = document.createElement("div");
    wrapper.id = inputId;
    wrapper.style.display = "flex";
    wrapper.style.gap = "0.5rem";
    wrapper.style.alignItems = "center";
    wrapper.innerHTML = `
        <input type="url" class="admin-control venue-image-url" value="${value.replace(/"/g, '&quot;')}" placeholder="https://example.com/scenic-performance-photo.jpg" style="flex-grow: 1;" required>
        <button type="button" class="action-icon-btn delete" style="padding: 0.7rem 0.9rem;" onclick="document.getElementById('${inputId}').remove()">×</button>
    `;
    imagesList.appendChild(wrapper);
}

function addVenueReviewInput(venueId, reviewData = null) {
    const venueCard = document.getElementById(venueId);
    const reviewsList = venueCard.querySelector(".venue-reviews-list");
    const reviewId = 'review-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    const quote = reviewData ? reviewData.quote || '' : '';
    const reviewer = reviewData ? reviewData.reviewer || '' : '';
    
    const wrapper = document.createElement("div");
    wrapper.id = reviewId;
    wrapper.style.display = "flex";
    wrapper.style.gap = "0.75rem";
    wrapper.style.alignItems = "flex-start";
    wrapper.style.marginBottom = "0.5rem";
    wrapper.innerHTML = `
        <textarea class="admin-control review-quote" placeholder="e.g. A masterclass in visceral performance..." rows="2" style="flex: 2; min-width: 200px; resize: vertical;" required>${quote}</textarea>
        <input type="text" class="admin-control review-reviewer" value="${reviewer.replace(/"/g, '&quot;')}" placeholder="e.g. Julie Petrucci, Combinations" style="flex: 1; min-width: 120px;" required>
        <button type="button" class="action-icon-btn delete" style="padding: 0.7rem 0.9rem; align-self: flex-start;" onclick="document.getElementById('${reviewId}').remove()">×</button>
    `;
    reviewsList.appendChild(wrapper);
}

function removeVenueField(venueId) {
    document.getElementById(venueId).remove();
}

function getVenuesData() {
    const venues = [];
    const cards = document.querySelectorAll(".venue-editor-card");
    
    cards.forEach(card => {
        const name = card.querySelector(".venue-name").value.trim();
        const dates = card.querySelector(".venue-dates").value.trim();
        
        // Gather images
        const images = [];
        card.querySelectorAll(".venue-image-url").forEach(input => {
            const url = input.value.trim();
            if (url) images.push(url);
        });
        
        // Gather reviews
        const reviews = [];
        card.querySelectorAll(".venue-reviews-list > div").forEach(row => {
            const quote = row.querySelector(".review-quote").value.trim();
            const reviewer = row.querySelector(".review-reviewer").value.trim();
            if (quote || reviewer) {
                reviews.push({ quote, reviewer });
            }
        });
        
        if (name || dates || images.length > 0 || reviews.length > 0) {
            venues.push({
                name,
                dates,
                images,
                reviews
            });
        }
    });
    
    return venues;
}
