import 'maplibre-gl/dist/maplibre-gl.css';
import './matcha/matcha.css';
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
maplibregl.setWorkerUrl(workerUrl);
import { venues, businessLabels, foodLabels, defaultFilters, filterVenues, priceLabel, type Venue } from './matcha/data';

const cup = `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M11 20h24l-3 18H14l-3-18Z" fill="currentColor" opacity=".16"/><path d="M11 20h24l-3 18H14l-3-18Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M35 23h3a5 5 0 0 1-4 10M8 41h29M19 15c-5-5 4-5 0-10m9 10c-5-5 4-5 0-10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="23" cy="20" rx="12" ry="3" fill="currentColor"/></svg>`;
const searchIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
const root = document.querySelector<HTMLDivElement>('#app')!;
root.innerHTML = `
<header class="site-header"><a class="brand" href="${import.meta.env.BASE_URL}" aria-label="Matcha in SF home"><span class="brand-icon">${cup}</span><span>matcha<span class="brand-serif"> in </span>sf<span class="brand-dot">.</span></span></a><div class="header-note">A LITTLE GREEN IN THE CITY</div><nav aria-label="Main"><button id="explore" class="nav-link active" aria-pressed="true">Explore</button><button id="saved" class="nav-link" aria-pressed="false">Saved <span id="saved-count">0</span></button><button id="about" class="nav-link about-button" aria-label="About this guide">About <span>↗</span></button></nav></header>
<main class="workspace"><aside class="sidebar" aria-label="Find matcha"><div class="intro"><div class="eyebrow"><span class="little-star">✳</span> SAN FRANCISCO, CA</div><h1>Your next<br><em>matcha moment.</em></h1><p>Find your cup, from neighborhood favorites<br class="desktop-break"> to a little something new.</p><div class="intro-stamp" aria-hidden="true">${cup}<span>sip local<br>stay curious</span></div></div>
<div class="filter-area"><label class="search-box">${searchIcon}<input id="search" type="search" placeholder="A café, a neighborhood, a craving…" aria-label="Search cafés or neighborhoods"><kbd>⌕</kbd></label>
<div class="quick-filters" aria-label="Quick filters"><button id="boutique" aria-pressed="false">✳ Boutique</button><button id="with-food" aria-pressed="false">◒ With a meal</button><button id="under-seven" aria-pressed="false">$7 & under</button></div>
<details id="filters"><summary><span>Fine-tune your cup</span><span class="filter-summary">Filters <span id="filter-count"></span> <span>⌄</span></span></summary><div class="filter-grid"><label>Kind of place<select id="business"><option value="">All places</option><option value="boutique">Boutique</option><option value="local">Local group</option><option value="chain">Chain</option></select></label><label>Something to eat<select id="food"><option value="">Any food options</option><option value="meals">Serves meals</option><option value="sweets">Sweets & bites</option><option value="drinks">Drinks only</option><option value="unknown">Food unconfirmed</option></select></label><label>The menu<select id="focus"><option value="">All menus</option><option value="specialty">Matcha-focused</option><option value="cafe">Broader café / restaurant</option></select></label><label>Your drink<select id="drink"><option value="">Any matcha drink</option><option value="latte">Matcha latte</option><option value="tea">Straight matcha / tea</option></select></label><label>Listed drink price<select id="budget"><option value="">Any price</option><option value="5">$5 & under</option><option value="7">$7 & under</option><option value="8">$8 & under</option></select></label><button id="reset" class="reset">Reset filters ↺</button></div></details></div>
<div class="results-heading"><h2><span id="result-count">${venues.length}</span> places to pause</h2><label class="sort-label">Sort <select id="sort" aria-label="Sort places"><option value="name">A–Z</option><option value="price">Price: low to high</option></select></label></div><div id="results" class="results"></div><footer class="sidebar-footer">A growing collection, one cup at a time. <button id="coverage">About the data ↗</button></footer></aside>
<section class="map-panel" aria-label="San Francisco matcha map"><div id="map" role="region" aria-label="Interactive map of matcha places in San Francisco"></div><div class="map-heading"><span class="map-live-dot"></span> THE CITY, ONE CUP AT A TIME <span class="map-area">SF / 37.77° N</span></div><button id="fit" class="fit-button" title="Show all matching places">⌖ <span>Show all places</span></button><div id="map-status" class="map-status" role="status" hidden></div><div id="detail" class="detail" role="region" aria-label="Place details" hidden></div><div class="map-bottom"><div class="map-legend"><span><i class="dot boutique"></i>Boutique</span><span><i class="dot local"></i>Local group</span><span><i class="dot chain"></i>Chain</span></div><div class="map-note">Good things come in green.<span>Approximate pins · San Francisco only</span></div></div></section></main><button id="mobile-view" class="mobile-view" aria-pressed="false">Explore the map ↗</button>
<dialog id="about-dialog"><button class="dialog-close" aria-label="Close about">×</button><div class="eyebrow">A SMALL GUIDE TO A BIG LOVE</div><h2>Meet your next<br><em>green obsession.</em></h2><p>A growing, curated collection of places to get matcha within San Francisco. This first edition has ${venues.length} locations; it is not a complete directory.</p><h3>A price you can trace</h3><p>Prices are published online menu prices for the named drink, viewed November 9, 2026. They may differ in-store and exclude tax, tips, milk swaps and extras. Cup sizes vary. Unknown prices are marked “Check menu” and excluded from price filters. Straight tea and lattes are separate drink categories.</p><h3>Find your kind of place</h3><p><b>Boutique:</b> a standalone specialist. <b>Local group:</b> a small local or regional operator. <b>Chain:</b> a wider multi-location brand or franchise. These are editorial categories, not ownership certifications.</p><p>“Matcha-focused” describes a menu centered on matcha; it does not mean matcha is the only drink sold. Food labels describe published menus, not real-time availability. Pins are approximate address locations.</p><p>Saved places stay in this browser. This guide does not track your location.</p><p class="credits">Adapted from <a href="https://github.com/happyTaher/crop-map" target="_blank" rel="noopener noreferrer">the California crop map</a>. Map tiles by OpenFreeMap. Map data © OpenMapTiles and OpenStreetMap contributors.</p></dialog>`;

