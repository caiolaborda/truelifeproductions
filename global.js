/* ==========================================================================
   TRUE LIFE PRODUCTIONS - GLOBAL INTERACTION & DATABASE PORTAL
   ========================================================================== */

// Default Local Storage Database Seeding
const DEFAULT_SITE_SETTINGS = {
    title: "True Life Productions",
    email: "hello@truelifeproductions.co.uk",
    phone: "01763 241000",
    registration: "Company number 16139873",
    address: "Royston, Hertfordshire",
    announcement: ""
};

const DEFAULT_PRODUCTIONS = [
    {
        id: "poison",
        title: "Poison",
        author: "Lot Vekemans",
        director: "Rosina Piovani",
        translator: "Rina Vergamo",
        cast: "Martin Maynard, Lynne Livingstone",
        setDesign: "Suzanne Emerson",
        year: "2026",
        status: "past",
        synopsis: "A marriage destroyed by grief. A former husband and wife are reunited to protect the memory of their lost child. Lot Vekemans’ play is raw and emotionally intense and asks a simple question: is it possible to move on? Martin Maynard and Lynne Livingstone star in this compelling story, directed by Rosina Piovani. True Life Productions brings 'Poison' to the stage hoping to create space for collective reflection, honesty, opening and healing.",
        image: "assets/images/play-poison-banner.jpg",
        banner: "assets/images/play-poison-banner.jpg",
        accent: "#201547", // Stage Shadows
        animationType: "misty-fog",
        detailsLink: "play-poison.html",
        video: "assets/videos/video02.mp4",
        videoPoster: "assets/videos/video02_poster.jpg",
        showInHero: false,
        isStudio: false,
        pageType: "post-prod",
        venues: [
            {
                name: "Cockpit Theatre, London",
                dates: "20-23rd May 2026",
                reviews: [
                    { quote: "The subtle evocation of Michelangelo’s Pietà in Suzanne Emerson’s austerely beautiful set... Superbly acted, brilliantly cast and well directed by Rosina Piovani...", reviewer: "Simon Ward, The PEG" },
                    { quote: "An emotionally charged, beautifully written and acted, two-hander about almost unbearable loss... both this and their first production - 'Continuity' - unquestionably deliver on TLP's mission statement.", reviewer: "Marcus Pollett, Critic" }
                ],
                images: [
                    "assets/images/slideshow09-6fe044e6.jpg",
                    "assets/images/slideshow09-dbdd7f54.jpg",
                    "assets/images/slideshow09-2b93c9d0.jpg",
                    "assets/images/slideshow09-b300bcbb.jpg",
                    "assets/images/slideshow09-2d150125.jpg"
                ]
            },
            {
                name: "Cambridge Junction",
                dates: "10-12th April 2026",
                reviews: [
                    { quote: "The production really gets under your skin. Maynard and Livingstone both gave spell-binding performances. I found myself holding my breath at several points during the show. Rosina Piovani’s excellent direction contrasted highly charged scenes with tender moments.", reviewer: "Alex Elbro, Critic" },
                    { quote: "A beautifully directed production of a play dealing with a very emotive subject. Superb acting. An extremely moving piece of theatre.", reviewer: "Julie Petrucci, Reviewer" },
                    { quote: "A masterclass in contrasting grief. Maynard’s performance is outstanding both subtle and real. Livingstone’s portrayal is visceral.", reviewer: "Davinia Fisher, Critic" }
                ],
                images: [
                    "assets/images/slideshow10-f9fd2fe8.jpg",
                    "assets/images/slideshow10-889995c0.jpg",
                    "assets/images/slideshow10-ba5ca97d.jpg",
                    "assets/images/slideshow10-ac95135b.jpg",
                    "assets/images/slideshow10-3b9ff0fc.jpg"
                ]
            }
        ]
    },
    {
        id: "continuity",
        title: "Continuity (7)",
        author: "David Sear",
        director: "Rosina Piovani",
        cast: "Christian Burton, Martin Maynard, Guy, Catherine Watson, Geraldine Hindley, Iain Mahony",
        year: "2025",
        status: "past",
        synopsis: "A satirical and darkly comic tale about humanity’s yearning for immortality – and what happens when technology and vast wealth manipulate the very essence of what makes us human. In a world where the pace of change is unprecedented and our ability to adapt to that change is struggling to evolve, Continuity asks the existential questions: 'What is the value of my continued existence? And, can I get a better phone?'",
        image: "assets/images/play-continuity-banner.jpg",
        banner: "assets/images/play-continuity-banner.jpg",
        accent: "#dfb75c", // Gold accent
        animationType: "digital-particles",
        detailsLink: "play-continuity.html",
        video: "assets/videos/video05.mp4",
        videoPoster: "assets/videos/video05_poster.jpg",
        showInHero: false,
        isStudio: false,
        pageType: "post-prod",
        venues: [
            {
                name: "London Cockpit Theatre",
                dates: "Summer 2025",
                reviews: [
                    { quote: "An intriguing and challenging work.", reviewer: "Simon Ward, The PEG" },
                    { quote: "The piece raises challenging ethical questions.", reviewer: "John Cutler, The Reviews Hub" },
                    { quote: "The core storyline was genuinely intriguing.", reviewer: "Natasha U'Ren-Ashdown, The Light Review London" }
                ],
                images: [
                    "assets/images/slideshow01-cc6cbc8a.jpg",
                    "assets/images/slideshow01-3e484db6.jpg",
                    "assets/images/slideshow01-bde4fe49.jpg",
                    "assets/images/slideshow01-961690ad.jpg",
                    "assets/images/slideshow01-145aefd7.jpg",
                    "assets/images/slideshow01-7df2b8d9.jpg",
                    "assets/images/slideshow06-733ddeef.jpg",
                    "assets/images/slideshow06-d611dc74.jpg",
                    "assets/images/slideshow06-b3497b77.jpg",
                    "assets/images/slideshow06-5ab44eba.jpg",
                    "assets/images/slideshow06-648b19f2.jpg",
                    "assets/images/slideshow06-a2372805.jpg",
                    "assets/images/slideshow06-4ca86362.jpg",
                    "assets/images/slideshow06-623ac5b7.jpg"
                ]
            },
            {
                name: "Mumford Theatre, Cambridge",
                dates: "Autumn 2025",
                reviews: [
                    { quote: "Christian Burton is excellent as the tech bro – arrogant, cunning, but ultimately evil.", reviewer: "Mike Levy, Cambridge Critique" },
                    { quote: "Maynard carries the show, bombarded by the opinions of the others on his choices and having to navigate the severe and bizarre consequences of them.", reviewer: "Poppy Saunders, East Midland Theatre Reviews" },
                    { quote: "The play was everything you wanted from a piece of theatre; thought-provoking, challenging, and emotional in places.", reviewer: "Alex Elbro, Cambridge Radio" }
                ],
                images: [
                    "assets/images/slideshow02-c9152598.jpg",
                    "assets/images/slideshow02-429eab47.jpg",
                    "assets/images/slideshow02-1bf5ac4a.jpg",
                    "assets/images/slideshow02-d1e02e44.jpg",
                    "assets/images/slideshow02-010ffba6.jpg",
                    "assets/images/slideshow02-803b0d32.jpg",
                    "assets/images/slideshow02-d6558de4.jpg",
                    "assets/images/slideshow04-733ddeef.jpg",
                    "assets/images/slideshow04-d611dc74.jpg",
                    "assets/images/slideshow04-b3497b77.jpg",
                    "assets/images/slideshow04-5ab44eba.jpg",
                    "assets/images/slideshow04-648b19f2.jpg",
                    "assets/images/slideshow04-a2372805.jpg",
                    "assets/images/slideshow04-4ca86362.jpg",
                    "assets/images/slideshow04-623ac5b7.jpg"
                ]
            }
        ]
    },
    {
        id: "how-to-cry",
        title: "How to Cry in a House Full of Children",
        author: "Victoria Vera",
        director: "Victoria Vera",
        cast: "Carolina Piñeyro Duarte",
        setDesign: "Playwright & Director: Victoria Vera<br>Performer & Choreographer: Carolina Piñeyro Duarte<br>Local UK Producer: Rosina Piovani (True Life Productions)<br>Stage Design: Malena Paz<br>Assistant Director: Valeria de Souza<br>Audiovisual: María Victoria Parada<br>Graphic Design: Natalia Vera<br>Sound Design: Romina Peluffo & Gonzalo Silva<br>Audio Description: Graciana Albertoni",
        year: "November 2026",
        status: "upcoming",
        synopsis: "A raw and poetic exploration of motherhood, this one-night-only performance arrives in the UK directly from a hugely successful run in Uruguay. A haunting, unfiltered portrait of motherhood, identity, and the invisible storms we carry. Through memory and confession, the play confronts the invisible labour of parenting, the relentless pressure to be everything to everyone, and the longing to be truly seen.",
        image: "play-how-to-cry.jpg",
        banner: "play-how-to-cry.jpg",
        accent: "#8f1b2c", // Crimson red
        animationType: "dripping-rain",
        detailsLink: "#",
        showInHero: true,
        isStudio: false,
        pageType: "pre-prod",
        venues: [
            {
                name: "The Space Theatre, London",
                dates: "6th November 2026 (Voila! Theatre Festival by The Cockpit)",
                reviews: [],
                images: ["play-how-to-cry.jpg"]
            }
        ]
    },
    {
        id: "mary-stuart",
        title: "Mary Stuart",
        author: "John Drinkwater",
        director: "Rosina Piovani",
        setDesign: "Adapted and directed by Rosina Piovani (True Life Productions)<br>Produced by Dan Lentell (49Knights)",
        year: "October 2026",
        status: "upcoming",
        synopsis: "True Life Productions, in collaboration with 49Knights, presents a compelling new adaptation of John Drinkwater's classic historical drama. This 60-minute live radio drama (performed before an audience) brings fresh life and a contemporary perspective to a classic. It's a powerful character study exploring the tensions between love, power, and destiny through Mary Stuart's relationships with David Riccio, Lord Darnley, and the Earl of Bothwell.",
        image: "play-mary.jpg",
        banner: "play-mary.jpg",
        accent: "#6c5b7b", // Royal Purple
        animationType: "royal-embers",
        detailsLink: "https://www.ticketsource.co.uk/",
        showInHero: true,
        isStudio: false,
        pageType: "pre-prod",
        venues: [
            {
                name: "Peterborough Cathedral",
                dates: "October 2026",
                reviews: [],
                images: ["play-mary.jpg"]
            }
        ]
    },
    {
        id: "19-6",
        title: "19/6",
        author: "David Sear",
        director: "David Sear",
        cast: "Rosemary Eason, Peter Simmons, Asher Guy, Reece Bond, Chris Hay, Craig Allen",
        setDesign: "Playwright & Director: David Sear<br>Stage Management: Rosina Piovani<br>Lighting: Leah Ward",
        year: "September 2026",
        status: "upcoming",
        synopsis: "Set in 1968, the story follows Mick, an undercover English detective facing a secret army of Welsh nationalists as Wales prepares for a new Prince. Decades later in 2019, Mick and his wife reflect on the turbulent choices that changed their destiny. Presented as a Studio at TLP production for the Cambridge Festival of Drama.",
        image: "play-19-6.jpg",
        banner: "play-19-6.jpg",
        accent: "#dfb75c", // Gold / Studio accent
        animationType: "digital-particles",
        detailsLink: "https://www.adctheatre.co.uk/",
        showInHero: true,
        isStudio: true,
        pageType: "pre-prod",
        venues: [
            {
                name: "ADC Theatre, Cambridge",
                dates: "26th September 2026 (Cambridge Festival of Drama)",
                reviews: [],
                images: ["play-19-6.jpg"]
            }
        ]
    },
    {
        id: "ernest",
        title: "The Importance of Being Earnest",
        author: "Oscar Wilde",
        director: "David Sear",
        setDesign: "Playwright: Oscar Wilde<br>Director: David Sear",
        year: "December 2026",
        status: "upcoming",
        synopsis: "Oscar Wilde’s brilliant comedy of manners hilariously exposes the calamitous consequences of not being entirely earnest. Jack and Algy invent fake friends and brothers to avoid being sensible, only to both fall in love—what could possibly go wrong? Studio at TLP brings David Sear’s delightful take on this social satire as a special Christmas fundraiser.",
        image: "play-ernest.jpg",
        banner: "play-ernest.jpg",
        accent: "#dfb75c", // Gold / Studio accent
        animationType: "rose-petals",
        detailsLink: "#",
        showInHero: true,
        isStudio: true,
        pageType: "pre-prod",
        venues: [
            {
                name: "The Great Hall at The Leys",
                dates: "17th–20th December 2026 (Christmas Fundraiser)",
                reviews: [],
                images: ["play-ernest.jpg"]
            }
        ]
    }
];

