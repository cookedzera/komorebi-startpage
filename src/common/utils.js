const { parse, stringify } = JSON;

const $ = (e, options) => {
  const elems = document.querySelectorAll(e);

  if (options?.includeAll || elems.length > 1) return elems;

  return elems[0];
};

Element.prototype.nodes = function () {
  return Array.prototype.slice.call(this.children);
};

const debounce = (func, wait = 100) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit = 100) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const CRYPTO_CONFIG = {
  ids: {
    btc: '90',
    eth: '80'
  },
  apiUrl: 'https://api.coinlore.net/api/ticker/',
  refreshInterval: 5 * 60 * 1000
};
