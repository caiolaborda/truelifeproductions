/* ==========================================================================
   TRUE LIFE PRODUCTIONS - ADMIN PANEL CRUD OPERATIONS & LIVE PREVIEW
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Session check to maintain authentication state
    if (sessionStorage.getItem("tlp_admin_logged_in") === "true") {
        document.getElementById("login-overlay").classList.add("hidden");
        loadAllAdminPanels();
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

    // Setup drag and drop for upload dropzones
    setupAllDropzones();
});

function loadAllAdminPanels() {
    loadSiteSettingsForm();
    renderPlaysTable();
    renderWorkshopsTable();
    renderTeamTable();
    loadAboutContentForm();
}

// Passcode Verification
function verifyPasscode() {
    const passcode = document.getElementById("passcode").value;
    const errorEl = document.getElementById("login-error");
    
    // Passcode check
    if (passcode === "admin") {
        sessionStorage.setItem("tlp_admin_logged_in", "true");
        document.getElementById("login-overlay").classList.add("hidden");
        loadAllAdminPanels();
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
        if (btn.outerHTML.includes(`switchTab('${tabName}')`)) {
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
   IMAGE UPLOAD, COMPRESSION & PREVIEW HELPERS
   ========================================================================== */

/**
 * Compresses an image file client-side using an HTML5 Canvas.
 * Returns a Promise that resolves to an optimized base64 Data URL.
 */
function compressImageFile(file, maxWidth = 1600, quality = 0.85) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
            return reject(new Error("Selected file is not an image."));
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxWidth) {
                    if (width > height) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxWidth) / height);
                        height = maxWidth;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                // Use webp or jpeg format
                const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
                const dataUrl = canvas.toDataURL(mimeType, quality);
                resolve({ dataUrl, width, height, originalName: file.name });
            };
            img.onerror = () => reject(new Error("Failed to load image into canvas."));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsDataURL(file);
    });
}

/**
 * Handles image file selection from file input or drag-and-drop
 */
async function handleImageFileUpload(event, inputId, previewId, callback = null) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
        const inputEl = document.getElementById(inputId);
        const previewEl = document.getElementById(previewId);
        
        if (previewEl) {
            previewEl.style.display = "block";
            previewEl.innerHTML = `<p style="font-size: 0.8rem; color: var(--primary);">Compressing and optimizing image...</p>`;
        }

        const result = await compressImageFile(file);
        
        if (inputEl) {
            inputEl.value = result.dataUrl;
        }

        renderImagePreview(previewId, inputId, result.dataUrl, result.originalName, `${result.width}×${result.height}`, callback);

        if (callback && typeof callback === "function") {
            callback();
        }
    } catch (err) {
        alert("Image upload error: " + err.message);
    }
}

/**
 * Handles typing or pasting a URL/path into the text input
 */
function handleManualImageUrl(inputId, previewId, callback = null) {
    const inputEl = document.getElementById(inputId);
    if (!inputEl) return;
    const url = inputEl.value.trim();
    if (url) {
        renderImagePreview(previewId, inputId, url, url.split("/").pop() || "Image", "", callback);
    } else {
        const previewEl = document.getElementById(previewId);
        if (previewEl) previewEl.style.display = "none";
    }
    if (callback && typeof callback === "function") {
        callback();
    }
}

/**
 * Renders an image preview box with a remove button
 */
function renderImagePreview(previewId, inputId, url, name = "Image", meta = "", callback = null) {
    const previewEl = document.getElementById(previewId);
    if (!previewEl) return;

    if (!url || !url.trim()) {
        previewEl.style.display = "none";
        previewEl.innerHTML = "";
        return;
    }

    const displayName = url.startsWith("data:") ? "Uploaded Image (compressed)" : (name || url.split("/").pop() || "Image");

    previewEl.style.display = "block";
    previewEl.innerHTML = `
        <div class="dropzone-preview-wrap">
            <img src="${url}" class="dropzone-thumb" alt="Preview" onerror="this.src='assets/images/image06.png'">
            <div class="dropzone-info">
                <span>${displayName}</span>
                ${meta ? `<small style="color: var(--text-muted);">${meta}</small>` : ''}
            </div>
            <button type="button" class="dropzone-btn-remove" onclick="clearUploadedImage('${inputId}', '${previewId}')">Remove</button>
        </div>
    `;
}

function clearUploadedImage(inputId, previewId) {
    const inputEl = document.getElementById(inputId);
    const previewEl = document.getElementById(previewId);
    if (inputEl) inputEl.value = "";
    if (previewEl) {
        previewEl.style.display = "none";
        previewEl.innerHTML = "";
    }
    if (inputId === "play-image") {
        updatePlayLivePreview();
    }
}

