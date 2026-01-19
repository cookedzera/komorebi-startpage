class CryptoWidget extends Component {
  refs = {
    btcPrice: '.btc-price',
    ethPrice: '.eth-price',
  };

  constructor() {
    super();
    this.prices = {
      btc: { price: '--', change: 0 },
      eth: { price: '--', change: 0 }
    };
  }

  imports() {
    return [
      this.resources.fonts.roboto,
    ];
  }

  async fetchPrices() {
    try {
      // Use centralized config
      const url = `${CRYPTO_CONFIG.apiUrl}?id=${CRYPTO_CONFIG.ids.btc},${CRYPTO_CONFIG.ids.eth}`;
      const response = await fetch(url);
      const data = await response.json();

      // Helper to find coin by ID
      const getCoin = (id) => data.find(c => c.id === id) || {};
      const btc = getCoin(CRYPTO_CONFIG.ids.btc);
      const eth = getCoin(CRYPTO_CONFIG.ids.eth);

      // Parse with NaN guards
      const btcPrice = parseFloat(btc.price_usd) || 0;
      const ethPrice = parseFloat(eth.price_usd) || 0;
      const btcChange = parseFloat(btc.percent_change_24h) || 0;
      const ethChange = parseFloat(eth.percent_change_24h) || 0;

      this.prices = {
        btc: {
          price: this.formatPrice(btcPrice),
          change: btcChange.toFixed(1)
        },
        eth: {
          price: this.formatPrice(ethPrice),
          change: ethChange.toFixed(1)
        }
      };

      this.updateDisplay();
    } catch (error) {
      // Silently handle API errors
      // Keep existing values or show fallback
      if (this.prices.btc.price === '--') {
        this.prices = {
          btc: { price: '—', change: 0 },
          eth: { price: '—', change: 0 }
        };
        this.updateDisplay();
      }
    }
  }

  formatPrice(price) {
    if (price >= 1000) {
      return (price / 1000).toFixed(1) + 'k';
    }
    return price.toFixed(0);
  }

  updateDisplay() {
    const btcEl = this.shadow.querySelector('.btc-value');
    const ethEl = this.shadow.querySelector('.eth-value');
    const btcChange = this.shadow.querySelector('.btc-change');
    const ethChange = this.shadow.querySelector('.eth-change');

    if (btcEl) btcEl.textContent = '$' + this.prices.btc.price;
    if (ethEl) ethEl.textContent = '$' + this.prices.eth.price;

    if (btcChange) {
      btcChange.textContent = (this.prices.btc.change >= 0 ? '↑' : '↓') + Math.abs(this.prices.btc.change) + '%';
      btcChange.className = 'crypto-change ' + (this.prices.btc.change >= 0 ? 'up' : 'down');
    }

    if (ethChange) {
      ethChange.textContent = (this.prices.eth.change >= 0 ? '↑' : '↓') + Math.abs(this.prices.eth.change) + '%';
      ethChange.className = 'crypto-change ' + (this.prices.eth.change >= 0 ? 'up' : 'down');
    }
  }

  style() {
    return `
      :host {
        display: flex;
        align-items: center;
      }

      .crypto-container {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        font-family: var(--font-primary); /* Cleaner font choice */
      }

      .crypto-item {
        display: flex;
        align-items: center;
        gap: 8px; /* Slightly more space */
        padding: 6px 10px;
        /* Lofi Minimal: flatter, subtler, no heavy borders */
        background: rgba(255, 255, 255, 0.03); 
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        /* No transition, no pointer events */
        pointer-events: none;
        user-select: none;
      }


      .crypto-symbol {
        font-weight: 600;
        font-size: 11px;
        letter-spacing: 0.5px;
        opacity: 0.7;
      }

      .crypto-symbol.btc { color: #eebb77; }
      .crypto-symbol.eth { color: #8899cc; }

      .crypto-value {
        color: var(--color-text-primary);
        font-weight: 500;
        font-size: 11px;
        opacity: 0.9;
      }

      .crypto-change {
        font-size: 10px;
        font-weight: 500;
        opacity: 0.6;
      }

      .crypto-change.up { color: #8cbfa5; }
      .crypto-change.down { color: #d68c8c; }
    `;
  }

  template() {
    return `
      <div class="crypto-container">
        <div class="crypto-item">
          <span class="crypto-symbol btc">BTC</span>
          <span class="crypto-value btc-value">$--</span>
          <span class="crypto-change btc-change">--</span>
        </div>
        <div class="crypto-item">
          <span class="crypto-symbol eth">ETH</span>
          <span class="crypto-value eth-value">$--</span>
          <span class="crypto-change eth-change">--</span>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.render().then(() => {
      this.fetchPrices();
      setInterval(() => this.fetchPrices(), CRYPTO_CONFIG.refreshInterval);
    });
  }
}

customElements.define('crypto-widget', CryptoWidget);
