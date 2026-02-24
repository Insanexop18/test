/* ══════════════════════════════════════════════════════════════════════════
   SPARKFORGE — ecommerce.js
   E-Commerce Service Page
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
                const idx = siblings.indexOf(entry.target);
                setTimeout(() => entry.target.classList.add('revealed'), idx * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


    /* ─── COUNTER ANIMATION ────────────────────────────────────────── */
    function animateCounter(el, target, duration = 1800) {
        const start = performance.now();
        function update(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease     = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(ease * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    }

    const metricsStrip = document.querySelector('.metrics-strip');
    if (metricsStrip) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.metric__num[data-target]').forEach(el => {
                        animateCounter(el, parseInt(el.dataset.target, 10));
                    });
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(metricsStrip);
    }


    /* ─── FAQ ACCORDION ────────────────────────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-item__q');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            faqItems.forEach(i => {
                i.classList.remove('is-open');
                const q = i.querySelector('.faq-item__q');
                if (q) q.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Open first by default
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
        greeting: ["Hey! 👋 Looking to build an e-commerce store? I can answer pricing, features, timeline questions — or connect you with the team."],
        price: [
            "Here's our e-commerce pricing:\n\n🟢 Starter: From ₹40,000\n   Up to 50 products, Razorpay, basic admin\n\n🔵 Growth: From ₹80,000\n   Unlimited products, all gateways, full dashboard, shipping\n\n⚡ Scale: From ₹1,60,000\n   Everything + AI features, chatbot, multi-vendor\n\nFinal price confirmed after discovery call!"
        ],
        timeline: [
            "Typical e-commerce timelines:\n\n🟢 Starter store: 3–4 weeks\n🔵 Growth store: 4–6 weeks\n⚡ Scale / AI store: 6–10 weeks\n\nTimeline starts after deposit + design approval."
        ],
        payments: [
            "We integrate all major payment methods:\n\n💳 Razorpay (recommended for India)\n💳 Stripe (international cards)\n📱 UPI / QR Code\n💵 Cash on Delivery\n🌍 PayPal\n🏦 Net Banking\n\nAll PCI-compliant and secure."
        ],
        features: [
            "Every store includes:\n\n🛍️ Custom storefront design\n💳 Payment gateway integration\n📦 Inventory management\n🖥️ Admin dashboard\n🚚 Shipping integration\n📱 Mobile-first (PWA-ready)\n🔍 SEO & analytics setup\n📧 Email & cart recovery\n\nAI add-ons available on Scale plan!"
        ],
        start: [
            "Starting is easy:\n\n1. Fill our contact form → index.html#contact\n2. Free 20-min discovery call\n3. We send a fixed-price proposal\n4. 50% deposit → design begins\n\nEmail: sparkforge2025@gmail.com"
        ],
        hosting: [
            "We handle all hosting setup as part of the project. After launch, hosting costs are:\n\n🖥️ ₹1,000–₹3,000/month (AWS/Vercel/DigitalOcean)\n\nBilled directly to you — we don't mark it up."
        ],
        migration: [
            "Yes! We handle migrations from:\n\n✅ Shopify → Custom\n✅ WooCommerce → Custom\n✅ Wix → Custom\n✅ Any custom platform\n\nWe migrate products, customers, orders, and SEO settings with zero downtime."
        ],
        contact: ["📧 sparkforge2025@gmail.com\n📞 +91 78359 24050\n📍 New Delhi, India\n\nWe usually reply the same day!"],
        fallback: [
            "Great question! For details, reach us at sparkforge2025@gmail.com.\n\nAsk me about: Pricing, Timeline, Features, Payments, Hosting, or Migration.",
            "I'm a simple bot 🤖 — for anything specific, ping sparkforge2025@gmail.com. I can help with: price, timeline, features, or how to get started."
        ]
    };

    function getReply(msg) {
        const m = msg.toLowerCase();
        if (/\b(hi|hello|hey|sup)\b/.test(m))                                          return pick(responses.greeting);
        if (/cost|price|pricing|how much|budget|quote|rupee|package|plan/.test(m))     return pick(responses.price);
        if (/time|long|week|month|deadline|when|fast|quick|deliver/.test(m))            return pick(responses.timeline);
        if (/payment|pay|gateway|razorpay|stripe|upi|cod|paypal/.test(m))              return pick(responses.payments);
        if (/feature|include|what.*get|functionality|capabilit/.test(m))               return pick(responses.features);
        if (/start|begin|project|hire|get started|contact|quote/.test(m))              return pick(responses.start);
        if (/host|server|domain|aws|vercel|deploy/.test(m))                            return pick(responses.hosting);
        if (/migrat|switch|move|existing|shopify|woocommerce|wix/.test(m))             return pick(responses.migration);
        if (/email|phone|reach|call|address/.test(m))                                  return pick(responses.contact);
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
                setTimeout(() => addChatMsg("Hey! 👋 Thinking about building an e-commerce store? Ask me about pricing, features, timelines, or how to get started!", 'bot'), 300);
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
    console.log('Build your e-commerce store with us → sparkforge2025@gmail.com');

});
