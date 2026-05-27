'use strict';

const GBIF_BASE = 'https://api.gbif.org/v1';

// FSI State of Forest Report 2023, MoEF Annual Report 2022–23
// pa = protected area count (national parks + wildlife sanctuaries)
// forest = % forest cover, threatened = approx. IUCN-listed spp.
const STATE_META = {
  'Andaman & Nicobar':     { code:'AN', area:8249,   pa:9,  forest:81.8, threatened:32, type:'UT'    },
  'Andhra Pradesh':        { code:'AP', area:162975, pa:16, forest:29.4, threatened:47, type:'state' },
  'Arunachal Pradesh':     { code:'AR', area:83743,  pa:13, forest:79.9, threatened:28, type:'state' },
  'Assam':                 { code:'AS', area:78438,  pa:27, forest:36.4, threatened:89, type:'state' },
  'Bihar':                 { code:'BR', area:94163,  pa:13, forest:9.7,  threatened:12, type:'state' },
  'Chandigarh':            { code:'CH', area:114,    pa:1,  forest:14.8, threatened:4,  type:'UT'    },
  'Chhattisgarh':          { code:'CG', area:135192, pa:14, forest:44.2, threatened:38, type:'state' },
  'Dadra & Nagar Haveli':  { code:'DN', area:491,    pa:1,  forest:42.0, threatened:5,  type:'UT'    },
  'Daman & Diu':           { code:'DD', area:112,    pa:0,  forest:20.0, threatened:3,  type:'UT'    },
  'Delhi':                 { code:'DL', area:1484,   pa:1,  forest:23.5, threatened:5,  type:'UT'    },
  'Goa':                   { code:'GA', area:3702,   pa:7,  forest:60.2, threatened:22, type:'state' },
  'Gujarat':               { code:'GJ', area:196024, pa:25, forest:15.5, threatened:31, type:'state' },
  'Haryana':               { code:'HR', area:44212,  pa:10, forest:6.0,  threatened:9,  type:'state' },
  'Himachal Pradesh':      { code:'HP', area:55673,  pa:37, forest:27.9, threatened:24, type:'state' },
  'Jammu & Kashmir':       { code:'JK', area:101387, pa:17, forest:10.2, threatened:37, type:'UT'    },
  'Jharkhand':             { code:'JH', area:79716,  pa:12, forest:29.6, threatened:19, type:'state' },
  'Karnataka':             { code:'KA', area:191791, pa:40, forest:19.6, threatened:72, type:'state' },
  'Kerala':                { code:'KL', area:38852,  pa:23, forest:52.2, threatened:83, type:'state' },
  'Lakshadweep':           { code:'LD', area:32,     pa:1,  forest:84.0, threatened:12, type:'UT'    },
  'Madhya Pradesh':        { code:'MP', area:308252, pa:37, forest:25.8, threatened:55, type:'state' },
  'Maharashtra':           { code:'MH', area:307713, pa:53, forest:20.7, threatened:66, type:'state' },
  'Manipur':               { code:'MN', area:22327,  pa:3,  forest:77.7, threatened:31, type:'state' },
  'Meghalaya':             { code:'ML', area:22429,  pa:6,  forest:76.7, threatened:29, type:'state' },
  'Mizoram':               { code:'MZ', area:21081,  pa:10, forest:84.5, threatened:21, type:'state' },
  'Nagaland':              { code:'NL', area:16579,  pa:4,  forest:75.1, threatened:18, type:'state' },
  'Odisha':                { code:'OR', area:155707, pa:20, forest:33.2, threatened:43, type:'state' },
  'Puducherry':            { code:'PY', area:479,    pa:1,  forest:8.1,  threatened:6,  type:'UT'    },
  'Punjab':                { code:'PB', area:50362,  pa:13, forest:6.1,  threatened:8,  type:'state' },
  'Rajasthan':             { code:'RJ', area:342239, pa:32, forest:4.9,  threatened:35, type:'state' },
  'Sikkim':                { code:'SK', area:7096,   pa:8,  forest:82.3, threatened:27, type:'state' },
  'Tamil Nadu':            { code:'TN', area:130058, pa:35, forest:20.3, threatened:68, type:'state' },
  'Telangana':             { code:'TS', area:112077, pa:20, forest:24.0, threatened:33, type:'state' },
  'Tripura':               { code:'TR', area:10486,  pa:6,  forest:73.7, threatened:17, type:'state' },
  'Uttar Pradesh':         { code:'UP', area:240928, pa:26, forest:9.2,  threatened:41, type:'state' },
  'Uttarakhand':           { code:'UK', area:53483,  pa:13, forest:45.4, threatened:36, type:'state' },
  'West Bengal':           { code:'WB', area:88752,  pa:21, forest:19.0, threatened:58, type:'state' },
};

