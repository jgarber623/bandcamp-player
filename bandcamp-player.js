export default class BandcampPlayer extends HTMLElement {
  static #bgcolDark = '333333';
  static #bgcolLight = 'ffffff';

  static tagName = 'bandcamp-player';

  static observedAttributes = ['album', 'accent', 'theme', 'track'];

  static themes = {
    auto: (() => {
      if ('matchMedia' in globalThis && globalThis.matchMedia('(prefers-color-scheme: dark)').matches) {
        return this.#bgcolDark;
      }

      return this.#bgcolLight;
    })(),
    dark: this.#bgcolDark,
    light: this.#bgcolLight
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
    size: 'large',
    tracklist: false,
    transparent: true
  };

  static register(tagName = this.tagName, registry = globalThis.customElements) {
    registry?.define(tagName, this);
  }

  #album;
  #track;

  #accent = '0687f5';
  #theme = 'light';

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: 'open' });
  }

  get album() {
    return this.#album;
  }

  set album(value) {
    this.setAttribute('album', value);
  }

  get accent() {
    return this.#accent;
  }

  set accent(value) {
    this.setAttribute('accent', value);
  }

  get theme() {
    return this.#theme;
  }

  set theme(value) {
    this.setAttribute('theme', value);
  }

  get track() {
    return this.#track;
  }

  set track(value) {
    this.setAttribute('track', value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'album': {
        this.#album = newValue;
        break;
      }
      case 'accent': {
        this.#accent = newValue;
        break;
      }
      case 'theme': {
        if (Object.keys(this.constructor.themes).includes(newValue)) {
          this.#theme = newValue;
        }
        break;
      }
      case 'track': {
        this.#track = newValue;
        break;
      }
    }
  }

  connectedCallback() {
    const stylesheet = new CSSStyleSheet();

    stylesheet.replaceSync(this.constructor.css);

    this.shadow.adoptedStyleSheets = [stylesheet];

    const parameters =
      Object
        .entries({
          ...this.constructor.defaults,
          album: this.album,
          bgcol: this.constructor.themes[this.theme],
          linkcol: this.accent,
          track: this.track
        })
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
