/* ══════════════════════════════════════════════════════════════════════════
   SPARKFORGE — agency-script.js
   Agency Website Service Page
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

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });


    /* ─── FAQ ACCORDION ────────────────────────────────────────────── */
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-a');
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Close all others
            document.querySelectorAll('.faq-q').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                const a = b.closest('.faq-item').querySelector('.faq-a');
                a.classList.remove('is-open');
            });

            // Toggle current
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
        greeting: ["Hey! 👋 I'm the SparkForge bot. Ask me about our Agency Website service!"],
        build: [
            "Our Agency Website service includes:\n\n🖼 Portfolio & Case Study layouts\n📋 Lead generation forms\n✏️ CMS integration\n⚡ Performance optimisation\n📱 Mobile-first design\n📈 SEO & Analytics setup\n\nNeed more details on any of these?"
        ],
        cost: [
            "Here's our Agency Website pricing:\n\n🌱 Starter: ₹20,000 — up to 5 pages\n🚀 Growth: ₹45,000 — full package with CMS\n🏢 Enterprise: ₹80,000+ — unlimited pages\n\nWant a precise quote? Email sparkforge2025@gmail.com"
        ],
        timeline: [
            "Delivery times for Agency Websites:\n\n🌱 Starter: ~2 weeks\n🚀 Growth: 3–4 weeks\n🏢 Enterprise: 4–6 weeks\n\nTimeline can vary based on content readiness and revisions."
        ],
        team: [
            "Our core team:\n\n👨‍💼 Mann Gupta — Founder & CEO\n👨‍💻 Ramanuz Kashyap — Lead Developer\n🤖 Kushal Malviya — AI/ML Engineer\n🤖 Ashmeet Singh — AI/ML Engineer\n\nEveryone ships. No account managers here."
        ],
        start: [
            "Getting started is easy:\n\n1. Click 'Start a Project' above\n2. Fill out the contact form\n3. We reply within 24 hours\n4. Discovery call → Design → Build → Launch\n\nOr email us directly: sparkforge2025@gmail.com"
        ],
        contact: [
            "📧 sparkforge2025@gmail.com\n📞 +91 78359 24050\n📍 New Delhi, India\n\nWe usually reply the same day!"
        ],
        fallback: [
            "Good question! For specifics, reach us at sparkforge2025@gmail.com — or ask me about: Pricing, Timeline, What's included, or How to get started.",
            "I'm a simple bot 🤖 — for anything complex, ping the team at sparkforge2025@gmail.com. I can answer: services, pricing, timeline, or how to start a project."
        ]
    };

    function getReply(msg) {
        const m = msg.toLowerCase();
        if (/\b(hi|hello|hey|sup|hola)\b/.test(m))                              return pick(responses.greeting);
        if (/build|include|feature|what do|what can|offer|service/.test(m))     return pick(responses.build);
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
                    addChatMsg("Hey! 👋 Want to know about our Agency Website service? Ask me anything about features, pricing, or timelines!", 'bot');
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
            btn.addEventListener('click', () => {
                sendChatMsg(btn.dataset.msg || btn.textContent);
            });
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
    console.log('Agency Websites — sparkforge2025@gmail.com | +91 78359 24050');

}); // end DOMContentLoaded
