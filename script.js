/* ══════════════════════════════════════════════════════════════════════════
   SPARKFORGE — script.js
   All selectors match index.html class names exactly.
══════════════════════════════════════════════════════════════════════════ */

/* ── DOM READY ──────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

    /* ─── THEME TOGGLE ─────────────────────────────────────────────── */
    const html         = document.documentElement;
    const themeToggle  = document.getElementById('themeToggle');
    const themeIcon    = themeToggle ? themeToggle.querySelector('i') : null;

    // Load saved preference
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
        if (navbar) {
            navbar.classList.toggle('is-scrolled', window.scrollY > 40);
        }
    });


    /* ─── HAMBURGER / MOBILE MENU ──────────────────────────────────── */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-open');
            mobileMenu.classList.toggle('is-open');
        });

        // Close when a link is tapped
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
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* ─── HERO COUNTER ANIMATION ───────────────────────────────────── */
    function animateCounter(el, target, duration = 1800) {
        const start = performance.now();
        function update(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(ease * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    }

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat__num[data-target]').forEach(el => {
                        animateCounter(el, parseInt(el.dataset.target, 10));
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }


    /* ─── SCROLL REVEAL ────────────────────────────────────────────── */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger siblings within same parent
                const siblings = Array.from(
                    entry.target.parentElement.querySelectorAll('[data-reveal]')
                );
                const idx   = siblings.indexOf(entry.target);
                const delay = idx * 80; // 80ms between each

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold:   0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });


    /* ─── WORK PORTFOLIO FILTER ────────────────────────────────────── */
    const filterBtns = document.querySelectorAll('.work-filter');
    const workItems  = document.querySelectorAll('.work-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('work-filter--active'));
            btn.classList.add('work-filter--active');

            const filter = btn.dataset.filter;

            workItems.forEach(item => {
                const match = filter === 'all' || item.dataset.category === filter;
                if (match) {
                    item.classList.remove('is-hidden');
                    requestAnimationFrame(() => {
                        item.classList.add('revealed');
                    });
                } else {
                    item.classList.add('is-hidden');
                    item.classList.remove('revealed');
                }
            });
        });
    });


    /* ─── CONTACT FORM ─────────────────────────────────────────────── */
    const contactForm    = document.getElementById('contactForm');
    const formSuccess    = document.getElementById('formSuccess');
    const formSubmitBtn  = document.getElementById('formSubmitBtn');

    if (contactForm && formSuccess && formSubmitBtn) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            const btnText = formSubmitBtn.querySelector('.btn__text');
            btnText.textContent = 'Sending…';
            formSubmitBtn.disabled = true;

            // Simulate send delay
            setTimeout(() => {
                btnText.textContent = 'Send Message';
                formSubmitBtn.disabled = false;
                formSuccess.classList.add('is-visible');
                contactForm.reset();

                setTimeout(() => {
                    formSuccess.classList.remove('is-visible');
                }, 5000);
            }, 1600);
        });
    }


    /* ─── CHATBOT ──────────────────────────────────────────────────── */
    const chatToggle   = document.getElementById('chatToggle');
    const chatOpenIcon = document.getElementById('chatOpenIcon');
    const chatCloseIcon= document.getElementById('chatCloseIcon');
    const chatBox      = document.getElementById('chatBox');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput    = document.getElementById('chatInput');
    const chatSend     = document.getElementById('chatSend');
    const chatQuick    = document.getElementById('chatQuick');

    let chatIsOpen = false;

    // Chatbot responses
    const responses = {
        greeting: ["Hey! 👋 I'm the SparkForge bot. What are you looking to build?"],
        build: [
            "We build 5 types of products:\n\n🛒 E-Commerce Stores\n🏢 Agency Websites\n📊 Business Portals\n🎨 Brand & Design\n🤖 AI & ML Integration\n\nWhich one interests you?"
        ],
        cost: [
            "Pricing depends on scope, here's a rough idea:\n\n🛒 E-Commerce: ₹40k–₹2L+\n🏢 Agency Site: ₹20k–₹80k\n📊 Portal/Dashboard: ₹60k–₹3L+\n🤖 AI Feature: ₹40k–₹2L+\n\nWant a quote? Email sparkforge2025@gmail.com"
        ],
        team: [
            "We're a team of 4:\n\n👨‍💼 Mann Gupta — Founder & CEO\n👨‍💻 Ramanuz Kashyap — Lead Developer\n🤖 Kushal Malviya — AI/ML Engineer\n🤖 Ashmeet Singh — AI/ML Engineer\n\nEveryone ships. No account managers here."
        ],
        start: [
            "Getting started is easy:\n\n1. Fill out the contact form below\n2. We reply within 24 hours\n3. Discovery call to understand your needs\n4. Design → Build → Launch\n\nScroll to the contact section or email sparkforge2025@gmail.com!"
        ],
        contact: [
            "📧 sparkforge2025@gmail.com\n📞 +91 78359 24050\n📍 New Delhi, India\n\nWe usually reply the same day!"
        ],
        fallback: [
            "Great question! For specific details, reach us at sparkforge2025@gmail.com — or ask me about: What we build, Pricing, Our team, or Getting started.",
            "I'm a simple bot 🤖 — for anything complex, ping the team at sparkforge2025@gmail.com. I can answer: services, pricing, team, or how to start a project."
        ]
    };

    function getReply(msg) {
        const m = msg.toLowerCase();
        if (/\b(hi|hello|hey|sup|hola|greet)\b/.test(m))         return pick(responses.greeting);
        if (/build|make|create|service|offer|what do|what can/.test(m)) return pick(responses.build);
        if (/cost|price|pricing|how much|budget|quote|rupee|inr/.test(m)) return pick(responses.cost);
        if (/team|who|people|founder|developer|staff|member/.test(m)) return pick(responses.team);
        if (/start|begin|project|hire|work with|get started/.test(m)) return pick(responses.start);
        if (/contact|email|phone|reach|call|address|location/.test(m)) return pick(responses.contact);
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
            chatOpenIcon.style.display  = chatIsOpen ? 'none'  : 'inline';
            chatCloseIcon.style.display = chatIsOpen ? 'inline': 'none';

            if (chatIsOpen && chatMessages && chatMessages.children.length === 0) {
                setTimeout(() => {
                    addChatMsg("Hey! 👋 I'm the SparkForge bot. Ask me anything about what we build, pricing, or the team!", 'bot');
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
    console.log('We build the web. sparkforge2025@gmail.com | +91 78359 24050');

}); // end DOMContentLoaded
