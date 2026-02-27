/* ══════════════════════════════════════════════════════════════════════════
   SPARKFORGE — portal-script.js
   Business Portals Service Page
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


    /* ─── DASHBOARD BAR ANIMATION ──────────────────────────────────── */
    // Animate the dashboard bars in the hero mockup when they come into view
    const dashChart = document.querySelector('.dash-chart-bars');
    if (dashChart) {
        const bars = dashChart.querySelectorAll('.dash-bar');
        // Store original heights
        const heights = Array.from(bars).map(b => b.style.height);
        // Start at 0
        bars.forEach(b => { b.style.height = '0%'; b.style.transition = 'height 0.7s cubic-bezier(0.4,0,0.2,1)'; });

        const barObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bars.forEach((b, i) => {
                        setTimeout(() => { b.style.height = heights[i]; }, i * 80);
                    });
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        barObserver.observe(dashChart);
    }


    /* ─── FAQ ACCORDION ────────────────────────────────────────────── */
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-a');
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Close all others
            document.querySelectorAll('.faq-q').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.closest('.faq-item').querySelector('.faq-a').classList.remove('is-open');
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
        greeting: ["Hey! 👋 I'm the SparkForge bot. Ask me about our Business Portal service!"],
        build: [
            "Our Business Portal service covers:\n\n🔐 Auth & role-based access\n📊 Data dashboards\n🔌 API integrations\n⚙️ Custom workflows\n📄 Report generation\n🔔 Notifications & alerts\n🔍 Advanced search\n🛡️ Security & audit logs\n\nWant details on any of these?"
        ],
        cost: [
            "Business Portal pricing:\n\n🌱 Essential: ₹60,000 — single workflow focus\n🚀 Professional: ₹1,50,000 — full-featured portal\n🏢 Enterprise: ₹3,00,000+ — large-scale platforms\n\nFor a precise quote, email sparkforge2025@gmail.com"
        ],
        timeline: [
            "Portal delivery timelines:\n\n🌱 Essential: 4–6 weeks\n🚀 Professional: 8–10 weeks\n🏢 Enterprise: 10–14 weeks\n\nWe can phase delivery to get core features live faster."
        ],
        integrate: [
            "We integrate with virtually any software with an API:\n\n✅ Salesforce, Zoho, HubSpot\n✅ QuickBooks, Tally\n✅ Razorpay, Stripe\n✅ Slack, Google Workspace\n✅ Custom databases & ERPs\n\nIf it has an API, we can connect it."
        ],
        security: [
            "Security is built-in from day one:\n\n🔒 HTTPS & encrypted storage\n🔑 JWT + OAuth 2.0 / SSO\n🛡️ CSRF protection & rate limiting\n📋 Full audit logs\n✅ OWASP guidelines followed\n\nEnterprise builds support SAML for compliance."
        ],
        team: [
            "Our core team:\n\n👨‍💼 Mann Gupta — Founder & CEO\n👨‍💻 Ramanuz Kashyap — Lead Developer\n🤖 Kushal Malviya — AI/ML Engineer\n🤖 Ashmeet Singh — AI/ML Engineer\n\nEveryone ships. No account managers here."
        ],
        start: [
            "Getting started is easy:\n\n1. Click 'Start a Project' above\n2. Fill out the contact form\n3. We reply within 24 hours\n4. Requirements mapping → Design → Build → Launch\n\nOr email: sparkforge2025@gmail.com"
        ],
        contact: [
            "📧 sparkforge2025@gmail.com\n📞 +91 78359 24050\n📍 New Delhi, India\n\nWe usually reply the same day!"
        ],
        usecases: [
            "Common portal types we build:\n\n🤝 Client portals\n📦 Inventory & operations systems\n👥 HR & employee portals\n🎓 Learning management systems\n📈 Analytics & BI dashboards\n🏪 Vendor & partner portals\n\nWhich one are you looking for?"
        ],
        fallback: [
            "Good question! For specifics, reach us at sparkforge2025@gmail.com — or ask me about: Pricing, Timeline, Integrations, Security, or Use cases.",
            "I'm a simple bot 🤖 — for anything complex, ping the team at sparkforge2025@gmail.com. I can answer about: features, pricing, timeline, integrations, or security."
        ]
    };

    function getReply(msg) {
        const m = msg.toLowerCase();
        if (/\b(hi|hello|hey|sup|hola)\b/.test(m))                              return pick(responses.greeting);
        if (/use case|example|type|kind|what kind|what type/.test(m))           return pick(responses.usecases);
        if (/build|include|feature|what do|what can|offer|service/.test(m))     return pick(responses.build);
        if (/cost|price|pricing|how much|budget|quote|rupee|inr/.test(m))       return pick(responses.cost);
        if (/time|timeline|long|how fast|quick|week|deliver/.test(m))           return pick(responses.timeline);
        if (/integrat|connect|crm|erp|existing|software|third.party/.test(m))  return pick(responses.integrate);
        if (/secure|security|safe|data|encrypt|compliance|sso|audit/.test(m))  return pick(responses.security);
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
                    addChatMsg("Hey! 👋 Thinking about building a business portal? Ask me about features, pricing, integrations, or timelines!", 'bot');
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
    console.log('Business Portals — sparkforge2025@gmail.com | +91 78359 24050');

}); // end DOMContentLoaded
