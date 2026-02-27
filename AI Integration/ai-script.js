/* ══════════════════════════════════════════════════════════════════════════
   SPARKFORGE — ai-script.js
   AI Integration Service Page
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


    /* ─── HERO AI CHAT DEMO ─────────────────────────────────────────── */
    // After a delay, resolve the typing indicator with a real reply
    const aiTyping   = document.getElementById('aiTyping');
    const aiChatBody = document.getElementById('aiChatBody');

    if (aiTyping && aiChatBody) {
        setTimeout(() => {
            // Replace typing bubble with actual response
            const parent = aiTyping.closest('.ai-msg');
            if (parent) {
                aiTyping.classList.remove('ai-msg__bubble--typing');
                aiTyping.removeAttribute('id');
                aiTyping.innerHTML = "Here are 3 picks just for you 🛍️<br>→ <strong>Noise Cancelling Headphones</strong><br>→ <strong>Ergonomic Keyboard</strong><br>→ <strong>Mechanical Desk Lamp</strong>";
                aiTyping.style.fontSize = '0.75rem';
            }

            // After another pause, add one more exchange
            setTimeout(() => {
                const userMsg = document.createElement('div');
                userMsg.className = 'ai-msg ai-msg--user';
                userMsg.innerHTML = '<div class="ai-msg__bubble">Add the headphones to cart</div>';
                aiChatBody.appendChild(userMsg);

                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'ai-msg ai-msg--bot';
                    botMsg.innerHTML = `
                        <div class="ai-msg__avatar">AI</div>
                        <div class="ai-msg__bubble">Done ✅ Added to cart!</div>
                    `;
                    aiChatBody.appendChild(botMsg);
                    aiChatBody.scrollTop = aiChatBody.scrollHeight;
                }, 1000);

                aiChatBody.scrollTop = aiChatBody.scrollHeight;
            }, 2200);

        }, 2000);
    }


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
        greeting: ["Hey! 👋 I'm the SparkForge bot. Ask me anything about our AI Integration service!"],
        build: [
            "Here's what we build:\n\n🤖 AI chatbots & assistants\n🎯 Recommendation engines\n📊 Data analytics pipelines\n🧠 Custom ML models\n🔍 Semantic search\n📄 Document intelligence\n📈 Predictive analytics\n⚙️ AI workflow automation\n\nWhich one interests you?"
        ],
        cost: [
            "AI Integration pricing:\n\n🔌 Feature Add-On: ₹40,000 — single AI feature\n🚀 AI Product: ₹1,00,000 — full custom build\n🏢 AI Platform: ₹2,00,000+ — multiple AI systems\n\nFor a precise quote: sparkforge2025@gmail.com"
        ],
        timeline: [
            "AI project timelines:\n\n🔌 Feature Add-On: 3–5 weeks\n🚀 AI Product: 6–8 weeks\n🏢 AI Platform: 8–12 weeks\n\nWe always start with a PoC so you see results fast."
        ],
        data: [
            "Data safety is built in:\n\n✅ Enterprise API agreements (no training on your data)\n✅ On-premise deployment available for sensitive data\n✅ Open-source models (Llama, Mistral) for full control\n✅ Encrypted storage + access controls\n\nYour data stays yours — always."
        ],
        models: [
            "We use both:\n\n🔧 LLM APIs (GPT-4, Claude) for chatbots & document intelligence\n🔬 Custom models for recommendations, churn prediction, fraud detection\n\nWe recommend whichever approach gets the best results for your specific problem."
        ],
        stack: [
            "Our AI tech stack:\n\n🐍 Python + PyTorch\n🧠 OpenAI / Claude APIs\n🔗 LangChain for LLM orchestration\n📦 Pinecone / FAISS for vector search\n☁️ AWS SageMaker for deployment\n📊 MLflow for experiment tracking"
        ],
        team: [
            "Our core team:\n\n👨‍💼 Mann Gupta — Founder & CEO\n👨‍💻 Ramanuz Kashyap — Lead Developer\n🤖 Kushal Malviya — AI/ML Engineer\n🤖 Ashmeet Singh — AI/ML Engineer\n\nTwo dedicated AI/ML engineers on every project."
        ],
        start: [
            "Getting started:\n\n1. Click 'Start a Project' above\n2. Describe your AI use case\n3. We reply within 24 hours\n4. Feasibility audit → PoC → Production build\n\nOr email: sparkforge2025@gmail.com"
        ],
        contact: [
            "📧 sparkforge2025@gmail.com\n📞 +91 78359 24050\n📍 New Delhi, India\n\nWe usually reply the same day!"
        ],
        fallback: [
            "Interesting question! For specifics, reach us at sparkforge2025@gmail.com — or ask me about: What we build, Pricing, Data safety, or How to get started.",
            "I'm a simple bot 🤖 — for anything complex, ping the team at sparkforge2025@gmail.com. I can answer: features, pricing, timeline, data safety, or tech stack."
        ]
    };

    function getReply(msg) {
        const m = msg.toLowerCase();
        if (/\b(hi|hello|hey|sup|hola)\b/.test(m))                                   return pick(responses.greeting);
        if (/stack|tool|tech|langchain|pytorch|openai|pinecone|sagemaker/.test(m))   return pick(responses.stack);
        if (/model|gpt|claude|llm|pretrain|fine.?tune|open.?source/.test(m))         return pick(responses.models);
        if (/safe|secur|data|privacy|gdpr|train|leak|confidential/.test(m))          return pick(responses.data);
        if (/build|feature|what|offer|service|include|chatbot|recommend/.test(m))    return pick(responses.build);
        if (/cost|price|pricing|how much|budget|quote|rupee|inr/.test(m))            return pick(responses.cost);
        if (/time|timeline|long|how fast|quick|week|deliver/.test(m))                return pick(responses.timeline);
        if (/team|who|people|founder|engineer|staff|member/.test(m))                 return pick(responses.team);
        if (/start|begin|project|hire|work with|get started/.test(m))                return pick(responses.start);
        if (/contact|email|phone|reach|call|address|location/.test(m))               return pick(responses.contact);
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
                    addChatMsg("Hey! 👋 Thinking about adding AI to your product? Ask me about what we build, pricing, data safety, or how to get started!", 'bot');
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
    console.log('AI Integration — sparkforge2025@gmail.com | +91 78359 24050');

}); // end DOMContentLoaded