const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
let saved = new Set<string>();
try { const stored: unknown = JSON.parse(localStorage.getItem('sf-matcha-saved') ?? '[]'); if (Array.isArray(stored)) saved = new Set(stored.filter((x): x is string => typeof x === 'string' && venues.some(v => v.id === x))); } catch { /* Storage may be unavailable. */ }
let filters = defaultFilters();
let selected: string | null = null;
let selectionFromList = false;
let matches: Venue[] = [];
const markers = new Map<string, maplibregl.Marker>();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cityBounds: maplibregl.LngLatBoundsLike = [[-122.518,37.708],[-122.355,37.817]];
let map: maplibregl.Map | null = null;
try {
  map = new maplibregl.Map({ container: 'map', center: [-122.440,37.766], zoom: 12.1,
    maxBounds: [[-122.57,37.55],[-122.32,37.98]], minZoom: 10.5, maxZoom: 17, maxPitch: 0, renderWorldCopies: false,
    style: 'https://tiles.openfreemap.org/styles/positron',
    attributionControl: { compact: true }, pitchWithRotate: false, dragRotate: false });
  map.touchZoomRotate.disableRotation();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
  map.on('error', () => { el('map-status').hidden = false; el('map-status').textContent = 'Map tiles couldn’t load. You can still browse every place in the list.'; });
  map.on('move', layoutMarkers);
  map.on('resize', layoutMarkers);
} catch { el('map-status').hidden = false; el('map-status').textContent = 'The map isn’t available in this browser. Explore all the places in the list.'; }
function fit() {
  if (!map) return;
  const bounds = new maplibregl.LngLatBounds(); matches.forEach(v => bounds.extend(v.coordinates));
  map.fitBounds(matches.length ? bounds : cityBounds, { padding: { top: 110, bottom: 130, left: 70, right: 75 }, maxZoom: 14, duration: reducedMotion ? 0 : 650 });
}
function setMapView(visible: boolean) {
  document.body.classList.toggle('show-map', visible);
  el('mobile-view').textContent = visible ? 'See the places ☰' : 'Explore the map ↗';
  el('mobile-view').setAttribute('aria-pressed', String(visible));
  map?.resize();
}

