/* ══════════════════════════════════════════════════════════════════════════
   SPARKFORGE — careers.js
   All selectors match careers.html class names exactly.
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


    /* ─── ROLE FILTER ──────────────────────────────────────────────── */
    const filterBtns  = document.querySelectorAll('.role-filter');
    const roleCards   = document.querySelectorAll('.role-card');
    const rolesEmpty  = document.getElementById('rolesEmpty');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('role-filter--active'));
            btn.classList.add('role-filter--active');

            const filter = btn.dataset.filter;
            let visible  = 0;

            roleCards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                if (match) {
                    card.classList.remove('is-hidden');
                    requestAnimationFrame(() => card.classList.add('revealed'));
                    visible++;
                } else {
                    card.classList.add('is-hidden');
                    card.classList.remove('revealed');
                }
            });

            if (rolesEmpty) {
                rolesEmpty.style.display = visible === 0 ? 'block' : 'none';
            }
        });
    });


    /* ─── APPLY MODAL ──────────────────────────────────────────────── */
    const modalOverlay    = document.getElementById('modalOverlay');
    const applyModal      = document.getElementById('applyModal');
    const modalClose      = document.getElementById('modalClose');
    const modalRoleTitle  = document.getElementById('modalRoleTitle');
    const applyBtns       = document.querySelectorAll('.apply-btn');

    function openModal(roleTitle) {
        if (!modalOverlay) return;
        if (modalRoleTitle) modalRoleTitle.textContent = roleTitle || 'Open Application';
        modalOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    applyBtns.forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.role));
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', e => {
            if (e.target === modalOverlay) closeModal();
        });
    }


    /* ─── QUICK APPLY FORM (modal) ─────────────────────────────────── */
    const quickApplyForm      = document.getElementById('quickApplyForm');
    const quickApplySuccess   = document.getElementById('quickApplySuccess');
    const quickApplySubmitBtn = document.getElementById('quickApplySubmitBtn');

    if (quickApplyForm && quickApplySuccess && quickApplySubmitBtn) {
        quickApplyForm.addEventListener('submit', e => {
            e.preventDefault();
            const btnText = quickApplySubmitBtn.querySelector('.btn__text');
            btnText.textContent = 'Sending…';
            quickApplySubmitBtn.disabled = true;

            setTimeout(() => {
                btnText.textContent = 'Submit Application';
                quickApplySubmitBtn.disabled = false;
                quickApplySuccess.classList.add('is-visible');
                quickApplyForm.reset();
                setTimeout(() => {
                    quickApplySuccess.classList.remove('is-visible');
                    closeModal();
                }, 3500);
            }, 1400);
        });
    }


    /* ─── MAIN APPLY FORM ──────────────────────────────────────────── */
    const applyForm      = document.getElementById('applyForm');
    const applySuccess   = document.getElementById('applySuccess');
    const applySubmitBtn = document.getElementById('applySubmitBtn');

    if (applyForm && applySuccess && applySubmitBtn) {
        applyForm.addEventListener('submit', e => {
            e.preventDefault();
            const btnText = applySubmitBtn.querySelector('.btn__text');
            btnText.textContent = 'Sending…';
            applySubmitBtn.disabled = true;

            setTimeout(() => {
                btnText.textContent = 'Submit Application';
                applySubmitBtn.disabled = false;
                applySuccess.classList.add('is-visible');
                applyForm.reset();
                setTimeout(() => applySuccess.classList.remove('is-visible'), 5000);
            }, 1600);
        });
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

    // Careers-specific chatbot responses
    const responses = {
        greeting: ["Hey! 👋 Glad you're exploring a career at SparkForge. What would you like to know?"],
        roles: [
            "Here's what we're currently hiring for:\n\n👨‍💻 Full-Stack Web Developer\n🎨 Frontend Developer\n🤖 AI/ML Engineer (Intern)\n🖌️ UI/UX Designer\n📈 Growth & Marketing Lead\n\nScroll up to see full details and apply!"
        ],
        process: [
            "Our hiring process is fast and respectful:\n\n1️⃣ Apply — fill the form\n2️⃣ Quick 20-min call with Mann or Ramanuz\n3️⃣ Paid task (2–4 hrs)\n4️⃣ Offer within 48 hours\n\nNo ghosting. Ever."
        ],
        remote: [
            "Yes! We're remote-friendly. Most of our team works remotely. We care about output, not office hours. Some roles may prefer Delhi-based candidates for occasional meetups."
        ],
        apply: [
            "To apply, scroll down to the form on this page — or click 'Apply Now' on the role you're interested in. You can also email us directly at sparkforge2025@gmail.com."
        ],
        pay: [
            "Compensation varies by role:\n\n👨‍💻 Full-Stack Dev: ₹4L–₹10L/yr\n🎨 Frontend Dev: ₹3L–₹8L/yr\n🤖 AI/ML Intern: ₹10k–₹20k/mo\n🖌️ UI/UX Designer: ₹3L–₹7L/yr\n📈 Growth Lead: ₹3L–₹6L/yr\n\nWe also offer performance bonuses!"
        ],
        contact: [
            "📧 sparkforge2025@gmail.com\n📞 +91 78359 24050\n📍 New Delhi, India\n\nFor career questions, mention 'Careers' in your subject line!"
        ],
        team: [
            "We're a small, high-impact team right now:\n\n👨‍💼 Mann Gupta — Founder & CEO\n👨‍💻 Ramanuz Kashyap — Lead Developer\n🤖 Kushal Malviya — AI/ML Engineer\n🤖 Ashmeet Singh — AI/ML Engineer\n\nYou'd be joining a lean, high-impact crew!"
        ],
        fallback: [
            "Great question! For specifics, reach us at sparkforge2025@gmail.com. I can answer about: open roles, hiring process, remote work, pay, or how to apply.",
            "I'm a simple careers bot 🤖 — for anything detailed, email sparkforge2025@gmail.com. Try asking: 'What roles are open?' or 'How does hiring work?'"
        ]
    };

    function getReply(msg) {
        const m = msg.toLowerCase();
        if (/\b(hi|hello|hey|sup|hola|greet)\b/.test(m))                       return pick(responses.greeting);
        if (/role|open|position|job|hiring|vacancy/.test(m))                    return pick(responses.roles);
        if (/process|how.*hire|interview|step|round/.test(m))                   return pick(responses.process);
        if (/remote|work from home|wfh|location|where/.test(m))                 return pick(responses.remote);
        if (/apply|application|how to|get started|submit/.test(m))              return pick(responses.apply);
        if (/pay|salary|compensation|stipend|money|rupee|inr|ctc|package/.test(m)) return pick(responses.pay);
        if (/contact|email|phone|reach|call/.test(m))                           return pick(responses.contact);
        if (/team|who|people|founder|developer|staff|member/.test(m))           return pick(responses.team);
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
                    addChatMsg("Hey! 👋 Thinking about joining SparkForge? Ask me anything about open roles, pay, our hiring process, or remote work!", 'bot');
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
            closeModal();
        }
    });


    /* ─── CONSOLE EASTER EGG ───────────────────────────────────────── */
    console.log(
        '%cSparkForge Careers ⚡',
        'font-size:18px;font-weight:800;color:#00df81;background:#007978;padding:8px 14px;border-radius:6px;'
    );
    console.log('Looking to join? sparkforge2025@gmail.com | +91 78359 24050');

}); // end DOMContentLoaded
