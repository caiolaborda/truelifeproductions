/* ==========================================================================
   TRUE LIFE PRODUCTIONS - GLOBAL INTERACTION & DATABASE PORTAL
   ========================================================================== */

// Default Local Storage Database Seeding
const DEFAULT_SITE_SETTINGS = {
    title: "True Life Productions",
    email: "hello@truelifeproductions.co.uk",
    phone: "",
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
        setDesign: "Suzanne Emerson (Set Design)",
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
        cast: "Christian Burton, Martin Maynard, Guy Asher, Catherine Watson, Geraldine Hindley, Iain Mahony, Michael Flintoff",
        setDesign: "Suzanne Emerson (Set Design)",
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
        synopsis: "A raw and poetic exploration of motherhood, this one-night-only performance arrives in the UK directly from a hugely successful run in Uruguay. A haunting, unfiltered portrait of motherhood, identity, and the invisible storms we carry. Through memory and confession, the play confronts the invisible labour of parenting, the relentless pressure to be everything to everyone, and the longing to be truly seen. True Life Productions brings this play from Uruguay to the London the Voila! Theatre Festival produced by The Cockpit.",
        image: "play-how-to-cry-v3.jpg",
        banner: "play-how-to-cry-v3.jpg",
        accent: "#8f1b2c", // Crimson red
        animationType: "dripping-rain",
        detailsLink: "https://space.org.uk/event/how-to-cry-in-a-house-full-of-children/",
        showInHero: true,
        isStudio: false,
        pageType: "pre-prod",
        mobileHeroAlign: "right",
        venues: [
            {
                name: "The Space Theatre, London",
                dates: "6th November 2026 (Voila! Theatre Festival by The Cockpit)",
                reviews: [],
                images: ["play-how-to-cry-v3.jpg"]
            }
        ]
    },
    {
        id: "mary-stuart",
        title: "Mary Stuart",
        author: "John Drinkwater",
        director: "Rosina Piovani",
        setDesign: "Adapted and directed by Rosina Piovani (True Life Productions)<br>Produced by Dan Lentell (49Knights)",
        year: "Soon on platforms",
        status: "upcoming",
        synopsis: "True Life Productions, in collaboration with 49Knights, presents a compelling new adaptation of John Drinkwater's classic historical drama. This 60-minute recorded production brings fresh life and a contemporary perspective to a classic. It's a powerful character study exploring the tensions between love, power, and destiny through Mary Stuart's relationships with David Riccio, Lord Darnley, and the Earl of Bothwell.",
        image: "play-mary.jpg",
        banner: "play-mary.jpg",
        accent: "#6c5b7b", // Royal Purple
        animationType: "royal-embers",
        detailsLink: "#",
        showInHero: true,
        isStudio: false,
        pageType: "pre-prod",
        mobileHeroAlign: "right",
        venues: [
            {
                name: "Digital & Streaming Platforms",
                dates: "Soon on platforms, stay tuned for more info",
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
        detailsLink: "https://www.adctheatre.com/whats-on/festival/cambridge-festival-of-drama-event-5/",
        showInHero: true,
        isStudio: true,
        pageType: "pre-prod",
        mobileHeroAlign: "right",
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
        setDesign: "",
        year: "December 2026",
        status: "upcoming",
        synopsis: "Oscar Wilde’s brilliant comedy of manners hilariously exposes the calamitous consequences of not being entirely earnest. Jack and Algy invent fake friends and brothers to avoid being sensible, only to both fall in love—what could possibly go wrong? Studio at TLP brings David Sear’s delightful take on this social satire as a special Christmas fundraiser.",
        image: "play-ernest.jpg",
        banner: "play-ernest.jpg",
        accent: "#dfb75c", // Gold / Studio accent
        animationType: "rose-petals",
        detailsLink: "https://www.ticketsource.com/true-life-productions-cic/the-importance-of-being-earnest/e-xmapgr",
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
        role: "Co-Founder & Artistic Director",
        image: "assets/images/image02.jpg",
        bio: "Rosina Piovani (1982) is a theatre director, actor and producer. She holds a Bsc. in Drama from the Escuela Multidisciplinaria de Arte Dramatico Margarita Xirgu, from her native Uruguay and has been working in theatre professionally and semi-professionally since 2007. Working with TLP she directed Continuity(7) in 2025 (TLP's debut) and directed Poison in 2026. Rosina is also the lead of teaching at TLP, running all the school workshops."
    },
    {
        name: "Martin Maynard",
        role: "Co-Founder & Artistic Director",
        image: "assets/images/image21.jpg",
        bio: "After studying acting at The Royal Central School of Speech and Drama, Martin worked in Stage, TV, Film and Radio - notably in Peter Kosminsky’s BAFTA winning 'The Government Inspector'. In 2024 Martin co-founded True Life Productions. He also leads the Cambridge Meisner Studio to pass on acting knowledge to the next generation."
    },
    {
        name: "David Sear",
        role: "Playwright & Director",
        image: "assets/images/david_sear.jpg",
        bio: "David is an English graduate who began writing during lockdown having had a successful career as a technology entrepreneur. His first play, The Medici Stars, won the Cambridge Festival of Drama in 2022, and his second, Horrox, was the lead production in the Cambridge Festival 2023, and was featured in The Guardian. Continuity(7) a dystopian parable about the power of billionaires, transferred in 2025 from Cambridge to The Cockpit in Marylebone for TLP. He is also an experienced director having recently directed Present Laughter, Rosencrantz and Guildenstern are Dead, Horrox, A Winter’s Tale and A Few Good Men all at the ADC Theatre."
    },
    {
        name: "Suzanne Emerson",
        role: "Set Designer",
        image: "assets/images/image17.jpg",
        bio: "Suzanne graduated from the Royal School of Speech and Drama in Stage Design. Recent designs include Hadestown and Jesus Christ Superstar (ADC, Cambridge), Bonnie and Clyde, Guys and Dolls, and Press at the Park Theatre London. She designed the set for TLP's acclaimed production of Poison."
    }
];

const DEFAULT_WORKSHOPS = [
    {
        id: "theatre-club",
        title: "Theatre Club (Ages 7–12)",
        category: "Youth Drama (Ages 7–12)",
        instructor: "TLP Artistic Directors",
        schedule: "Term-time Weekly Sessions",
        location: "Royston & South of England Community Hubs",
        description: "The theatre class for kids (7 to 12 years old) aims to introduce young children to the basics of theatre and dramatic arts through fun, engaging, and interactive activities. The class focuses on fostering creativity, teamwork, and self-expression while teaching essential theatre skills such as voice projection, movement, character development, and storytelling.",
        subDescription: "Led by TLP's Artistic Directors, it focuses on developing an understanding of basic theatre concepts, enhancing communication and social skills, encouraging creativity, and building confidence and teamwork abilities.",
        image: "assets/images/slideshow11-86368c53.jpg",
        slideshowImages: [
            "assets/images/slideshow11-86368c53.jpg",
            "assets/images/slideshow11-375e204f.jpg",
            "assets/images/slideshow11-afc6d71b.jpg",
            "assets/images/slideshow11-52fcbd8f.jpg",
            "assets/images/slideshow11-0e27f76a.jpg",
            "assets/images/slideshow11-7f0baa85.jpg",
            "assets/images/slideshow11-f6077cff.jpg",
            "assets/images/slideshow11-8a47bd98.jpg",
            "assets/images/slideshow11-3218de60.jpg",
            "assets/images/slideshow11-b7aad491.jpg",
            "assets/images/slideshow11-567ee6e2.jpg"
        ],
        ctaText: "Register Interest",
        ctaLink: "contact.html?subject=Theatre%20Club%20Enquiry",
        status: "active"
    }
];

const DEFAULT_ABOUT_CONTENT = {
    heroSubtitle: "Our history, our commitment as a Community Interest Company, and the team driving professional performances in the South of England.",
    missionHeading: "Our Mission & Core Purpose",
    missionP1: "Founded in 2024, True Life Productions (TLP) is a registered Community Interest Company (CIC) dedicated to creating bold, human theatre and telling honest, emotionally truthful stories that challenge, engage, and heal.",
    missionP2: "Founded following a chance coffee shop meeting between founders Rosina and Martin, TLP, based in the South of England, acts as a vital platform for promising artistic talent, enabling actors, writers, and designers to develop their craft, gain professional credits, and grow within the industry.",
    missionP3: "As a Community Interest Company, all our revenue is reinvested with the goal to link local theatrical community groups directly with professional spaces, particularly bridging opportunities to the London theatre world.",
    missionP4: "Alongside our professional productions, TLP Studio is our community-focused branch dedicated to nurturing local talent across the South of England and surrounding areas. TLP Studio is the heartbeat of our local theatre community — creating opportunities for emerging and amateur artists. Through productions, festivals and amateur competitions, TLP Studio provides opportunities for local talent to develop, collaborate and share their passion for performance — while remaining connected to the wider creative vision of True Life Productions.",
    visionQuote: "Aiming to link communities with performing arts, creating safe places for expression, building emotional connections, and celebrating local identities. We prioritize human connection and the search for truth in every actor's work.",
    visionQuoteAttribution: "True Life Productions CIC",
    communityStatement: "TLP is a registered Community Interest Company (CIC) committed to making theatre accessible to everyone. Every pound we earn is reinvested into our projects, supporting local talent development programmes, youth opportunities, and creating inclusive and bold theatre productions. By removing barriers to participation and performance, TLP helps nurture emerging artists and strengthen the cultural life of our communities. TLP Company reg.no. 16139873",
    videoVisionHeading: "Our Founding Vision",
    videoVisionText: "Watch co-founders Martin Maynard and Rosina Piovani share TLP's founding vision, establishing a dynamic platform that bridges emerging regional talent with professional opportunities on the London stage."
};

// Database operations class
class DatabasePortal {
    constructor() {
        this.init();
    }

    init() {
        try {
            if (!localStorage.getItem("tlp_settings")) {
                localStorage.setItem("tlp_settings", JSON.stringify(DEFAULT_SITE_SETTINGS));
            }
            
            // Force database reset/migration using database versioning to prevent outdated structures
            const CURRENT_DB_VERSION = "5.2";
            const storedDbVersion = localStorage.getItem("tlp_db_version");
            
            if (storedDbVersion !== CURRENT_DB_VERSION || !localStorage.getItem("tlp_productions")) {
                localStorage.setItem("tlp_productions", JSON.stringify(DEFAULT_PRODUCTIONS));
                localStorage.setItem("tlp_team", JSON.stringify(DEFAULT_TEAM));
                localStorage.setItem("tlp_workshops", JSON.stringify(DEFAULT_WORKSHOPS));
                localStorage.setItem("tlp_about", JSON.stringify(DEFAULT_ABOUT_CONTENT));
                localStorage.setItem("tlp_settings", JSON.stringify(DEFAULT_SITE_SETTINGS));
                localStorage.setItem("tlp_db_version", CURRENT_DB_VERSION);
            }

            if (!localStorage.getItem("tlp_team")) {
                localStorage.setItem("tlp_team", JSON.stringify(DEFAULT_TEAM));
            }
            if (!localStorage.getItem("tlp_workshops")) {
                localStorage.setItem("tlp_workshops", JSON.stringify(DEFAULT_WORKSHOPS));
            }
            if (!localStorage.getItem("tlp_about")) {
                localStorage.setItem("tlp_about", JSON.stringify(DEFAULT_ABOUT_CONTENT));
            }
        } catch (e) {
            console.warn("LocalStorage initialization warning (quota or cookies restricted):", e);
        }

        // Sync live updates from Netlify cloud storage in background
        this.syncFromCloud();
    }

    async syncFromCloud() {
        try {
            const res = await fetch("/.netlify/functions/admin-api?type=all");
            if (!res.ok) return;
            const data = await res.json();
            
            let hasChanges = false;
            try {
                if (data.settings && typeof data.settings === "object" && !Array.isArray(data.settings)) {
                    localStorage.setItem("tlp_settings", JSON.stringify(data.settings));
                    hasChanges = true;
                }
                if (data.productions && Array.isArray(data.productions) && data.productions.length > 0) {
                    localStorage.setItem("tlp_productions", JSON.stringify(data.productions));
                    hasChanges = true;
                }
                if (data.team && Array.isArray(data.team) && data.team.length > 0) {
                    localStorage.setItem("tlp_team", JSON.stringify(data.team));
                    hasChanges = true;
                }
                if (data.workshops && Array.isArray(data.workshops) && data.workshops.length > 0) {
                    localStorage.setItem("tlp_workshops", JSON.stringify(data.workshops));
                    hasChanges = true;
                }
                if (data.about && typeof data.about === "object" && !Array.isArray(data.about)) {
                    localStorage.setItem("tlp_about", JSON.stringify(data.about));
                    hasChanges = true;
                }
            } catch (quotaErr) {
                console.warn("LocalStorage cache limit reached during cloud sync:", quotaErr);
            }

            if (hasChanges) {
                window.dispatchEvent(new CustomEvent("tlp_data_synced", { detail: data }));
            }
        } catch (err) {
            console.debug("Cloud sync offline/local mode.");
        }
    }

    getSettings() {
        try {
            return JSON.parse(localStorage.getItem("tlp_settings")) || DEFAULT_SITE_SETTINGS;
        } catch(e) {
            return DEFAULT_SITE_SETTINGS;
        }
    }

    async saveSettings(settings) {
        try {
            localStorage.setItem("tlp_settings", JSON.stringify(settings));
        } catch(e) {
            console.warn("LocalStorage quota exceeded, proceeding with cloud sync:", e);
        }
        return await this.pushToCloud("settings", settings);
    }

    getProductions() {
        try {
            return JSON.parse(localStorage.getItem("tlp_productions")) || DEFAULT_PRODUCTIONS;
        } catch(e) {
            return DEFAULT_PRODUCTIONS;
        }
    }

    async saveProductions(productions) {
        try {
            localStorage.setItem("tlp_productions", JSON.stringify(productions));
        } catch(e) {
            console.warn("LocalStorage quota exceeded, proceeding with cloud sync:", e);
        }
        return await this.pushToCloud("productions", productions);
    }

    getTeam() {
        try {
            return JSON.parse(localStorage.getItem("tlp_team")) || DEFAULT_TEAM;
        } catch(e) {
            return DEFAULT_TEAM;
        }
    }

    async saveTeam(team) {
        try {
            localStorage.setItem("tlp_team", JSON.stringify(team));
        } catch(e) {
            console.warn("LocalStorage quota exceeded, proceeding with cloud sync:", e);
        }
        return await this.pushToCloud("team", team);
    }

    getWorkshops() {
        try {
            return JSON.parse(localStorage.getItem("tlp_workshops")) || DEFAULT_WORKSHOPS;
        } catch(e) {
            return DEFAULT_WORKSHOPS;
        }
    }

    async saveWorkshops(workshops) {
        try {
            localStorage.setItem("tlp_workshops", JSON.stringify(workshops));
        } catch(e) {
            console.warn("LocalStorage quota exceeded, proceeding with cloud sync:", e);
        }
        return await this.pushToCloud("workshops", workshops);
    }

    getAboutContent() {
        try {
            return JSON.parse(localStorage.getItem("tlp_about")) || DEFAULT_ABOUT_CONTENT;
        } catch(e) {
            return DEFAULT_ABOUT_CONTENT;
        }
    }

    async saveAboutContent(about) {
        try {
            localStorage.setItem("tlp_about", JSON.stringify(about));
        } catch(e) {
            console.warn("LocalStorage quota exceeded, proceeding with cloud sync:", e);
        }
        return await this.pushToCloud("about", about);
    }

    async pushToCloud(type, data) {
        try {
            const res = await fetch("/.netlify/functions/admin-api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    auth: "admin",
                    type: type,
                    data: data
                })
            });
            if (res.ok) {
                const result = await res.json();
                return { success: true, cloud: true, message: result.message };
            } else {
                const errData = await res.json().catch(() => ({}));
                console.error("Cloud push rejected by server:", res.status, errData);
                return { success: false, cloud: false, error: errData.error || `Server returned HTTP ${res.status}` };
            }
        } catch (err) {
            console.warn("Cloud sync offline or Netlify Functions unavailable:", err.message);
            return { success: true, cloud: false, offline: true, message: "Saved locally in browser." };
        }
    }
}

