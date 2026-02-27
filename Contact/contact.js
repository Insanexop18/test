/* ══════════════════════════════════════════════════════════════════════════
   SPARKFORGE — contact.js
   All selectors match contact.html class names exactly.
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
            const next    = current === 'dark' ? 'light' : 'dark';
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


    /* ─── CONTACT FORM ─────────────────────────────────────────────── */
    const contactForm   = document.getElementById('contactForm');
    const formSuccess   = document.getElementById('formSuccess');
    const formSubmitBtn = document.getElementById('formSubmitBtn');

    if (contactForm && formSuccess && formSubmitBtn) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const btnText = formSubmitBtn.querySelector('.btn__text');
            btnText.textContent = 'Sending…';
            formSubmitBtn.disabled = true;

            setTimeout(() => {
                btnText.textContent = 'Send Message';
                formSubmitBtn.disabled = false;
                formSuccess.classList.add('is-visible');
                contactForm.reset();
                setTimeout(() => formSuccess.classList.remove('is-visible'), 5000);
            }, 1600);
        });
    }


    /* ─── FAQ ACCORDION ────────────────────────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-item__q');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('is-open');
                const q = i.querySelector('.faq-item__q');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked
            if (!isOpen) {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Open first FAQ by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('is-open');
        const firstBtn = faqItems[0].querySelector('.faq-item__q');
        if (firstBtn) firstBtn.setAttribute('aria-expanded', 'true');
    }


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
        greeting: ["Hey! 👋 I'm the SparkForge bot. What are you looking to build?"],
        build: [
            "We build 5 types of products:\n\n🛒 E-Commerce Stores\n🏢 Agency Websites\n📊 Business Portals\n🎨 Brand & Design\n🤖 AI & ML Integration\n\nWhich one interests you?"
        ],
        cost: [
            "Pricing depends on scope:\n\n🛒 E-Commerce: ₹40k–₹2L+\n🏢 Agency Site: ₹20k–₹80k\n📊 Portal/Dashboard: ₹60k–₹3L+\n🤖 AI Feature: ₹40k–₹2L+\n\nWant a quote? Fill the form above!"
        ],
        team: [
            "Our core team:\n\n👨‍💼 Mann Gupta — Founder & CEO\n👨‍💻 Ramanuz Kashyap — Lead Developer\n🤖 Kushal Malviya — AI/ML Engineer\n🤖 Ashmeet Singh — AI/ML Engineer\n\nEveryone ships. No account managers here."
        ],
        start: [
            "Getting started is easy:\n\n1. Fill the form on this page\n2. We reply within 24 hours\n3. Discovery call to understand your needs\n4. Design → Build → Launch\n\nOr email us at sparkforge2025@gmail.com!"
        ],
        contact: [
            "📧 sparkforge2025@gmail.com\n📞 +91 78359 24050\n📍 New Delhi, India\n\nWe usually reply the same day!"
        ],
        timeline: [
            "Timelines vary by scope:\n\n🏢 Agency site: 1–2 weeks\n🛒 E-commerce: 3–5 weeks\n📊 Portal: 4–8 weeks\n🤖 AI feature: 2–6 weeks\n\nWe'll give you a firm timeline in our first call."
        ],
        fallback: [
            "Great question! For specific details, reach us at sparkforge2025@gmail.com — or ask me about: What we build, Pricing, Our team, Timeline, or Getting started.",
            "I'm a simple bot 🤖 — for anything complex, ping the team at sparkforge2025@gmail.com. I can answer: services, pricing, team, timelines, or how to start."
        ]
    };

    function getReply(msg) {
        const m = msg.toLowerCase();
        if (/\b(hi|hello|hey|sup|hola|greet)\b/.test(m))                   return pick(responses.greeting);
        if (/build|make|create|service|offer|what do|what can/.test(m))     return pick(responses.build);
        if (/cost|price|pricing|how much|budget|quote|rupee|inr/.test(m))   return pick(responses.cost);
        if (/team|who|people|founder|developer|staff|member/.test(m))       return pick(responses.team);
        if (/start|begin|project|hire|work with|get started/.test(m))       return pick(responses.start);
        if (/contact|email|phone|reach|call|address|location/.test(m))      return pick(responses.contact);
        if (/time|long|week|month|deadline|when|fast|quick/.test(m))        return pick(responses.timeline);
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
            chatOpenIcon.style.display  = chatIsOpen ? 'none' : 'inline';
            chatCloseIcon.style.display = chatIsOpen ? 'inline' : 'none';

            if (chatIsOpen && chatMessages && chatMessages.children.length === 0) {
                setTimeout(() => {
                    addChatMsg("Hey! 👋 I'm the SparkForge bot. Ask me anything about what we build, pricing, or the team!", 'bot');
                }, 300);
            }
        });
    }

    if (chatSend) {
        chatSend.addEventListener('click', () => { if (chatInput) sendChatMsg(chatInput.value); });
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
    console.log('Let\'s build something. sparkforge2025@gmail.com | +91 78359 24050');

}); // end DOMContentLoaded
