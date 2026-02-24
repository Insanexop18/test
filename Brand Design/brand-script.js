/* ══════════════════════════════════════════════════════════════════════════
   SPARKFORGE — brand-script.js
   Brand & Design Service Page
══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── THEME TOGGLE ─────────────────────────────────────────────── */
    const html        = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon   = themeToggle ? themeToggle.querySelector('i') : null;

    const savedTheme = localStorage.getItem('sf-theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('sf-theme', next);
            updateThemeIcon(next);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }


    /* ─── NAVBAR SCROLL ────────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    });


    /* ─── HAMBURGER / MOBILE MENU ──────────────────────────────────── */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-open');
            mobileMenu.classList.toggle('is-open');
        });
        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                hamburger.classList.remove('is-open');
                mobileMenu.classList.remove('is-open');
            });
        });
    }


    /* ─── SMOOTH SCROLL ────────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });


    /* ─── SCROLL REVEAL ────────────────────────────────────────────── */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const siblings = Array.from(
                    entry.target.parentElement.querySelectorAll('[data-reveal]')
                );
                const idx   = siblings.indexOf(entry.target);
                const delay = idx * 80;
                setTimeout(() => entry.target.classList.add('revealed'), delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


    /* ─── COLOUR SWATCH HOVER ─────────────────────────────────────── */
    // Subtle lift animation on swatches on hover is handled by CSS,
    // but we add a tooltip showing the hex on click for UX.
    document.querySelectorAll('.brand-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            const hex = swatch.getAttribute('title');
            if (!hex) return;
            // Copy to clipboard if supported
            if (navigator.clipboard) {
                navigator.clipboard.writeText(hex).then(() => {
                    const original = swatch.querySelector('span').textContent;
                    swatch.querySelector('span').textContent = 'Copied!';
                    setTimeout(() => {
                        swatch.querySelector('span').textContent = original;
                    }, 1200);
                });
            }
        });
    });


    /* ─── FAQ ACCORDION ────────────────────────────────────────────── */
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-a');
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            document.querySelectorAll('.faq-q').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.closest('.faq-item').querySelector('.faq-a').classList.remove('is-open');
            });

            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                answer.classList.add('is-open');
            }
        });
    });


    /* ─── CHATBOT ──────────────────────────────────────────────────── */
    const chatToggle    = document.getElementById('chatToggle');
    const chatOpenIcon  = document.getElementById('chatOpenIcon');
    const chatCloseIcon = document.getElementById('chatCloseIcon');
    const chatBox       = document.getElementById('chatBox');
    const chatMessages  = document.getElementById('chatMessages');
    const chatInput     = document.getElementById('chatInput');
    const chatSend      = document.getElementById('chatSend');
    const chatQuick     = document.getElementById('chatQuick');

    let chatIsOpen = false;

    const responses = {
        greeting: ["Hey! 👋 I'm the SparkForge bot. Ask me anything about our Brand & Design service!"],
        include: [
            "Our Brand & Design service covers:\n\n✏️ Logo & identity design\n🎨 Colour systems\n🔤 Typography systems\n📖 Brand guidelines PDF\n🧩 Design systems (Figma)\n🖥️ UI/UX screen design\n📱 Responsive design\n🗂️ Brand collateral\n\nWant details on any of these?"
        ],
        files: [
            "You receive everything, fully organised:\n\n📁 Figma source files (editable forever)\n🖼️ SVG, PNG, EPS, PDF exports\n📄 Brand guidelines PDF\n💻 CSS design tokens\n🧩 Component library\n📋 Developer handoff specs\n\nYou own every file — no lock-in."
        ],
        cost: [
            "Brand & Design pricing:\n\n🌱 Identity: ₹15,000 — logo + basic assets\n🚀 Brand: ₹55,000 — full identity system\n🏢 Brand + UI: ₹1,50,000+ — brand + full UI/UX\n\nFor a precise quote: sparkforge2025@gmail.com"
        ],
        timeline: [
            "Brand project timelines:\n\n🌱 Identity: ~1 week\n🚀 Brand: 2–3 weeks\n🏢 Brand + UI: 4–8 weeks\n\nTimeline depends on revision rounds and content availability."
        ],
        logo: [
            "All logos start with 3 distinct concepts.\n\nEach concept shows a full brand direction — logo, colours, type — so you can make a real decision, not just pick a mark in isolation.\n\nWe then refine your chosen direction through 2 rounds of revisions."
        ],
        figma: [
            "Yes — all UI work is done in Figma.\n\nYou get the full source file with:\n• Auto-layout components\n• Colour & text styles\n• Interactive prototypes\n• Variants & states\n\nFully editable, forever yours."
        ],
        team: [
            "We're a team of 4:\n\n👨‍💼 Mann Gupta — Founder & CEO\n👨‍💻 Ramanuz Kashyap — Lead Developer\n🤖 Kushal Malviya — AI/ML Engineer\n🤖 Ashmeet Singh — AI/ML Engineer\n\nEveryone ships. No account managers here."
        ],
        start: [
            "Getting started is easy:\n\n1. Click 'Start a Project' above\n2. Fill out the contact form\n3. We reply within 24 hours\n4. Brand discovery → Concepts → Refine → Deliver\n\nOr email: sparkforge2025@gmail.com"
        ],
        contact: [
            "📧 sparkforge2025@gmail.com\n📞 +91 78359 24050\n📍 New Delhi, India\n\nWe usually reply the same day!"
        ],
        fallback: [
            "Good question! Reach us at sparkforge2025@gmail.com for specifics — or ask me about: Pricing, What's included, Deliverables, Figma, or How to start.",
            "I'm a simple bot 🤖 — for anything complex, ping sparkforge2025@gmail.com. I can answer: pricing, timeline, files/deliverables, or how to get started."
        ]
    };

    function getReply(msg) {
        const m = msg.toLowerCase();
        if (/\b(hi|hello|hey|sup|hola)\b/.test(m))                              return pick(responses.greeting);
        if (/file|deliverable|get|receive|export|handoff|format/.test(m))       return pick(responses.files);
        if (/figma|component|design system|source/.test(m))                     return pick(responses.figma);
        if (/logo|concept|mark|symbol|icon/.test(m))                            return pick(responses.logo);
        if (/include|what do|what can|service|offer|cover/.test(m))             return pick(responses.include);
        if (/cost|price|pricing|how much|budget|quote|rupee|inr/.test(m))       return pick(responses.cost);
        if (/time|timeline|long|how fast|quick|week|deliver/.test(m))           return pick(responses.timeline);
        if (/team|who|people|founder|developer|staff|member/.test(m))           return pick(responses.team);
        if (/start|begin|project|hire|work with|get started/.test(m))           return pick(responses.start);
        if (/contact|email|phone|reach|call|address|location/.test(m))          return pick(responses.contact);
        return pick(responses.fallback);
    }

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function addChatMsg(text, type) {
        if (!chatMessages) return;
        const div = document.createElement('div');
        div.className = `chat-msg ${type}`;
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendChatMsg(val) {
        val = val.trim();
        if (!val) return;
        addChatMsg(val, 'user');
        if (chatInput) chatInput.value = '';
        if (chatQuick) chatQuick.style.display = 'none';
        setTimeout(() => addChatMsg(getReply(val), 'bot'), 650);
    }

    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatIsOpen = !chatIsOpen;
            chatBox.classList.toggle('is-open', chatIsOpen);
            chatOpenIcon.style.display  = chatIsOpen ? 'none'   : 'inline';
            chatCloseIcon.style.display = chatIsOpen ? 'inline' : 'none';

            if (chatIsOpen && chatMessages && chatMessages.children.length === 0) {
                setTimeout(() => {
                    addChatMsg("Hey! 👋 Thinking about your brand? Ask me about our Brand & Design packages, what you'll receive, or how to get started!", 'bot');
                }, 300);
            }
        });
    }

    if (chatSend) {
        chatSend.addEventListener('click', () => {
            if (chatInput) sendChatMsg(chatInput.value);
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') sendChatMsg(chatInput.value);
        });
    }

    if (chatQuick) {
        chatQuick.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => sendChatMsg(btn.dataset.msg || btn.textContent));
        });
    }


    /* ─── KEYBOARD SHORTCUTS ───────────────────────────────────────── */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (hamburger)  hamburger.classList.remove('is-open');
            if (mobileMenu) mobileMenu.classList.remove('is-open');
            if (chatIsOpen && chatToggle) chatToggle.click();
        }
    });


    /* ─── CONSOLE EASTER EGG ───────────────────────────────────────── */
    console.log(
        '%cSparkForge ⚡',
        'font-size:20px;font-weight:800;color:#00df81;background:#007978;padding:8px 14px;border-radius:6px;'
    );
    console.log('Brand & Design — sparkforge2025@gmail.com | +91 78359 24050');

}); // end DOMContentLoaded
