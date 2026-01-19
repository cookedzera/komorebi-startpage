class Links extends Component {
  constructor() {
    super();
  }

  static getIcon(link) {
    const defaultColor = "#a89984";

    return link.icon
      ? `<i class="ti ti-${link.icon} link-icon"
            style="color: ${link.icon_color ?? defaultColor}"></i>`
      : "";
  }

  static getAll(tabName, tabs) {
    const { categories } = tabs.find((f) => f.name === tabName);

    return `
      ${categories.map(({ name, links }) => {
      return `
          <li>
            <h1>${name}</h1>
              <div class="links-wrapper">
              ${links.map((link) => `
                  <div class="link-info">
                    <a href="${link.url}">
                      ${Links.getIcon(link)}
                      ${link.name ? `<p class="link-name">${link.name}</p>` : ""
        }
                    </a>
                </div>`).join("")
        }
            </div>
          </li>`;
    }).join("")
      }
    `;
  }
}

class Category extends Component {
  constructor() {
    super();
  }

  static getBackgroundStyle(url) {
    return `style="background-image: url(${url}); background-repeat: no-repeat;background-size: contain;"`;
  }

  static hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  static getAll(tabs) {
    const defaultAccents = ['#a9b665', '#d4be98', '#e78a4e', '#7daea3'];
    const defaultContainers = ['#2a2b26', '#2a2b26', '#2a2b26', '#2a2b26'];
    return `
      ${tabs.map(({ name, background_url, accent, containerColor }, index) => {
      const accentColor = accent || defaultAccents[index] || '#ebbcba';
      const containerBg = containerColor || defaultContainers[index] || '#191724';

      // Convert to transparent RGBA
      const bgStart = Category.hexToRgba(containerBg, 0.60); // 60% opacity
      const bgEnd = Category.hexToRgba(containerBg, 0.40);   // 40% opacity

      const bgStyle = background_url ? `background-image: url(${background_url}); background-repeat: no-repeat; background-size: contain;` : '';

      return `<ul class="${name}" ${index == 0 ? "active" : ""} style="--flavour: ${accentColor}; --container-bg: ${containerBg}; background: linear-gradient(145deg, ${bgStart}, ${bgEnd}); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); ${bgStyle}">
            <div class="banner"></div>
            <div class="links">${Links.getAll(name, tabs)}</div>
          </ul>`;
    }).join("")
      }
    `;
  }
}

class Tabs extends Component {
  refs = {};

