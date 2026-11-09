import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/shell.css';
import '../styles/boot.css';
import './matcha.css';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import { showMap } from '../lib/ready';
import { buildBasemapStyle } from '../style/basemap';
import { el } from '../ui/format';
import { SF_BOUNDS_LITERAL } from './bounds';
import {
  ALL_FILTERS,
  formatPrice,
  kindOf,
  loadMatcha,
  matchesFilters,
  menuOf,
  priceBounds,
  sortByPrice,
  type Kind,
  type MatchaData,
  type MatchaFilters,
  type MatchaShop,
  type Menu,
} from './data';

const SF_BOUNDS: [[number, number], [number, number]] = [
  [...SF_BOUNDS_LITERAL[0]],
  [...SF_BOUNDS_LITERAL[1]],
];
/** Extra room to pan past the city, in degrees; wide enough to slide the west side out from under the list. */
const PAN_ALLOWANCE = { lng: 0.12, lat: 0.05 } as const;
/** Zoom floor: about the whole city on a phone. */
const MIN_ZOOM = 11.5;

/** Keeps the city clear of the shop list: on the left on desktop, along the bottom on phones. */
const framePadding = (): maplibregl.PaddingOptions =>
  window.innerWidth <= 720
    ? { top: 24, right: 24, bottom: Math.round(window.innerHeight * 0.5), left: 24 }
    : { top: 24, right: 64, bottom: 24, left: 380 };

const container = document.getElementById('map');
const app = document.getElementById('app');
if (!container || !app) throw new Error('#map container missing');

maplibregl.addProtocol('pmtiles', new Protocol().tile);

/** The California veil and sticker shadow frame the whole state; inside one city they only wash the streets out. */
const STATE_ONLY_LAYERS = new Set(['outside_ca_veil', 'ca_sticker_shadow']);
const style = buildBasemapStyle(window.location.origin, import.meta.env.BASE_URL);
style.layers = style.layers.filter((layer) => !STATE_ONLY_LAYERS.has(layer.id));

const [[west, south], [east, north]] = SF_BOUNDS;
const map = new maplibregl.Map({
  container,
  style,
  center: [(west + east) / 2, (south + north) / 2],
  zoom: MIN_ZOOM,
  minZoom: MIN_ZOOM,
  maxZoom: 17,
  maxBounds: [
    [west - PAN_ALLOWANCE.lng, south - PAN_ALLOWANCE.lat],
    [east + PAN_ALLOWANCE.lng, north + PAN_ALLOWANCE.lat],
  ],
  maxPitch: 0,
  pitchWithRotate: false,
  touchPitch: false,
  dragRotate: false,
  attributionControl: false,
  renderWorldCopies: false,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
});
const fit = map.cameraForBounds(SF_BOUNDS, { padding: framePadding() });
if (fit?.center) map.jumpTo({ center: fit.center, zoom: Math.max(MIN_ZOOM, fit.zoom ?? MIN_ZOOM) });
map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

const KIND_LABEL: Record<Kind, string> = { chain: 'Chain', boutique: 'Boutique' };
const MENU_LABEL: Record<Menu, string> = { matcha: 'Matcha & sweets only', food: 'Serves food' };

function shopCard(shop: MatchaShop, item: string): HTMLElement {
  const card = el('div', 'matcha-card');
  card.append(el('h2', 'matcha-card__name', shop.name), el('p', 'matcha-card__where', `${shop.neighborhood} · ${shop.address}`));
  const price = el('p', 'matcha-card__price');
  price.append(el('strong', '', formatPrice(shop)), el('span', '', ` ${item.toLowerCase()}`));
  card.append(price);
  const status =
    shop.price === null
      ? 'No price found yet'
      : shop.priceConfirmed
        ? 'From the shop’s own menu'
        : 'Unconfirmed: from a delivery app, review or sister location';
  card.append(el('p', `matcha-card__status${shop.priceConfirmed ? ' is-confirmed' : ''}`, status));
  if (shop.note) card.append(el('p', 'matcha-card__note', shop.note));
  const tags = el('div', 'matcha-card__tags');
  tags.append(
    el('span', `matcha-tag is-${kindOf(shop)}`, KIND_LABEL[kindOf(shop)]),
    el('span', `matcha-tag is-${menuOf(shop)}`, MENU_LABEL[menuOf(shop)]),
  );
  card.append(tags);
  const link = el('a', 'matcha-card__source', 'Price source');
  link.href = shop.source;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  card.append(link);
  return card;
}

function pinElement(shop: MatchaShop): HTMLButtonElement {
  const pin = el('button', `matcha-pin is-${kindOf(shop)} is-${menuOf(shop)}`);
  pin.type = 'button';
  pin.setAttribute('aria-label', `${shop.name}, ${formatPrice(shop)}`);
  pin.append(el('span', 'matcha-pin__dot'), el('span', 'matcha-pin__price', formatPrice(shop)));
  return pin;
}

function chip(label: string, className: string, on: boolean, toggle: (on: boolean) => void): HTMLButtonElement {
  const button = el('button', `matcha-chip ${className}`, label);
  button.type = 'button';
  button.setAttribute('aria-pressed', String(on));
  button.addEventListener('click', () => {
    const next = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(next));
    toggle(next);
  });
  return button;
}

