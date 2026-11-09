# SF matcha data notes

This is a manually curated first edition, reviewed November 9, 2026. It is not an exhaustive list of SF matcha sellers. Venue records live in `site/src/matcha/data.ts`.

Prices describe one named drink on a published online menu. They are not necessarily counter prices and exclude extras, tax and tips. Cup sizes are not standardized. Never fill a missing price with an estimate. A null price must stay out of budget filters and sort after known prices.

| Venue | Listed drink | Published price | Evidence |
|---|---|---:|---|
| Stonemill Matcha | Matcha latte | $6.50 | [Specific Toast item](https://order.toasttab.com/online/stonemill-matcha/item-to-matcha-latte_627e5d39-6b2d-4bd4-b81f-73f093f2c82d); [restaurant menu](https://www.stonemillmatcha-us.com/menu) supports meals and pastries. |
| Kiss of Matcha, Broadway | Matcha latte | $7.57 | [Specific product page](https://kissofmatcha.order.tryperdiem.com/products/matcha-latte); [Broadway location](https://kissofmatcha.order.tryperdiem.com/locations/san-francisco) supports address and sweets. The product price is more specific than a location-page summary that previously displayed $7.47. |
| Asha Tea House | Matcha latte | Unverified | [Merchant ordering site](https://ashateahouse.square.site/) confirms the SF location in search results but did not expose readable menu content when opened. Food is therefore marked unconfirmed; no price is inferred. |
| Junbi | Matcha latte | $7.25 | [SF merchant menu](https://order.toasttab.com/online/junbi-sanfrancisco); [brand locations](https://junbishop.com/pages/locations). Rice balls are on the menu but were marked out of stock. |
| Matcha Café Maiko, three SF locations | Matcha latte | Unverified | [Brand menu](https://www.matchacafe-maiko.com/eng/menu/) supports lattes and desserts and warns that selection varies by store. No local price was established. |
| Toast Eatery, West Portal | Matcha latte | $6.00 | [Merchant menu](https://toast.app/r/toastwestportal.com/order) supports drink, address and breakfast/lunch. |
| Marufuku Ramen, Japantown | Iced matcha | $3.00 | [Specific merchant item](https://order.toasttab.com/online/marufuku-ramen-sf-1581-webster-st-suite-235/item-iced-matcha_8bfdbdfa-7c0a-4c52-ad8b-cdc25b4f6535). Menu describes unsweetened iced green tea; this is intentionally classified as tea, not a latte. |

Maiko location evidence is linked per record: [Japantown neighborhood directory](https://www.sfjapantown.org/directory-jpndirectory/listing/matcha-cafe-maiko/), [Stonestown mall directory](https://www.stonestowngalleria.com/en/directory/), and the [merchant's California location page](https://coverage-e5afaa9bdb1529a121e0b7b57b7490de.web.ordersave.com/page/california) for Chinatown. The brand's own San Francisco store selector returned a broken parameter error during review.

Coordinates are approximate address pins, not surveyed entrance points. The mall pin denotes the mall location; the address identifies the Level 2 food court. Locations fit within mainland San Francisco.

Business categories are editorial navigation aids: boutique for a standalone specialist, local group for a small local/regional operator, chain for a wider brand/franchise. They are not certifications of ownership. “Matcha-focused” describes the menu emphasis, not an assertion that only matcha is sold. Food categories follow menus rather than live stock. This initial collection contains no confirmed drinks-only venue.

When refreshing, open the specific merchant item first, compare it with the local location menu, record the date, and retain null for any unverified price. Do not silently mix delivery prices with counter prices or straight tea with lattes.

## Expanded city coverage

Eight additional locations use direct brand/merchant sources. Their prices remain unverified:

- [Constance Tea](https://www.constancetea.com/) identifies its matcha milling, current soft-opening hours and 3512 Balboa address. Food is unconfirmed.
- [Nagomi Café](https://cafenagomi.com/) identifies 74 New Montgomery, hand-whisked matcha lattes and soft serve. The page retains a “coming soon” heading but also gives current temporary soft-opening hours; users should check before visiting.
- Peet’s [Chestnut](https://www.peets.com/pages/store/chestnut) and [West Portal](https://www.peets.com/pages/store/west-portal) pages identify active locations and warm breakfast. Its [matcha latte product page](https://www.peets.com/products/matcha-green-tea-latte) identifies the brand offering. Local stock and price are not asserted.
- Boba Guys’ [current SF location directory](https://www.bobaguys.com/sf-bay-area-express) lists Fillmore, Potrero, NoPa and Union Square. Its [brand menu](https://www.bobaguys.com/english-menu) supports the strawberry matcha latte; location stock, food and prices are unconfirmed.

The expanded collection has 17 locations. Brand-menu listings are distinguished in their notes from individually verified local-menu prices. No local price is inferred from a national brand menu. Approximate pins still require a venue-by-venue geocoding pass before presenting them as entrance-accurate.
