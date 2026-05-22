const states = [
    {
        code: "UP",
        name: "Uttar Pradesh",
        index: 62,
        species: 1840,
        protectedAreas: 26,
        threatened: 41,
        trend: "Stable"
    },
    {
        code: "MH",
        name: "Maharashtra",
        index: 78,
        species: 2940,
        protectedAreas: 52,
        threatened: 66,
        trend: "Improving"
    },
    {
        code: "RJ",
        name: "Rajasthan",
        index: 58,
        species: 1560,
        protectedAreas: 32,
        threatened: 35,
        trend: "Stable"
    },
    {
        code: "KA",
        name: "Karnataka",
        index: 81,
        species: 3180,
        protectedAreas: 39,
        threatened: 72,
        trend: "Improving"
    },
    {
        code: "AS",
        name: "Assam",
        index: 85,
        species: 3540,
        protectedAreas: 18,
        threatened: 89,
        trend: "Sensitive"
    },
    {
        code: "MP",
        name: "Madhya Pradesh",
        index: 74,
        species: 2410,
        protectedAreas: 44,
        threatened: 55,
        trend: "Stable"
    }
];

const districts = {
    UP: [
        { name: "Lakhimpur Kheri", index: 74, species: 420, protectedAreas: 2, trend: "Improving" },
        { name: "Lucknow", index: 51, species: 210, protectedAreas: 1, trend: "Stable" },
        { name: "Varanasi", index: 56, species: 260, protectedAreas: 1, trend: "Stable" }
    ],
    MH: [
        { name: "Pune", index: 76, species: 520, protectedAreas: 3, trend: "Improving" },
        { name: "Nagpur", index: 82, species: 610, protectedAreas: 4, trend: "Improving" },
        { name: "Nashik", index: 71, species: 460, protectedAreas: 2, trend: "Stable" }
    ],
    RJ: [
        { name: "Jaipur", index: 49, species: 220, protectedAreas: 1, trend: "Stable" },
        { name: "Udaipur", index: 68, species: 390, protectedAreas: 3, trend: "Improving" },
        { name: "Jaisalmer", index: 44, species: 180, protectedAreas: 2, trend: "Sensitive" }
    ],
    KA: [
        { name: "Bengaluru Rural", index: 63, species: 360, protectedAreas: 2, trend: "Stable" },
        { name: "Kodagu", index: 88, species: 720, protectedAreas: 4, trend: "Improving" },
        { name: "Mysuru", index: 77, species: 510, protectedAreas: 3, trend: "Stable" }
    ],
    AS: [
        { name: "Kaziranga Region", index: 91, species: 840, protectedAreas: 5, trend: "Sensitive" },
        { name: "Jorhat", index: 79, species: 580, protectedAreas: 2, trend: "Stable" },
        { name: "Dibrugarh", index: 82, species: 620, protectedAreas: 2, trend: "Improving" }
    ],
    MP: [
        { name: "Mandla", index: 80, species: 600, protectedAreas: 4, trend: "Improving" },
        { name: "Bhopal", index: 59, species: 310, protectedAreas: 2, trend: "Stable" },
        { name: "Chhindwara", index: 73, species: 470, protectedAreas: 3, trend: "Stable" }
    ]
};

const summaryCards = document.getElementById("summaryCards");
const stateGrid = document.getElementById("stateGrid");
const districtGrid = document.getElementById("districtGrid");
const districtSection = document.getElementById("districtSection");
const districtTitle = document.getElementById("districtTitle");
const searchInput = document.getElementById("searchInput");

function renderSummary() {
    const totalSpecies = states.reduce((sum, s) => sum + s.species, 0);
    const totalProtected = states.reduce((sum, s) => sum + s.protectedAreas, 0);
    const avgIndex = Math.round(states.reduce((sum, s) => sum + s.index, 0) / states.length);

    const cards = [
        { icon: "bi-flower1", value: avgIndex, label: "Average Index" },
        { icon: "bi-binoculars", value: totalSpecies.toLocaleString(), label: "Species Records" },
        { icon: "bi-shield-check", value: totalProtected, label: "Protected Areas" },
        { icon: "bi-map", value: states.length, label: "States Covered" }
    ];

    summaryCards.innerHTML = cards.map(card => `
    <div class="col-6 col-lg-3">
      <div class="stat-card">
        <i class="bi ${card.icon}"></i>
        <h3>${card.value}</h3>
        <p>${card.label}</p>
      </div>
    </div>
  `).join("");
}

function renderStates(list = states) {
    stateGrid.innerHTML = list.map(state => `
    <div class="col-md-6 col-xl-4">
      <div class="data-card" onclick="showDistricts('${state.code}')">
        <div class="card-top">
          <div>
            <h4>${state.name}</h4>
            <p>${state.code} biodiversity overview</p>
          </div>
          <div class="index-badge">${state.index}</div>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <small>Species</small>
            <strong>${state.species.toLocaleString()}</strong>
          </div>
          <div class="meta-item">
            <small>Protected Areas</small>
            <strong>${state.protectedAreas}</strong>
          </div>
          <div class="meta-item">
            <small>Threatened</small>
            <strong>${state.threatened}</strong>
          </div>
          <div class="meta-item">
            <small>Trend</small>
            <strong>${state.trend}</strong>
          </div>
        </div>

        <div class="trend">
          <i class="bi bi-arrow-right-circle"></i>
          View districts
        </div>
      </div>
    </div>
  `).join("");
}

function showDistricts(stateCode) {
    const state = states.find(s => s.code === stateCode);
    const districtList = districts[stateCode] || [];

    districtSection.classList.remove("d-none");
    districtTitle.textContent = `${state.name} Districts`;

    districtGrid.innerHTML = districtList.map(district => `
    <div class="col-md-6 col-xl-4">
      <div class="data-card">
        <div class="card-top">
          <div>
            <h4>${district.name}</h4>
            <p>District biodiversity profile</p>
          </div>
          <div class="index-badge">${district.index}</div>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <small>Species</small>
            <strong>${district.species.toLocaleString()}</strong>
          </div>
          <div class="meta-item">
            <small>Protected Areas</small>
            <strong>${district.protectedAreas}</strong>
          </div>
          <div class="meta-item">
            <small>Trend</small>
            <strong>${district.trend}</strong>
          </div>
          <div class="meta-item">
            <small>Status</small>
            <strong>${getStatus(district.index)}</strong>
          </div>
        </div>
      </div>
    </div>
  `).join("");

    districtSection.scrollIntoView({ behavior: "smooth" });
}

function getStatus(index) {
    if (index >= 80) return "High";
    if (index >= 60) return "Moderate";
    return "Low";
}

function resetView() {
    searchInput.value = "";
    districtSection.classList.add("d-none");
    renderStates();
}

searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    const filteredStates = states.filter(state =>
        state.name.toLowerCase().includes(keyword) ||
        state.code.toLowerCase().includes(keyword)
    );

    renderStates(filteredStates);

    if (!keyword) {
        districtSection.classList.add("d-none");
    }
});

renderSummary();
renderStates();