// GeoJSON NAME_1 values and GBIF stateProvince variations → STATE_META key
const NAME_ALIASES = {
  'Andaman and Nicobar':          'Andaman & Nicobar',
  'Andaman And Nicobar':          'Andaman & Nicobar',
  'Andaman and Nicobar Islands':  'Andaman & Nicobar',
  'Andaman And Nicobar Islands':  'Andaman & Nicobar',
  'Andaman & Nicobar Islands':    'Andaman & Nicobar',
  'Jammu and Kashmir':            'Jammu & Kashmir',
  'Jammu And Kashmir':            'Jammu & Kashmir',
  'Jammu & Kashmir':              'Jammu & Kashmir',
  'Ladakh':                       'Jammu & Kashmir',
  'Orissa':                       'Odisha',
  'Uttaranchal':                  'Uttarakhand',
  'Dadra and Nagar Haveli':       'Dadra & Nagar Haveli',
  'Dadra And Nagar Haveli':       'Dadra & Nagar Haveli',
  'Daman and Diu':                'Daman & Diu',
  'Daman And Diu':                'Daman & Diu',
  'Pondicherry':                  'Puducherry',
  // GBIF data-quality variants
  'NCT of Delhi':                 'Delhi',
  'New Delhi':                    'Delhi',
  'Kashmir':                      'Jammu & Kashmir',
  'Arunachal':                    'Arunachal Pradesh',
  'Maharastra':                   'Maharashtra',
  'Madras':                       'Tamil Nadu',
};

