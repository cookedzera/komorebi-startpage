class Clock extends Component {
  refs = {
    clock: '.clock-time',
    icon: '.clock-icon'
  };

  constructor() {
    super();
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.fonts.roboto
    ];
  }

  style() {
    return `
        :host {
            display: flex;
            align-items: center;
            padding: 6px 10px;
            background: rgba(42, 43, 38, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(169, 182, 101, 0.1);
            border-radius: 8px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        }

        :host(:hover) {
            background: rgba(42, 43, 38, 0.8);
            border-color: rgba(169, 182, 101, 0.15);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 
                        0 0 15px rgba(169, 182, 101, 0.03);
        }

        .clock-time {
            white-space: nowrap;
            font: 300 9pt 'Roboto', sans-serif;
            color: #d4be98;
            letter-spacing: .5px;
        }

        .clock-icon {
            color: #ea6962;
            font-size: 10pt;
            margin-right: 10px;
        }
    `;
  }

  template() {
    return `
        <span class="material-icons clock-icon">schedule</span>
        <p class="clock-time"></p>
    `;
  }

  setIconColor() {
    this.refs.icon.style.color = CONFIG.clock.iconColor;
  }

  setTime() {
    const timezoneOffset = parseInt(localStorage.getItem('weatherTimezone') || '32400');
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const localDate = new Date(utc + (timezoneOffset * 1000));

    this.refs.clock = localDate.strftime(CONFIG.clock.format);
  }

  connectedCallback() {
    this.render().then(() => {
      this.setTime();
      this.setIconColor();

      setInterval(() => this.setTime(), 1000);

      document.addEventListener('timezoneUpdate', () => {
        this.setTime();
      });
    });
  }
}
