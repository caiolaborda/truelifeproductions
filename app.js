/* ==========================================================================
   TRUE LIFE PRODUCTIONS - HOMEPAGE & HERO ROTATION LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Load active productions from local storage database
    const productions = TLP_DB.getProductions();
    
    // Filter plays based on showInHero flag (toggled via admin)
    const heroSlidesData = productions.filter(p => p.showInHero === true || p.showInHero === "true");
    
    // Fallback to all if none match
    const slidesData = heroSlidesData.length > 0 ? heroSlidesData : productions;
    
    // 2. Render Hero Slider elements dynamically
    const sliderContainer = document.getElementById("hero-slider");
    const dotsContainer = document.getElementById("hero-dots");
    
    if (sliderContainer && dotsContainer) {
        sliderContainer.innerHTML = "";
        dotsContainer.innerHTML = "";
        
        slidesData.forEach((slide, idx) => {
            // Slide Item
            const slideItem = document.createElement("div");
            slideItem.className = `hero-slide ${idx === 0 ? 'active' : ''}`;
            slideItem.setAttribute("data-animation", slide.animationType || "none");
            slideItem.setAttribute("data-accent", slide.accent || "#dfb75c");
            
            // Build the tag text depending on studio/full production
            const tagText = slide.isStudio ? "TLP STUDIO PRODUCTION" : "FULL TLP PRODUCTION";
            const tagStyle = slide.isStudio 
                ? "background: #dfb75c; border: 1px solid #dfb75c; color: #06070a; font-weight: 800;"
                : "background: #8f1b2c; border: 1px solid #8f1b2c; color: #ffffff; font-weight: 800;";
            
            // Map production ID to custom detail page URLs
            let detailLink = `play-${slide.id}.html?id=${slide.id}`;

            // Dynamic Booking Link (goes to ticketing website if setup, otherwise falls back to booking inquiry)
            let ticketLink = slide.detailsLink || "#";
            if (ticketLink === "#" || !ticketLink.startsWith("http")) {
                ticketLink = `contact.html?subject=Booking Inquiry for ${encodeURIComponent(slide.title)}`;
            }

            // Extract primary venue name and dates for upcoming plays display
            let venueInfo = "";
            if (slide.venues && slide.venues.length > 0) {
                const venue = slide.venues[0];
                venueInfo = `
                    <p class="slide-venue-info" style="font-family: var(--font-heading); font-size: 0.95rem; color: #ffffff; font-weight: 600; margin-bottom: 1.5rem; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">
                        <span>📍 ${venue.name}</span>
                        <span style="color: var(--primary);">|</span>
                        <span>📅 ${venue.dates}</span>
                    </p>
                `;
            }

            slideItem.innerHTML = `
                <div class="hero-bg-image" style="background-image: linear-gradient(180deg, rgba(6, 7, 10, 0.4) 0%, rgba(6, 7, 10, 0.95) 100%), url('${slide.image}');"></div>
                <div class="container hero-content-wrapper">
                    <div class="hero-text-content">
                        <span class="slide-tag" style="${tagStyle}">${tagText}</span>
                        <h1 class="slide-title">${slide.title}</h1>
                        <p class="slide-author">By ${slide.author} ${slide.director ? `| Directed by ${slide.director}` : ''}</p>
                        ${venueInfo}
                        <p class="slide-synopsis">${slide.synopsis}</p>
                        <div class="hero-actions">
                            <a href="${ticketLink}" class="btn btn-primary" style="box-shadow: 0 4px 15px ${slide.accent}55;" ${ticketLink.startsWith("http") ? 'target="_blank"' : ''}>Book Tickets</a>
                            <a href="${detailLink}" class="btn btn-outline">Explore Production</a>
                        </div>
                    </div>
                </div>
            `;
            sliderContainer.appendChild(slideItem);
            
            // Dot Item
            const dot = document.createElement("button");
            dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
            dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
            dot.addEventListener("click", () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });
    }

    // 3. Slider Navigation Controls
    let currentSlide = 0;
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".slider-dot");
    let slideInterval;
    const intervalTime = 8000; // 8 seconds per slide
    const canvasEl = document.getElementById("hero-effect-canvas");

    function updateSlider() {
        slides.forEach((slide, idx) => {
            if (idx === currentSlide) {
                slide.classList.add("active");
                dots[idx].classList.add("active");
                
                // Trigger canvas effect update
                const animType = slide.getAttribute("data-animation");
                const accentColor = slide.getAttribute("data-accent");
                if (window.stageEffects) {
                    window.stageEffects.setEffect(animType, accentColor);
                }
            } else {
                slide.classList.remove("active");
                dots[idx].classList.remove("active");
            }
        });
    }

    function transitionToSlide(index) {
        if (canvasEl) {
            canvasEl.style.opacity = "0";
            setTimeout(() => {
                currentSlide = index;
                updateSlider();
                setTimeout(() => {
                    if (canvasEl) canvasEl.style.opacity = "1";
                }, 50);
            }, 600);
        } else {
            currentSlide = index;
            updateSlider();
        }
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        transitionToSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        transitionToSlide(prevIndex);
    }

    function goToSlide(index) {
        transitionToSlide(index);
        resetTimer();
    }

    function startTimer() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }

    const prevBtn = document.querySelector(".hero-nav-btn.prev");
    const nextBtn = document.querySelector(".hero-nav-btn.next");

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            resetTimer();
        });
        nextBtn.addEventListener("click", () => {
            nextSlide();
            resetTimer();
        });
    }

    // Start auto-slide if we have more than 1 slide
    if (slides.length > 1) {
        startTimer();
    }

    // 4. Stage Effects Canvas Manager
    class StageEffectsCanvas {
        constructor() {
            this.canvas = document.getElementById("hero-effect-canvas");
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext("2d");
            this.particles = [];
            this.animationFrameId = null;
            this.effectType = "none";
            this.accentColor = "#dfb75c";

            this.resize();
            window.addEventListener("resize", () => this.resize());
            this.loop();
        }

        resize() {
            this.width = this.canvas.width = this.canvas.offsetWidth;
            this.height = this.canvas.height = this.canvas.offsetHeight;
            this.initParticles();
        }

        setEffect(type, accent) {
            this.effectType = type;
            this.accentColor = accent;
            this.initParticles();
        }

        initParticles() {
            this.particles = [];
            
            if (this.effectType === "rose-petals") {
                // Falling rose petals (snow-like)
                const count = Math.min(60, Math.floor(this.width / 20));
                for (let i = 0; i < count; i++) {
                    this.particles.push({
                        x: Math.random() * this.width,
                        y: Math.random() * -this.height,
                        r: Math.random() * 6 + 4, // Petal size radius
                        d: Math.random() * 2 + 1, // Density
                        color: Math.random() > 0.5 ? "#a81e32" : "#f4f5f6", // Crimson vs. White rose
                        angle: Math.random() * 360,
                        spin: Math.random() * 0.02 - 0.01,
                        swing: Math.random() * 2 + 1,
                        swingSpeed: Math.random() * 0.02 + 0.005
                    });
                }
            } else if (this.effectType === "misty-fog") {
                // Slow drifting moody spotlight fog clouds
                const count = 12;
                for (let i = 0; i < count; i++) {
                    this.particles.push({
                        x: Math.random() * this.width,
                        y: Math.random() * this.height,
                        r: Math.random() * 150 + 100, // Large cloud radius
                        vx: Math.random() * 0.2 - 0.1,
                        vy: Math.random() * 0.1 - 0.05,
                        opacity: Math.random() * 0.08 + 0.02
                    });
                }
            } else if (this.effectType === "digital-particles") {
                // Connecting tech lines for Continuity(7)
                const count = Math.min(80, Math.floor(this.width / 15));
                for (let i = 0; i < count; i++) {
                    this.particles.push({
                        x: Math.random() * this.width,
                        y: Math.random() * this.height,
                        vx: Math.random() * 0.4 - 0.2,
                        vy: Math.random() * -0.6 - 0.1,
                        r: Math.random() * 2 + 1
                    });
                }
            } else if (this.effectType === "dripping-rain") {
                // Falling rain drops/tears
                const count = Math.min(80, Math.floor(this.width / 12));
                for (let i = 0; i < count; i++) {
                    this.particles.push({
                        x: Math.random() * this.width,
                        y: Math.random() * -this.height,
                        length: Math.random() * 20 + 10,
                        vy: Math.random() * 4 + 3,
                        vx: Math.random() * 0.2 - 0.1,
                        opacity: Math.random() * 0.35 + 0.1
                    });
                }
            } else if (this.effectType === "royal-embers") {
                // Rising fire embers/candle sparks
                const count = Math.min(50, Math.floor(this.width / 25));
                for (let i = 0; i < count; i++) {
                    this.particles.push({
                        x: Math.random() * this.width,
                        y: Math.random() * this.height + this.height,
                        r: Math.random() * 2 + 1.5,
                        vy: Math.random() * -1 - 0.5,
                        vx: Math.random() * 0.4 - 0.2,
                        opacity: Math.random() * 0.7 + 0.3,
                        decay: Math.random() * 0.005 + 0.002
                    });
                }
            }
        }

        loop() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.draw();
            this.animationFrameId = requestAnimationFrame(() => this.loop());
        }

        draw() {
            if (this.effectType === "rose-petals") {
                this.drawRosePetals();
            } else if (this.effectType === "misty-fog") {
                this.drawMistyFog();
            } else if (this.effectType === "digital-particles") {
                this.drawDigitalParticles();
            } else if (this.effectType === "dripping-rain") {
                this.drawDrippingRain();
            } else if (this.effectType === "royal-embers") {
                this.drawRoyalEmbers();
            }
        }

        drawRosePetals() {
            this.ctx.save();
            this.particles.forEach(p => {
                this.ctx.beginPath();
                this.ctx.fillStyle = p.color;
                
                // Falling physics
                p.y += (Math.cos(p.angle) + 1 + p.r / 6) * 0.8;
                p.x += Math.sin(p.angle) * p.swing;
                p.angle += p.swingSpeed;
                
                // Reset off-screen particles
                if (p.y > this.height || p.x < -20 || p.x > this.width + 20) {
                    p.x = Math.random() * this.width;
                    p.y = -20;
                    p.angle = Math.random() * 360;
                }

                // Draw organic petal path (curved leaf shape)
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.angle * Math.PI / 180);
                
                this.ctx.moveTo(0, -p.r);
                this.ctx.quadraticCurveTo(p.r * 1.2, -p.r * 0.2, 0, p.r);
                this.ctx.quadraticCurveTo(-p.r * 1.2, -p.r * 0.2, 0, -p.r);
                
                this.ctx.fill();
                this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
            });
            this.ctx.restore();
        }

        drawMistyFog() {
            this.particles.forEach(p => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off boundaries
                if (p.x - p.r > this.width) p.x = -p.r;
                if (p.x + p.r < 0) p.x = this.width + p.r;
                if (p.y - p.r > this.height) p.y = -p.r;
                if (p.y + p.r < 0) p.y = this.height + p.r;

                // Draw gradient fog radial
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                gradient.addColorStop(0, `rgba(32, 21, 71, ${p.opacity})`);
                gradient.addColorStop(0.5, `rgba(13, 14, 25, ${p.opacity * 0.4})`);
                gradient.addColorStop(1, 'rgba(6, 7, 10, 0)');

                this.ctx.beginPath();
                this.ctx.fillStyle = gradient;
                this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }

        drawDigitalParticles() {
            const maxDistance = 90;
            this.particles.forEach((p, idx) => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Reset when floating off top
                if (p.y < -10) {
                    p.y = this.height + 10;
                    p.x = Math.random() * this.width;
                }
                if (p.x < -10 || p.x > this.width + 10) {
                    p.x = Math.random() * this.width;
                }

                // Draw dot
                this.ctx.beginPath();
                this.ctx.fillStyle = this.accentColor;
                this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                this.ctx.fill();

                // Draw links between nearby particles
                for (let j = idx + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * 0.12;
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(223, 183, 92, ${alpha})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }
            });
        }

        drawDrippingRain() {
            this.ctx.save();
            this.particles.forEach(p => {
                // Update position
                p.y += p.vy;
                p.x += p.vx;

                // Reset when off bottom
                if (p.y > this.height) {
                    p.y = -20;
                    p.x = Math.random() * this.width;
                }

                // Draw raindrop line (dripping teardrops)
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p.x + p.vx, p.y + p.length);
                this.ctx.stroke();
            });
            this.ctx.restore();
        }

        drawRoyalEmbers() {
            this.ctx.save();
            this.particles.forEach(p => {
                // Update position
                p.y += p.vy;
                p.x += p.vx;
                p.opacity -= p.decay;

                // Reset when burned out or off-screen
                if (p.opacity <= 0 || p.y < -10 || p.x < -10 || p.x > this.width + 10) {
                    p.y = this.height + Math.random() * 20;
                    p.x = Math.random() * this.width;
                    p.opacity = Math.random() * 0.7 + 0.3;
                }

                // Draw glowing ember (historical dramatic candle glow)
                this.ctx.beginPath();
                this.ctx.fillStyle = `rgba(223, 150, 92, ${p.opacity})`; // Warm amber-gold
                this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = "rgba(223, 80, 40, 0.8)";
                this.ctx.fill();
            });
            this.ctx.restore();
        }
    }

    // Initialize the canvas effects
    window.stageEffects = new StageEffectsCanvas();
    
    // Set initial slide effect
    if (slides.length > 0) {
        const firstSlideAnim = slides[0].getAttribute("data-animation");
        const firstSlideAccent = slides[0].getAttribute("data-accent");
        window.stageEffects.setEffect(firstSlideAnim, firstSlideAccent);
    }
});
