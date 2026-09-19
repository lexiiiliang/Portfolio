# First-visit loading

The September 14, 2026 optimization preserves the approved typography, cover
images, frost layers, layout, and motion. It changes when resources are requested.

## Changes

- The initial portrait uses a lossless crop of frame 33 of the existing atlas:
  13,296 bytes at 1× and 52,606 bytes at 2×, instead of downloading the full
  369,656 / 1,274,366-byte atlas before the portrait can appear.
- On devices with a fine pointer, the atlas loads at low priority after the
  document finishes loading, during idle time. Pointer movement can request it
  sooner. Touch-only, reduced-motion, and data-saving visits avoid the automatic
  download. Data-saving visitors can still request it by moving a mouse.
- The poster remains visible until the atlas has decoded. Pointer movement
  received while loading becomes the animation's target once it is ready.
- The wink video uses `preload="none"` in the initial document. After the first
  screen loads, an idle callback warms it before the gaze atlas; hover/focus can
  warm it sooner. Reduced-motion, data-saving, hidden, and offscreen visits skip
  automatic warming. Click/tap/Enter starts playback. The portrait switches to
  video only on `playing`, so a slow or failed request does not replace it with
  an empty circle.
- Pointer animation stops outside the viewport or in a hidden document.
- Project cover and frost images use native lazy loading and async decoding.
  The browser can prepare them near the viewport without preloading them ahead
  of the first screen's CSS and font.
