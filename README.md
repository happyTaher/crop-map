# Matcha in SF

An SF-only matcha discovery map adapted from the California crop map. Explore a growing collection of cafés and restaurants, compare the published price of a named matcha drink, and filter by business type, food, menu focus and drink category.

## Run locally

Requires Node.js 24 or later.

```sh
cd site
npm ci
npm run dev
```

Open the address printed by Vite (normally http://localhost:5173). No map API key, crop data pipeline or PMTiles download is required. Basemap tiles come from OpenFreeMap with OpenMapTiles and OpenStreetMap attribution and need internet access. The venue list, filters and saved places work if map tiles cannot load.

```sh
npm test       # Unit tests, including the inherited crop-map tests
npm run build # TypeScript validation and production build in site/dist
npm run preview
```

With the dev server running, `npm run test:ui` checks desktop/mobile navigation, filters, saving, map-pin collisions and the no-WebGL fallback. If needed, install its test browser with `npx playwright install chromium`. Set `MATCHA_URL` to test another running instance.

## Discovery features

- Search by café, neighborhood, street address or drink name.
- Filter boutique, local group and chain locations independently from food options.
- Separate matcha-focused menus from broader café and restaurant menus.
- Separate matcha lattes from straight matcha/tea, so their prices are not confused.
- Filter by maximum published drink price; unverified prices never qualify for a budget filter.
- Sort by name or price; unknown prices sort last.
- Select a venue on the map or in the list for food details, source links and directions.
- Save places in browser local storage. No account or location permission is required.
- Browse the list or map on mobile, with reduced-motion support and keyboard controls.

## Venue data and limitations

The first edition is a curated starter collection, **not a complete inventory of every SF matcha seller**. Each record lives in `site/src/matcha/data.ts` with an address, approximate map coordinates, a menu link and a checked date. Sources were consulted November 9, 2026. Listings and prices require manual updates; there is no automatic synchronization or live opening-hours feed.

Prices are the listed online price for the named drink, not an estimated average or a promise of the in-store total. They exclude tax, tip and optional extras; sizes and ordering channels vary. Missing prices are explicitly marked “Check menu.” Do not copy one branch’s price to another without verifying it.

Business labels are editorial descriptions, not ownership certifications: boutique means a standalone specialist; local group means a small local or regional operator; chain means a wider multi-location brand or franchise. “Matcha-focused” means matcha is central to the menu, not that it is the only product. Food categories describe the published menu rather than current stock. “Drinks only” and “food unconfirmed” are supported categories and may have no entries in the starter set.

Source-by-source notes and refresh guidance are in `docs/matcha-data.md`.

To add a venue, update the typed data and include a source link and checked date. Keep locations inside San Francisco, verify the specific drink/branch price, and leave unknown prices as `null`. A complete city directory would require a broader venue census and an ongoing verification workflow.

## Structure

| Path | Purpose |
|---|---|
| `site/src/main.ts` | Matcha app, map, list, detail cards and saved places |
| `site/src/matcha/data.ts` | Venue records, categories and filter logic |
| `site/src/matcha/matcha.css` | Responsive visual design |
| `site/src/matcha/data.test.ts` | Matcha discovery tests |
| `site/public/webfonts/` | Locally hosted Figtree font |
| `pipeline/`, `data/lookup/`, original `site/src/` modules | Retained original crop-map implementation; not used by the matcha entry point |

## Deployment

`npm run build` produces a static site in `site/dist/`. Deploy that folder to a static host. The existing Cloudflare workflow deploys only when the fork has its own `PAGES_PROJECT` repository variable and Cloudflare credentials. It uses the fork’s configured project; no deployment is performed just by building locally.

For manual Cloudflare deployment, set `PAGES_PROJECT` to your own project before running `./deploy.sh`. Map tiles use the public OpenFreeMap service; no R2 crop archives or `TILES_BASE` configuration are needed.

## Credits and license

Adapted from [happyTaher/crop-map](https://github.com/happyTaher/crop-map), originally the “What’s growing here?” California crop map. Code and original artwork retain the MIT license. Map rendering uses MapLibre GL; basemap via OpenFreeMap, © OpenMapTiles and © OpenStreetMap contributors. Figtree is licensed under the SIL Open Font License (`site/public/webfonts/OFL.txt`). Retained crop data, artwork and other third-party material keep their original licenses.
