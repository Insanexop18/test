/* ══════════════════════════════════════════════════════════════════════════
   SPARKFORGE — terms.js
════════════════════════════════════════════════════════════════════════ */

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
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('sf-theme', next);
            updateThemeIcon(next);
        });
    }
    function updateThemeIcon(theme) {
        if (themeIcon) themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
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
                window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
            }
        });
    });


    /* ─── SCROLL REVEAL ────────────────────────────────────────────── */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


    /* ─── TOC ACTIVE HIGHLIGHT ─────────────────────────────────────── */
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.policy-section');

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                tocLinks.forEach(link => {
                    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));


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
        build:    ["We build:\n\n🛒 E-Commerce Stores\n🏢 Agency Websites\n📊 Business Portals\n🎨 Brand & Design\n🤖 AI & ML Integration\n\nWhich one interests you?"],
        cost:     ["Pricing depends on scope:\n\n🛒 E-Commerce: ₹40k–₹2L+\n🏢 Agency Site: ₹20k–₹80k\n📊 Portal: ₹60k–₹3L+\n🤖 AI Feature: ₹40k–₹2L+\n\nWant a quote? Email sparkforge2025@gmail.com!"],
        start:    ["Easy to begin:\n\n1. Fill our contact form\n2. We reply within 24 hrs\n3. Discovery call\n4. Build → Launch\n\nEmail: sparkforge2025@gmail.com"],
        payment:  ["Our standard payment split:\n\n💰 50% deposit upfront\n💰 25% at mid-project milestone\n💰 25% before final delivery\n\nInvoices are due within 7 days of issue."],
        ip:       ["Once fully paid, you own all custom code and designs we create for you.\n\nWe retain rights to our internal frameworks and tools, but you get a perpetual licence to use anything we incorporate."],
        terms:    ["This page is our full Terms & Conditions.\n\nKey points: fixed-price projects, 50/25/25 payment split, 30-day post-launch support, you own the final code.\n\nQuestions? Email sparkforge2025@gmail.com."],
        contact:  ["📧 sparkforge2025@gmail.com\n📞 +91 78359 24050\n📍 New Delhi, India\n\nWe usually reply the same day!"],
        fallback: [
            "Great question! For specifics, reach us at sparkforge2025@gmail.com — or ask me about: what we build, pricing, payment terms, or IP ownership.",
            "I'm a simple bot 🤖 — for anything complex, ping sparkforge2025@gmail.com. I can answer: services, pricing, payment structure, or getting started."
        ]
    };

    function getReply(msg) {
        const m = msg.toLowerCase();
        if (/\b(hi|hello|hey|sup)\b/.test(m))                              return pick(responses.greeting);
        if (/build|service|what do|what can/.test(m))                       return pick(responses.build);
        if (/cost|price|pricing|how much|budget|quote/.test(m))             return pick(responses.cost);
        if (/start|begin|project|hire|get started/.test(m))                 return pick(responses.start);
        if (/pay|payment|invoice|deposit|refund|money/.test(m))             return pick(responses.payment);
        if (/ip|intellectual|property|own|copyright|code|design/.test(m))   return pick(responses.ip);
        if (/term|condition|contract|legal|agreement/.test(m))              return pick(responses.terms);
        if (/contact|email|phone|reach|call/.test(m))                       return pick(responses.contact);
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
                setTimeout(() => addChatMsg("Hey! 👋 Questions about our Terms & Conditions or what we build? Ask away.", 'bot'), 300);
            }
        });
    }

    if (chatSend) chatSend.addEventListener('click', () => chatInput && sendChatMsg(chatInput.value));
    if (chatInput) chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMsg(chatInput.value); });
    if (chatQuick) chatQuick.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => sendChatMsg(btn.dataset.msg || btn.textContent)));


    /* ─── KEYBOARD ─────────────────────────────────────────────────── */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            hamburger?.classList.remove('is-open');
            mobileMenu?.classList.remove('is-open');
            if (chatIsOpen && chatToggle) chatToggle.click();
        }
    });


    /* ─── CONSOLE ──────────────────────────────────────────────────── */
    console.log('%cSparkForge ⚡', 'font-size:20px;font-weight:800;color:#00df81;background:#007978;padding:8px 14px;border-radius:6px;');
    console.log('Questions about our terms? sparkforge2025@gmail.com');

});