  constructor() {
    super();
    this.tabs = CONFIG.tabs;
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.icons.tabler,
      this.resources.fonts.roboto,
      this.resources.fonts.raleway,
      this.resources.libs.awoo,
    ];
  }

  style() {
    // Get saved taskbar color or default to olive
    const savedTaskbarColor = localStorage.getItem('taskbarColor') || '#2a2b26';

    return `
      status-bar {
          bottom: -70px;
          height: 32px;
          background: ${savedTaskbarColor};
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-radius: 8px;
          border: 1px solid rgba(169, 182, 101, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }

      #panels, #panels ul,
      #panels .links {
          position: absolute;
      }

      .nav {
          color: #e8e0d5;
      }

      #panels {
          border-radius: 12px;
          width: 90%;
          max-width: 1200px;
          height: 450px;
          right: 0;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          border: 1px solid rgba(244, 162, 97, 0.15);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
      }

      .categories {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          border-radius: 12px;
      }

      .categories ul {
          --panelbg: transparent;
          --container-bg: rgba(58, 45, 35, 0.9);
          width: 100%;
          height: 100%;
          right: 100%;
          opacity: 0.5;
          transform: scale(0.96) translateY(10px);
          filter: blur(2px);
          background-image: url("../img/bg-1.gif");
          background-repeat: repeat;
          background-position: left;
          background-color: var(--container-bg);
          transition: right 0.8s cubic-bezier(0.22, 0.61, 0.36, 1),
                      opacity 0.7s ease-out,
                      transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1),
                      filter 0.6s ease-out;
          will-change: right, opacity, transform, filter;
      }

      .categories ul .links {
          box-shadow: inset -2px 0 var(--flavour);
      }

      .categories ul[active] {
          right: 0;
          z-index: 1;
          opacity: 1;
          transform: scale(1) translateY(0);
          filter: blur(0);
      }

      .categories .links {
          right: 0;
          width: 70%;
          height: 100%;
          background: var(--container-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 5%;
          flex-wrap: wrap;
      }

      .categories .links li {
          list-style: none;
      }

      .categories ul .links a {
          color: #e8e0d5;
          text-decoration: none;
          font: 600 15px 'Roboto', sans-serif;
          transition: all .25s ease;
          display: inline-flex;
          align-items: center;
          padding: .45em .8em;
          background: color-mix(in srgb, var(--flavour) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--flavour) 25%, transparent);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          margin-bottom: .6em;
      }

      .categories .link-info {
          display: inline-flex;
      }

      .categories .link-info:not(:last-child) { margin-right: .5em; }

      .categories ul .links a:hover {
          transform: translateY(-3px) scale(1.02);
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--flavour);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4),
                      0 0 20px -5px var(--flavour);
          color: #fff;
      }
      
      .categories ul .links a:hover .link-icon {
          transform: scale(1.1) rotate(5deg);
          color: var(--flavour);
          filter: drop-shadow(0 0 8px var(--flavour));
      }

      .categories ul::after {
          content: attr(class);
          position: absolute;
          display: flex;
          text-transform: uppercase;
          writing-mode: vertical-rl;
          text-orientation: upright;
          width: auto;
          height: auto;
          max-height: 70%;
          padding: 1.5em 1em;
          margin: auto;
          border-radius: 16px;
          box-shadow: inset 0 0 0 2px var(--flavour);
          left: calc(15% - 42.5px);
          top: 50%;
          bottom: auto;
          transform: translateY(-50%);
          background: var(--container-bg);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: var(--flavour);
          letter-spacing: 0.3em;
          font: 700 18px 'Nunito', sans-serif;
          text-align: center;
          align-items: center;
          justify-content: center;
      }

      .categories .links li:not(:last-child) {
          box-shadow: 0 1px 0 rgba(232, 224, 213, 0.1);
          padding: 0 0 .5em 0;
          margin-bottom: 1.4em;
      }

      .categories .links li h1 {
          color: rgba(232, 224, 213, 0.5);
          font-size: 11px;
          margin-bottom: 1em;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-family: 'Raleway', sans-serif;
      }

      .categories .link-icon {
          font-size: 22px;
          margin-right: 12px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      filter 0.3s ease, 
                      color 0.3s ease;
      }

      .categories ul .links a:hover .link-icon {
          filter: drop-shadow(0 0 6px currentColor);
      }

      .categories .link-icon + .link-name {
          margin-left: 8px;
      }

      .categories .links-wrapper {
          display: flex;
          flex-wrap: wrap;
      }

      .ti {
          animation: fadeInAnimation ease .4s;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
          height: 22px;
          width: 22px;
      }

      @keyframes fadeInAnimation {
          0% {
              opacity: 0;
          }
          100% {
              opacity: 1;
           }
      }
    `;
  }

  template() {
    const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const defaults = { crypto: true, weather: true, ambient: true, search: true };
    const widgets = { ...defaults, ...(userSettings.widgets || {}) };
    return `
      <div id="links" class="-">
        <greeting-display></greeting-display>
        <bookmark-carousel></bookmark-carousel>
        <div id="panels">
          <div class="categories">
            ${Category.getAll(this.tabs)}
            <search-bar></search-bar>
            <config-tab></config-tab>
            ${widgets.ambient ? '<ambient-player></ambient-player>' : ''}
          </div>
          <status-bar class="!-"></status-bar>
        </div>
        ${(!userSettings.widgets || userSettings.widgets.quote !== false) ? '<quote-widget></quote-widget>' : ''}
      </div>
      <settings-panel></settings-panel>
      <command-palette></command-palette>
    `;
  }

  connectedCallback() {
    this.render();
  }
}