const DEFAULT_TEAM = [
    {
        name: "Rosina Piovani",
        role: "Artistic Director",
        image: "assets/images/image02.jpg",
        bio: "Rosina Piovani (1982) is a theatre director, actor and producer. She holds a Bsc. in Drama from the Escuela Multidisciplinaria de Arte Dramatico Margarita Xirgu, from her native Uruguay and has been working in theatre professionally and semi-professionally since 2007. Working with TLP she directed Continuity(7) in 2025 (TLP's debut) and directed Poison in 2026. Rosina is also the lead of teaching at TLP, running all the school workshops."
    },
    {
        name: "Martin Maynard",
        role: "Co-Founder & Actor",
        image: "assets/images/image21.jpg",
        bio: "After studying acting at The Royal Central School of Speech and Drama, Martin worked in Stage, TV, Film and Radio - notably in Peter Kosminsky’s BAFTA winning 'The Government Inspector'. In 2024 Martin co-founded True Life Productions. He also leads the Cambridge Meisner Studio to pass on acting knowledge to the next generation."
    },
    {
        name: "Suzanne Emerson",
        role: "Set Designer",
        image: "assets/images/image17.jpg",
        bio: "Suzanne graduated from the Royal School of Speech and Drama in Stage Design. Recent designs include Hadestown and Jesus Christ Superstar (ADC, Cambridge), Bonnie and Clyde, Guys and Dolls, and Press at the Park Theatre London. She designed the set for TLP's acclaimed production of Poison."
    }
];