const DISTRICTS = {
  'Karnataka': [
    { name:'Kodagu',            index:88, species:720, pa:4, trend:'Improving' },
    { name:'Uttara Kannada',    index:85, species:640, pa:5, trend:'Improving' },
    { name:'Dakshina Kannada',  index:82, species:590, pa:3, trend:'Stable'    },
    { name:'Chamarajanagar',    index:80, species:560, pa:3, trend:'Stable'    },
    { name:'Mysuru',            index:77, species:510, pa:3, trend:'Stable'    },
    { name:'Bengaluru Rural',   index:63, species:360, pa:2, trend:'Stable'    },
  ],
  'Kerala': [
    { name:'Wayanad',           index:90, species:780, pa:3, trend:'Sensitive' },
    { name:'Idukki',            index:87, species:720, pa:4, trend:'Stable'    },
    { name:'Palakkad',          index:78, species:540, pa:3, trend:'Stable'    },
    { name:'Thrissur',          index:74, species:460, pa:2, trend:'Stable'    },
    { name:'Thiruvananthapuram',index:72, species:430, pa:2, trend:'Stable'    },
    { name:'Ernakulam',         index:68, species:390, pa:1, trend:'Declining' },
  ],
  'Assam': [
    { name:'Golaghat (Kaziranga)', index:91, species:840, pa:3, trend:'Sensitive' },
    { name:'Dibrugarh',         index:82, species:620, pa:2, trend:'Improving' },
    { name:'Jorhat',            index:79, species:580, pa:2, trend:'Stable'    },
    { name:'Tinsukia',          index:76, species:520, pa:2, trend:'Sensitive' },
    { name:'Kamrup',            index:71, species:490, pa:2, trend:'Declining' },
    { name:'Barpeta',           index:68, species:450, pa:1, trend:'Stable'    },
  ],
  'Maharashtra': [
    { name:'Chandrapur',        index:85, species:670, pa:5, trend:'Improving' },
    { name:'Nagpur',            index:82, species:610, pa:4, trend:'Improving' },
    { name:'Ratnagiri',         index:79, species:540, pa:3, trend:'Stable'    },
    { name:'Pune',              index:76, species:520, pa:3, trend:'Improving' },
    { name:'Kolhapur',          index:74, species:490, pa:2, trend:'Stable'    },
    { name:'Nashik',            index:71, species:460, pa:2, trend:'Stable'    },
  ],
  'Madhya Pradesh': [
    { name:'Umaria',            index:83, species:630, pa:4, trend:'Stable'    },
    { name:'Mandla',            index:80, species:600, pa:4, trend:'Improving' },
    { name:'Balaghat',          index:78, species:560, pa:3, trend:'Stable'    },
    { name:'Panna',             index:76, species:520, pa:3, trend:'Improving' },
    { name:'Chhindwara',        index:73, species:470, pa:3, trend:'Stable'    },
    { name:'Bhopal',            index:59, species:310, pa:2, trend:'Stable'    },
  ],
  'Rajasthan': [
    { name:'Sawai Madhopur',    index:72, species:480, pa:2, trend:'Improving' },
    { name:'Bharatpur',         index:70, species:460, pa:2, trend:'Stable'    },
    { name:'Udaipur',           index:68, species:390, pa:3, trend:'Improving' },
    { name:'Alwar',             index:65, species:390, pa:2, trend:'Stable'    },
    { name:'Jaipur',            index:49, species:220, pa:1, trend:'Stable'    },
    { name:'Jaisalmer',         index:44, species:180, pa:2, trend:'Sensitive' },
  ],
  'Uttar Pradesh': [
    { name:'Lakhimpur Kheri',   index:78, species:540, pa:3, trend:'Improving' },
    { name:'Pilibhit',          index:74, species:420, pa:2, trend:'Stable'    },
    { name:'Varanasi',          index:56, species:260, pa:1, trend:'Stable'    },
    { name:'Lucknow',           index:51, species:210, pa:1, trend:'Stable'    },
    { name:'Agra',              index:48, species:200, pa:1, trend:'Stable'    },
    { name:'Kanpur',            index:44, species:170, pa:0, trend:'Declining' },
  ],
  'West Bengal': [
    { name:'South 24 Parganas (Sundarbans)', index:89, species:760, pa:4, trend:'Sensitive' },
    { name:'Darjeeling',        index:84, species:650, pa:3, trend:'Stable'    },
    { name:'Jalpaiguri',        index:80, species:590, pa:3, trend:'Stable'    },
    { name:'Bankura',           index:65, species:380, pa:2, trend:'Stable'    },
    { name:'Puruliya',          index:61, species:340, pa:2, trend:'Stable'    },
    { name:'Kolkata',           index:45, species:190, pa:1, trend:'Declining' },
  ],
  'Tamil Nadu': [
    { name:'Nilgiris',          index:86, species:700, pa:5, trend:'Sensitive' },
    { name:'Coimbatore',        index:78, species:530, pa:3, trend:'Stable'    },
    { name:'Theni',             index:74, species:480, pa:3, trend:'Stable'    },
    { name:'Dindigul',          index:68, species:400, pa:2, trend:'Stable'    },
    { name:'Vellore',           index:55, species:270, pa:1, trend:'Stable'    },
    { name:'Chennai',           index:44, species:180, pa:0, trend:'Declining' },
  ],
  'Uttarakhand': [
    { name:'Chamoli',           index:88, species:730, pa:4, trend:'Stable'    },
    { name:'Uttarkashi',        index:84, species:660, pa:3, trend:'Stable'    },
    { name:'Pithoragarh',       index:80, species:590, pa:3, trend:'Improving' },
    { name:'Nainital',          index:76, species:520, pa:3, trend:'Stable'    },
    { name:'Pauri Garhwal',     index:72, species:460, pa:2, trend:'Stable'    },
    { name:'Haridwar',          index:58, species:290, pa:1, trend:'Declining' },
  ],
  'Himachal Pradesh': [
    { name:'Kinnaur',           index:82, species:610, pa:4, trend:'Stable'    },
    { name:'Kullu',             index:78, species:540, pa:4, trend:'Improving' },
    { name:'Lahaul & Spiti',    index:75, species:480, pa:5, trend:'Stable'    },
    { name:'Chamba',            index:73, species:470, pa:3, trend:'Stable'    },
    { name:'Shimla',            index:67, species:390, pa:2, trend:'Stable'    },
    { name:'Mandi',             index:62, species:340, pa:2, trend:'Stable'    },
  ],
  'Odisha': [
    { name:'Mayurbhanj',        index:80, species:590, pa:3, trend:'Stable'    },
    { name:'Koraput',           index:76, species:520, pa:3, trend:'Stable'    },
    { name:'Kandhamal',         index:73, species:470, pa:2, trend:'Stable'    },
    { name:'Sundargarh',        index:70, species:440, pa:2, trend:'Stable'    },
    { name:'Gajapati',          index:68, species:400, pa:2, trend:'Stable'    },
    { name:'Bhubaneswar (Khordha)',index:52,species:230,pa:1,trend:'Stable'   },
  ],
  'Arunachal Pradesh': [
    { name:'West Kameng',       index:88, species:740, pa:4, trend:'Stable'    },
    { name:'Dibang Valley',     index:85, species:690, pa:3, trend:'Stable'    },
    { name:'Lower Subansiri',   index:82, species:640, pa:3, trend:'Stable'    },
    { name:'East Kameng',       index:80, species:610, pa:3, trend:'Stable'    },
    { name:'Papum Pare',        index:74, species:500, pa:2, trend:'Stable'    },
    { name:'Itanagar (Capital)', index:65, species:360, pa:1, trend:'Declining'},
  ],
  'Chhattisgarh': [
    { name:'Bastar',            index:82, species:620, pa:3, trend:'Stable'    },
    { name:'Narayanpur',        index:79, species:570, pa:3, trend:'Stable'    },
    { name:'Kanker',            index:74, species:480, pa:2, trend:'Stable'    },
    { name:'Bijapur',           index:72, species:450, pa:2, trend:'Stable'    },
    { name:'Surguja',           index:70, species:430, pa:2, trend:'Stable'    },
    { name:'Raipur',            index:51, species:220, pa:1, trend:'Declining' },
  ],
};

