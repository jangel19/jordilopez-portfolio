# Portfolio review — October 17, 2026

## Changes made

- **Routing and focus:** track the complete hash, match `#/owell` exactly, handle same-view anchors as well as page changes, and move focus to the destination after it mounts. In-page deep links bypass the intro so they reach their requested section. Owell's return link, browser back/forward, malformed-route fallback, and the route-preserving skip link work without a router dependency.
- **Intro:** provide keyboard controls on each lead (Enter/Space), focus the visible Skip intro button initially, preserve Escape, and use a stable completion callback with a nine-second final deadline. Continued interaction cannot indefinitely reset completion. Resize and reduced-motion changes dismiss the intro. Storage reads and writes are guarded; a rejected write skips the intro. Pointer release no longer performs side effects inside a React state updater, avoiding StrictMode duplication. Timers and optional audio resources are cleaned up. Removed the unreachable mobile circuit layout and unused BiosignalGate/generator.
- **Accessibility:** add a skip link and global visible keyboard focus, improve low-contrast gray labels/placeholders, give repeated project links distinct accessible names, reserve portrait/image dimensions, use meaningful project image alternatives, add contact autocomplete and a success announcement, and expose general form errors. Experience entries now have h3 headings; Owell's company statement is an h2. Missing timeline metadata no longer leaves orphan separators.
- **Reduced motion:** share a reveal hook that removes both fades and transforms. Disable CSS animations and hover transitions, stop contour parallax, and disable the cursor spotlight. Small screens use static contours without the large background blur layers.
- **Performance/layout:** restore normal document scrolling and scrollbar visibility; allow long labels to wrap without masking overflow. Lazy-load the below-the-fold portrait with its intrinsic ratio. Serve WebP versions of the three project images: approximately 4.4 MB combined becomes 208 KB. The original files remain available. Move Google Fonts out of a blocking CSS import, preconnect, and use optional font display to limit late font swaps.
- **Secrets:** remove browser visitor tracking, its IP lookup requests, the webhook configuration example, and the workflow's webhook injection. A `VITE_` environment variable does not protect a webhook: Vite includes referenced values in client code. See [Vite's environment-variable documentation](https://vite.dev/guide/env-and-mode#env-variables). The final output contains neither the local environment value nor webhook/IP lookup strings. No secret values were printed. The untracked local `.env` was left untouched.
- **Tooling/deployment:** fix JSX variable detection with `react/jsx-uses-vars` rather than suppressing unused-variable errors for `motion`. Update the workflow to Node 22, deterministic `npm ci`, a lint step, checkout/setup-node v6 and Pages action v4. Keep the root base path and hash routing. Apply security fixes within existing dependency ranges, including Vite 7.3.1 → 7.3.7, tar 7.5.11 → 7.5.22 and ws 8.18.3 → 8.22.0. React and Framer Motion versions remain unchanged.
- **Metadata:** add a description, Open Graph metadata, an SVG initials favicon and font preconnects. Social URLs follow `public/CNAME` (`jordi-lopez.dev`).

## Verification

- `npm run build`: passes.
- `npx eslint src`: passes with zero errors, including genuine unused-variable detection.
- `git diff --check`: passes.
- Headless Chromium via Playwright, with React StrictMode enabled: desktop first visit auto-completes in about 6.6 seconds; repeated interaction still completes in about 9.1 seconds. Hero focus and top scroll are restored. Reload does not replay the intro.
- Keyboard-only lead connection, Escape, hero navigation, focus after navigation, Owell return navigation, browser back/forward, same-view anchors and fresh Owell deep links pass.
- Fresh 375px mobile visit, blocked localStorage/sessionStorage getters, rejected storage writes, resize during the intro and changing reduced-motion preference during the intro pass.
- Reduced-motion mode skips the intro, has zero running browser animations and keeps the contours stationary during scroll.
- Both views have no horizontal document overflow at 320, 375, 767, 768, 1280 and 1920px.
- Captured and visually inspected every section of both views at 375px and 1280px (28 screenshots), after scrolling through each view to reveal content. Also checked a normal viewport to distinguish Chromium full-section capture artifacts from the actual skip-link visibility. Screenshots and machine-readable results are in `/private/tmp/portfolio-review`; the runner is `/private/tmp/portfolio-review.cjs`. These are local review artifacts and are not published website assets.
- Neither public resume PDF names the co-op employer or WHOOP. The co-op data/copy is unchanged; only shared rendering, headings, contrast and motion behavior changed.
- No page exceptions or webhook/IP lookup requests were observed. External font/form services were blocked in the browser suite; no contact messages were submitted. This verifies fallback-font layout, not external service availability.

## Issues found but not fixed

| Severity | Issue | Reason / next action |
| --- | --- | --- |
| High | Any webhook used in earlier builds may still be usable by others. The local environment still configures one. | Revoke/rotate the old webhook and remove the obsolete GitHub secret. Removing it from this checkout cannot revoke a credential or change the live deployment. |
| High, development tooling | `npm audit` still reports five high findings in `gh-pages → globby → fast-glob → micromatch → braces`. | Nonbreaking fixes reduced the original 19 findings (including one critical) to five. npm proposes a forced downgrade to gh-pages 6.1.1; that needs a separate tooling decision. This CLI chain is not part of the browser bundle. The workflow uses a separate Pages action. |
| Medium, content | Owell's existing statements about a “fraction of the effort,” demand being “already there,” and “Most of that loop is attention, not skill” can sound like demonstrated outcomes or dismiss farming expertise. | Kept existing claims for founder review. The factual testing status is consistent across the shared build/feature data and company page. |
| Low | `package.json` still names `jordisworld.me`, while `public/CNAME` names `jordi-lopez.dev`. | Metadata follows the hosting file; confirm the intended canonical domain before consolidating the older package field. DNS/live deployment was not changed. |
| Low | The demo area still announces a video that does not exist. Several large unused public assets are copied to dist. | Decide whether to hide the demo until available and prune legacy assets. Unused assets do not download during normal page viewing, but increase the deployment artifact. |
| Low | Small-screen More Work and Experience sections are long; the More Work descriptions vary greatly in length. | Content pacing is a subjective editorial change. The Builds cards consistently show a pitch, role, dates, status and tags; the co-op correctly has no link. |

No hardware performance trace, screen-reader audit, Safari/Firefox pass, live form delivery test or GitHub Actions execution was performed. Reserved image space was checked visually and by markup; no numerical Core Web Vitals claim is made. Hash routes resolve locally, but social crawlers generally share the single index document's metadata rather than a distinct Owell preview.

## Copy/design suggestions held back

1. Lead About with the concrete current work: “I'm co-founding Owell and testing the field device, backend, and app.” Then connect the research and prior builds to that work. The current About section reads more like a résumé than the hero does.
2. Shorten the A.I.M. pitch to one direct sentence; move the longer community explanation elsewhere. Keep its existing dates, role and status.
3. Present Owell's effort-saving language as the company's goal until testing supports an outcome claim. Example: “We're testing sensors and automation to take over routine monitoring and response.”
4. Reduce older-project summaries to two or three sentences and let their repositories carry technical detail. Preserve the existing sourced/results claims rather than adding new numbers.
5. Consider removing the demo placeholder until a real video is ready. Do not substitute fabricated screenshots, traction, deployments or testimonials.
6. Co-op wording was deliberately not rewritten. Its existing short, general description fits the IP constraints; any future replacement should go through the required IP review.

## Decisions for Jordi / hard-rule review

- Revoke the old webhook; decide whether visitor notifications are needed at all. If reintroduced, use a server-side secret and endpoint rather than a browser webhook.
- Confirm the canonical domain and whether to remove the unused local deploy CLI or separately address its dependency chain.
- Approve any changes to Owell's outcome/demand language and demo visibility. No new agricultural statistic or company traction was added.
- Owell remains a co-founded company, founded Jun 2026, In testing, with built device/backend/app and Ecuador as its first deployment target. No dates, customer counts, outcomes, partner identities or WHOOP references were added to the site. The co-op entry in `src/data/builds.js` is untouched, and all text in the experience data is preserved.

No push or deployment was performed.