// Database operations class
class DatabasePortal {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem("tlp_settings")) {
            localStorage.setItem("tlp_settings", JSON.stringify(DEFAULT_SITE_SETTINGS));
        }
        
        // Force database reset/migration using database versioning to prevent outdated structures
        const CURRENT_DB_VERSION = "2.6";
        const storedDbVersion = localStorage.getItem("tlp_db_version");
        
        if (storedDbVersion !== CURRENT_DB_VERSION || !localStorage.getItem("tlp_productions")) {
            localStorage.setItem("tlp_productions", JSON.stringify(DEFAULT_PRODUCTIONS));
            localStorage.setItem("tlp_team", JSON.stringify(DEFAULT_TEAM));
            localStorage.setItem("tlp_settings", JSON.stringify(DEFAULT_SITE_SETTINGS));
            localStorage.setItem("tlp_db_version", CURRENT_DB_VERSION);
        }

        if (!localStorage.getItem("tlp_team")) {
            localStorage.setItem("tlp_team", JSON.stringify(DEFAULT_TEAM));
        }
    }

    getSettings() {
        return JSON.parse(localStorage.getItem("tlp_settings"));
    }

    saveSettings(settings) {
        localStorage.setItem("tlp_settings", JSON.stringify(settings));
    }

    getProductions() {
        return JSON.parse(localStorage.getItem("tlp_productions"));
    }

    saveProductions(productions) {
        localStorage.setItem("tlp_productions", JSON.stringify(productions));
    }

    getTeam() {
        return JSON.parse(localStorage.getItem("tlp_team"));
    }

    saveTeam(team) {
        localStorage.setItem("tlp_team", JSON.stringify(team));
    }
}

