# `<bandcamp-player>` Web Component

**A dependency-free [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components) that generates a [Bandcamp](https://bandcamp.com) embedded player.**

[![npm](https://img.shields.io/npm/v/@jgarber/bandcamp-player.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@jgarber/bandcamp-player)
[![Downloads](https://img.shields.io/npm/dt/@jgarber/bandcamp-player.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@jgarber/bandcamp-player)
[![Build](https://img.shields.io/github/actions/workflow/status/jgarber623/bandcamp-player/ci.yml?branch=main&logo=github&style=for-the-badge)](https://github.com/jgarber623/bandcamp-player/actions/workflows/ci.yml)

🎶 🎧 **[See `<bandcamp-player>` in action!](https://jgarber623.github.io/bandcamp-player/example)**

## Getting `<bandcamp-player>`

You've got several options for adding this Web Component to your project:

- [Download a release](https://github.com/jgarber623/bandcamp-player/releases) from GitHub and do it yourself _(old school)_.
- Install using [npm](https://www.npmjs.com/package/@jgarber/bandcamp-player): `npm install @jgarber/bandcamp-player --save`
- Install using [Yarn](https://yarnpkg.com/en/package/@jgarber/bandcamp-player): `yarn add @jgarber/bandcamp-player`

## Usage

First, add this `<script>` element to your page which defines the `<bandcamp-player>` Web Component:

```html
<script type="module" src="bandcamp-player.js"></script>
```

Embed an entire album using the `album` attribute:

```html
<bandcamp-player album="3656183138"></bandcamp-player>
```

Alternatively, embed a single track using the `track` attribute:

```html
<bandcamp-player track="3220102216"></bandcamp-player>
```

The `album` and `track` attributes may be used in combination to embed an entire album _and_ set the featured track:

```html
<bandcamp-player album="3656183138" track="3220102216"></bandcamp-player>
```

> [!TIP]
> You may include HTML within the `<bandcamp-player>` Web Component. This is good practice—hooray, [progressive enhancement](https://sixtwothree.org/posts/designing-with-progressive-enhancement)!—and provides initial content in cases where JavaScript is unavailable or in circumstances where the Web Component fails to initialize.

For example:

```html
<bandcamp-player track="3220102216">
  <p>Listen to <cite><a href="https://theorchid.bandcamp.com/track/the-astronaut-escape-velocity">The Astronaut (Escape Velocity)</a></cite> by <a href="https://theorchid.bandcamp.com">The Orchid</a> on Bandcamp.</p>
</bandcamp-player>
```

> [!IMPORTANT]
> At least one of the `album` or `track` attributes must be provided!

### Bandcamp album and track IDs

As noted above, this Web Component requires an `album` or `track` ID (or both!). Those values aren't the easiest thing to come by as Bandcamp doesn't expose them via their URLs or via an official API (which, sadly, they no longer have…).

You _can_ get these values by inspecting the HTML of any album or track page. Album and track identifiers are littered throughout the markup and inlined JSON data. It's a mess.

As of this writing, there's a consistently present `<meta name="bc-page-properties">` element at the top of each album or track page. Buried in its encoded `content` attribute value is a ten(ish)-digit `item_id`.

If you're feeling bold, you can enter the following command in your Web browser's developer tools to retrieve the `item_id`:

```js
JSON.parse(document.querySelector('meta[name="bc-page-properties"]').content).item_id
```

## Optional Attributes

This Web Component supports the following optional attributes.

| Name     | Default  | Description                     |
|:---------|:---------|:--------------------------------|
| `theme`  | `light`  | One of `light`, `dark`, `auto`. |
| `accent` | `0687f5` | A hexadecimal color code.       |

> [!TIP]
> The `theme` attribute's `auto` value sets the Bandcamp embedded player's background color using [the `prefers-color-scheme` CSS media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme).

## Custom Styling

You may want to set the `<bandcamp-player>` Web Component's `display` property for cases where the component is undefined:

```css
bandcamp-player:not(:defined) {
  display: block;
}
```

Once defined, the `<bandcamp-player>` Web Component's `display` property is set to `block`. This may be customized to suit your layout's needs using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties):

```css
bandcamp-player {
  --bp-host-display: flex;
}
```

You may similarly style some properties of the Bandcamp embedded player's `<iframe>`:

```css
bandcamp-player {
  --bp-frame-border: 0.25rem solid #0687f5;
  --bp-frame-height: 12rem;
  --bp-frame-width: 20rem;
}
```

> [!NOTE]
> Styling the width and height of the Bandcamp embedded player requires some foreknowledge of the content rendered within the `<iframe>`.

## JavaScript API

While not encouraged, you may create instances of this Web Component using JavaScript:

```js
const player = document.createElement('bandcamp-player');

player.album = 3656183138;
player.track = 3220102216;

player.accent = 'aa8b54';
player.theme = 'dark';

document.body.append(player);
```

> [!NOTE]
> Once attached to the DOM, changes to `player`'s properties and attributes will not (currently, at least) trigger a re-render of the element.

## Notes and Limitations

This Web Component currently offers a limited subset of the Bandcamp embedded player's features. Future versions will integrate additional options such as displaying artwork and a tracklist. Open the "Share / Embed" widget on any Bandcamp album or track page and click the "Embed this…" link for a look at the full range of customizations.

The reliance on [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) here is of questionable utility. This Web Component could've just as easily leveraged the DOM (more recently rebranded as, "Light DOM" 🙄) and been an [HTML web component](https://adactio.com/journal/20618). Further, perhaps your use case doesn't require this Web Component at all! The direct-from-Bandcamp `<iframe>` code snippet will work just as well.

## License

The `<bandcamp-player>` Web Component is freely available under the [MIT License](https://opensource.org/licenses/MIT).
