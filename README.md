# Kiddash Design System

Internal reference for the UX and Engineering team. The guide contains reusable UI components, supported states, design tokens, behavior requirements and implementation CSS. It does not include full-screen mockups or end-to-end application prototypes.

**Published documentation:** https://zexinlyu-cmu-f25.github.io/f26-fall-early-education-styleguide/

## Documentation structure

- **Foundations:** branding, colors, typography, layout and spacing.
- **UI components:** icons, navigation bars, buttons, counts, forms, search inputs, menus, dialogs, lists and messages.
- **Domain components:** scanner surfaces, guardian pairs, pickup passes, approaching responses, arrival status, journey scenes, search results and campus selection surfaces.
- **Guidelines:** interaction patterns and responsive CSS.
- **Resources:** shared CSS, original logo, source ZIP, offline HTML and the one-page Jama summary.

Each component page provides standalone specimens, specifications, state behavior and a CSS reference. State controls affect the individual specimen only. Application navigation, roster updates and complete pickup journeys are intentionally excluded.

## Open locally

1. [Download the standalone HTML](https://github.com/zexinlyu-cmu-F25/f26-fall-early-education-styleguide/raw/refs/heads/main/kiddash-style-guide-offline.html).
2. Save it with the `.html` extension and open it in a desktop browser.
3. Alternatively, download the repository ZIP, extract it and open `index.html` with the CSS, JavaScript and `assets/` directory beside it.

The standalone export embeds fonts, icons, logo, styles, scripts and downloadable resources. No package installation or server is required. External reference links require an internet connection. Preview state is local to each browser and resets on reload.

## Files

| File | Responsibility |
| --- | --- |
| `index.html` | Documentation pages and specimen containers |
| `kiddash.css` | Design tokens and reusable component styles |
| `guide.css` | Documentation shell and specimen layouts |
| `responsive.css` | Breakpoints, safe areas and accessibility overrides |
| `guide.js` | Routing, basic component examples and CSS references |
| `library.js` | Component state specimens |
| `component-audit.json` | Source library inventory, audited 23 Nov 2026 |
| `guide-resources.js` | Generated CSS text; no runtime fetch |
| `overview.html` | Printable one-page summary and Copy for Jama |
| `tools/build_offline.py` | Offline HTML and source ZIP generator |
| `assets/` | Official logo, rounded SVG icons, Nunito Sans fonts and license |

## Edit and export

Edit the source files, then regenerate the distributable files:

```sh
python3 tools/build_offline.py
```

Optional local preview:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. The generated offline HTML and ZIP should be committed with the source changes.

## Behavior contracts

- Attention is a subset of Remaining; it must not be added to the total again.
- Capturing a pickup pass and matching a guardian do not record a handoff. Confirmation is a separate deliberate action.
- Disabled, loading and completed states must prevent duplicate submissions in the host application.
- Arrival sharing requires an explicit parent choice; manual updates remain a separate path.
- Swipes have equivalent keyboard and tap controls. Names and complete messages remain visible.

These contracts describe the consuming application. The documentation contains component-scoped state previews, not connected school services.

## Assets and submission status

Four portrait assets still use initials. Two source route graphics are represented by a simplified journey illustration. The old expandable inline scanner is retired.

The supplied logo is unchanged. The new rounded SVG icon set is used in this web guide; the Figma file was not modified. Nunito Sans is distributed under the SIL Open Font License (`assets/OFL.txt`).

The one-page overview is prepared for Jama but has not been submitted. The team must verify its original Task 4 pattern selections. Production implementations require real-device and assistive-technology testing.

Browser verification covers component routing, navigation states, validation, dialogs, scanner and location state selectors, and responsive layout. The preview browser accepts HTTP/HTTPS; direct `file://` opening is not part of its automated browser coverage. The standalone export is separately checked for embedded runtime resources and valid scripts.
