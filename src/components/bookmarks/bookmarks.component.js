class BookmarkCarousel extends Component {
    constructor() {
        super();
    }

    style() {
        return `
            :host {
                display: block;
                margin: 16px 0;
            }

            .carousel-container {
                display: flex;
                gap: 12px;
                overflow-x: auto;
                padding: 8px 4px;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }

            .carousel-container::-webkit-scrollbar {
                display: none;
            }

            .bookmark-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-width: 80px;
                padding: 16px 12px;
                background: var(--glass-bg);
                backdrop-filter: blur(var(--glass-blur));
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                text-decoration: none;
            }

            .bookmark-card:hover {
                transform: translateY(-8px) scale(1.05);
                border-color: var(--color-accent-olive);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4),
                            0 0 20px rgba(169, 182, 101, 0.15);
            }

            .bookmark-icon {
                font-size: 24px;
                color: var(--color-text-primary);
                margin-bottom: 8px;
                transition: color 0.2s ease;
            }

            .bookmark-card:hover .bookmark-icon {
                color: var(--color-accent-olive);
            }

            .bookmark-name {
                font: 500 10px var(--font-primary);
                color: var(--color-text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                white-space: nowrap;
            }

            .bookmark-card.magnetic {
                will-change: transform;
            }
        `;
    }

    template() {
        const bookmarks = (typeof CONFIG !== 'undefined' && CONFIG.bookmarks)
            ? CONFIG.bookmarks
            : [];

        if (bookmarks.length === 0) return '';

        return `
            <div class="carousel-container">
                ${bookmarks.map(b => `
                    <a class="bookmark-card magnetic" href="${b.url}" target="_blank" rel="noopener">
                        <i class="ti ti-${b.icon || 'link'} bookmark-icon"></i>
                        <span class="bookmark-name">${b.name}</span>
                    </a>
                `).join('')}
            </div>
        `;
    }

    setEvents() {
        const cards = this.shadow.querySelectorAll('.bookmark-card.magnetic');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                card.style.transform = `translateY(-8px) scale(1.05) translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    connectedCallback() {
        this.render().then(() => this.setEvents());
    }
}

customElements.define('bookmark-carousel', BookmarkCarousel);