// Global DB instance
const TLP_DB = new DatabasePortal();

// Setup UI Interaction on Page Load
document.addEventListener("DOMContentLoaded", () => {
    // 0. Inject Theatrical FX: Mouse Spotlight
    injectTheatricalFX();
    setupPageTransitionLinkInterceptors();
    setupMouseSpotlight();

    // 1. Update site metadata & announcement banner from DB
    applySiteSettingsUI(TLP_DB.getSettings());

    // Listen for cloud sync event to live-update metadata
    window.addEventListener("tlp_data_synced", (e) => {
        if (e.detail && e.detail.settings) {
            applySiteSettingsUI(e.detail.settings);
        }
    });

    // Keep banner height synchronized on resize
    window.addEventListener("resize", () => {
        const banner = document.querySelector(".announcement-banner");
        if (banner && document.body.classList.contains("has-announcement") && banner.offsetHeight > 0) {
            document.documentElement.style.setProperty("--banner-height", `${banner.offsetHeight}px`);
        }
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
    // Mouse Spotlight Overlay
    const spotlight = document.createElement("div");
    spotlight.className = "mouse-spotlight";
    spotlight.id = "mouse-spotlight";
    document.body.appendChild(spotlight);
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

function applySiteSettingsUI(settings) {
    if (!settings) return;

    // Update announcement banner and adjust header layout to prevent overlaps
    const banner = document.querySelector(".announcement-banner");
    const announcementEl = document.querySelector(".announcement-banner p");
    if (banner && announcementEl) {
        const text = (settings.announcement || "").trim();
        if (!text || text.toUpperCase() === "NONE") {
            banner.style.display = "none";
            document.body.classList.remove("has-announcement");
            document.documentElement.style.setProperty("--banner-height", "0px");
        } else {
            banner.style.display = "flex";
            if (text.includes("<") && text.includes(">")) {
                announcementEl.innerHTML = text;
            } else {
                announcementEl.textContent = text;
            }
            document.body.classList.add("has-announcement");
            
            const syncHeight = () => {
                if (banner.offsetHeight > 0) {
                    document.documentElement.style.setProperty("--banner-height", `${banner.offsetHeight}px`);
                }
            };
            syncHeight();
            requestAnimationFrame(syncHeight);
            setTimeout(syncHeight, 60);
        }
    }

    // Dynamic phone/email injection for footers or links
    document.querySelectorAll(".meta-email").forEach(el => {
        if (settings.email) {
            el.textContent = settings.email;
            if (el.tagName === "A") el.href = `mailto:${settings.email}`;
        }
    });
    document.querySelectorAll(".meta-phone").forEach(el => {
        if (!settings.phone) {
            const parentLi = el.closest("li");
            const parentP = el.closest("p");
            if (parentLi) parentLi.style.display = "none";
            else if (parentP) parentP.style.display = "none";
            else el.style.display = "none";
        } else {
            el.textContent = settings.phone;
            if (el.tagName === "A") el.href = `tel:${settings.phone.replace(/\s+/g, '')}`;
            const parentLi = el.closest("li");
            const parentP = el.closest("p");
            if (parentLi) parentLi.style.display = "";
            else if (parentP) parentP.style.display = "";
            else el.style.display = "";
        }
    });
    document.querySelectorAll(".meta-address").forEach(el => {
        if (settings.address || settings.registration) {
            el.textContent = `${settings.address || ''}${settings.address && settings.registration ? ', ' : ''}${settings.registration || ''}`;
        }
    });
}

