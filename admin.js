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
   TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, type = 'info', duration = 4000) {
    let container = document.getElementById("admin-toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "admin-toast-container";
        container.className = "admin-toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `admin-toast ${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "❌";
    if (type === "warning") icon = "⚠️";

    toast.innerHTML = `
        <span style="font-size: 1.1rem; flex-shrink: 0;">${icon}</span>
        <div style="flex-grow: 1; font-size: 0.88rem; line-height: 1.4;">${message}</div>
        <button type="button" style="background: none; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 0.2rem;" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => toast.remove(), 350);
    }, duration);
}

/* ==========================================================================
   IMAGE UPLOAD, COMPRESSION & PREVIEW HELPERS
   ========================================================================== */

/**
 * Compresses an image file client-side using an HTML5 Canvas to high-efficiency JPEG.
 * Returns a Promise that resolves to an optimized base64 Data URL (typically 30KB–90KB).
 */
function compressImageFile(file, maxWidth = 1200, quality = 0.75) {
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

                // Fill background with dark tone for transparent PNGs
                ctx.fillStyle = "#06070a";
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                // Standardize to image/jpeg for strong compression and broad browser support
                let currentQuality = quality;
                let dataUrl = canvas.toDataURL("image/jpeg", currentQuality);

                // If dataUrl exceeds 300KB, scale quality down further to guarantee light payloads
                if (dataUrl.length > 350000) {
                    currentQuality = 0.65;
                    dataUrl = canvas.toDataURL("image/jpeg", currentQuality);
                }

                const sizeKb = Math.round((dataUrl.length * 0.75) / 1024);
                resolve({ dataUrl, width, height, originalName: file.name, sizeKb });
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

        renderImagePreview(previewId, inputId, result.dataUrl, result.originalName, `${result.width}×${result.height} (${result.sizeKb} KB)`, callback);

        if (callback && typeof callback === "function") {
            callback();
        }
        showToast(`Image "${result.originalName}" compressed successfully (${result.sizeKb} KB).`, 'success', 3000);
    } catch (err) {
        showToast("Image upload error: " + err.message, 'error');
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
    if (btn) {
        btn.disabled = true;
        btn.textContent = "Saving & Syncing to Live Site...";
    }
    
    try {
        const settings = {
            title: document.getElementById("site-title").value.trim(),
            announcement: document.getElementById("site-announcement").value.trim() || "",
            email: document.getElementById("site-email").value.trim(),
            phone: document.getElementById("site-phone").value.trim(),
            registration: document.getElementById("site-registration").value.trim(),
            address: document.getElementById("site-address").value.trim()
        };

        const result = await TLP_DB.saveSettings(settings);
        
        if (result && result.cloud) {
            showToast("Site settings saved & synced to live website!", 'success');
        } else {
            showToast("Site settings saved locally in browser.", 'info');
        }
        
        // Toggle announcement banner visibility instantly
        const banner = document.querySelector(".announcement-banner");
        const bannerEl = document.querySelector(".announcement-banner p");
        if (banner && bannerEl) {
            if (!settings.announcement || settings.announcement.trim() === "" || settings.announcement.toUpperCase() === "NONE") {
                banner.style.display = "none";
                document.body.classList.remove("has-announcement");
                document.documentElement.style.setProperty("--banner-height", "0px");
            } else {
                banner.style.display = "flex";
                if (settings.announcement.includes("<") && settings.announcement.includes(">")) {
                    bannerEl.innerHTML = settings.announcement;
                } else {
                    bannerEl.textContent = settings.announcement;
                }
                document.body.classList.add("has-announcement");
                setTimeout(() => {
                    const bannerHeight = banner.offsetHeight;
                    document.documentElement.style.setProperty("--banner-height", `${bannerHeight}px`);
                }, 50);
            }
        }
    } catch (err) {
        console.error("Save settings error:", err);
        showToast("Failed to save settings: " + err.message, 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
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

    productions.forEach((play, idx) => {
        let badgeText = "Upcoming";
        let badgeColor = "background: var(--accent-red); color: #ffffff;";
        if (play.status === "past") {
            badgeText = "Archive (Past)";
            badgeColor = "background: rgba(255,255,255,0.12); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.15);";
        } else if (play.status === "current") {
            badgeText = "Current Season";
            badgeColor = "background: #5c3ce6; color: #ffffff;";
        }

        const row = document.createElement("tr");
        row.className = "is-draggable";
        row.setAttribute("draggable", "true");
        row.setAttribute("data-id", play.id);
        row.setAttribute("data-index", idx);
        
        row.innerHTML = `
            <td class="drag-handle-cell">
                <div class="drag-handle-wrap">
                    <span class="order-number-badge">${idx + 1}</span>
                    <span class="drag-grip-icon" title="Drag to reorder play">⠿</span>
                    <div class="reorder-btns-col">
                        <button type="button" class="reorder-btn up" title="Move Up" ${idx === 0 ? 'disabled' : ''} onclick="movePlayOrder('${play.id}', -1)">▲</button>
                        <button type="button" class="reorder-btn down" title="Move Down" ${idx === productions.length - 1 ? 'disabled' : ''} onclick="movePlayOrder('${play.id}', 1)">▼</button>
                    </div>
                </div>
            </td>
            <td style="font-weight: 600;">${play.title}</td>
            <td>${play.author} <br><span style="font-size: 0.8rem; color: var(--text-muted);">Dir: ${play.director || 'N/A'}</span></td>
            <td>${play.year}</td>
            <td><span class="status-badge" style="${badgeColor}">${badgeText}</span></td>
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

    setupPlaysTableDragAndDrop();
}

/**
 * Update numerical badges (#1, #2, #3...) and disabled button states in the table without re-rendering
 */
function updatePlaysTableOrderUI() {
    const tableBody = document.getElementById("plays-table-body");
    if (!tableBody) return;

    const rows = Array.from(tableBody.querySelectorAll("tr.is-draggable"));
    rows.forEach((row, idx) => {
        row.setAttribute("data-index", idx);
        
        const badge = row.querySelector(".order-number-badge");
        if (badge) badge.textContent = `${idx + 1}`;

        const playId = row.getAttribute("data-id");
        const upBtn = row.querySelector(".reorder-btn.up");
        const downBtn = row.querySelector(".reorder-btn.down");
        
        if (upBtn) {
            upBtn.disabled = (idx === 0);
            upBtn.setAttribute("onclick", `movePlayOrder('${playId}', -1)`);
        }
        if (downBtn) {
            downBtn.disabled = (idx === rows.length - 1);
            downBtn.setAttribute("onclick", `movePlayOrder('${playId}', 1)`);
        }
    });
}

/**
 * Move play up or down by 1 position and sync live
 */
async function movePlayOrder(playId, direction) {
    const tableBody = document.getElementById("plays-table-body");
    const productions = TLP_DB.getProductions();
    const idx = productions.findIndex(p => p.id === playId);
    if (idx === -1) return;

    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= productions.length) return;

    const [movedPlay] = productions.splice(idx, 1);
    productions.splice(newIdx, 0, movedPlay);

    renderPlaysTable();

    // Pulse highlight the moved row
    if (tableBody) {
        const movedRow = tableBody.querySelector(`tr[data-id="${playId}"]`);
        if (movedRow) {
            movedRow.classList.add("row-moved-flash");
            setTimeout(() => movedRow.classList.remove("row-moved-flash"), 1200);
        }
    }

    try {
        const res = await TLP_DB.saveProductions(productions);
        if (res && res.cloud) {
            showToast(`Order updated: "${movedPlay.title}" (Position #${newIdx + 1}) synced to live website!`, 'success');
        } else if (res && res.error) {
            showToast(`Order updated locally. Cloud notice: ${res.error}`, 'info');
        } else {
            showToast(`Order updated: "${movedPlay.title}" moved ${direction < 0 ? 'up' : 'down'}.`, 'success');
        }
    } catch (err) {
        showToast("Error updating order: " + err.message, 'error');
    }
}