// ── Runtime state ─────────────────────────────────────────────────────────────

let gbifOccurrences = {};
let hasGBIFData     = false;
let states          = [];
let leafletMap      = null;
let geoJsonLayer    = null;

// ── Boot ──────────────────────────────────────────────────────────────────────

async function init() {
  const results = await Promise.allSettled([
    fetch('./data/india-states.geojson').then(r => r.json()),
    fetchGBIF(),
  ]);

  const geojson = results[0].status === 'fulfilled' ? results[0].value : null;

  buildStateList();
  renderSummary();
  renderStates();
  setupSearch();
  setupViewToggle();

  if (geojson) {
    initMap(geojson);
  } else {
    document.getElementById('mapPanel').innerHTML =
      '<div class="container py-5 text-center text-muted"><p>Map data unavailable — switch to States view.</p></div>';
  }

  showLoading(false);
}

// ── GBIF ──────────────────────────────────────────────────────────────────────

async function fetchGBIF() {
  const url = `${GBIF_BASE}/occurrence/search?country=IN&facet=stateProvince&facetMincount=100&facetLimit=60&limit=0`;
  try {
    const data   = await fetch(url).then(r => r.json());
    const counts = data.facets?.[0]?.counts ?? [];
    counts.forEach(({ name, count }) => {
      const canonical = canonicalize(name);
      if (canonical) gbifOccurrences[canonical] = (gbifOccurrences[canonical] ?? 0) + count;
    });
    hasGBIFData = Object.keys(gbifOccurrences).length > 0;
  } catch (_) {
    // proceed with static data only
  }
}