/**
 * Drag and drop zone wiring
 */
function setupAllDropzones() {
    setupDropzone("play-image-dropzone", "play-image-file");
    setupDropzone("ws-image-dropzone", "ws-image-file");
    setupDropzone("team-image-dropzone", "team-image-file");
}

function setupDropzone(dropzoneId, fileInputId) {
    const dropzone = document.getElementById(dropzoneId);
    const fileInput = document.getElementById(fileInputId);
    if (!dropzone || !fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('dragover');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            fileInput.files = files;
            const changeEvent = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(changeEvent);
        }
    });
}

/* ==========================================================================
   TAB 1: SITE SETTINGS OPERATIONS
   ========================================================================== */
function loadSiteSettingsForm() {
    const settings = TLP_DB.getSettings();
    document.getElementById("site-title").value = settings.title || "";
    document.getElementById("site-announcement").value = settings.announcement || "";
    document.getElementById("site-email").value = settings.email || "";
    document.getElementById("site-phone").value = settings.phone || "";
    document.getElementById("site-registration").value = settings.registration || "";
    document.getElementById("site-address").value = settings.address || "";
}

async function saveSiteSettings(event) {
    event.preventDefault();
    const btn = document.getElementById("save-settings-btn");
    const originalText = btn ? btn.textContent : "Save Site Settings";
    if (btn) btn.textContent = "Saving & Syncing to Live Site...";
    
    const settings = {
        title: document.getElementById("site-title").value,
        announcement: document.getElementById("site-announcement").value || "",
        email: document.getElementById("site-email").value,
        phone: document.getElementById("site-phone").value,
        registration: document.getElementById("site-registration").value,
        address: document.getElementById("site-address").value
    };

    await TLP_DB.saveSettings(settings);
    if (btn) btn.textContent = originalText;
    
    alert("Site settings saved and synced successfully! Changes will reflect live across all pages.");
    
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
   TAB 2: MANAGE PLAYS CRUD OPERATIONS & LIVE PREVIEW
   ========================================================================== */
function renderPlaysTable() {
    const tableBody = document.getElementById("plays-table-body");
    const productions = TLP_DB.getProductions();
    
    if (!tableBody) return;
    tableBody.innerHTML = "";

    productions.forEach(play => {
        let badgeColor = "background: var(--primary); color: var(--text-dark);";
        if (play.status === "upcoming") badgeColor = "background: var(--accent-red); color: var(--text-main);";
        if (play.status === "past") badgeColor = "background: rgba(255,255,255,0.1); color: var(--text-muted);";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="font-weight: 600;">${play.title}</td>
            <td>${play.author} <br><span style="font-size: 0.8rem; color: var(--text-muted);">Dir: ${play.director || 'N/A'}</span></td>
            <td>${play.year}</td>
            <td><span class="status-badge" style="${badgeColor}">${play.customStatus || play.status}</span></td>
            <td><span class="color-preview-dot" style="background: ${play.accent};"></span>${play.accent}</td>
            <td style="font-size: 0.85rem; color: var(--primary); font-family: monospace;">${play.animationType || 'none'}</td>
            <td>
                <div class="action-btns-group">
                    <button type="button" class="action-icon-btn edit" onclick="openPlayModal('edit', '${play.id}')">Edit</button>
                    <button type="button" class="action-icon-btn delete" onclick="deletePlay('${play.id}')">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Real-time Live Play Page Preview Updater
 */
function updatePlayLivePreview() {
    const title = document.getElementById("play-title")?.value || "Production Title";
    const author = document.getElementById("play-author")?.value || "Playwright";
    const year = document.getElementById("play-year")?.value || "2026";
    const prodType = document.getElementById("play-prod-type")?.value || "full";
    const accent = document.getElementById("play-accent")?.value || "#dfb75c";
    const image = document.getElementById("play-image")?.value || "assets/images/play-poison-banner.jpg";
    const director = document.getElementById("play-director")?.value || "—";
    const cast = document.getElementById("play-cast")?.value || "—";
    const setDesign = document.getElementById("play-set")?.value || "—";
    const synopsis = document.getElementById("play-synopsis")?.value || "Plot synopsis will be displayed here...";
    const pageType = document.getElementById("play-page-type")?.value || "pre-prod";
    const detailsLink = document.getElementById("play-details-link")?.value || "";

    // Update Hero Banner Preview
    const mockHeroImg = document.getElementById("mock-hero-img");
    const mockBadge = document.getElementById("mock-badge");
    const mockTitle = document.getElementById("mock-title");
    const mockSub = document.getElementById("mock-sub");

    if (mockHeroImg) {
        mockHeroImg.src = image || "assets/images/play-poison-banner.jpg";
        mockHeroImg.onerror = () => {
            mockHeroImg.src = "assets/images/image06.png";
        };
    }
    if (mockBadge) {
        if (prodType === "studio") {
            mockBadge.textContent = "TLP STUDIO PRODUCTION";
            mockBadge.style.background = "#dfb75c";
            mockBadge.style.color = "#06070a";
        } else {
            mockBadge.textContent = "TLP PRODUCTION";
            mockBadge.style.background = "#8f1b2c";
            mockBadge.style.color = "#ffffff";
        }
    }
    if (mockTitle) mockTitle.textContent = title;
    if (mockSub) mockSub.textContent = `By ${author} — ${year}`;

    // Update Sidebar Meta Preview
    const mockAuthor = document.getElementById("mock-meta-author");
    const mockDirector = document.getElementById("mock-meta-director");
    const mockCast = document.getElementById("mock-meta-cast");
    const mockSet = document.getElementById("mock-meta-set");
    const mockSyn = document.getElementById("mock-synopsis");

    if (mockAuthor) mockAuthor.textContent = author;
    if (mockDirector) mockDirector.textContent = director;
    if (mockCast) mockCast.textContent = cast;
    if (mockSet) mockSet.textContent = setDesign;
    if (mockSyn) mockSyn.textContent = synopsis;

    // Update Dynamic Body (Pre-prod vs Post-prod)
    const dynamicBox = document.getElementById("mock-dynamic-content");
    if (dynamicBox) {
        if (pageType === "pre-prod") {
            const hasLink = detailsLink && detailsLink.startsWith("http");
            dynamicBox.innerHTML = `
                <div class="mock-booking-box">
                    <h5>Booking & Tickets</h5>
                    <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.75rem; line-height: 1.4;">
                        Tickets for upcoming runs are available directly through Box Offices.
                    </p>
                    <span class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; display: inline-block; pointer-events: none;">
                        ${hasLink ? 'Book Tickets ↗' : 'Enquire / Book Tickets'}
                    </span>
                </div>
            `;
        } else {
            // Post-prod mode: render sample reviews from venues
            const venues = getVenuesData();
            let allReviews = [];
            venues.forEach(v => {
                if (v.reviews && v.reviews.length > 0) {
                    allReviews.push(...v.reviews);
                }
            });

            if (allReviews.length === 0) {
                allReviews = [{ quote: "A captivating production that resonates deeply.", reviewer: "Critical Review" }];
            }

            dynamicBox.innerHTML = `
                <div style="margin-top: 1rem;">
                    <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--primary); font-family: var(--font-heading); margin-bottom: 0.5rem;">Critical Acclaim</div>
                    ${allReviews.slice(0, 2).map(r => `
                        <div class="mock-review-card">
                            "${r.quote}"
                            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.25rem; font-style: normal;">— ${r.reviewer}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Update Production Photos Gallery Strip in Mockup
    const galleryContainer = document.getElementById("mock-gallery-preview");
    const gallerySection = document.getElementById("mock-gallery-section");
    if (galleryContainer) {
        const venues = getVenuesData();
        const allPhotos = [];
        venues.forEach(v => {
            if (v.images && Array.isArray(v.images)) {
                v.images.forEach(img => {
                    if (img && img.trim()) allPhotos.push(img.trim());
                });
            }
        });
        if (allPhotos.length > 0) {
            if (gallerySection) gallerySection.style.display = "block";
            galleryContainer.innerHTML = allPhotos.map(p => `
                <img src="${p}" class="mock-gallery-thumb" alt="Production Photo" onerror="this.src='assets/images/image06.png'">
            `).join('');
        } else {
            if (gallerySection) gallerySection.style.display = "none";
            galleryContainer.innerHTML = "";
        }
    }
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
        document.getElementById("play-image").value = "assets/images/play-poison-banner.jpg";
        
        renderImagePreview("play-image-preview", "play-image", "assets/images/play-poison-banner.jpg", "Default Banner");

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
            document.getElementById("play-title").value = play.title || '';
            document.getElementById("play-author").value = play.author || '';
            document.getElementById("play-director").value = play.director || '';
            document.getElementById("play-year").value = play.year || '';
            document.getElementById("play-status").value = play.status || 'upcoming';
            document.getElementById("play-accent").value = play.accent || '#dfb75c';
            document.getElementById("play-animation").value = play.animationType || 'none';
            document.getElementById("play-image").value = play.image || '';
            document.getElementById("play-cast").value = play.cast || '';
            document.getElementById("play-set").value = play.setDesign || '';
            document.getElementById("play-synopsis").value = play.synopsis || '';
            document.getElementById("play-page-type").value = play.pageType || 'pre-prod';
            document.getElementById("play-prod-type").value = play.isStudio ? 'studio' : 'full';
            document.getElementById("play-show-hero").checked = !!play.showInHero;
            document.getElementById("play-details-link").value = play.detailsLink || '';
            
            if (play.image) {
                renderImagePreview("play-image-preview", "play-image", play.image, play.image.startsWith("data:") ? "Uploaded Poster" : (play.image.split("/").pop() || "Poster"));
            } else {
                renderImagePreview("play-image-preview", "play-image", "");
            }

            document.getElementById("venues-editor-list").innerHTML = "";
            const venuesList = play.venues || [];
            if (venuesList.length === 0) {
                addVenueField();
            } else {
                venuesList.forEach(v => addVenueField(v));
            }
        }
    }

    updatePlayLivePreview();
    overlay.classList.add("open");
}

function closePlayModal() {
    document.getElementById("play-modal-overlay").classList.remove("open");
}

// Create & Update Play Form submission
async function handlePlaySubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById("save-play-btn");
    const originalBtnText = submitBtn ? submitBtn.textContent : "Save Production";
    if (submitBtn) submitBtn.textContent = "Saving & Syncing to Live Site...";
    
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

    const pageType = document.getElementById("play-page-type").value;
    const prodType = document.getElementById("play-prod-type").value;
    const isStudio = prodType === "studio";
    const showInHero = document.getElementById("play-show-hero").checked;
    const detailsLink = document.getElementById("play-details-link").value;
    
    const venues = getVenuesData();
    const productions = TLP_DB.getProductions();

    if (mode === "create") {
        const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        if (productions.some(p => p.id === newId)) {
            alert("A play with this title or similar ID already exists. Please choose a different title.");
            if (submitBtn) submitBtn.textContent = originalBtnText;
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
            banner: image,
            accent,
            animationType: animation,
            cast,
            setDesign: set,
            pageType,
            isStudio,
            showInHero,
            detailsLink,
            venues,
            reviews: []
        };

        productions.push(newPlay);
    } else if (mode === "edit" && playId) {
        const playIdx = productions.findIndex(p => p.id === playId);
        
        if (playIdx !== -1) {
            productions[playIdx].title = title;
            productions[playIdx].author = author;
            productions[playIdx].director = director;
            productions[playIdx].year = year;
            productions[playIdx].status = status;
            productions[playIdx].accent = accent;
            productions[playIdx].animationType = animation;
            productions[playIdx].image = image;
            productions[playIdx].banner = image;
            productions[playIdx].cast = cast;
            productions[playIdx].setDesign = set;
            productions[playIdx].synopsis = synopsis;
            productions[playIdx].pageType = pageType;
            productions[playIdx].isStudio = isStudio;
            productions[playIdx].showInHero = showInHero;
            productions[playIdx].detailsLink = detailsLink;
            productions[playIdx].venues = venues;
        }
    }

    await TLP_DB.saveProductions(productions);
    if (submitBtn) submitBtn.textContent = originalBtnText;
    renderPlaysTable();
    closePlayModal();
    alert(`Production "${title}" saved and synced successfully to the live website!`);
}

async function deletePlay(playId) {
    const productions = TLP_DB.getProductions();
    const play = productions.find(p => p.id === playId);
    
    if (!play) return;

    const confirmDelete = confirm(`Are you sure you want to delete "${play.title}"?\nThis cannot be undone.`);
    if (confirmDelete) {
        const updated = productions.filter(p => p.id !== playId);
        await TLP_DB.saveProductions(updated);
        renderPlaysTable();
        alert(`Production "${play.title}" deleted.`);
    }
}

/* ==========================================================================
   VENUES, REVIEWS & GALLERY BUILDER
   ========================================================================== */
function addVenueField(data = null) {
    const container = document.getElementById("venues-editor-list");
    const venueId = 'venue-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
    
    const card = document.createElement("div");
    card.className = "venue-editor-card";
    card.id = venueId;
    card.style.padding = "1.5rem";
    card.style.background = "rgba(255,255,255,0.02)";
    card.style.border = "1px solid rgba(255,255,255,0.08)";
    card.style.borderRadius = "8px";
    card.style.position = "relative";
    card.style.marginBottom = "1.25rem";
    
    const name = data ? data.name || '' : '';
    const dates = data ? data.dates || '' : '';
    const images = data ? data.images || [] : [];
    const reviews = data ? data.reviews || [] : [];
    
    card.innerHTML = `
        <button type="button" class="close-modal" style="position: absolute; top: 0.75rem; right: 1rem; color: #d9534f; font-size: 1.25rem;" onclick="removeVenueField('${venueId}')">×</button>
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 1rem;">Venue & Performance Dates</div>
        
        <div class="form-grid-2">
            <div class="admin-form-group" style="margin-bottom: 0;">
                <label>Venue Name</label>
                <input type="text" class="admin-control venue-name" value="${name.replace(/"/g, '&quot;')}" placeholder="e.g. Cambridge Junction" required oninput="updatePlayLivePreview()">
            </div>
            <div class="admin-form-group" style="margin-bottom: 0;">
                <label>Show Dates / Season</label>
                <input type="text" class="admin-control venue-dates" value="${dates.replace(/"/g, '&quot;')}" placeholder="e.g. Spring 2026" required oninput="updatePlayLivePreview()">
            </div>
        </div>
        
        <!-- Images Sub-Section -->
        <div style="margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <label style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0;">Scenic / Performance Photos</label>
                <button type="button" class="btn btn-outline" style="padding: 0.2rem 0.6rem; font-size: 0.7rem;" onclick="addVenueImageInput('${venueId}')">+ Add Photo</button>
            </div>
            <div class="venue-images-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Image inputs -->
            </div>
        </div>

        <!-- Reviews Sub-Section -->
        <div style="margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <label style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0;">Critical Review Quotes</label>
                <button type="button" class="btn btn-outline" style="padding: 0.2rem 0.6rem; font-size: 0.7rem;" onclick="addVenueReviewInput('${venueId}')">+ Add Review Quote</button>
            </div>
            <div class="venue-reviews-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <!-- Review blocks -->
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
    if (!venueCard) return;
    const imagesList = venueCard.querySelector(".venue-images-list");
    const inputId = 'image-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const fileId = 'file-' + inputId;
    
    const wrapper = document.createElement("div");
    wrapper.id = inputId;
    wrapper.style.display = "flex";
    wrapper.style.gap = "0.5rem";
    wrapper.style.alignItems = "center";
    wrapper.innerHTML = `
        <img src="${value || 'assets/images/image06.png'}" class="venue-photo-thumb" style="width: 36px; height: 36px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); flex-shrink: 0; background: #000; ${value ? '' : 'display: none;'}" alt="Thumb" onerror="this.src='assets/images/image06.png'">
        <input type="text" class="admin-control venue-image-url" value="${value.replace(/"/g, '&quot;')}" placeholder="e.g. photo.jpg or https://..." style="flex-grow: 1;" required oninput="handleVenueUrlInput('${inputId}')">
        <input type="file" id="${fileId}" accept="image/*" style="display: none;" onchange="handleVenuePhotoUpload(event, '${inputId}')">
        <button type="button" class="btn btn-outline" style="padding: 0.5rem 0.75rem; font-size: 0.75rem; white-space: nowrap;" onclick="document.getElementById('${fileId}').click()">📁 Upload</button>
        <button type="button" class="action-icon-btn delete" style="padding: 0.55rem 0.75rem;" onclick="document.getElementById('${inputId}').remove(); updatePlayLivePreview();">×</button>
    `;
    imagesList.appendChild(wrapper);
}

function handleVenueUrlInput(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    const input = wrapper.querySelector(".venue-image-url");
    const thumb = wrapper.querySelector(".venue-photo-thumb");
    const val = input ? input.value.trim() : '';
    if (thumb) {
        if (val) {
            thumb.src = val;
            thumb.style.display = "block";
        } else {
            thumb.style.display = "none";
        }
    }
    updatePlayLivePreview();
}

async function handleVenuePhotoUpload(event, wrapperId) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
        const wrapper = document.getElementById(wrapperId);
        const input = wrapper.querySelector(".venue-image-url");
        const thumb = wrapper.querySelector(".venue-photo-thumb");
        const result = await compressImageFile(file);
        if (input) input.value = result.dataUrl;
        if (thumb) {
            thumb.src = result.dataUrl;
            thumb.style.display = "block";
        }
        updatePlayLivePreview();
    } catch(e) {
        alert("Photo upload error: " + e.message);
    }
}

function addVenueReviewInput(venueId, reviewData = null) {
    const venueCard = document.getElementById(venueId);
    if (!venueCard) return;
    const reviewsList = venueCard.querySelector(".venue-reviews-list");
    const reviewId = 'review-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    const quote = reviewData ? reviewData.quote || '' : '';
    const reviewer = reviewData ? reviewData.reviewer || '' : '';
    
    const wrapper = document.createElement("div");
    wrapper.id = reviewId;
    wrapper.style.display = "flex";
    wrapper.style.gap = "0.75rem";
    wrapper.style.alignItems = "flex-start";
    wrapper.innerHTML = `
        <textarea class="admin-control review-quote" placeholder="Critical review quote..." rows="2" style="flex: 2; resize: vertical;" required oninput="updatePlayLivePreview()">${quote}</textarea>
        <input type="text" class="admin-control review-reviewer" value="${reviewer.replace(/"/g, '&quot;')}" placeholder="e.g. The Guardian" style="flex: 1;" required oninput="updatePlayLivePreview()">
        <button type="button" class="action-icon-btn delete" style="padding: 0.6rem 0.8rem;" onclick="document.getElementById('${reviewId}').remove(); updatePlayLivePreview();">×</button>
    `;
    reviewsList.appendChild(wrapper);
}

function removeVenueField(venueId) {
    const card = document.getElementById(venueId);
    if (card) {
        card.remove();
        updatePlayLivePreview();
    }
}

function getVenuesData() {
    const venueCards = document.querySelectorAll(".venue-editor-card");
    const venues = [];
    
    venueCards.forEach(card => {
        const nameInput = card.querySelector(".venue-name");
        const datesInput = card.querySelector(".venue-dates");
        
        const name = nameInput ? nameInput.value : '';
        const dates = datesInput ? datesInput.value : '';
        
        const imageInputs = card.querySelectorAll(".venue-image-url");
        const images = [];
        imageInputs.forEach(input => {
            if (input.value.trim()) images.push(input.value.trim());
        });
        
        const reviewQuotes = card.querySelectorAll(".review-quote");
        const reviewReviewers = card.querySelectorAll(".review-reviewer");
        const reviews = [];
        
        for (let i = 0; i < reviewQuotes.length; i++) {
            const q = reviewQuotes[i].value.trim();
            const r = reviewReviewers[i] ? reviewReviewers[i].value.trim() : '';
            if (q) reviews.push({ quote: q, reviewer: r });
        }
        
        if (name) {
            venues.push({ name, dates, images, reviews });
        }
    });
    
    return venues;
}

/* ==========================================================================
   TAB 3: MANAGE WORKSHOPS CRUD OPERATIONS
   ========================================================================== */
function renderWorkshopsTable() {
    const tableBody = document.getElementById("workshops-table-body");
    if (!tableBody) return;
    const workshops = TLP_DB.getWorkshops ? TLP_DB.getWorkshops() : [];
    tableBody.innerHTML = "";

    workshops.forEach((ws, idx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${ws.image || 'assets/images/slideshow11-86368c53.jpg'}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" alt="${ws.title}">
            </td>
            <td style="font-weight: 600;">${ws.title}</td>
            <td><span class="status-badge" style="background: rgba(223, 183, 92, 0.15); color: var(--primary); border: 1px solid var(--border-gold);">${ws.category || 'Workshop'}</span></td>
            <td>${ws.instructor || 'TLP Lead'}</td>
            <td>${ws.schedule || 'Term Sessions'}</td>
            <td>
                <div class="action-btns-group">
                    <button type="button" class="action-icon-btn edit" onclick="openWorkshopModal('edit', '${ws.id || idx}')">Edit</button>
                    <button type="button" class="action-icon-btn delete" onclick="deleteWorkshop('${ws.id || idx}')">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openWorkshopModal(mode, wsId = '') {
    const overlay = document.getElementById("workshop-modal-overlay");
    const form = overlay.querySelector("form");
    const titleEl = document.getElementById("workshop-modal-action-title");
    
    form.reset();
    document.getElementById("workshop-form-mode").value = mode;
    document.getElementById("workshop-form-id").value = wsId;

    if (mode === "create") {
        titleEl.textContent = "Add New Workshop";
        document.getElementById("workshop-image").value = "assets/images/slideshow11-86368c53.jpg";
        renderImagePreview("ws-image-preview", "workshop-image", "assets/images/slideshow11-86368c53.jpg", "Default Image");
    } else if (mode === "edit" && wsId) {
        titleEl.textContent = "Edit Workshop";
        const workshops = TLP_DB.getWorkshops();
        const ws = workshops.find((w, i) => w.id === wsId || String(i) === String(wsId));

        if (ws) {
            document.getElementById("workshop-title").value = ws.title || '';
            document.getElementById("workshop-category").value = ws.category || '';
            document.getElementById("workshop-instructor").value = ws.instructor || '';
            document.getElementById("workshop-schedule").value = ws.schedule || '';
            document.getElementById("workshop-location").value = ws.location || '';
            document.getElementById("workshop-image").value = ws.image || '';
            document.getElementById("workshop-desc").value = ws.description || '';
            document.getElementById("workshop-sub-desc").value = ws.subDescription || '';
            document.getElementById("workshop-cta-text").value = ws.ctaText || 'Register Interest';
            document.getElementById("workshop-cta-link").value = ws.ctaLink || '';

            if (ws.image) {
                renderImagePreview("ws-image-preview", "workshop-image", ws.image, ws.image.startsWith("data:") ? "Uploaded Image" : (ws.image.split("/").pop() || "Image"));
            } else {
                renderImagePreview("ws-image-preview", "workshop-image", "");
            }
        }
    }

    overlay.classList.add("open");
}

function closeWorkshopModal() {
    document.getElementById("workshop-modal-overlay").classList.remove("open");
}

async function handleWorkshopSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById("save-ws-btn");
    const originalText = submitBtn ? submitBtn.textContent : "Save Workshop";
    if (submitBtn) submitBtn.textContent = "Saving & Syncing...";

    const mode = document.getElementById("workshop-form-mode").value;
    const wsId = document.getElementById("workshop-form-id").value;

    const title = document.getElementById("workshop-title").value;
    const category = document.getElementById("workshop-category").value;
    const instructor = document.getElementById("workshop-instructor").value;
    const schedule = document.getElementById("workshop-schedule").value;
    const location = document.getElementById("workshop-location").value;
    const image = document.getElementById("workshop-image").value;
    const description = document.getElementById("workshop-desc").value;
    const subDescription = document.getElementById("workshop-sub-desc").value;
    const ctaText = document.getElementById("workshop-cta-text").value;
    const ctaLink = document.getElementById("workshop-cta-link").value;

    const workshops = TLP_DB.getWorkshops();

    if (mode === "create") {
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        workshops.push({
            id, title, category, instructor, schedule, location, image, description, subDescription, ctaText, ctaLink, status: "active"
        });
    } else {
        const idx = workshops.findIndex((w, i) => w.id === wsId || String(i) === String(wsId));
        if (idx !== -1) {
            workshops[idx].title = title;
            workshops[idx].category = category;
            workshops[idx].instructor = instructor;
            workshops[idx].schedule = schedule;
            workshops[idx].location = location;
            workshops[idx].image = image;
            workshops[idx].description = description;
            workshops[idx].subDescription = subDescription;
            workshops[idx].ctaText = ctaText;
            workshops[idx].ctaLink = ctaLink;
        }
    }

    await TLP_DB.saveWorkshops(workshops);
    if (submitBtn) submitBtn.textContent = originalText;
    renderWorkshopsTable();
    closeWorkshopModal();
    alert(`Workshop "${title}" saved and synced successfully!`);
}

async function deleteWorkshop(wsId) {
    const workshops = TLP_DB.getWorkshops();
    const idx = workshops.findIndex((w, i) => w.id === wsId || String(i) === String(wsId));
    if (idx === -1) return;

    if (confirm(`Are you sure you want to delete "${workshops[idx].title}"?`)) {
        workshops.splice(idx, 1);
        await TLP_DB.saveWorkshops(workshops);
        renderWorkshopsTable();
        alert("Workshop removed.");
    }
}

/* ==========================================================================
   TAB 4: MEET THE TEAM CRUD OPERATIONS
   ========================================================================== */
function renderTeamTable() {
    const tableBody = document.getElementById("team-table-body");
    if (!tableBody) return;
    const team = TLP_DB.getTeam();
    tableBody.innerHTML = "";

    team.forEach((member, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src="${member.image}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 50%;" alt="${member.name}" onerror="this.src='assets/images/image06.png'">
            </td>
            <td style="font-weight: 600;">${member.name}</td>
            <td style="color: var(--primary);">${member.role}</td>
            <td style="font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-muted);">
                ${member.bio}
            </td>
            <td>
                <div class="action-btns-group">
                    <button type="button" class="action-icon-btn edit" onclick="openTeamModal('edit', ${index})">Edit</button>
                    <button type="button" class="action-icon-btn delete" onclick="deleteTeamMember(${index})">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openTeamModal(mode, index = null) {
    const overlay = document.getElementById("team-modal-overlay");
    const form = overlay.querySelector("form");
    const titleEl = document.getElementById("team-modal-action-title");
    
    form.reset();
    document.getElementById("team-form-mode").value = mode;
    document.getElementById("team-form-index").value = index !== null ? index : '';

    if (mode === "create") {
        titleEl.textContent = "Add Team Member";
        document.getElementById("team-image").value = "assets/images/image02.jpg";
        renderImagePreview("team-image-preview", "team-image", "assets/images/image02.jpg", "Default Headshot");
    } else if (mode === "edit" && index !== null) {
        titleEl.textContent = "Edit Team Member";
        const team = TLP_DB.getTeam();
        const member = team[index];
        
        if (member) {
            document.getElementById("team-name").value = member.name || '';
            document.getElementById("team-role").value = member.role || '';
            document.getElementById("team-image").value = member.image || '';
            document.getElementById("team-bio").value = member.bio || '';
            
            if (member.image) {
                renderImagePreview("team-image-preview", "team-image", member.image, member.image.startsWith("data:") ? "Uploaded Headshot" : (member.name + " Headshot"));
            } else {
                renderImagePreview("team-image-preview", "team-image", "");
            }
        }
    }

    overlay.classList.add("open");
}

function closeTeamModal() {
    document.getElementById("team-modal-overlay").classList.remove("open");
}

async function handleTeamSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById("save-team-btn");
    const originalBtnText = submitBtn ? submitBtn.textContent : "Save Team Member";
    if (submitBtn) submitBtn.textContent = "Saving & Syncing...";
    
    const mode = document.getElementById("team-form-mode").value;
    const index = document.getElementById("team-form-index").value;
    
    const name = document.getElementById("team-name").value;
    const role = document.getElementById("team-role").value;
    const image = document.getElementById("team-image").value;
    const bio = document.getElementById("team-bio").value;

    const team = TLP_DB.getTeam();

    if (mode === "create") {
        team.push({ name, role, image, bio });
    } else if (mode === "edit" && index !== '') {
        const idx = parseInt(index, 10);
        if (team[idx]) {
            team[idx] = { name, role, image, bio };
        }
    }

    await TLP_DB.saveTeam(team);
    if (submitBtn) submitBtn.textContent = originalBtnText;
    renderTeamTable();
    closeTeamModal();
    alert(`Team member "${name}" saved and synced successfully!`);
}

async function deleteTeamMember(index) {
    const team = TLP_DB.getTeam();
    const member = team[index];
    if (!member) return;

    if (confirm(`Are you sure you want to remove "${member.name}" from the team?`)) {
        team.splice(index, 1);
        await TLP_DB.saveTeam(team);
        renderTeamTable();
        alert(`"${member.name}" has been removed.`);
    }
}

/* ==========================================================================
   TAB 5: ABOUT PAGE CONTENT CMS
   ========================================================================== */
function loadAboutContentForm() {
    if (!TLP_DB.getAboutContent) return;
    const about = TLP_DB.getAboutContent();
    if (!about) return;

    document.getElementById("about-hero-sub-input").value = about.heroSubtitle || '';
    document.getElementById("about-mission-heading-input").value = about.missionHeading || '';
    document.getElementById("about-mission-p1-input").value = about.missionP1 || '';
    document.getElementById("about-mission-p2-input").value = about.missionP2 || '';
    document.getElementById("about-mission-p3-input").value = about.missionP3 || '';
    document.getElementById("about-mission-p4-input").value = about.missionP4 || '';
    document.getElementById("about-vision-quote-input").value = about.visionQuote || '';
    document.getElementById("about-vision-attr-input").value = about.visionQuoteAttribution || '';
    document.getElementById("about-community-statement-input").value = about.communityStatement || '';
    document.getElementById("about-video-heading-input").value = about.videoVisionHeading || '';
    document.getElementById("about-video-text-input").value = about.videoVisionText || '';
}

async function saveAboutContentForm(event) {
    event.preventDefault();
    const btn = document.getElementById("save-about-btn");
    const originalText = btn ? btn.textContent : "Save & Sync About Page";
    if (btn) btn.textContent = "Saving & Syncing...";

    const about = {
        heroSubtitle: document.getElementById("about-hero-sub-input").value,
        missionHeading: document.getElementById("about-mission-heading-input").value,
        missionP1: document.getElementById("about-mission-p1-input").value,
        missionP2: document.getElementById("about-mission-p2-input").value,
        missionP3: document.getElementById("about-mission-p3-input").value,
        missionP4: document.getElementById("about-mission-p4-input").value,
        visionQuote: document.getElementById("about-vision-quote-input").value,
        visionQuoteAttribution: document.getElementById("about-vision-attr-input").value,
        communityStatement: document.getElementById("about-community-statement-input").value,
        videoVisionHeading: document.getElementById("about-video-heading-input").value,
        videoVisionText: document.getElementById("about-video-text-input").value
    };

    await TLP_DB.saveAboutContent(about);
    if (btn) btn.textContent = originalText;
    alert("About page content saved and synced successfully to the live website!");
}