// Nearby cafés share city blocks. Offset only their labels, keeping the actual coordinates intact.
function layoutMarkers() {
  if (!map) return;
  type Rect = { left: number; top: number; right: number; bottom: number };
  const placed: Rect[] = [];
  const viewport = map.getContainer();
  const directions: [number, number][] = [];
  for (let x = -7; x <= 7; x++) for (let y = -7; y <= 7; y++) directions.push([x * 70,y * 44]);
  directions.sort((a,b) => a[0] ** 2 + a[1] ** 2 - b[0] ** 2 - b[1] ** 2);
  for (const [id, marker] of markers) {
    const venue = matches.find(v => v.id === id);
    if (!venue) continue;
    const p = map.project(venue.coordinates);
    // An offscreen café stays offscreen as the camera moves.
    if (p.x < 0 || p.x > viewport.clientWidth || p.y < 0 || p.y > viewport.clientHeight) {
      marker.setOffset([0,0]); continue;
    }
    const node = marker.getElement();
    const width = node.offsetWidth || 70;
    const height = node.offsetHeight || 36;
    const rectangle = (dx: number,dy: number): Rect => ({
      left: p.x + dx - width / 2 - 5, right: p.x + dx + width / 2 + 5,
      top: p.y + dy - height - 5, bottom: p.y + dy + 5,
    });
    const available = (rect: Rect): boolean => rect.left >= 8 && rect.right <= viewport.clientWidth - 8
      && rect.top >= 45 && rect.bottom <= viewport.clientHeight - 55
      && !placed.some(other => rect.left < other.right && rect.right > other.left && rect.top < other.bottom && rect.bottom > other.top);
    let chosen = directions.find(([dx,dy]) => available(rectangle(dx,dy)));
    // Dense downtown blocks may exhaust the local rings. Find the closest free position
    // across the visible map rather than reverting to a label that covers another café.
    if (!chosen) {
      let distance = Infinity;
      for (let x = width / 2 + 13; x <= viewport.clientWidth - width / 2 - 13; x += 8) {
        for (let y = height + 50; y <= viewport.clientHeight - 60; y += 8) {
          const dx = x - p.x, dy = y - p.y;
          const candidateDistance = dx * dx + dy * dy;
          if (candidateDistance < distance && available(rectangle(dx,dy))) {
            chosen = [dx,dy]; distance = candidateDistance;
          }
        }
      }
    }
    if (chosen) placed.push(rectangle(...chosen));
    marker.setOffset(chosen ?? [0,0]);
  }
}

