export default class BandcampPlayer extends HTMLElement {
  static tagName = 'bandcamp-player';

  static themes = {
    auto: (() => {
      if ('matchMedia' in window && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return '333333';
      }

      return 'ffffff';
    })(),
    dark: '333333',
    light: 'ffffff'
  };

  static defaults = {
    artwork: 'none',
    bgcol: this.themes.light,
    linkcol: '0687f5',
    size: 'large',
    tracklist: false,
    transparent: true
  };

  static stylesheet = `\
    :host {
      --host-display: var(--bp-host-display, block);

      --frame-border: var(--bp-frame-border, 0);
      --frame-height: var(--bp-frame-height, 120px);
      --frame-width: var(--bp-frame-width, 100%);

      display: var(--host-display);
    }

    iframe {
      border: var(--frame-border);
      display: block;
      height: var(--frame-height);
      width: var(--frame-width);
    }
  `;

  static register(tagName = this.tagName) {
    if ('customElements' in window) {
      window.customElements.define(tagName, this);
    }
  }

  connectedCallback() {
    if (this.shadowRoot) {
      return;
    }

    const shadow = this.attachShadow({ mode: 'open' });

    const stylesheet = new CSSStyleSheet();

    stylesheet.replaceSync(BandcampPlayer.stylesheet);

    shadow.adoptedStyleSheets = [stylesheet];

    const attributes = {
      ...BandcampPlayer.defaults,
      album: this.getAttribute('album'),
      bgcol: BandcampPlayer.themes[this.getAttribute('theme') || 'light'],
      linkcol: this.getAttribute('accent') || BandcampPlayer.defaults.linkcol,
      track: this.getAttribute('track')
    };

    const parameters =
      Object
        .entries(attributes)
        .filter(([_, value]) => ![null, undefined].includes(value))
        .map(entry => entry.join('='))
        .join('/');

    const iframe = document.createElement('iframe');

    iframe.loading = 'lazy';
    iframe.src = `https://bandcamp.com/EmbeddedPlayer/${parameters}`;

    shadow.append(iframe);
  }
}

BandcampPlayer.register();