function canonicalize(name) {
  if (!name) return null;
  if (name in NAME_ALIASES) return NAME_ALIASES[name] ?? null;
  if (name in STATE_META)   return name;
  const lower = name.toLowerCase();
  return Object.keys(STATE_META).find(k => k.toLowerCase() === lower) ?? null;
}

// ── Index computation ─────────────────────────────────────────────────────────

function buildStateList() {
  const keys    = Object.keys(STATE_META);
  // Log-transform both metrics to prevent extreme outliers (e.g. tiny Lakshadweep)
  // from collapsing the entire normalization range
  const occLogs = keys.map(k => Math.log10((gbifOccurrences[k] ?? 0) + 1));
  const paLogs  = keys.map(k => Math.log10((STATE_META[k].pa / STATE_META[k].area) * 10000 + 1));

  const occMin = Math.min(...occLogs), occMax = Math.max(...occLogs);
  const paMin  = Math.min(...paLogs),  paMax  = Math.max(...paLogs);

  const norm = (v, lo, hi) => hi > lo ? ((v - lo) / (hi - lo)) * 100 : 50;

  states = keys.map((name, i) => {
    const meta     = STATE_META[name];
    const occ      = gbifOccurrences[name] ?? 0;
    const occScore = hasGBIFData && occMax > occMin
      ? norm(occLogs[i], occMin, occMax)
      : meta.forest;

    const paScore = norm(paLogs[i], paMin, paMax);
    const fScore  = meta.forest;

    // Weights: 40% occurrence richness, 30% forest cover, 30% PA density
    const index = hasGBIFData
      ? 0.40 * occScore + 0.30 * fScore + 0.30 * paScore
      : 0.50 * fScore   + 0.50 * paScore;

    return {
      name,
      ...meta,
      occurrences:    occ,
      index:          Math.min(99, Math.max(1, Math.round(index))),
      trend:          deriveTrend(name),
      _occContrib:    hasGBIFData ? Math.round(0.40 * occScore) : null,
      _forestContrib: Math.round(hasGBIFData ? 0.30 * fScore : 0.50 * fScore),
      _paContrib:     Math.round(hasGBIFData ? 0.30 * paScore : 0.50 * paScore),
    };
  }).sort((a, b) => b.index - a.index);
}

function deriveTrend(name) {
  const sensitive = new Set(['Kerala','Assam','West Bengal','Sikkim','Manipur','Nagaland','Mizoram','Meghalaya']);
  const improving = new Set(['Karnataka','Maharashtra','Uttarakhand','Madhya Pradesh','Goa','Tamil Nadu','Himachal Pradesh']);
  if (sensitive.has(name)) return 'Sensitive';
  if (improving.has(name)) return 'Improving';
  return 'Stable';
}

// ── Map ───────────────────────────────────────────────────────────────────────

function initMap(geojson) {
  leafletMap = L.map('map', { zoomControl: true, scrollWheelZoom: true })
    .setView([23, 82], 5);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors © <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18,
  }).addTo(leafletMap);

  geoJsonLayer = L.geoJSON(geojson, {
    style:         styleFeature,
    onEachFeature: onEachFeature,
  }).addTo(leafletMap);

  // Fixed view centered on mainland India — fitBounds would zoom out to include
  // Andaman & Nicobar (~93°E) and Lakshadweep (~72°E), shrinking mainland India
  leafletMap.setView([22.5, 80], 5);
  addLegend();
}