// Global DB instance
const TLP_DB = new DatabasePortal();

// Setup UI Interaction on Page Load
document.addEventListener("DOMContentLoaded", () => {
    // 0. Inject Theatrical FX: Curtains (only on session initial start) and Mouse Spotlight
    const isInitialStart = !sessionStorage.getItem("tlp_curtains_played");
    if (isInitialStart) {
        injectTheatricalFX();
        sessionStorage.setItem("tlp_curtains_played", "true");
    }
    setupPageTransitionLinkInterceptors();
    setupMouseSpotlight();

    // 1. Update site metadata from DB
    const settings = TLP_DB.getSettings();
    
    // Update announcement banner and adjust header layout to prevent overlaps
    const banner = document.querySelector(".announcement-banner");
    const announcementEl = document.querySelector(".announcement-banner p");
    if (banner && announcementEl) {
        if (!settings.announcement || settings.announcement.trim() === "" || settings.announcement.toUpperCase() === "NONE") {
            banner.style.display = "none";
            document.body.classList.remove("has-announcement");
            document.documentElement.style.setProperty("--banner-height", "0px");
        } else {
            banner.style.display = "block";
            announcementEl.textContent = settings.announcement;
            document.body.classList.add("has-announcement");
            // Set dynamic CSS variable for the banner height
            setTimeout(() => {
                const bannerHeight = banner.offsetHeight;
                document.documentElement.style.setProperty("--banner-height", `${bannerHeight}px`);
            }, 50);
        }
    }

    // Dynamic phone/email injection for footers or links
    document.querySelectorAll(".meta-email").forEach(el => {
        el.textContent = settings.email;
        if (el.tagName === "A") el.href = `mailto:${settings.email}`;
    });
    document.querySelectorAll(".meta-phone").forEach(el => {
        el.textContent = settings.phone;
        if (el.tagName === "A") el.href = `tel:${settings.phone.replace(/\s+/g, '')}`;
    });
    document.querySelectorAll(".meta-address").forEach(el => {
        el.textContent = `${settings.address}, ${settings.registration}`;
    });

    // 2. Navigation Scroll Effect
    const header = document.querySelector("header.global-header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
        // Set scrolled class on reload if already page is down
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        }
    }

    // 3. Mobile Navigation Burger Menu
    const navToggle = document.querySelector(".mobile-nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("open");
            navMenu.classList.toggle("open");
            document.body.classList.toggle("nav-active"); // block body scrolling
        });

        // Close menu on nav link click
        navMenu.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("open");
                navMenu.classList.remove("open");
                document.body.classList.remove("nav-active");
            });
        });
    }

    // 4. Set Active Navigation Link based on current URL path
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(link => {
        const linkPath = link.getAttribute("href");
        if (linkPath === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // 5. Scroll Reveal Intersection Observer
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    revealObserver.unobserve(entry.target); // Animates only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 6. Back to Top Button
    const backToTopBtn = document.querySelector(".back-to-top");
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});

/* ==========================================================================
   DYNAMIC STAGE EFFECTS MODULES (INJECTION & INTERCEPTORS)
   ========================================================================== */

function injectTheatricalFX() {
    // Curtains Overlay
    const curtains = document.createElement("div");
    curtains.className = "theater-curtains-wrapper";
    curtains.id = "page-curtains";
    curtains.innerHTML = `
        <div class="curtain-panel left"></div>
        <div class="curtain-panel right"></div>
    `;
    document.body.prepend(curtains);

    // Mouse Spotlight Overlay
    const spotlight = document.createElement("div");
    spotlight.className = "mouse-spotlight";
    spotlight.id = "mouse-spotlight";
    document.body.appendChild(spotlight);

    // Slide curtains open after layout settles
    setTimeout(() => {
        curtains.classList.add("reveal-stage");
    }, 150);
}

function setupPageTransitionLinkInterceptors() {
    // Disabled at user request to navigate immediately, curtains only slide open on initial page load.
}

function setupMouseSpotlight() {
    if (window.innerWidth > 992) {
        window.addEventListener("mousemove", (e) => {
            document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
            document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
            
            if (!document.body.classList.contains("mouse-active")) {
                document.body.classList.add("mouse-active");
            }
        });
    }
}
