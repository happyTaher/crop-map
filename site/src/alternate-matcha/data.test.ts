import { describe, expect, it } from 'vitest';
import {
  ALL_FILTERS,
  formatPrice,
  matchesFilters,
  parseMatcha,
  priceBounds,
  sortByPrice,
  type MatchaFilters,
  type MatchaShop,
} from './data';
import { SF_BOUNDS_LITERAL } from './bounds';
import bundledMatcha from '../../public/data/matcha.json?raw';

const shop = (over: Partial<MatchaShop> = {}): MatchaShop => ({
  id: 'a',
  name: 'A',
  address: '1 Main St',
  neighborhood: 'Mission',
  lng: -122.42,
  lat: 37.76,
  price: 6.5,
  priceConfirmed: true,
  chain: false,
  food: false,
  source: 'https://example.com',
  ...over,
});

const filters = (over: Partial<MatchaFilters> = {}): MatchaFilters => ({ ...ALL_FILTERS, ...over });

describe('parseMatcha', () => {
  it('parses a valid file', () => {
    const data = parseMatcha({ checked: '2026-11-09', item: 'Hot matcha latte', shops: [shop()] });
    expect(data.shops).toHaveLength(1);
    expect(data.item).toBe('Hot matcha latte');
  });

  it('treats a null price as unconfirmed', () => {
    const data = parseMatcha({ shops: [shop({ price: null, priceConfirmed: true })] });
    expect(data.shops[0]?.priceConfirmed).toBe(false);
  });

  it('rejects bad fields and duplicate ids', () => {
    expect(() => parseMatcha({ shops: [{ ...shop(), lat: 'x' }] })).toThrow(/lat/);
    expect(() => parseMatcha({ shops: [shop({ price: 0 })] })).toThrow(/price/);
    expect(() => parseMatcha({ shops: [shop(), shop()] })).toThrow(/duplicate/);
    expect(() => parseMatcha({})).toThrow(/shops/);
  });
});

describe('matchesFilters', () => {
  it('filters by chain/boutique and food/matcha-only', () => {
    const chain = shop({ chain: true });
    expect(matchesFilters(chain, filters())).toBe(true);
    expect(matchesFilters(chain, filters({ kinds: new Set(['boutique']) }))).toBe(false);
    expect(matchesFilters(shop({ food: true }), filters({ menus: new Set(['matcha']) }))).toBe(false);
  });

  it('applies the max price and the unpriced toggle', () => {
    expect(matchesFilters(shop({ price: 7.25 }), filters({ maxPrice: 7 }))).toBe(false);
    expect(matchesFilters(shop({ price: 7 }), filters({ maxPrice: 7 }))).toBe(true);
    expect(matchesFilters(shop({ price: null }), filters({ maxPrice: 5 }))).toBe(true);
    expect(matchesFilters(shop({ price: null }), filters({ includeUnpriced: false }))).toBe(false);
  });
});

describe('sortByPrice', () => {
  it('puts the cheapest first and unpriced shops last', () => {
    const sorted = sortByPrice([
      shop({ id: 'n', name: 'Zed', price: null }),
      shop({ id: 'b', name: 'B', price: 7 }),
      shop({ id: 'm', name: 'Abe', price: null }),
      shop({ id: 'c', name: 'C', price: 5.5 }),
    ]);
    expect(sorted.map((s) => s.id)).toEqual(['c', 'b', 'm', 'n']);
  });
});

describe('formatPrice / priceBounds', () => {
  it('marks unconfirmed and missing prices', () => {
    expect(formatPrice({ price: 6.5, priceConfirmed: true })).toBe('$6.50');
    expect(formatPrice({ price: 7, priceConfirmed: false })).toBe('~$7.00');
    expect(formatPrice({ price: null, priceConfirmed: false })).toBe('$?');
  });

  it('rounds the bounds out to whole dollars', () => {
    expect(priceBounds([shop({ price: 5.5 }), shop({ price: 7.57 }), shop({ price: null })])).toEqual([5, 8]);
    expect(priceBounds([shop({ price: null })])).toBeNull();
  });
});

describe('matcha.json', () => {
  const data = parseMatcha(JSON.parse(bundledMatcha));
  const [[west, south], [east, north]] = SF_BOUNDS_LITERAL;

  it('has a 30–50 spot starter list', () => {
    expect(data.shops.length).toBeGreaterThanOrEqual(30);
    expect(data.shops.length).toBeLessThanOrEqual(50);
  });

  it('keeps every shop inside San Francisco', () => {
    for (const s of data.shops) {
      expect(s.lng, s.id).toBeGreaterThan(west);
      expect(s.lng, s.id).toBeLessThan(east);
      expect(s.lat, s.id).toBeGreaterThan(south);
      expect(s.lat, s.id).toBeLessThan(north);
    }
  });

  it('links every shop to an https source', () => {
    for (const s of data.shops) expect(s.source, s.id).toMatch(/^https:\/\//);
  });
});
