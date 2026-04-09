# 🌸 Sakura Deutschland

An interactive cherry blossom map of Germany. Find peak bloom spots, hidden gems, and plan your visit — all in one place.

## What it does

- **88 cherry blossom locations** across all 16 German states, from Bonn's iconic Heerstraße to hidden residential alleys in Aachen
- **Interactive Leaflet map** with Germany highlighted in blossom pink, colored dot markers by bloom status, and fly-to animation on selection
- **Side panel** with live search, bloom status filters (Peak / Partial / Budding), region filters, and a Hidden Gems tab
- **Spot detail overlay** with full description, crowd level, transit info, tags, and a Get Directions link to Google Maps
- **Falling petal animation** — clicking a peak-bloom card triggers a sakura petal shower over the map
- **Ambient music player** — lofi sakura café background music with play/pause, seek, and volume control; music by [LoFi Tokyo](https://youtu.be/IUxgb_qinNE?si=u7Wb_xo_SsWxEHpF) on YouTube
- **DE / EN language toggle** — full bilingual support across all UI text and spot descriptions

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Leaflet](https://leafletjs.com/) (vanilla, not react-leaflet) for the map
- [CartoDB Light](https://carto.com/basemaps/) tile layer
- [Germany GeoJSON](https://github.com/isellsoap/deutschlandGeoJSON) for the country border overlay
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) + [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) via Google Fonts
- Canvas API for the falling petal animation
- No CSS framework — all styling is inline or minimal global CSS

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Music credit

Background music: **Lofi Chill at a Sakura Café** by **LoFi Tokyo**  
[Watch on YouTube →](https://youtu.be/IUxgb_qinNE?si=u7Wb_xo_SsWxEHpF)
