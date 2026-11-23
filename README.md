# Kiddash · Interactive Style Guide

A vanilla HTML, CSS and JavaScript style guide for a calmer school pickup experience. No framework, package install, account, camera or location permission is needed to use the examples.

**Online guide:** https://zexinlyu-cmu-f25.github.io/f26-fall-early-education-styleguide/

## Open on your own computer

**Easiest: download one file.**

1. [Download the standalone offline HTML](https://github.com/zexinlyu-cmu-F25/f26-fall-early-education-styleguide/raw/refs/heads/main/kiddash-style-guide-offline.html).
2. Save it as `kiddash-style-guide-offline.html` (keep the `.html` extension).
3. Double-click it and open it with Chrome, Edge, Firefox or Safari.

The file contains its own fonts, logo, icons, styles, JavaScript, CSS references and downloadable resources. Internet is not needed for the examples. External reference links still need a connection. Use **Download raw file** on GitHub if the link shows source instead of downloading.

**中文：**下载上面的离线 HTML，保存后双击即可。不要只复制网页源码，也不需要安装 Node。字体、Logo、图标和交互已经放在同一个文件里。

You can also download the repository using **Code → Download ZIP**, extract the complete folder, then open `index.html`. Keep the `assets` folder and the `.css` / `.js` files beside it. Opening a file inside an unextracted ZIP is not supported.

## What is included

- **Foundations:** original SVG logo, Kiddash palette, actual-size typography and editable specimen text.
- **Layout:** a reference phone canvas, four-column overlay, visible padding and spacing tokens.
- **Components:** raised buttons, count selectors, fields, errors, menus, navigation, dialogs, sheets, messages, lists, icons and documentation tables.
- **Interactions:** teacher pickup, explicit identity and handoff checks, parent sharing and manual arrival, student search and source-linked summaries.
- **Responsive:** width simulation, phone/tablet/desktop grids and a separate downloadable `responsive.css`.
- **Handoff:** complete CSS, source ZIP, an offline HTML and a printable one-page overview with **Copy for Jama**.

## Interaction rules

1. Attention is a subset of Remaining. Initially, 12 picked up + 8 remaining = 20 children.
2. Scanning a pass and matching a guardian do not record pickup. Only **Confirm handoff** changes the roster to 13 picked up + 7 remaining.
3. Repeated scans cannot record a second handoff. Mismatch and expired-code states stop the flow.
4. Parents explicitly choose trip sharing or manual updates. Approaching, arrived and picked up remain distinct.
5. Swipe decisions have visible button and keyboard alternatives. Messages stay attached to the child.

All names and events are fictional. This guide does not connect to school records, cameras, geolocation, messaging services or AI. Changes reset when the page reloads. Separate people opening the file do not share demo state.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Main, editable application |
| `kiddash.css` | Shared design tokens and component CSS |
| `guide.css` | Documentation shell and visual specimens |
| `responsive.css` | Media queries, safe areas and accessibility rules |
| `guide.js` | Routing and working interaction examples |
| `guide-resources.js` | Generated CSS text used by the reference panels; no fetch required |
| `overview.html` | Printable one-page summary and copyable Jama text |
| `kiddash-style-guide-offline.html` | Generated, fully self-contained HTML |
| `kiddash-style-guide.zip` | Downloadable source bundle with offline HTML |
| `tools/build_offline.py` | Standard-library Python export script |
| `assets/` | Official SVG, shared icons and local Nunito Sans fonts |

## Edit and regenerate

Edit the normal source files, then refresh the generated exports:

```sh
python3 tools/build_offline.py
```

Optional development server:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. A server is optional for normal use; it is useful while developing.

## Verification and submission notes

Browser checks cover the 402 px phone layout, typography sizes/weights, form errors, keyboard menu, parent manual-arrival flow, teacher confirmation and duplicate-scan prevention. The automated preview browser only accepts HTTP/HTTPS, so direct `file://` opening is not part of its browser test coverage. The offline export has no external runtime files or fetch calls.

The one-page overview is ready to copy into Jama, but has not been submitted. Cross-check the pattern list against the team's original Task 4 selections before final submission. Real-device and assistive-technology testing remain necessary for a production app.

Brand artwork is the supplied `kid-dash-logo-transparent.svg`, preserved unchanged. Icons are exported from the existing Kiddash component library. Nunito Sans is distributed under the SIL Open Font License; see `assets/OFL.txt`.
