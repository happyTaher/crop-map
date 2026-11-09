import { MATCHA_URL } from '../config';

export interface MatchaShop {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  lng: number;
  lat: number;
  /** Hot matcha latte, base price in USD before tax and add-ons; null when no price was found. */
  price: number | null;
  /** True when the price comes from the shop's own menu or ordering page (not delivery apps or reviews). */
  priceConfirmed: boolean;
  chain: boolean;
  /** Sells food (meals, sandwiches, pastries) beyond matcha drinks and desserts. */
  food: boolean;
  source: string;
  note?: string;
}

export interface MatchaData {
  checked: string;
  item: string;
  shops: MatchaShop[];
}

export type Kind = 'chain' | 'boutique';
export type Menu = 'matcha' | 'food';

export interface MatchaFilters {
  kinds: ReadonlySet<Kind>;
  menus: ReadonlySet<Menu>;
  /** Shops priced above this are hidden; null means no limit. */
  maxPrice: number | null;
  includeUnpriced: boolean;
}

export const ALL_FILTERS: MatchaFilters = {
  kinds: new Set<Kind>(['chain', 'boutique']),
  menus: new Set<Menu>(['matcha', 'food']),
  maxPrice: null,
  includeUnpriced: true,
};

export const kindOf = (shop: MatchaShop): Kind => (shop.chain ? 'chain' : 'boutique');
export const menuOf = (shop: MatchaShop): Menu => (shop.food ? 'food' : 'matcha');

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

function parseShop(raw: unknown, index: number): MatchaShop {
  const fail = (field: string): never => {
    throw new Error(`matcha.json: shop ${index} has an invalid "${field}"`);
  };
  if (!isRecord(raw)) return fail('record');
  const str = (k: string): string => (typeof raw[k] === 'string' && raw[k] !== '' ? (raw[k] as string) : fail(k));
  const num = (k: string): number => (typeof raw[k] === 'number' && Number.isFinite(raw[k]) ? (raw[k] as number) : fail(k));
  const bool = (k: string): boolean => (typeof raw[k] === 'boolean' ? (raw[k] as boolean) : fail(k));
  const price = raw.price === null ? null : num('price');
  if (price !== null && price <= 0) fail('price');
  const shop: MatchaShop = {
    id: str('id'),
    name: str('name'),
    address: str('address'),
    neighborhood: str('neighborhood'),
    lng: num('lng'),
    lat: num('lat'),
    price,
    priceConfirmed: price !== null && bool('priceConfirmed'),
    chain: bool('chain'),
    food: bool('food'),
    source: str('source'),
  };
  if (typeof raw.note === 'string' && raw.note !== '') shop.note = raw.note;
  return shop;
}

export function parseMatcha(raw: unknown): MatchaData {
  if (!isRecord(raw) || !Array.isArray(raw.shops)) throw new Error('matcha.json: missing "shops"');
  const shops = raw.shops.map(parseShop);
  const ids = new Set<string>();
  for (const s of shops) {
    if (ids.has(s.id)) throw new Error(`matcha.json: duplicate id "${s.id}"`);
    ids.add(s.id);
  }
  return {
    checked: typeof raw.checked === 'string' ? raw.checked : '',
    item: typeof raw.item === 'string' ? raw.item : 'Matcha latte',
    shops,
  };
}

export async function loadMatcha(url: string = MATCHA_URL): Promise<MatchaData> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`matcha.json: HTTP ${res.status}`);
  return parseMatcha(await res.json());
}

export function matchesFilters(shop: MatchaShop, filters: MatchaFilters): boolean {
  if (!filters.kinds.has(kindOf(shop)) || !filters.menus.has(menuOf(shop))) return false;
  if (shop.price === null) return filters.includeUnpriced;
  return filters.maxPrice === null || shop.price <= filters.maxPrice;
}

/** Cheapest first; shops without a price go last, alphabetically. */
export function sortByPrice(shops: readonly MatchaShop[]): MatchaShop[] {
  return [...shops].sort((a, b) => {
    if (a.price !== null && b.price !== null && a.price !== b.price) return a.price - b.price;
    if (a.price === null && b.price !== null) return 1;
    if (a.price !== null && b.price === null) return -1;
    return a.name.localeCompare(b.name);
  });
}

/** "$6.50", "~$7.00" for an unconfirmed price, "$?" when there is none. */
export function formatPrice(shop: Pick<MatchaShop, 'price' | 'priceConfirmed'>): string {
  if (shop.price === null) return '$?';
  return `${shop.priceConfirmed ? '' : '~'}$${shop.price.toFixed(2)}`;
}

/** Whole-dollar bounds that cover every priced shop, for the price slider. */
export function priceBounds(shops: readonly MatchaShop[]): [number, number] | null {
  const prices = shops.flatMap((s) => (s.price === null ? [] : [s.price]));
  if (prices.length === 0) return null;
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
}
