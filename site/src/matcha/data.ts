export type Business = 'boutique' | 'local' | 'chain';
export type Food = 'meals' | 'sweets' | 'drinks' | 'unknown';
export interface Venue {
  id: string; name: string; neighborhood: string; address: string;
  coordinates: [number, number]; business: Business; food: Food;
  specialty: boolean; drink: string; drinkType: 'latte' | 'tea'; price: number | null;
  note: string; foodNote: string; source: string; locationSource?: string;
  checked: string; priceNote?: string;
}
const checked = '2026-11-09';
const maiko = { business: 'chain', food: 'sweets', specialty: true, drink: 'Matcha latte', drinkType: 'latte', price: null,
  note: 'A matcha-focused stop for lattes, soft serve and parfaits.', foodNote: 'Soft serve, parfaits and shaved ice; selection varies by location.',
  source: 'https://www.matchacafe-maiko.com/eng/menu/', locationSource: 'https://coverage-e5afaa9bdb1529a121e0b7b57b7490de.web.ordersave.com/page/california', checked } as const;
export const venues: Venue[] = [
  { id: 'constance', name: 'Constance Tea', neighborhood: 'Outer Richmond', address: '3512 Balboa St', coordinates: [-122.49734,37.77582],
    business: 'boutique', food: 'unknown', specialty: true, drink: 'Freshly milled matcha', drinkType: 'tea', price: null,
    note: 'A tea studio that mills tencha into matcha in-house on Japanese stone mills.', foodNote: 'Food options are not confirmed on the published site.',
    source: 'https://www.constancetea.com/', checked },
  { id: 'nagomi', name: 'Nagomi Café', neighborhood: 'SoMa', address: '74 New Montgomery St', coordinates: [-122.40110,37.78778],
    business: 'boutique', food: 'sweets', specialty: true, drink: 'Matcha latte', drinkType: 'latte', price: null,
    note: 'A Shizuoka matcha specialist serving hand-whisked lattes near the Palace Hotel.', foodNote: 'Soft serve is described on the café website; check the current selection.',
    source: 'https://cafenagomi.com/', checked },
  { id: 'peets-chestnut', name: 'Peet’s Coffee', neighborhood: 'Marina', address: '2080 Chestnut St', coordinates: [-122.43740,37.80047],
    business: 'chain', food: 'meals', specialty: false, drink: 'Matcha green tea latte', drinkType: 'latte', price: null,
    note: 'A familiar coffee-chain stop with matcha on the wider drinks menu. Confirm local availability when ordering.', foodNote: 'The location lists warm breakfast and pastries.',
    source: 'https://www.peets.com/products/matcha-green-tea-latte', locationSource: 'https://www.peets.com/pages/store/chestnut', checked },
  { id: 'peets-west-portal', name: 'Peet’s Coffee', neighborhood: 'West Portal', address: '54 West Portal Ave', coordinates: [-122.46633,37.73982],
    business: 'chain', food: 'meals', specialty: false, drink: 'Matcha green tea latte', drinkType: 'latte', price: null,
    note: 'A neighborhood coffee-chain branch with matcha on the brand menu. Confirm local availability when ordering.', foodNote: 'Warm breakfast is listed among this location’s amenities.',
    source: 'https://www.peets.com/products/matcha-green-tea-latte', locationSource: 'https://www.peets.com/pages/store/west-portal', checked },
  { id: 'boba-fillmore', name: 'Boba Guys', neighborhood: 'Fillmore', address: '1522 Fillmore St', coordinates: [-122.43247,37.78377],
    business: 'chain', food: 'unknown', specialty: false, drink: 'Strawberry matcha latte', drinkType: 'latte', price: null,
    note: 'The brand’s signature strawberry matcha alongside a broader milk-tea menu. Check the local menu before visiting.', foodNote: 'The published brand menu focuses on drinks; local food options are unconfirmed.',
    source: 'https://www.bobaguys.com/english-menu', locationSource: 'https://www.bobaguys.com/sf-bay-area-express', checked },
  { id: 'boba-potrero', name: 'Boba Guys', neighborhood: 'Potrero Hill', address: '1002 16th St', coordinates: [-122.39488,37.76643],
    business: 'chain', food: 'unknown', specialty: false, drink: 'Strawberry matcha latte', drinkType: 'latte', price: null,
    note: 'A Potrero branch for the brand’s strawberry matcha and other tea drinks. Check local availability.', foodNote: 'Local food options could not be confirmed from the published brand menu.',
    source: 'https://www.bobaguys.com/english-menu', locationSource: 'https://www.bobaguys.com/sf-bay-area-express', checked },
  { id: 'boba-nopa', name: 'Boba Guys', neighborhood: 'NoPa', address: '836 Divisadero St', coordinates: [-122.43780,37.77758],
    business: 'chain', food: 'unknown', specialty: false, drink: 'Strawberry matcha latte', drinkType: 'latte', price: null,
    note: 'A Divisadero stop with the brand’s layered strawberry matcha. Check the local selection before visiting.', foodNote: 'Local food options could not be confirmed from the published brand menu.',
    source: 'https://www.bobaguys.com/english-menu', locationSource: 'https://www.bobaguys.com/sf-bay-area-express', checked },
  { id: 'boba-union', name: 'Boba Guys', neighborhood: 'Union Square', address: '429 Stockton St', coordinates: [-122.40761,37.78938],
    business: 'chain', food: 'unknown', specialty: false, drink: 'Strawberry matcha latte', drinkType: 'latte', price: null,
    note: 'A central branch serving the brand’s matcha and milk-tea lineup. Check local availability.', foodNote: 'Local food options could not be confirmed from the published brand menu.',
    source: 'https://www.bobaguys.com/english-menu', locationSource: 'https://www.bobaguys.com/sf-bay-area-express', checked },
  { id: 'stonemill', name: 'Stonemill Matcha', neighborhood: 'Mission', address: '561 Valencia St', coordinates: [-122.42146,37.76309],
    business: 'boutique', food: 'meals', specialty: true, drink: 'Matcha latte', drinkType: 'latte', price: 6.50,
    note: 'Matcha and a proper lunch. A Japanese café on Valencia with classic and flavored lattes.', foodNote: 'Katsu sandos, curry, rice dishes and pastries.',
    source: 'https://order.toasttab.com/online/stonemill-matcha/item-to-matcha-latte_627e5d39-6b2d-4bd4-b81f-73f093f2c82d', locationSource: 'https://www.stonemillmatcha-us.com/menu', checked },
  { id: 'kiss-broadway', name: 'Kiss of Matcha', neighborhood: 'North Beach', address: '612 Broadway', coordinates: [-122.40761,37.79776],
    business: 'local', food: 'sweets', specialty: true, drink: 'Matcha latte', drinkType: 'latte', price: 7.57,
    note: 'A matcha-focused stop with cloud drinks, flavored lattes and a sweet side.', foodNote: 'Croffles and Japanese sweets.',
    source: 'https://kissofmatcha.order.tryperdiem.com/products/matcha-latte', locationSource: 'https://kissofmatcha.order.tryperdiem.com/locations/san-francisco', checked },
  { id: 'asha', name: 'Asha Tea House', neighborhood: 'Financial District', address: '17 Kearny St', coordinates: [-122.40368,37.78819],
    business: 'local', food: 'unknown', specialty: false, drink: 'Matcha latte', drinkType: 'latte', price: null,
    note: 'A Bay Area tea house with matcha alongside a wider tea selection.', foodNote: 'Current food selection could not be verified from the online menu.',
    source: 'https://ashateahouse.square.site/', checked },
  { id: 'junbi', name: 'Junbi', neighborhood: 'SoMa', address: '685 Market St, Suite 130', coordinates: [-122.40266,37.78816],
    business: 'chain', food: 'meals', specialty: true, drink: 'Matcha latte', drinkType: 'latte', price: 7.25,
    note: 'Matcha lattes, fruit blends and straight matcha near Market Street.', foodNote: 'Rice balls and small bites are listed; rice balls were marked out of stock when checked.',
    source: 'https://order.toasttab.com/online/junbi-sanfrancisco', locationSource: 'https://junbishop.com/pages/locations', checked },
  { ...maiko, id: 'maiko-japan', name: 'Matcha Café Maiko', neighborhood: 'Japantown', address: '1581 Webster St, #175', coordinates: [-122.43165,37.78493], locationSource: 'https://www.sfjapantown.org/directory-jpndirectory/listing/matcha-cafe-maiko/' },
  { ...maiko, id: 'maiko-china', name: 'Matcha Café Maiko', neighborhood: 'Chinatown', address: '756 Grant Ave', coordinates: [-122.40663,37.79332] },
  { ...maiko, id: 'maiko-stonestown', name: 'Matcha Café Maiko', neighborhood: 'Stonestown', address: '3251 20th Ave, Level 2 food court', coordinates: [-122.47686,37.72838], locationSource: 'https://www.stonestowngalleria.com/en/directory/' },
  { id: 'toast', name: 'Toast Eatery', neighborhood: 'West Portal', address: '160 W Portal Ave', coordinates: [-122.46799,37.73879],
    business: 'local', food: 'meals', specialty: false, drink: 'Matcha latte', drinkType: 'latte', price: 6,
    note: 'A breakfast-and-lunch stop that also serves a classic matcha latte.', foodNote: 'Breakfast plates, sandwiches and lunch.',
    source: 'https://toast.app/r/toastwestportal.com/order', checked },
  { id: 'marufuku', name: 'Marufuku Ramen', neighborhood: 'Japantown', address: '1581 Webster St, Suite 235', coordinates: [-122.43133,37.78520],
    business: 'chain', food: 'meals', specialty: false, drink: 'Iced matcha (not a latte)', drinkType: 'tea', price: 3,
    note: 'An unsweetened iced matcha to go with ramen. This listing is tea, rather than a milk-based latte.', foodNote: 'Ramen, rice bowls and Japanese small plates.',
    source: 'https://order.toasttab.com/online/marufuku-ramen-sf-1581-webster-st-suite-235/item-iced-matcha_8bfdbdfa-7c0a-4c52-ad8b-cdc25b4f6535', checked },
];
export const businessLabels: Record<Business, string> = { boutique: 'Boutique', local: 'Local group', chain: 'Chain' };
export const foodLabels: Record<Food, string> = { meals: 'Serves meals', sweets: 'Sweets & bites', drinks: 'Drinks only', unknown: 'Food unconfirmed' };
export interface Filters { query: string; business: string; food: string; focus: string; drink: string; budget: number | null; savedOnly: boolean; sort: string }
export const defaultFilters = (): Filters => ({ query: '', business: '', food: '', focus: '', drink: '', budget: null, savedOnly: false, sort: 'name' });
export function filterVenues(items: Venue[], f: Filters, saved: Set<string>): Venue[] {
  const query = f.query.trim().toLocaleLowerCase();
  return items.filter(v => (!query || `${v.name} ${v.neighborhood} ${v.address} ${v.drink}`.toLocaleLowerCase().includes(query))
    && (!f.business || v.business === f.business) && (!f.food || v.food === f.food)
    && (!f.focus || v.specialty === (f.focus === 'specialty')) && (!f.drink || v.drinkType === f.drink)
    && (f.budget === null || (v.price !== null && v.price <= f.budget)) && (!f.savedOnly || saved.has(v.id)))
    .sort((a,b) => f.sort === 'price' ? (a.price ?? Infinity) - (b.price ?? Infinity) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
}
export const priceLabel = (v: Venue): string => v.price === null ? 'Check menu' : `$${v.price.toFixed(2)}`;
