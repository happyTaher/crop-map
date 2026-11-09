import { describe, expect, it } from 'vitest';
import { venues, filterVenues, defaultFilters, type Venue } from './data';

// Fixtures keep filtering checks independent of changes to the live venue collection.
const base = venues[0]!;
const fixtures: Venue[] = [
  { ...base, id: 'latte', name: 'Alpha', neighborhood: 'Mission', address: '100 Test St', business: 'boutique', food: 'meals', specialty: true, drinkType: 'latte', price: 7 },
  { ...base, id: 'tea', name: 'Beta', neighborhood: 'Japantown', business: 'chain', food: 'sweets', specialty: true, drinkType: 'tea', price: 3 },
  { ...base, id: 'unknown', name: 'Gamma', neighborhood: 'Sunset', business: 'local', food: 'unknown', specialty: false, drinkType: 'latte', price: null },
];
describe('SF matcha discovery', () => {
  it('excludes unknown prices from budgets and includes prices equal to the limit', () => {
    expect(filterVenues(fixtures, { ...defaultFilters(), budget: 7 }, new Set()).map(v => v.id)).toEqual(['latte','tea']);
    expect(filterVenues(fixtures, { ...defaultFilters(), budget: 5 }, new Set()).map(v => v.id)).toEqual(['tea']);
  });
  it('combines drink, food and business filters rather than mixing tea with latte prices', () => {
    const result = filterVenues(fixtures, { ...defaultFilters(), drink: 'latte', food: 'meals', business: 'boutique' }, new Set());
    expect(result.map(v => v.id)).toEqual(['latte']);
    expect(filterVenues(fixtures, { ...defaultFilters(), drink: 'latte', business: 'chain' }, new Set())).toEqual([]);
  });
  it('keeps matcha specialists separate from food offerings', () => {
    expect(filterVenues(fixtures, { ...defaultFilters(), focus: 'specialty', food: 'meals' }, new Set()).map(v => v.id)).toEqual(['latte']);
    expect(filterVenues(fixtures, { ...defaultFilters(), focus: 'cafe' }, new Set()).map(v => v.id)).toEqual(['unknown']);
  });
  it('searches names, neighborhoods and addresses without case sensitivity', () => {
    for (const query of ['  ALPHA  ','MISSION','100 Test']) {
      expect(filterVenues(fixtures, { ...defaultFilters(), query }, new Set()).map(v => v.id)).toEqual(['latte']);
    }
  });
  it('sorts unknown prices last and limits saved mode to saved entries', () => {
    expect(filterVenues(fixtures, { ...defaultFilters(), sort: 'price' }, new Set()).map(v => v.id)).toEqual(['tea','latte','unknown']);
    expect(filterVenues(fixtures, { ...defaultFilters(), savedOnly: true }, new Set(['latte'])).map(v => v.id)).toEqual(['latte']);
    expect(filterVenues(fixtures, { ...defaultFilters(), savedOnly: true }, new Set())).toEqual([]);
  });
  it('has unique IDs, SF coordinates, source links, dates and valid prices', () => {
    expect(new Set(venues.map(v => v.id)).size).toBe(venues.length);
    for (const v of venues) {
      expect(v.coordinates[0]).toBeGreaterThan(-122.52); expect(v.coordinates[0]).toBeLessThan(-122.35);
      expect(v.coordinates[1]).toBeGreaterThan(37.708); expect(v.coordinates[1]).toBeLessThan(37.82);
      expect(v.source).toMatch(/^https:\/\//); expect(v.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(v.price === null || (v.price > 0 && Number.isFinite(v.price))).toBe(true);
    }
  });
});
