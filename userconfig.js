let saved_config = JSON.parse(localStorage.getItem("CONFIG"));

const default_config = {
  overrideStorage: true,
  temperature: {
    location: 'Tokyo,JP',
    scale: "C",
  },
  clock: {
    format: "h:i p",
    iconColor: "#f4a261",
  },
  search: {
    engines: {
      g: ["https://google.com/search?q=", "Google"],
      d: ["https://duckduckgo.com/html?q=", "DuckDuckGo"],
      y: ["https://youtube.com/results?search_query=", "Youtube"],
      r: ["https://www.reddit.com/search/?q=", "Reddit"],
      p: ["https://www.pinterest.es/search/pins/?q=", "Pinterest"],
    },
  },
  keybindings: {
    "s": "search-bar",
    "q": "config-tab",
  },
  disabled: [],
  localIcons: false,
  fastlink: "https://chat.openai.com/",
  openLastVisitedTab: true,
  userName: "Ravi",

  customQuotes: [
  ],

  bookmarks: [
    { name: "GitHub", url: "https://github.com", icon: "brand-github" },
    { name: "Twitter", url: "https://twitter.com", icon: "brand-twitter" },
    { name: "YouTube", url: "https://youtube.com", icon: "brand-youtube" },
    { name: "Reddit", url: "https://reddit.com", icon: "brand-reddit" },
    { name: "Discord", url: "https://discord.com", icon: "brand-discord" },
  ],
  tabs: [
    {
      name: "chill",
      background_url: "src/img/banners/cbg-2.gif",
      accent: "#a9b665", // Olive Green
      containerColor: "#2a2b26", // Dark Olive
      categories: [{
        name: "Social Media",
        links: [
          {
            name: "whatsapp",
            url: "https://web.whatsapp.com/",
            icon: "brand-whatsapp",
            icon_color: "#8bab68", // Muted green
          },
          {
            name: "X",
            url: "https://x.com/",
            icon: "brand-x",
            icon_color: "#d4be98", // Warm cream
          },
          {
            name: "reddit",
            url: "https://www.reddit.com/",
            icon: "brand-reddit",
            icon_color: "#d8a657", // Muted orange
          },
          {
            name: "telegram",
            url: "https://web.telegram.org/",
            icon: "brand-telegram",
            icon_color: "#7daea3", // Sage teal
          },
        ],
      }, {
        name: "AI Tools",
        links: [
          {
            name: "gemini",
            url: "https://gemini.google.com/",
            icon: "sparkles",
            icon_color: "#b4a4c9", // Soft lavender
          },
          {
            name: "chatgpt",
            url: "https://chat.openai.com/",
            icon: "brand-openai",
            icon_color: "#89b482", // Sage green
          },
          {
            name: "claude",
            url: "https://claude.ai/",
            icon: "message-chatbot",
            icon_color: "#e78a4e", // Soft terracotta
          },
          {
            name: "grok",
            url: "https://grok.x.ai/",
            icon: "robot",
            icon_color: "#c5b4a1", // Warm taupe
          },
        ],
      }, {
        name: "Video",
        links: [
          {
            name: "netflix",
            url: "https://www.netflix.com/",
            icon: "brand-netflix",
            icon_color: "#ea6962",
          },
          {
            name: "prime video",
            url: "https://www.primevideo.com/",
            icon: "player-play-filled",
            icon_color: "#7daea3",
          },
          {
            name: "youtube",
            url: "https://www.youtube.com/",
            icon: "brand-youtube-filled",
            icon_color: "#ea6962", // Muted red
          },
        ],
      }],
    },
    {
      name: "crypto",
      background_url: "src/img/banners/cbg-6.gif",
      accent: "#d4be98", // Warm Beige
      containerColor: "#2a2b26", // Same Dark Olive
      categories: [
        {
          name: "Crypto Hub",
          links: [
            {
              name: "coingecko",
              url: "https://www.coingecko.com/",
              icon: "currency-bitcoin",
              icon_color: "#a9b665", // Olive green
            },
            {
              name: "coinmarketcap",
              url: "https://coinmarketcap.com/",
              icon: "chart-line",
              icon_color: "#7daea3", // Sage blue
            },
            {
              name: "polymarket",
              url: "https://polymarket.com/",
              icon: "chart-pie",
              icon_color: "#7daea3", // Sage teal
            },
            {
              name: "dexscreener",
              url: "https://dexscreener.com/",
              icon: "chart-candle",
              icon_color: "#89b482", // Muted teal
            },
          ],
        },
        {
          name: "Trading & Research",
          links: [
            {
              name: "gmgn.ai",
              url: "https://gmgn.ai/",
              icon: "brain",
              icon_color: "#d8a657", // Warm gold
            },
            {
              name: "cryptorank",
              url: "https://cryptorank.io/",
              icon: "trophy",
              icon_color: "#d4be98", // Warm beige
            },
            {
              name: "tradingview",
              url: "https://www.tradingview.com/",
              icon: "chart-arrows-vertical",
              icon_color: "#7daea3", // Sage
            },
          ],
        },
        {
          name: "Notes & Schedule",
          links: [
            {
              name: "notion",
              url: "https://www.notion.so/",
              icon: "notebook",
              icon_color: "#d4be98", // Cream
            },
            {
              name: "google calendar",
              url: "https://calendar.google.com/",
              icon: "calendar",
              icon_color: "#7daea3", // Sage
            },
            {
              name: "obsidian",
              url: "https://obsidian.md/",
              icon: "diamond",
              icon_color: "#b4a4c9", // Soft purple
            },
          ],
        },
      ],
    },
    {
      name: "dev",
      background_url: "src/img/banners/cbg-7.gif",
      accent: "#e78a4e", // Soft Orange
      containerColor: "#2a2b26", // Same Dark Olive
      categories: [
        {
          name: "Vibe Coding",
          links: [
            {
              name: "replit",
              url: "https://replit.com/",
              icon: "brand-redhat",
              icon_color: "#e78a4e", // Terracotta
            },
            {
              name: "lovable",
              url: "https://lovable.dev/",
              icon: "heart-code",
              icon_color: "#d3869b", // Dusty rose
            },
            {
              name: "vercel",
              url: "https://vercel.com/",
              icon: "brand-vercel",
              icon_color: "#d4be98", // Cream
            },
            {
              name: "bolt",
              url: "https://bolt.new/",
              icon: "bolt",
              icon_color: "#d8a657", // Gold
            },
          ],
        },
        {
          name: "Repositories",
          links: [
            {
              name: "github",
              url: "https://github.com/",
              icon: "brand-github",
              icon_color: "#c5b4a1", // Warm taupe
            },
            {
              name: "gitlab",
              url: "https://gitlab.com/",
              icon: "brand-gitlab",
              icon_color: "#e78a4e", // Terracotta
            },
            {
              name: "vscode",
              url: "https://vscode.dev/",
              icon: "brand-vscode",
              icon_color: "#7daea3", // Sage
            },
            {
              name: "stackoverflow",
              url: "https://stackoverflow.com/",
              icon: "brand-stackoverflow",
              icon_color: "#d8a657", // Gold
            },
          ],
        },
        {
          name: "Hackathons",
          links: [
            {
              name: "devfolio",
              url: "https://devfolio.co/hackathons",
              icon: "code",
              icon_color: "#7daea3", // Sage
            },
            {
              name: "unstop",
              url: "https://unstop.com/hackathons",
              icon: "trophy",
              icon_color: "#89b482", // Muted green
            },
            {
              name: "hackerearth",
              url: "https://www.hackerearth.com/challenges/",
              icon: "planet",
              icon_color: "#928374", // Warm grey
            },
            {
              name: "kaggle",
              url: "https://www.kaggle.com/competitions",
              icon: "brain",
              icon_color: "#7daea3", // Sage teal
            },
            {
              name: "mlh",
              url: "https://mlh.io/seasons/2025/events",
              icon: "calendar-event",
              icon_color: "#ea6962", // Muted coral
            },
          ],
        },
      ],
    },
    {
      name: "myself",
      background_url: "src/img/banners/cbg-9.gif",
      accent: "#7daea3", // Sage
      containerColor: "#2a2b26", // Same Dark Olive
      categories: [
        {
          name: "Mails",
          links: [
            {
              name: "gmail",
              url: "https://mail.google.com/mail/u/0/",
              icon: "brand-gmail",
              icon_color: "#ea6962", // Muted coral
            },
            {
              name: "icloud mail",
              url: "https://www.icloud.com/mail/",
              icon: "brand-apple",
              icon_color: "#d4be98", // Cream
            },
            {
              name: "outlook",
              url: "https://outlook.live.com/mail/",
              icon: "mail",
              icon_color: "#7daea3", // Sage
            },
          ],
        },
        {
          name: "Storage",
          links: [
            {
              name: "drive",
              url: "https://drive.google.com/drive/u/0/my-drive",
              icon: "brand-google-drive",
              icon_color: "#7daea3", // Sage
            },
            {
              name: "icloud",
              url: "https://www.icloud.com/",
              icon: "cloud",
              icon_color: "#c5b4a1", // Warm taupe
            },
            {
              name: "photos",
              url: "https://photos.google.com/",
              icon: "photo-filled",
              icon_color: "#ea6962", // Coral
            },
          ],
        },
        {
          name: "Stuff",
          links: [
            {
              name: "X",
              url: "https://x.com/",
              icon: "brand-x",
              icon_color: "#d4be98", // Cream
            },
            {
              name: "quicknote",
              url: "https://quicknote.io/",
              icon: "notes",
              icon_color: "#d8a657",
            },
            {
              name: "linkedin",
              url: "https://www.linkedin.com/feed/",
              icon: "brand-linkedin",
              icon_color: "#7daea3", // Sage
            },
          ],
        },
      ],
    },
  ],
};

const CONFIG = new Config(saved_config ?? default_config);

const savedSearchEngines = localStorage.getItem('savedSearchEngines');
const deletedEngines = JSON.parse(localStorage.getItem('deletedSearchEngines') || '[]');

if (savedSearchEngines) {
  try {
    const engines = JSON.parse(savedSearchEngines);
    if (!CONFIG.search) CONFIG.search = { engines: {} };
    const merged = { ...default_config.search.engines, ...engines };
    deletedEngines.forEach(key => delete merged[key]);
    CONFIG.search.engines = merged;
  } catch (e) { }
} else {
  const filtered = { ...default_config.search.engines };
  deletedEngines.forEach(key => delete filtered[key]);
  if (CONFIG.search) CONFIG.search.engines = filtered;
}

(function () {
  var css = document.createElement('link');
  css.href = 'src/css/tabler-icons.min.css';
  css.rel = 'stylesheet';
  css.type = 'text/css';
  if (!CONFIG.config.localIcons)
    document.getElementsByTagName('head')[0].appendChild(css);
})();
