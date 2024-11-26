export default class BandcampPlayer extends HTMLElement {
  static tagName = "bandcamp-player";

  static observedAttributes = ["album", "accent", "artwork", "size", "theme", "track"];

  static css = `\
    :host {
      --host-display: var(--bp-host-display, block);

      --frame-border: var(--bp-frame-border, 0);
      --frame-height: var(--bp-frame-height, 120px);
      --frame-width: var(--bp-frame-width, 100%);

      display: var(--host-display);
    }

    :host([artwork="large"]) {
      --frame-height: var(--bp-frame-height, 470px);
      --frame-width: var(--bp-frame-width, 350px);
    }

    :host([size="small"]) {
      --frame-height: var(--bp-frame-height, 42px);
    }

    :host([hidden]) {
      --host-display: none;
    }

    iframe {
      border: var(--frame-border);
      display: block;
      height: var(--frame-height);
      width: var(--frame-width);
    }
  `;

  static themes = {
    auto: (() => {
      if ("matchMedia" in globalThis && globalThis.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "333333";
      }

      return "ffffff";
    })(),
    dark: "333333",
    light: "ffffff",
  };

  static define(tagName = this.tagName, registry = globalThis.customElements) {
    registry?.define(tagName, this);
  }

  #props = {
    album: "",
    track: "",

    accent: "0687f5",
    artwork: "none",
    size: "large",
    theme: "light",
    tracklist: false,
    transparent: true,
  };

  shadowRoot = this.attachShadow({ mode: "open" });

  get album() {
    return this.#props.album;
  }

  set album(value) {
    this.setAttribute("album", value ?? "");
  }

  get accent() {
    return this.#props.accent;
  }

  set accent(value) {
    this.setAttribute("accent", value ?? "");
  }

  get artwork() {
    return this.#props.artwork;
  }

  set artwork(value) {
    value = (() => {
      switch (value.toLowerCase()) {
        case "large": return "large";
        case "small": return "small";
        default: return "none";
      }
    })();

    this.setAttribute("artwork", value);
  }

  get size() {
    return this.#props.size;
  }

  set size(value) {
    value = (() => {
      switch (value.toLowerCase()) {
        case "small": return "small";
        default: return "large";
      }
    })();

    this.setAttribute("size", value);
  }

  get theme() {
    return this.#props.theme;
  }

  set theme(value) {
    value = (() => {
      switch (value.toLowerCase()) {
        case "auto": return "auto";
        case "dark": return "dark";
        default: return "light";
      }
    })();

    this.setAttribute("theme", value);
  }

  get track() {
    return this.#props.track;
  }

  set track(value) {
    this.setAttribute("track", value ?? "");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.constructor.observedAttributes.includes(name)) return;

    this.#props[name] = newValue;

    this.isConnected && this.#render();
  }

  connectedCallback() {
    const stylesheet = new CSSStyleSheet();

    stylesheet.replaceSync(this.constructor.css);

    this.shadowRoot.adoptedStyleSheets = [stylesheet];

    this.#render();
  }

  #render() {
    const { album, artwork, size, track, tracklist, transparent } = this.#props;

    const properties = {
      album,
      artwork,
      bgcol: this.constructor.themes[this.#props.theme],
      linkcol: this.#props.accent,
      size,
      track,
      tracklist,
      transparent,
    };

    if (size === "small" && artwork !== "none") {
      delete properties.artwork;
    }

    const parameters =
      Object
        .entries(properties)
        .filter(([_, value]) => ![null, undefined, ""].includes(value))
        .map(entry => entry.join("="))
        .join("/");

    const iframe = document.createElement("iframe");

    iframe.loading = "lazy";
    iframe.src = `https://bandcamp.com/EmbeddedPlayer/${parameters}`;

    this.shadowRoot.replaceChildren(iframe);
  }
}

BandcampPlayer.define();