- Root metadata uses the public site URL rather than reading request headers.
  Next.js now prerenders `/` at build time. Local production responses confirm
  `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`, and `s-maxage=31536000`.
  Case routes and password checks retain their existing dynamic behavior.
  See the [Next.js caching documentation](https://nextjs.org/docs/app/guides/caching-without-cache-components).

To regenerate the posters after replacing the source atlas, run
`node scripts/generate-portrait-posters.mjs`. This does not modify the atlas or
Obsidian sources; production builds consume the checked-in images.

## Controlled measurement

Chrome, fresh context/cache disabled on every run, 4 Mbps download, 120 ms
emulated network latency, 4× CPU slowdown, 2× display density. Baseline is the
native Next.js build of `b0d2017`; both baseline and optimized builds were served
on `http://localhost:3001/`. Values below are medians of three runs per viewport.

| Metric | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Desktop page load event, 1440 × 1000 | 5.977 s | 1.451 s | 76% |
| Desktop first contentful paint | 0.612 s | 0.512 s | 16% |
| Mobile largest contentful paint, 390 × 844 | 6.008 s | 0.516 s | 91% |
| Mobile page load event | 5.975 s | 1.459 s | 76% |
| Initial 2× portrait image | 1,274,366 B | 52,606 B | 96% |

The deferred desktop atlas still downloads after the first screen is available;
the load-event reduction is not a claim that all interactive media became that
much smaller. The mobile largest-contentful-paint improvement includes the
portrait, which was previously blank while waiting for the atlas.

A separate pre-change public-domain cold run had a 7.708 s first contentful
paint. Public network latency varies; do not compare that single live result
directly with these local measurements or claim these timings have been verified
on a newly deployed production release. These measurements predate the Vercel
Preview deployment below.

## Verification

- `npm run build:vercel`: passed; homepage static, light/dark production blur
  checks passed. One initial attempt hit a transient Google Fonts fetch failure;
  the unchanged retry succeeded.
- TypeScript, targeted ESLint, and `git diff --check`: passed.
- Both poster images decode to exactly the same pixels as their source frames.
- 11 screenshot pairs compare current production with the optimized local
  production build: desktop English/light and Chinese/dark, mobile Chinese/dark,
  whole homepage and folder rest/hover/open. Geometry matches. Differences are
  confined to small rasterization/shadow variations: all but three pixels across
  the pairs differ by at most 5/255 per channel (maximum 19/255 at a mobile
  portrait boundary). No layout, typography, or frost changes were introduced.
- Browser checks cover desktop gaze, mouse/keyboard wink, touch wink, all three
  folder panels, offscreen animation pause, reduced motion, disabled JavaScript,
  data saving, and delayed/failed media. Poster remains visible before playback
  and after failed media requests.
- Direct Livis and From Query to Quest pages return 200 and request no portrait
  media. No application JavaScript errors occurred during the interaction run.
- Existing rendered-HTML tests have the previously documented stale content
  assertions; they are not used as a pass claim for this frontend change.

Raw measurements, browser scripts, screenshots, and pixel comparisons are in
`output/playwright/performance/`.

## Wink follow-up: first click and continuous playback

The original wink is 960 × 960 H.264, 1,231,751 bytes, with its MP4 index at the
end. Chrome requested the beginning, then the tail for metadata, then the video
payload. The initial hover-only warming also began too late for a quick click.

The final implementation serves `click-wink-web.mp4`: 640 × 640 H.264,
222,830 bytes (82% smaller), with the index at the beginning. It preserves the
2.066667-second motion and uses 30 fps. This is a re-encoded display derivative,
not a pixel-identical copy; the original `click-wink.mp4` remains untouched.
The earlier lossless fast-start experiment preserved the video bytes but did
not sufficiently reduce mid-playback buffering on a constrained connection.
See [FFmpeg's description of fast-start MP4 indexes](https://ffmpeg.org/ffmpeg-formats.html#mov_002c-mp4_002c-ismv).

The compact clip warms after the document load event, during idle time, before
the gaze atlas competes for bandwidth. A single abortable fetch obtains the full
223 KB clip and assigns a local object URL to the video. The gaze atlas waits
until this fetch completes; playback can no longer stall on network buffering.
The object URL and pending fetch are released on unmount.
Rapid clicks cannot let an older rejected play promise hide a newer wink.
Captured source-element errors release gaze loading and retain the visible
portrait; clicking again can retry a failed video.

Controlled results use fresh Chrome contexts, cache disabled, 4 Mbps download,
120 ms latency, 4× CPU slowdown, 2× display density, and a click 300 ms after the
page load event. Medians are from three runs per viewport. Baseline component
bytes match the previously deployed Preview source SHA-1
`ab9e919afc14783b56a7f01a3e1a8f301179327d`.

| Metric | Previous Preview implementation | Final implementation |
| --- | ---: | ---: |
| Desktop click → first `playing` | 1,517 ms | 247 ms |
| Mobile click → first `playing` | 976 ms | 221 ms |
| Desktop mid-playback waits longer than 50 ms | 4 | 0 |
| Mobile mid-playback waits longer than 50 ms | 1 | 0 |
| Video requests per run | 4 | 1 |
| Desktop page load | 1.451 s | 1.455 s |
| Mobile page load | 1.459 s | 1.458 s |

The browser may emit near-zero-duration `waiting` events during startup; these
are not counted as a visible mid-playback stall. The early `before.json` and
`after.json` files accidentally recorded the last `playing` event (a resume),
not the first. The corrected comparisons are `before-first-play.json` and
`buffered-first-play.json`; the initially reported 4.46 / 2.75 s figures were not
first-frame latency.

Six decoded-frame comparisons at a 500 × 500 backing resolution (250 CSS pixels
at 2×) produce average RGB channel differences of 0.75–1.13 out of 255 and PSNR
of 41.1–43.8 dB. The visible 250px side-by-side check preserves the wink pose and
edge detail. The smaller 480px candidate was rejected in favor of the clearer
640px version. Additional browser checks pass for idle prewarming, keyboard,
touch, rapid repeat clicks, reduced motion, data saving, offscreen loading, and
failed media. Build, TypeScript, targeted ESLint, and production blur checks pass.

The native macOS helper `scripts/encode-wink.swift` prepares this asset offline;
it is not part of the Vercel build. To reproduce into a new output file:

```sh
swiftc -O scripts/encode-wink.swift -o /tmp/encode-wink
/tmp/encode-wink public/media/cursor-tracker/click-wink.mp4 /tmp/click-wink-web.mp4 640 1000000
```

Measurements, helper scripts, and the visual comparison are in
`output/playwright/wink/`.

## Vercel Preview

Initial first-load optimization, deployed September 14, 2026 for user review:

- Deployment: `dpl_CKeKLoAa5XTtDJ84dEamS3PV5aaf`, status `READY`.
- URL: `https://lexi-liang-portfolio-6t757238n-lexiiiliang.vercel.app`.
- Alias: `https://preview.lianglezhi.site` (Vercel authentication applies).
- Source: current `preview` worktree, based on `b0d2017`, including the
  uncommitted performance changes and checked-in content snapshot. The old base
  commit alone does not contain this optimization.
- Cloud build: Next.js/Turbopack, 18 seconds; homepage static; light/dark standard
  backdrop blur verification passed.
- Deployed-page checks: HTTP 200, `x-vercel-cache: HIT`,
  `x-nextjs-prerender: 1`, and `noindex`. The folder panel opens with the expected
  30px blur; warm wink playback passes. A fresh mobile visit requests only the
  portrait poster, with no atlas/video request before interaction. No application
  JavaScript errors occurred during this completed verification run.
- Production domains were not promoted or changed.
- Preview cold-video caveat: the first wink encountered slow ranged media
  requests in the verification network. One run completed its video transfer at
  approximately 132 seconds, exceeding the 30-second playback check. The poster
  stayed visible, and the video ultimately played to its full 2.067-second end.
  Do not describe cold wink playback on this Preview as instant; check it on the
  reviewer's network separately from the improved initial portrait paint.
- `.vercelignore` excludes local browser evidence, build outputs, and secrets
  from source uploads. The original poster atlases and new cropped images are
  included.

The wink follow-up is deployed as `dpl_b4CeutQkeSzUTyXpnWMdZagYYC8H`, `READY`, at
`https://lexi-liang-portfolio-cflafgd5j-lexiiiliang.vercel.app` and the same
`preview.lianglezhi.site` alias. It uses the current uncommitted `preview`
worktree. The cloud build completed in 15 seconds with static homepage and
light/dark blur verification passing. Production domains remain unchanged.

The first compact-video iteration still used native range buffering. Live fresh
contexts measured 7.76 s desktop and 5.25 s mobile click latency, including three
desktop playback stalls. Isolated fetches of the same clip took 0.47–0.88 s,
including both normal and Range requests: the Range header alone was not the
cause. Native media scheduling and competing atlas traffic were implicated.
The final implementation downloads the complete clip before releasing the
atlas. Its controlled cold click latency is 0.22–0.25 s; the earlier 22–23 ms
measurement belongs to the superseded native-buffering iteration.

Final buffered Preview: `dpl_3i9xQLv1tNZYyVbCyrgM8WNNU3Rd`, `READY`, at
`https://lexi-liang-portfolio-mi1s1uup0-lexiiiliang.vercel.app`, with alias
`preview.lianglezhi.site`. Cloud build completed in 17 seconds, including static
homepage and production blur checks. This is a working-tree Preview deployment,
not a production release or a new Git commit.

Four fresh live Chrome contexts (two desktop, two mobile, cache disabled) now
make one normal 223 KB fetch per visit. Cold click-to-play: desktop 1.69 / 1.95 s,
mobile 0.75 / 0.24 s. All four play the complete 2.066667-second clip with no
mid-playback waits, and no application JavaScript errors. These are live network
samples, not a guarantee of instantaneous cold playback. The full-clip fetch
still has to finish if a visitor clicks before warming completes.

The final browser checks also cover a failed fetch followed by a successful
click retry, duplicate clicks during an in-flight download (one request), and
turning on reduced motion while a requested clip is downloading. All pass.
Evidence: `live-buffered.json`, `verification-buffered.json`, and
`verification-buffered-races.json` in `output/playwright/wink/`.

## Return from a project to the landing page (local, September 14)

The header's Next.js links were intercepted and converted into
`window.location.assign('/#…')`. This caused a full document navigation and
app initialization, discarding the client router's cached home page. The handler
now leaves cross-page navigation to the existing `Link` component. Home's own
section clicks retain their custom smooth scroll and reveal-completion event.
Modified clicks retain native new-tab behavior.

The root `data-scroll-behavior="smooth"` attribute declares the existing CSS
scroll setting to Next.js. Cross-page returns now position their target directly;
within-home section navigation remains smooth. See the official
[Link reference](https://nextjs.org/docs/app/api-reference/components/link) and
[scroll behavior guidance](https://nextjs.org/docs/messages/missing-data-scroll-behavior).

Local native Next.js production-build comparison, Chrome, fresh contexts,
4 Mbps / 120 ms latency, 4× CPU, 2× density, browser cache enabled within each
visit. The round trip visits Home, opens Livis, and clicks Home in the header.
The direct-case scenario starts on Livis. The return link has been visible for
500 ms before clicking, allowing the normal Link prefetch. These are single
samples per scenario, measured from click to the home DOM and decoded portrait
being available; not a universal load-time or animation-completion guarantee.

| Scenario | Before | After |
| --- | ---: | ---: |
| Desktop Home → Livis → Home | 279 ms | 65 ms |
| Mobile Home → Livis → Home | 292 ms | 60 ms |
| Desktop direct Livis → first Home | 457 ms | 407 ms |
| Mobile direct Livis → first Home | 542 ms | 492 ms |
| Full document navigation on return | Yes | No |

The cached return adds no homepage resource requests. Two outgoing Livis media
requests were observed in the desktop final sample; this is not a claim that
all network traffic on the page becomes zero. A visitor who has never loaded
Home still needs its images. Native anchor positioning finishes at scrollY 0
for Home and the existing header offset for Work/About; Contact respects the
bottom-of-document scroll limit.

Checks passed: production build (including TypeScript and blur checks), targeted
ESLint, diff whitespace, desktop keyboard, mobile touch/reduced motion, direct
and cached return to all four sections, browser Back, preserved dark/Chinese
preferences, modified clicks, and opening a project summary after returning.
The main vinext preview at localhost:3000 also retains the same document and
returns to scrollY 0, without application JavaScript errors.

Evidence: `output/playwright/return-home/before.json`, `final.json`, `local.json`,
and `local.png`. This follow-up changes SiteHeader and one root HTML attribute;
it was subsequently deployed with explicit approval as
`dpl_FQS3PmtG3rwmoZxZTwEzqY3ti9Y6` (READY), while Git changes remain uncommitted
and unpushed. Live desktop/Livis and mobile/Query-to-Quest round trips retain the
document and return to scrollY 0, with 32 / 30 ms measured in these two samples.
The immediate rollback target is `dpl_D6wSP3TgaiWRYMxP14wXwp1zKDVp`.
See `docs/RELEASE-2026-09-14.md` for release and rollback details.