function resolveGeoName(props) {
  return canonicalize(props.NAME_1 || props.ST_NM || '');
}

function styleFeature(feature) {
  const name = resolveGeoName(feature.properties);
  const s    = name ? states.find(st => st.name === name) : null;
  return {
    fillColor:   getColor(s?.index ?? 0),
    weight:      1.2,
    opacity:     1,
    color:       '#fff',
    fillOpacity: 0.82,
  };
}

function onEachFeature(feature, layer) {
  const name = resolveGeoName(feature.properties);
  const s    = name ? states.find(st => st.name === name) : null;
  if (!s) return;

  layer.bindTooltip(makeTooltip(s), { sticky: true, className: 'map-tooltip' });
  layer.on({
    mouseover: e => {
      e.target.setStyle({ weight: 2.5, color: '#1a4a2e', fillOpacity: 0.95 });
      e.target.bringToFront();
    },
    mouseout:  e => geoJsonLayer.resetStyle(e.target),
    click:     () => openState(s.name),
  });
}

function makeTooltip(s) {
  const occ = s.occurrences > 0 ? s.occurrences.toLocaleString() : '—';
  return `
    <div class="tt-header">
      <span class="tt-name">${s.name}</span>
      <span class="tt-score" style="background:${getColor(s.index)}">${s.index}</span>
    </div>
    <div class="tt-row"><span>Occurrences</span><span>${occ}</span></div>
    <div class="tt-row"><span>Protected Areas</span><span>${s.pa}</span></div>
    <div class="tt-row"><span>Forest Cover</span><span>${s.forest}%</span></div>
    <div class="tt-row"><span>Trend</span><span>${s.trend}</span></div>`;
}

function getColor(score) {
  return score > 80 ? '#1b6b3a'
       : score > 70 ? '#2e9a56'
       : score > 60 ? '#60ba7a'
       : score > 50 ? '#93d19a'
       : score > 40 ? '#c5e8cb'
       : score > 25 ? '#e8f4ea'
       :               '#f0f0eb';
}

function addLegend() {
  const ctrl = L.control({ position: 'bottomright' });
  ctrl.onAdd = () => {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = '<div class="legend-title">Biodiversity Index</div>';
    [[81,'80+'], [71,'70–80'], [61,'60–70'], [51,'50–60'], [41,'40–50'], [26,'25–40'], [0,'<25']]
      .forEach(([score, label]) => {
        div.innerHTML += `
          <div class="legend-row">
            <span class="legend-swatch" style="background:${getColor(score)}"></span>
            <span>${label}</span>
          </div>`;
      });
    return div;
  };
  ctrl.addTo(leafletMap);
}

// ── Summary cards ─────────────────────────────────────────────────────────────

function renderSummary() {
  const totalOcc  = states.reduce((s, st) => s + st.occurrences, 0);
  const totalPA   = states.reduce((s, st) => s + st.pa, 0);
  const avgIndex  = Math.round(states.reduce((s, st) => s + st.index, 0) / states.length);

  document.getElementById('indiaScore').textContent = avgIndex;
  const circle = document.querySelector('.score-circle');
  circle.style.background = `conic-gradient(var(--green) ${avgIndex}%, #dcebdd 0)`;

  const occLabel = totalOcc > 1e6
    ? (totalOcc / 1e6).toFixed(1) + 'M'
    : totalOcc > 1e3 ? Math.round(totalOcc / 1e3) + 'K'
    : String(totalOcc);

  document.getElementById('heroDesc').textContent = hasGBIFData
    ? `${states.length} states & UTs · ${occLabel} occurrence records from GBIF · ${totalPA} protected areas`
    : `${states.length} states & UTs · ${totalPA} protected areas · Forest & PA data from FSI/MoEF 2023`;

  document.getElementById('summaryCards').innerHTML = [
    { icon:'bi-flower1',      value: avgIndex,                         label:'Average Index'    },
    { icon:'bi-binoculars',   value: hasGBIFData ? occLabel : '—',     label:'GBIF Occurrences' },
    { icon:'bi-shield-check', value: totalPA,                          label:'Protected Areas'  },
    { icon:'bi-map',          value: states.length,                    label:'States & UTs'     },
  ].map(c => `
    <div class="col-6 col-lg-3">
      <div class="stat-card">
        <i class="bi ${c.icon}"></i>
        <h3>${c.value}</h3>
        <p>${c.label}</p>
      </div>
    </div>`).join('');
}