function toggleSaved(id: string) {
  if (saved.has(id)) saved.delete(id); else saved.add(id);
  try { localStorage.setItem('sf-matcha-saved', JSON.stringify([...saved])); } catch { /* Saved state remains available for this visit. */ }
  render();
}
function showDetail(v: Venue, focus = false) {
  selected = v.id;
  const panel = el('detail'); panel.hidden = false;
  panel.innerHTML = `<button class="detail-close" aria-label="Close place details">×</button><div class="detail-cup ${v.business}">${cup}</div><div class="eyebrow">${v.neighborhood}</div><h2>${v.name}</h2><p class="detail-address">${v.address}, San Francisco</p><div class="tags"><span class="tag ${v.business}">${businessLabels[v.business]}</span><span class="tag">${foodLabels[v.food]}</span></div><p class="detail-description">${v.note}</p><div class="drink-price"><div><span>YOUR CUP</span><b>${v.drink}</b></div><strong>${priceLabel(v)}</strong></div><p class="price-context">${v.price === null ? 'No published price verified. Check the linked menu.' : 'Published online price · before tax & extras'}<br>Menu viewed Nov 9, 2026 · size may vary</p><div class="food-note"><span>ON THE SIDE</span><p>${v.foodNote}</p></div><div class="detail-actions"><a class="directions" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${v.name}, ${v.address}, San Francisco, CA`)}" target="_blank" rel="noopener noreferrer">Get directions ↗</a><button class="detail-save" aria-pressed="${saved.has(v.id)}">${saved.has(v.id) ? '♥ Saved' : '♡ Save'}</button></div><a class="source-link" href="${v.source}" target="_blank" rel="noopener noreferrer">View menu & price source ↗</a>${v.locationSource ? `<a class="source-link" href="${v.locationSource}" target="_blank" rel="noopener noreferrer">Location source ↗</a>` : ''}`;
  panel.querySelector('.detail-close')!.addEventListener('click', closeDetail);
  panel.querySelector('.detail-save')!.addEventListener('click', () => toggleSaved(v.id));
  updateSelection();
  if (focus) panel.querySelector<HTMLButtonElement>('.detail-close')!.focus();
}
function select(v: Venue, fromList = false) {
  selectionFromList = fromList;
  if (window.innerWidth <= 760) setMapView(true);
  showDetail(v, true);
  map?.easeTo({ center: v.coordinates, zoom: Math.max(map.getZoom(),13), offset: window.innerWidth > 1000 ? [-140,0] : [0,-80], duration: reducedMotion ? 0 : 650 });
}
function closeDetail() {
  const id = selected; selected = null; el('detail').hidden = true; updateSelection();
  if (selectionFromList && window.innerWidth <= 760) setMapView(false);
  if (id) {
    const trigger = document.querySelector<HTMLButtonElement>(!selectionFromList && map
      ? `[data-marker="${id}"]` : `[data-open="${id}"]`);
    trigger?.focus();
  }
}
function updateSelection() {
  document.querySelectorAll<HTMLElement>('[data-venue]').forEach(card => card.classList.toggle('selected',card.dataset.venue === selected));
  markers.forEach((marker,id) => { marker.getElement().classList.toggle('selected',id === selected); marker.getElement().setAttribute('aria-pressed',String(id === selected)); });
}
function render() {
  const active = document.activeElement as HTMLElement | null;
  const focusedSaveId = active?.dataset.save;
  const focusedMarkerId = active?.dataset.marker;
  const focusedDetailSave = active?.classList.contains('detail-save');
  matches = filterVenues(venues,filters,saved);
  if (selected && !matches.some(v => v.id === selected)) {
    selected = null; el('detail').hidden = true;
    if (window.innerWidth <= 760) setMapView(false);
  }
  el('saved-count').textContent = String(saved.size);
  el('result-count').textContent = String(matches.length);
  el('results').innerHTML = matches.length ? matches.map((v,i) => `<article class="venue-card" data-venue="${v.id}"><button class="card-open" data-open="${v.id}" aria-label="View ${v.name}, ${v.neighborhood}"><span class="card-cup ${v.business}">${cup}<span>${String(i+1).padStart(2,'0')}</span></span><span class="card-main"><span class="card-neighborhood">${v.neighborhood}</span><h3>${v.name}</h3><span class="card-tags"><span class="business-text ${v.business}"><i></i>${businessLabels[v.business]}</span><span>·</span><span>${foodLabels[v.food]}</span></span><span class="card-drink">${v.drink}</span></span><span class="card-price ${v.price === null ? 'unknown' : ''}">${priceLabel(v)}<small>${v.price === null ? 'price unconfirmed' : 'listed drink'}</small></span></button><button class="save-button" data-save="${v.id}" aria-label="${saved.has(v.id) ? 'Unsave' : 'Save'} ${v.name}, ${v.neighborhood}" aria-pressed="${saved.has(v.id)}">${saved.has(v.id) ? '♥' : '♡'}</button></article>`).join('') : '<div class="empty"><span>⌕</span><h3>No cups found. Yet.</h3><p>Try another neighborhood or loosen your filters. This is a small, growing collection.</p><button id="clear-empty">Clear filters</button></div>';
  el('results').querySelectorAll<HTMLButtonElement>('[data-open]').forEach(b => b.addEventListener('click',() => select(venues.find(v => v.id === b.dataset.open)!, true)));
  el('results').querySelectorAll<HTMLButtonElement>('[data-save]').forEach(b => b.addEventListener('click',() => toggleSaved(b.dataset.save!)));
  document.getElementById('clear-empty')?.addEventListener('click', reset);
  for (const marker of markers.values()) marker.remove(); markers.clear();
  if (map) matches.forEach(v => {
    const button = document.createElement('button'); button.type = 'button'; button.className = `map-pin ${v.business}`;
    button.dataset.marker = v.id;
    button.innerHTML = `<span class="pin-dot"></span>${v.price === null ? '🍵' : priceLabel(v)}`;
    button.setAttribute('aria-label',`${v.name}, ${v.neighborhood}, ${priceLabel(v)}`); button.title = `${v.name} · ${v.neighborhood}`;
    button.addEventListener('click',() => select(v));
    markers.set(v.id,new maplibregl.Marker({ element: button, anchor: 'bottom' }).setLngLat(v.coordinates).addTo(map!));
  });
  if (selected) showDetail(venues.find(v => v.id === selected)!);
  updateSelection();
  syncControls();
  layoutMarkers();
  if (focusedSaveId) (document.querySelector<HTMLButtonElement>(`[data-save="${focusedSaveId}"]`) ?? document.querySelector<HTMLButtonElement>('#clear-empty') ?? el<HTMLButtonElement>('saved')).focus();
  else if (focusedDetailSave) (document.querySelector<HTMLButtonElement>('#detail:not([hidden]) .detail-save') ?? document.querySelector<HTMLButtonElement>('#clear-empty') ?? el<HTMLButtonElement>('saved')).focus();
  else if (focusedMarkerId) document.querySelector<HTMLButtonElement>(`[data-marker="${focusedMarkerId}"]`)?.focus();
}
function syncControls() {
  for (const key of ['business','food','focus','drink','sort'] as const) el<HTMLSelectElement>(key).value = filters[key];
  el<HTMLSelectElement>('budget').value = filters.budget === null ? '' : String(filters.budget);
  el<HTMLInputElement>('search').value = filters.query;
  el('boutique').setAttribute('aria-pressed', String(filters.business === 'boutique'));
  el('with-food').setAttribute('aria-pressed', String(filters.food === 'meals'));
  el('under-seven').setAttribute('aria-pressed', String(filters.budget === 7));
  el('saved').classList.toggle('active',filters.savedOnly); el('saved').setAttribute('aria-pressed',String(filters.savedOnly));
  el('explore').classList.toggle('active',!filters.savedOnly); el('explore').setAttribute('aria-pressed',String(!filters.savedOnly));
  const count = [filters.business,filters.food,filters.focus,filters.drink,filters.budget].filter(v => v !== '' && v !== null).length;
  el('filter-count').textContent = count ? `(${count})` : '';
}
function reset() { filters = defaultFilters(); render(); fit(); }
el<HTMLInputElement>('search').addEventListener('input',e => { filters.query = (e.target as HTMLInputElement).value; render(); });
for (const key of ['business','food','focus','drink','sort'] as const) el(key).addEventListener('change',e => { filters[key] = (e.target as HTMLSelectElement).value; render(); });
el('budget').addEventListener('change',e => { const value = (e.target as HTMLSelectElement).value; filters.budget = value ? Number(value) : null; render(); });
el('boutique').addEventListener('click',() => { filters.business = filters.business === 'boutique' ? '' : 'boutique'; render(); });
el('with-food').addEventListener('click',() => { filters.food = filters.food === 'meals' ? '' : 'meals'; render(); });
el('under-seven').addEventListener('click',() => { filters.budget = filters.budget === 7 ? null : 7; render(); });
el('reset').addEventListener('click',reset);
el('fit').addEventListener('click',fit);
el('saved').addEventListener('click',() => { filters.savedOnly = true; setMapView(false); render(); fit(); });
el('explore').addEventListener('click',() => { filters.savedOnly = false; setMapView(false); render(); fit(); });
const dialog = el<HTMLDialogElement>('about-dialog');
for (const id of ['about','coverage']) el(id).addEventListener('click',() => dialog.showModal());
dialog.querySelector('.dialog-close')!.addEventListener('click',() => dialog.close());
dialog.addEventListener('click',e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
window.addEventListener('keydown',e => { if (e.key === 'Escape' && selected && !dialog.open) closeDetail(); });
el('mobile-view').addEventListener('click',() => {
  const visible = !document.body.classList.contains('show-map');
  setMapView(visible);
  if (visible) fit();
});
render(); map?.once('load', fit);
