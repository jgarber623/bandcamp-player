export default class BandcampPlayer extends HTMLElement {
  static tagName = 'bandcamp-player';

  static themes = {
    auto: (() => {
      if ('matchMedia' in globalThis && globalThis.matchMedia('(prefers-color-scheme: dark)').matches) {
        return '333333';
      }

      return 'ffffff';
    })(),
    dark: '333333',
    light: 'ffffff'
  };

  static css = `\
    :host {
      --host-display: var(--bp-host-display, block);

      --frame-border: var(--bp-frame-border, 0);
      --frame-height: var(--bp-frame-height, 120px);
      --frame-width: var(--bp-frame-width, 100%);

      display: var(--host-display);
    }

    :host[hidden] {
      display: none;
    }

    iframe {
      border: var(--frame-border);
      display: block;
      height: var(--frame-height);
      width: var(--frame-width);
    }
  `;

  static defaults = {
    artwork: 'none',
    bgcol: this.themes.light,
    linkcol: '0687f5',
    size: 'large',
    tracklist: false,
    transparent: true
  };

  static register(tagName = this.tagName, registry = globalThis.customElements) {
    registry?.define(tagName, this);
  }

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const stylesheet = new CSSStyleSheet();

    stylesheet.replaceSync(BandcampPlayer.css);

    this.shadow.adoptedStyleSheets = [stylesheet];

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

    this.shadow.append(iframe);
  }
}

BandcampPlayer.register();