// ── State grid ────────────────────────────────────────────────────────────────

function renderStates(list = states) {
  document.getElementById('stateGrid').innerHTML = list.map(s => `
    <div class="col-md-6 col-xl-4">
      <div class="data-card" onclick="openState('${s.name.replace(/'/g, "\\'")}')">
        <div class="card-top">
          <div>
            <h4>${s.name}</h4>
            <p class="mb-0">${s.type === 'UT' ? 'Union Territory' : s.code} · ${s.trend}</p>
          </div>
          <div class="index-badge" style="background:${getColor(s.index)}"
               data-state="${s.name.replace(/&/g,'&amp;').replace(/'/g,'&#39;')}"
               tabindex="0">${s.index}</div>
        </div>
        <div class="meta-grid">
          <div class="meta-item">
            <small>Occurrences</small>
            <strong>${s.occurrences > 0 ? s.occurrences.toLocaleString() : '—'}</strong>
          </div>
          <div class="meta-item">
            <small>Protected Areas</small>
            <strong>${s.pa}</strong>
          </div>
          <div class="meta-item">
            <small>Forest Cover</small>
            <strong>${s.forest}%</strong>
          </div>
          <div class="meta-item">
            <small>Threatened spp.</small>
            <strong>${s.threatened}</strong>
          </div>
        </div>
        <div class="trend">
          <i class="bi bi-arrow-right-circle"></i> View districts
        </div>
      </div>
    </div>`).join('');

  initPopovers();
}

function buildIndexPopoverContent(s) {
  const rows = s._occContrib !== null
    ? [['Species richness','×40%',s._occContrib],['Forest cover','×30%',s._forestContrib],['Protected areas','×30%',s._paContrib]]
    : [['Forest cover','×50%',s._forestContrib],['Protected areas','×50%',s._paContrib]];
  const rowsHTML = rows.map(([label, weight, val]) => `
    <tr>
      <td style="font-size:12px;padding:3px 8px 3px 0;color:#6b7c72">${label}</td>
      <td style="font-size:12px;padding:3px 8px;color:#6b7c72;text-align:center">${weight}</td>
      <td style="font-size:12px;padding:3px 0;font-weight:700;text-align:right">${val}</td>
    </tr>`).join('');
  return `<table style="width:100%;border-collapse:collapse;min-width:190px">
    <tbody>
      ${rowsHTML}
      <tr style="border-top:1px solid #dee2e6">
        <td colspan="2" style="font-size:12px;padding:5px 8px 2px 0;font-weight:600">Index</td>
        <td style="font-size:14px;padding:5px 0 2px;font-weight:800;text-align:right;color:#2f7d32">${s.index}</td>
      </tr>
    </tbody>
  </table>
  <p style="margin:6px 0 0;font-size:11px;color:#6b7c72">Each factor is scored 0–100 relative to all states</p>`;
}