function mountApp(data: MatchaData): void {
  const popup = new maplibregl.Popup({ closeButton: true, maxWidth: '300px', offset: 18, className: 'matcha-popup' });
  const filters: MatchaFilters = {
    kinds: new Set(ALL_FILTERS.kinds),
    menus: new Set(ALL_FILTERS.menus),
    maxPrice: null,
    includeUnpriced: true,
  };

  const open = (shop: MatchaShop, fly: boolean): void => {
    popup.setLngLat([shop.lng, shop.lat]).setDOMContent(shopCard(shop, data.item)).addTo(map);
    if (fly) map.flyTo({ center: [shop.lng, shop.lat], zoom: Math.max(map.getZoom(), 14.5) });
  };

  const markers = new Map<string, { marker: maplibregl.Marker; pin: HTMLButtonElement }>();
  for (const shop of data.shops) {
    const pin = pinElement(shop);
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      open(shop, false);
    });
    markers.set(shop.id, { marker: new maplibregl.Marker({ element: pin }).setLngLat([shop.lng, shop.lat]).addTo(map), pin });
  }

  const panel = el('section', 'matcha-panel glass');
  panel.setAttribute('aria-label', 'Matcha shops');
  const head = el('header', 'matcha-panel__head');
  head.append(el('h1', 'matcha-panel__title', 'Matcha in SF'), el('p', 'matcha-panel__sub', `${data.item} · checked ${data.checked}`));
  const toggle = el('button', 'matcha-panel__toggle', 'Hide list');
  toggle.type = 'button';
  toggle.addEventListener('click', () => {
    const collapsed = panel.classList.toggle('is-collapsed');
    toggle.textContent = collapsed ? 'Show list' : 'Hide list';
  });
  head.append(toggle);

  const chips = el('div', 'matcha-panel__chips');
  const setToggle = <T>(set: Set<T>, value: T) => (on: boolean) => {
    if (on) set.add(value);
    else set.delete(value);
    render();
  };
  chips.append(
    chip('Boutique', 'is-boutique', true, setToggle(filters.kinds as Set<Kind>, 'boutique')),
    chip('Chain', 'is-chain', true, setToggle(filters.kinds as Set<Kind>, 'chain')),
    chip('Matcha only', 'is-matcha', true, setToggle(filters.menus as Set<Menu>, 'matcha')),
    chip('Serves food', 'is-food', true, setToggle(filters.menus as Set<Menu>, 'food')),
  );

  const priceRow = el('label', 'matcha-panel__price');
  const bounds = priceBounds(data.shops);
  const slider = el('input');
  slider.type = 'range';
  const priceLabel = el('span', 'matcha-panel__price-label');
  if (bounds) {
    slider.min = String(bounds[0]);
    slider.max = String(bounds[1]);
    slider.step = '0.25';
    slider.value = slider.max;
  }
  const updatePrice = (): void => {
    const value = Number(slider.value);
    filters.maxPrice = bounds && value < bounds[1] ? value : null;
    priceLabel.textContent = filters.maxPrice === null ? 'Any price' : `Up to $${value.toFixed(2)}`;
  };
  slider.addEventListener('input', () => {
    updatePrice();
    render();
  });
  updatePrice();
  priceRow.append(el('span', '', 'Max price'), slider, priceLabel);

  const unpriced = el('label', 'matcha-panel__unpriced');
  const unpricedBox = el('input');
  unpricedBox.type = 'checkbox';
  unpricedBox.checked = true;
  unpricedBox.addEventListener('change', () => {
    filters.includeUnpriced = unpricedBox.checked;
    render();
  });
  unpriced.append(unpricedBox, el('span', '', 'Include shops with no price'));

  const count = el('p', 'matcha-panel__count');
  const list = el('ol', 'matcha-list');
  const legend = el('p', 'matcha-panel__legend', 'Green = boutique, blue = chain (3+ locations). Round = matcha only, square = serves food. ~ = unconfirmed price, $? = no price found.');
  panel.append(head, chips, priceRow, unpriced, count, list, legend);
  app?.append(panel);

  function render(): void {
    const visible = sortByPrice(data.shops.filter((s) => matchesFilters(s, filters)));
    const shown = new Set(visible.map((s) => s.id));
    for (const [id, { pin }] of markers) pin.hidden = !shown.has(id);
    count.textContent = `${visible.length} of ${data.shops.length} spots, cheapest first`;
    list.replaceChildren(
      ...visible.map((shop) => {
        const item = el('li');
        const button = el('button', `matcha-row is-${kindOf(shop)} is-${menuOf(shop)}`);
        button.type = 'button';
        const text = el('span', 'matcha-row__text');
        text.append(el('span', 'matcha-row__name', shop.name), el('span', 'matcha-row__meta', `${shop.neighborhood} · ${KIND_LABEL[kindOf(shop)]}`));
        button.append(el('span', 'matcha-pin__dot'), text, el('span', 'matcha-row__price', formatPrice(shop)));
        button.addEventListener('click', () => open(shop, true));
        item.append(button);
        return item;
      }),
    );
  }
  render();
}

// Not showMapWhenReady: its deferred painter left street tiles that loaded before the reveal undrawn on this page.
const loaded = new Promise<void>((resolve) => map.once('load', () => resolve()));
Promise.all([loadMatcha().then(mountApp), loaded])
  .catch((err: unknown) => console.error(err))
  .finally(showMap);
