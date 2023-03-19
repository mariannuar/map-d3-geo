import { select } from "d3-selection";
import { json } from "d3-fetch";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import postalCodes from "../static/state-codes.json";
import statesWithTaylorSwiftConcerts from "../static/states-with-taylor-swift-concerts.json";
import "./style.scss";

const geojsonApiUrl = json(`../static/states-10m.json`);
const stateConcertsDataApiUrl = `../static/concert-data.json`;

const stateLabel = document.querySelector("#state-label");

const getPostalCode = (id) => postalCodes.find((state) => state.val === id)?.id;

const popupWrapper = document.querySelector('#map-popup-wrapper');
const popup = popupWrapper.querySelector('.map__popup');
const popupContent = popupWrapper.querySelector('.map__popup-content');

function closePopup() {
  delete popupWrapper.dataset.visible;
  popupContent.replaceChildren();
}

function showPopup(stateCode, stateName) {
  json(`${stateConcertsDataApiUrl}?state=${stateCode}`).then((concertsData) => {
    const dataRendered = concertsData
      .map(
        (concert) => `
          <div class="state-concert__wrapper">
            <div class="state-concert__poster-wrapper">
              <img src="${concert.tour_image}" alt="${concert.tour_name} poster">
            </div>
            <div class="state-concert__info-wrapper">
              <h3 class="state-concert__tour-name">Tour: ${concert.tour_name}</h3>
              <p class="state-concert__tour-dates">Dates: ${concert.tour_dates}</p>
              <p class="state-concert__tour-year">Year: ${concert.tour_year}</p>
            </div>
          </div>
        `,
      )
      .join('\n');

    popup.setAttribute(
      'aria-labelledby',
      'map-popup-title',
    );

    popupContent.insertAdjacentHTML(
      'afterbegin',
      `
        <div class="map__popup-heading">
          <h2
            id="map-popup-title"
            class="map__popup-title"
          >
            State: ${stateName}
          </h2>
          <button class="map__popup-close">X</button>
        </div>
        ${dataRendered}
      `,
    );

    popupWrapper.dataset.visible = true;
    popupContent
      .querySelector('.map__popup-close')
      .addEventListener('click', closePopup);

    popup.focus();
  });
}

popupWrapper.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePopup();
  }
});

Promise.all([geojsonApiUrl, statesWithTaylorSwiftConcerts]).then(([usa]) => {
  function hasTaylorSwiftConcerts(id) {
    const state = statesWithTaylorSwiftConcerts.filter(
      (item) => item.state === getPostalCode(id)
    );
    if (state.length) {
      return `map__state map__state--${state[0].color}`;
    } else {
      return `map__state map__state--color-0`;
    }
  }

  function mouseEnterHandler(_, d) {
    stateLabel.innerHTML = `State: ${d.properties.name}`;
  }

  function mouseLeaveHandler() {
    stateLabel.innerHTML = '';
  }

  const projection = geoAlbersUsa();

  const path = geoPath().projection(projection);

  const width = 960;
  const height = 520;

  // SVG container append to the element with map-wrapper as id.
  const svg = select("#map-wrapper")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  svg
    .selectAll(".map__state")
    .data(feature(usa, usa.objects.states).features)
    .enter()
    .filter((d) => postalCodes.find((state) => state.val === d.id))
    .append("g")
    .attr("class", (d) => hasTaylorSwiftConcerts(d.id))
    .attr("id", (d) => `state-${d.id}`)
    .insert("path")
    .attr("d", path)
    .on("mouseenter", mouseEnterHandler)
    .on("mouseleave", mouseLeaveHandler)
    .on('click', (_, d) => {
      if (hasTaylorSwiftConcerts(d.id))
        showPopup(getPostalCode(d.id), d.properties.name);
    });
});