function initPopovers() {
  document.querySelectorAll('.index-badge[data-state]').forEach(el => {
    const existing = bootstrap.Popover.getInstance(el);
    if (existing) existing.dispose();
    const s = states.find(st => st.name === el.dataset.state);
    if (!s) return;
    new bootstrap.Popover(el, {
      trigger:   'hover focus',
      html:      true,
      placement: 'left',
      title:     'Index breakdown',
      content:   buildIndexPopoverContent(s),
      sanitize:  false,
    });
  });
}

// ── Districts ─────────────────────────────────────────────────────────────────

function openState(stateName) {
  const s       = states.find(st => st.name === stateName);
  if (!s) return;
  const list    = DISTRICTS[stateName] ?? [];
  const section = document.getElementById('districtSection');

  document.getElementById('districtTitle').textContent = `${stateName} — Districts`;
  document.getElementById('districtGrid').innerHTML = list.length
    ? list.map(d => `
        <div class="col-md-6 col-xl-4">
          <div class="data-card no-click">
            <div class="card-top">
              <div>
                <h4>${d.name}</h4>
                <p class="mb-0">District profile · ${d.trend}</p>
              </div>
              <div class="index-badge" style="background:${getColor(d.index)}">${d.index}</div>
            </div>
            <div class="meta-grid">
              <div class="meta-item"><small>Species (est.)</small><strong>${d.species.toLocaleString()}</strong></div>
              <div class="meta-item"><small>Protected Areas</small><strong>${d.pa}</strong></div>
              <div class="meta-item"><small>Trend</small><strong>${d.trend}</strong></div>
              <div class="meta-item"><small>Status</small><strong>${getStatus(d.index)}</strong></div>
            </div>
          </div>
        </div>`).join('')
    : '<div class="col-12 py-3 text-muted small">District-level data coming soon for this state.</div>';

  section.classList.remove('d-none');
  section.scrollIntoView({ behavior: 'smooth' });
}

function closeDistricts() {
  document.getElementById('districtSection').classList.add('d-none');
}

function getStatus(index) {
  return index >= 80 ? 'High' : index >= 60 ? 'Moderate' : 'Low';
}

// ── Search ────────────────────────────────────────────────────────────────────

function setupSearch() {
  document.getElementById('searchInput').addEventListener('input', function () {
    const kw = this.value.toLowerCase().trim();
    renderStates(kw
      ? states.filter(s => s.name.toLowerCase().includes(kw) || s.code.toLowerCase().includes(kw))
      : states
    );

    // In map view, zoom to matching state
    if (kw && leafletMap && geoJsonLayer) {
      const match = states.find(s => s.name.toLowerCase().includes(kw));
      if (match) highlightOnMap(match.name);
    }
  });
}

function highlightOnMap(stateName) {
  geoJsonLayer.eachLayer(layer => {
    const name = canonicalize(layer.feature.properties.NAME_1 ?? '');
    if (name === stateName) {
      leafletMap.fitBounds(layer.getBounds(), { padding: [60, 60], maxZoom: 8 });
      layer.setStyle({ weight: 2.5, color: '#1a4a2e', fillOpacity: 0.95 });
      layer.bringToFront();
      setTimeout(() => geoJsonLayer.resetStyle(layer), 2000);
    }
  });
}

// ── View toggle ───────────────────────────────────────────────────────────────

function setupViewToggle() {
  document.querySelectorAll('.view-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isMap = btn.dataset.view === 'map';
      document.getElementById('mapPanel').classList.toggle('d-none', !isMap);
      document.getElementById('gridPanel').classList.toggle('d-none', isMap);
      if (isMap && leafletMap) leafletMap.invalidateSize();
    });
  });
}

function resetView() {
  document.getElementById('searchInput').value = '';
  renderStates();
  closeDistricts();
}

// ── Loading ───────────────────────────────────────────────────────────────────

function showLoading(show) {
  document.getElementById('loadingOverlay').classList.toggle('d-none', !show);
}

// ── Start ─────────────────────────────────────────────────────────────────────

init();
