class QuoteWidget extends Component {
    quotes = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
        { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
        { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
        { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
        { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
        { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
        { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
        { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
        { text: "Learn the rules like a pro, so you can break them like an artist.", author: "Pablo Picasso" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "What we think, we become.", author: "Buddha" },
        { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
        { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
        { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
        { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
        { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    ];

    constructor() {
        super();
    }

    getDailyQuote() {
        const customQuotes = (typeof CONFIG !== 'undefined' && CONFIG.customQuotes && CONFIG.customQuotes.length > 0)
            ? CONFIG.customQuotes
            : null;

        const quoteList = customQuotes || this.quotes;

        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        return quoteList[dayOfYear % quoteList.length];
    }

    style() {
        const activeTabIndex = parseInt(localStorage.lastVisitedTab || '0');
        const activeTab = (typeof CONFIG !== 'undefined' && CONFIG.tabs && CONFIG.tabs[activeTabIndex])
            ? CONFIG.tabs[activeTabIndex]
            : {};
        const accent = activeTab.accent || '#a9b665';

        return `
            :host {
                display: block;
                --theme-accent: ${accent};
            }

            .quote-wrapper {
                position: fixed;
                bottom: 25px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 0;
                text-align: center;
                opacity: 0;
                animation: fadeIn 2s ease-out 1s forwards;
                pointer-events: none;
                width: 100%;
                max-width: 600px;
                padding: 0 var(--space-lg);
            }

            .quote-wrapper::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/></svg>');
                pointer-events: none;
                opacity: var(--grain-opacity);
                mix-blend-mode: overlay;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateX(-50%) translateY(10px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }

            .quote-text {
                font-family: var(--font-mono);
                font-size: 12px;
                line-height: 1.6;
                color: var(--color-text-muted);
                text-shadow: 0 1px 1px rgba(0, 0, 0, 0.8);
                margin-bottom: var(--space-xs);
                font-weight: 400;
                position: relative;
                z-index: 1;
            }

            .quote-text::before { content: '"'; opacity: 0.3; margin-right: 2px; }
            .quote-text::after { content: '"'; opacity: 0.3; margin-left: 2px; }

            .quote-author {
                font-family: var(--font-mono);
                font-size: 10px;
                color: var(--theme-accent);
                opacity: 0.4;
                text-transform: lowercase;
                letter-spacing: 1px;
                position: relative;
                z-index: 1;
            }

            .quote-author::before { content: '// '; opacity: 0.5; }
        `;
    }

    template() {
        const quote = this.getDailyQuote();
        return `
            <div class="quote-wrapper" role="complementary" aria-label="Daily inspirational quote">
                <blockquote class="quote-text" aria-live="polite">${quote.text}</blockquote>
                <cite class="quote-author">${quote.author}</cite>
            </div>
        `;
    }

    connectedCallback() {
        this.render();
    }
}

customElements.define('quote-widget', QuoteWidget);