/**
 * Helper to calculate which row comes directly after the current drag position (clientY)
 */
function getDragAfterRow(container, y) {
    const draggableElements = [...container.querySelectorAll("tr.is-draggable:not(.is-dragging)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/**
 * HTML5 Real-Time Drag and Drop Handlers for Plays Table
 */
function setupPlaysTableDragAndDrop() {
    const tableBody = document.getElementById("plays-table-body");
    if (!tableBody) return;

    let draggingRow = null;

    tableBody.querySelectorAll("tr.is-draggable").forEach(row => {
        row.addEventListener("dragstart", (e) => {
            draggingRow = row;
            row.classList.add("is-dragging");
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", row.getAttribute("data-id"));
        });

        row.addEventListener("dragend", async () => {
            if (!draggingRow) return;
            const movedRow = draggingRow;
            draggingRow.classList.remove("is-dragging");
            draggingRow = null;

            // Extract new order from the live DOM structure
            const rows = Array.from(tableBody.querySelectorAll("tr.is-draggable"));
            const newOrderedIds = rows.map(r => r.getAttribute("data-id"));

            // Check if order actually changed
            const currentProds = TLP_DB.getProductions();
            const currentIds = currentProds.map(p => p.id);
            const isDifferent = newOrderedIds.some((id, i) => id !== currentIds[i]);

            // Update order UI badges (#1, #2...) and buttons immediately
            updatePlaysTableOrderUI();

            if (isDifferent) {
                const reordered = newOrderedIds.map(id => currentProds.find(p => p.id === id)).filter(Boolean);
                
                movedRow.classList.add("row-moved-flash");
                setTimeout(() => movedRow.classList.remove("row-moved-flash"), 1200);

                try {
                    const res = await TLP_DB.saveProductions(reordered);
                    if (res && res.cloud) {
                        showToast(`Plays reordered and synced to live website!`, 'success');
                    } else if (res && res.error) {
                        showToast(`Plays reordered locally. Cloud notice: ${res.error}`, 'info');
                    } else {
                        showToast(`Plays reordered successfully!`, 'success');
                    }
                } catch (err) {
                    showToast("Failed to save reordered plays: " + err.message, 'error');
                }
            }
        });
    });

    tableBody.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        
        const dragging = tableBody.querySelector("tr.is-dragging");
        if (!dragging) return;

        const afterElement = getDragAfterRow(tableBody, e.clientY);
        if (afterElement == null) {
            tableBody.appendChild(dragging);
        } else if (afterElement !== dragging) {
            tableBody.insertBefore(dragging, afterElement);
        }
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
        const allMedia = [];
        venues.forEach(v => {
            if (v.images && Array.isArray(v.images)) {
                v.images.forEach(img => {
                    if (img && img.trim()) allMedia.push(img.trim());
                });
            }
        });
        if (allMedia.length > 0) {
            if (gallerySection) gallerySection.style.display = "block";
            galleryContainer.innerHTML = allMedia.map(p => {
                const isVid = typeof isVideoMedia === 'function' ? isVideoMedia(p) : (p.includes("youtube") || p.includes("youtu.be") || p.includes("vimeo") || p.endsWith(".mp4") || p.startsWith("data:video/"));
                if (isVid) {
                    let thumb = 'assets/images/image06.png';
                    const ytMatch = p.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
                    if (ytMatch) thumb = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
                    return `
                        <div style="position: relative; display: inline-block; width: 48px; height: 36px; border-radius: 4px; overflow: hidden; background: #000; border: 1px solid rgba(255,255,255,0.15);">
                            <img src="${thumb}" style="width: 100%; height: 100%; object-fit: cover;" alt="Video" onerror="this.src='assets/images/image06.png'">
                            <span style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.35); font-size: 0.65rem; color: #dfb75c;">▶</span>
                        </div>
                    `;
                }
                return `<img src="${p}" class="mock-gallery-thumb" alt="Production Photo" onerror="this.src='assets/images/image06.png'">`;
            }).join('');
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
        document.getElementById("play-video").value = "";
        document.getElementById("play-video-poster").value = "";
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
            document.getElementById("play-video").value = play.video || '';
            document.getElementById("play-video-poster").value = play.videoPoster || '';
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
    handlePlayVideoInput();
    overlay.classList.add("open");
}

function closePlayModal() {
    document.getElementById("play-modal-overlay").classList.remove("open");
    const previewPlayer = document.getElementById("play-video-preview-player");
    if (previewPlayer) previewPlayer.innerHTML = "";
}

function handlePlayVideoInput() {
    const videoInput = document.getElementById("play-video");
    const posterInput = document.getElementById("play-video-poster");
    const previewBox = document.getElementById("play-video-preview-box");
    const previewPlayer = document.getElementById("play-video-preview-player");
    if (!videoInput || !previewBox || !previewPlayer) return;

    const val = videoInput.value.trim();
    const posterVal = posterInput ? posterInput.value.trim() : '';

    if (val) {
        previewBox.style.display = "block";
        if (typeof renderUniversalVideoPlayer === "function") {
            renderUniversalVideoPlayer(previewPlayer, val, posterVal);
        } else {
            previewPlayer.innerHTML = `<video src="${val}" controls style="width: 100%; height: 100%;"></video>`;
        }
    } else {
        previewBox.style.display = "none";
        previewPlayer.innerHTML = "";
    }
    updatePlayLivePreview();
}

async function handleShowreelFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const videoInput = document.getElementById("play-video");
    if (!videoInput) return;
    await handleVideoFileUpload(file, videoInput, handlePlayVideoInput);
    event.target.value = "";
}

async function handleShowreelPosterUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
        const posterInput = document.getElementById("play-video-poster");
        const result = await compressImageFile(file, 1200, 0.75);
        if (posterInput) posterInput.value = result.dataUrl;
        handlePlayVideoInput();
        showToast("Video poster uploaded!", "success");
    } catch (e) {
        showToast("Poster upload failed: " + e.message, "error");
    }
    event.target.value = "";
}

async function handleVideoFileUpload(file, targetInput, callback) {
    if (!file) return;
    const maxMb = 10;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    if (file.size > maxMb * 1024 * 1024) {
        alert(`This video file is ${sizeMb}MB.\n\nTo ensure your website loads fast on all mobile phones and desktop connections, videos larger than 10MB should be uploaded to YouTube or Vimeo, and then you can simply paste the link here.\n\nTip: You can set the video to 'Unlisted' on YouTube if you want it private!`);
        return;
    }
    showToast(`Loading video clip (${sizeMb}MB)...`, 'info');
    const reader = new FileReader();
    reader.onload = (e) => {
        targetInput.value = e.target.result;
        if (typeof callback === 'function') callback();
        updatePlayLivePreview();
        showToast(`Video loaded (${sizeMb}MB)!`, 'success');
    };
    reader.onerror = () => {
        showToast("Failed to read video file.", "error");
    };
    reader.readAsDataURL(file);
}

async function handlePlaySubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById("save-play-btn");
    const originalBtnText = submitBtn ? submitBtn.textContent : "Save Production";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving & Syncing to Live Site...";
    }
    
    try {
        const mode = document.getElementById("play-form-mode").value;
        const playId = document.getElementById("play-form-id").value;
        
        const title = document.getElementById("play-title").value.trim();
        const author = document.getElementById("play-author").value.trim();
        const director = document.getElementById("play-director").value.trim();
        const year = document.getElementById("play-year").value.trim();
        const status = document.getElementById("play-status").value;
        const accent = document.getElementById("play-accent").value;
        const animation = document.getElementById("play-animation").value;
        const image = document.getElementById("play-image").value.trim();
        const video = document.getElementById("play-video")?.value.trim() || '';
        const videoPoster = document.getElementById("play-video-poster")?.value.trim() || '';
        const cast = document.getElementById("play-cast").value.trim();
        const set = document.getElementById("play-set").value.trim();
        const synopsis = document.getElementById("play-synopsis").value.trim();

        const pageType = document.getElementById("play-page-type").value;
        const prodType = document.getElementById("play-prod-type").value;
        const isStudio = prodType === "studio";
        const showInHero = document.getElementById("play-show-hero").checked;
        const detailsLink = document.getElementById("play-details-link").value.trim();
        
        const venues = getVenuesData();
        const productions = TLP_DB.getProductions();

        if (mode === "create") {
            const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            
            if (productions.some(p => p.id === newId)) {
                showToast(`A production with the ID "${newId}" already exists. Please adjust the title.`, 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
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
                video,
                videoPoster,
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
                // Delete legacy customStatus/customTag so the Schedule Status takes precedence
                delete productions[playIdx].customStatus;
                delete productions[playIdx].customTag;
                productions[playIdx].accent = accent;
                productions[playIdx].animationType = animation;
                productions[playIdx].image = image;
                productions[playIdx].banner = image;
                productions[playIdx].video = video;
                productions[playIdx].videoPoster = videoPoster;
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

        const result = await TLP_DB.saveProductions(productions);
        renderPlaysTable();
        closePlayModal();

        if (result && result.cloud) {
            showToast(`Production "${title}" saved and synced live to website!`, 'success');
        } else if (result && result.error) {
            showToast(`Saved in browser. Cloud sync notice: ${result.error}`, 'error', 7000);
        } else {
            showToast(`Production "${title}" saved.`, 'info');
        }
    } catch (err) {
        console.error("Save production error:", err);
        showToast("Error saving production: " + err.message, 'error', 6000);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }
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
        
        <!-- Images & Videos Sub-Section -->
        <div style="margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div>
                    <label style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.15rem; display: block;">📸 Production Gallery (Photos & Videos)</label>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">Add scenic photos or YouTube/Vimeo/MP4 video clips for this production's gallery.</span>
                </div>
                <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
                    <input type="file" id="batch-file-${venueId}" multiple accept="image/*" style="display: none;" onchange="handleBatchVenuePhotoUpload(event, '${venueId}')">
                    <button type="button" class="btn btn-primary" style="padding: 0.35rem 0.7rem; font-size: 0.72rem;" onclick="document.getElementById('batch-file-${venueId}').click()">📁 Upload Photos</button>
                    <button type="button" class="btn btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.72rem; color: #dfb75c; border-color: rgba(223,183,92,0.4);" onclick="addVenueVideoInput('${venueId}')">🎬 Add Video</button>
                    <button type="button" class="btn btn-outline" style="padding: 0.35rem 0.55rem; font-size: 0.72rem;" onclick="addVenueImageInput('${venueId}')">+ Add Photo URL</button>
                </div>
            </div>
            <div class="venue-images-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
                <!-- Image & Video inputs -->
            </div>
        </div>

        <!-- Reviews Sub-Section -->
        <div style="margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <label style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0;">Critical Review Quotes</label>
                <button type="button" class="btn btn-outline" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;" onclick="addVenueReviewInput('${venueId}')">+ Add Review Quote</button>
            </div>
            <div class="venue-reviews-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <!-- Review blocks -->
            </div>
        </div>
    `;
    
    container.appendChild(card);
    
    // Add existing images and videos
    images.forEach(imgUrl => addVenueImageInput(venueId, imgUrl));
    
    // Add existing reviews
    reviews.forEach(rev => addVenueReviewInput(venueId, rev));
}

async function handleBatchVenuePhotoUpload(event, venueId) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    showToast(`Compressing & optimizing ${files.length} photo${files.length > 1 ? 's' : ''}...`, 'info');

    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
        try {
            const result = await compressImageFile(files[i], 1000, 0.72);
            addVenueImageInput(venueId, result.dataUrl);
            successCount++;
        } catch (err) {
            console.error("Batch upload failed for", files[i].name, err);
        }
    }

    event.target.value = "";
    updatePlayLivePreview();
    showToast(`Successfully added ${successCount} photo${successCount > 1 ? 's' : ''}!`, 'success');
}

function addVenueImageInput(venueId, value = '') {
    addVenueMediaInput(venueId, value, false);
}

function addVenueVideoInput(venueId, value = '') {
    addVenueMediaInput(venueId, value, true);
}

function addVenueMediaInput(venueId, value = '', isVideoExplicit = false) {
    const venueCard = document.getElementById(venueId);
    if (!venueCard) return;
    const imagesList = venueCard.querySelector(".venue-images-list");
    const inputId = 'media-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const fileId = 'file-' + inputId;
    const isVid = isVideoExplicit || (value && typeof isVideoMedia === 'function' && isVideoMedia(value));
    
    const wrapper = document.createElement("div");
    wrapper.id = inputId;
    wrapper.className = "venue-media-item";
    wrapper.setAttribute("data-media-type", isVid ? "video" : "image");
    wrapper.style.display = "flex";
    wrapper.style.gap = "0.5rem";
    wrapper.style.alignItems = "center";
    wrapper.style.background = isVid ? "rgba(223,183,92,0.03)" : "transparent";
    wrapper.style.padding = "0.25rem 0.4rem";
    wrapper.style.borderRadius = "4px";
    
    let ytThumb = '';
    if (isVid && value) {
        const ytMatch = value.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
        if (ytMatch) ytThumb = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }

    const placeholder = isVid ? "Paste YouTube link, Vimeo, or MP4 URL..." : "e.g. photo.jpg or https://...";
    const uploadBtnHtml = isVid 
        ? `<button type="button" class="btn btn-outline" style="padding: 0.5rem 0.75rem; font-size: 0.75rem; white-space: nowrap; color: #dfb75c; border-color: rgba(223,183,92,0.4);" onclick="document.getElementById('${fileId}').click()">📁 Upload Video</button>`
        : `<button type="button" class="btn btn-outline" style="padding: 0.5rem 0.75rem; font-size: 0.75rem; white-space: nowrap;" onclick="document.getElementById('${fileId}').click()">📁 Upload</button>`;

    const acceptType = isVid ? "video/mp4,video/webm" : "image/*";
    const uploadHandler = isVid ? `handleVenueVideoUpload(event, '${inputId}')` : `handleVenuePhotoUpload(event, '${inputId}')`;

    wrapper.innerHTML = `
        <div class="venue-video-badge" style="width: 36px; height: 36px; border-radius: 4px; background: #141824; border: 1px solid rgba(223,183,92,0.3); display: ${isVid ? 'flex' : 'none'}; align-items: center; justify-content: center; flex-shrink: 0; color: #dfb75c; font-size: 0.85rem; overflow: hidden;">
            ${ytThumb ? `<img src="${ytThumb}" style="width: 100%; height: 100%; object-fit: cover;">` : `🎬`}
        </div>
        <img src="${(!isVid && value) ? value : 'assets/images/image06.png'}" class="venue-photo-thumb" style="width: 36px; height: 36px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); flex-shrink: 0; background: #000; ${(value && !isVid) ? '' : 'display: none;'}" alt="Thumb" onerror="this.src='assets/images/image06.png'">
        <input type="text" class="admin-control venue-image-url" value="${value.replace(/"/g, '&quot;')}" placeholder="${placeholder}" style="flex-grow: 1;" required oninput="handleVenueUrlInput('${inputId}')">
        <input type="file" id="${fileId}" accept="${acceptType}" style="display: none;" onchange="${uploadHandler}">
        ${uploadBtnHtml}
        <button type="button" class="action-icon-btn delete" style="padding: 0.55rem 0.75rem;" onclick="document.getElementById('${inputId}').remove(); updatePlayLivePreview();">×</button>
    `;
    imagesList.appendChild(wrapper);
}

function handleVenueUrlInput(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    const input = wrapper.querySelector(".venue-image-url");
    const val = input ? input.value.trim() : '';
    const isVid = typeof isVideoMedia === 'function' ? isVideoMedia(val) : false;
    
    const photoThumb = wrapper.querySelector(".venue-photo-thumb");
    const videoBadge = wrapper.querySelector(".venue-video-badge");
    
    if (isVid) {
        let ytThumb = '';
        const ytMatch = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
        if (ytMatch) ytThumb = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
        if (photoThumb) photoThumb.style.display = "none";
        if (videoBadge) {
            videoBadge.style.display = "flex";
            videoBadge.innerHTML = ytThumb ? `<img src="${ytThumb}" style="width: 100%; height: 100%; object-fit: cover;">` : `🎬`;
        }
    } else {
        if (videoBadge) videoBadge.style.display = "none";
        if (photoThumb) {
            if (val) {
                photoThumb.src = val;
                photoThumb.style.display = "block";
            } else {
                photoThumb.style.display = "none";
            }
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

async function handleVenueVideoUpload(event, wrapperId) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    const input = wrapper.querySelector(".venue-image-url");
    if (!input) return;
    await handleVideoFileUpload(file, input, () => handleVenueUrlInput(wrapperId));
    event.target.value = "";
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
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving & Syncing...";
    }

    try {
        const mode = document.getElementById("workshop-form-mode").value;
        const wsId = document.getElementById("workshop-form-id").value;

        const title = document.getElementById("workshop-title").value.trim();
        const category = document.getElementById("workshop-category").value.trim();
        const instructor = document.getElementById("workshop-instructor").value.trim();
        const schedule = document.getElementById("workshop-schedule").value.trim();
        const location = document.getElementById("workshop-location").value.trim();
        const image = document.getElementById("workshop-image").value.trim();
        const description = document.getElementById("workshop-desc").value.trim();
        const subDescription = document.getElementById("workshop-sub-desc").value.trim();
        const ctaText = document.getElementById("workshop-cta-text").value.trim();
        const ctaLink = document.getElementById("workshop-cta-link").value.trim();

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

        const result = await TLP_DB.saveWorkshops(workshops);
        renderWorkshopsTable();
        closeWorkshopModal();

        if (result && result.cloud) {
            showToast(`Workshop "${title}" saved and synced to live website!`, 'success');
        } else {
            showToast(`Workshop "${title}" saved locally in browser.`, 'info');
        }
    } catch (err) {
        console.error("Save workshop error:", err);
        showToast("Error saving workshop: " + err.message, 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

async function deleteWorkshop(wsId) {
    const workshops = TLP_DB.getWorkshops();
    const idx = workshops.findIndex((w, i) => w.id === wsId || String(i) === String(wsId));
    if (idx === -1) return;

    if (confirm(`Are you sure you want to delete "${workshops[idx].title}"?`)) {
        const title = workshops[idx].title;
        workshops.splice(idx, 1);
        await TLP_DB.saveWorkshops(workshops);
        renderWorkshopsTable();
        showToast(`Workshop "${title}" removed.`, 'info');
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
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving & Syncing...";
    }
    
    try {
        const mode = document.getElementById("team-form-mode").value;
        const index = document.getElementById("team-form-index").value;
        
        const name = document.getElementById("team-name").value.trim();
        const role = document.getElementById("team-role").value.trim();
        const image = document.getElementById("team-image").value.trim();
        const bio = document.getElementById("team-bio").value.trim();

        const team = TLP_DB.getTeam();

        if (mode === "create") {
            team.push({ name, role, image, bio });
        } else if (mode === "edit" && index !== '') {
            const idx = parseInt(index, 10);
            if (team[idx]) {
                team[idx] = { name, role, image, bio };
            }
        }

        const result = await TLP_DB.saveTeam(team);
        renderTeamTable();
        closeTeamModal();

        if (result && result.cloud) {
            showToast(`Team member "${name}" saved and synced to live website!`, 'success');
        } else {
            showToast(`Team member "${name}" saved locally in browser.`, 'info');
        }
    } catch (err) {
        console.error("Save team error:", err);
        showToast("Error saving team member: " + err.message, 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }
}

async function deleteTeamMember(index) {
    const team = TLP_DB.getTeam();
    const member = team[index];
    if (!member) return;

    if (confirm(`Are you sure you want to remove "${member.name}" from the team?`)) {
        const name = member.name;
        team.splice(index, 1);
        await TLP_DB.saveTeam(team);
        renderTeamTable();
        showToast(`"${name}" removed from team.`, 'info');
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
    document.getElementById("about-video-url-input").value = about.videoVisionUrl || '';
    document.getElementById("about-video-poster-input").value = about.videoVisionPoster || '';
}

async function saveAboutContentForm(event) {
    event.preventDefault();
    const btn = document.getElementById("save-about-btn");
    const originalText = btn ? btn.textContent : "Save & Sync About Page";
    if (btn) {
        btn.disabled = true;
        btn.textContent = "Saving & Syncing...";
    }

    try {
        const about = {
            heroSubtitle: document.getElementById("about-hero-sub-input").value.trim(),
            missionHeading: document.getElementById("about-mission-heading-input").value.trim(),
            missionP1: document.getElementById("about-mission-p1-input").value.trim(),
            missionP2: document.getElementById("about-mission-p2-input").value.trim(),
            missionP3: document.getElementById("about-mission-p3-input").value.trim(),
            missionP4: document.getElementById("about-mission-p4-input").value.trim(),
            visionQuote: document.getElementById("about-vision-quote-input").value.trim(),
            visionQuoteAttribution: document.getElementById("about-vision-attr-input").value.trim(),
            communityStatement: document.getElementById("about-community-statement-input").value.trim(),
            videoVisionHeading: document.getElementById("about-video-heading-input").value.trim(),
            videoVisionText: document.getElementById("about-video-text-input").value.trim(),
            videoVisionUrl: document.getElementById("about-video-url-input").value.trim(),
            videoVisionPoster: document.getElementById("about-video-poster-input").value.trim()
        };

        const result = await TLP_DB.saveAboutContent(about);
        
        if (result && result.cloud) {
            showToast("About page content saved & synced to live website!", 'success');
        } else {
            showToast("About page content saved locally in browser.", 'info');
        }
    } catch (err) {
        console.error("Save about error:", err);
        showToast("Error saving about content: " + err.message, 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }
}
