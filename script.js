"use strict";

// const { map } = require("leaflet");

// const { map } = require("leaflet");

//TODO Refactor functions to work for search/filter dropdown which will be displayed on the page
//TODO Implement wikipedia link on country name and city

//Getting the elements
const countryCard = document.querySelector(".countries_card_container");
const searchField = document.querySelector(".search_text");
const searchButton = document.querySelector(".search_btn");
const dropdownMenu = document.querySelector(".country_dropdown");
const mapContainer = document.querySelector(".map");
const displayAll = document.querySelector(".display");
//api https://restcountries.com/v3.1/all
// search by name https://restcountries.com/v3.1/name/{name}
const apiUrl = "https://restcountries.com/v3.1/all";
// Function to get the value from the input field
const getSearchValue = function () {
  const value = searchField.value;
  return value;
};
// Variable to store the map instance
let currentMap;
// Click listener for search button
searchButton.addEventListener("click", function () {
  // Getting the value from the search button and storing into constant
  const searchValue = getSearchValue();
  //Calling getCountryData method(function) with the value of the input
  getCountryData(searchValue);
});
// Attaching event listener for hitting enter key on input field
searchField.addEventListener("keyup", function (event) {
  // Checking if the pressed key is the enter key
  if (event.key === "Enter") {
    // Storing the value for the input field in variable
    const searchValue = getSearchValue();
    // Calling getCountryData function with the value of the input field
    getCountryData(searchValue);
  }
});
// Trying to display all countries to the dom
displayAll.addEventListener("click", () => {
  const getCountryData = function () {
    try {
      fetch(`https://restcountries.com/v3.1/all`)
        // fetch(apiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // renderCountry(Array.isArray(data) ? data : [data]);
          // searchField.value = "";
          //Getting all data from the api
          let allData = data;
          // renderCountry(Array.isArray(allData) ? allData : [allData]);
          console.log(...allData);
        });
    } catch (error) {
      console.log(error);
    }
  };
  getCountryData();
});

//Notworking atm
// countryCard.addEventListener("mouseleave", function (event) {
//   const card = event.target.closest(".country_card");
//   if (card) {
//     console.log("Going out");
//     // card.classList.remove("card_flip");
//   }
// });

// Function for getting data from the API call
const getCountryData = function (country) {
  try {
    fetch(`https://restcountries.com/v3.1/name/${country}`)
      // fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        renderCountry(Array.isArray(data) ? data : [data]);
        searchField.value = "";
      });
  } catch (error) {
    console.log(error);
  }
};

// Function for storing values from the API object and
// rendering html elements to the page with
const renderCountry = function (countries) {
  let htmlMarkup = "";
  // Removing existing map before initializing a new one (based on user search)
  if (currentMap) {
    currentMap.remove();
  }
  // Initializing map
  currentMap = L.map(mapContainer).setView([51, 9], 3);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
    currentMap
  );

  // L.marker([latitude, longitude]).addTo(map).bindPopup("Hello");
  let latitude, longitude;

  // Accesing data and storing it in variables

  //TODO Try to destructure this object with the operator instead of destructuring one line at the time
  countries.forEach((data) => {
    const dataCountry = data;
    const country = dataCountry.name.official;
    const [countryCapital] = Object.values(data.capital);
    const continent = Object.values(data.continents[0]);
    const subregion = Object.values(data.subregion);
    const population = dataCountry.population;
    const language = Object.values(dataCountry.languages);
    let countryCurrency;
    for (const currency of Object.values(dataCountry.currencies)) {
      countryCurrency = currency.name;
    }
    // Country currency symbol
    let countryCurrencySymbol;
    for (const currency of Object.values(data.currencies)) {
      countryCurrencySymbol = currency.symbol;
    }
    // Country flag
    const countryFlag = Object.values(data.flags);

    // Using destructuring on an array from the api
    [latitude, longitude] = dataCountry.latlng;

    // Accessing 3 digit country code and creating unique ID for each map
    const mapContainerId = `map_${data.cca3}`;
    console.log(mapContainerId);

    // document.addEventListener("DOMContentLoaded", function () {
    // const loaded = document.addEventListener("load", function () {

    // console.log(map);
    // });
    // });
    // const countryMapMarkup = `<div class="card_map">
    //                             <div class="map" id="${mapContainerId}">
    //                             </div>
    //                           </div>`;
    // console.log(countryMapMarkup);
    const countryCardMarkup = `<article class="country_card">
    <div class="card">
      <div class="card_front">
        <div class="card_picture">
            <img src="${countryFlag[1]}" alt="country flag" class="country_img">
        </div>
        <div class="country_data">
            <h2 class="country_name">${country}</h2>
            <h3 class="country_capital"><span><i class="fa-solid fa-landmark-flag"></i></span>${countryCapital}</h3>
            <p class="country_row"><span><i class="fa-solid fa-location-dot"></i></span>${continent.join(
              ""
            )}</p>

            <h3 class="country_region"><span><i class="fa-solid fa-location-dot"></i></span>${subregion.join(
              ""
            )}</h3>
            <p class="country_row"><span><i
              class="fa-solid fa-people-group"></i></span>${(
                population / 1000000
              ).toFixed(2)} million
              </p>
            <p class="country_row"><span><i
              class="fa-solid fa-comments"></i></span>${language.join(", ")}
            </p>
            <p class="country_row"><span><i
              class="fa-solid fa-coins"></i></span>${countryCurrency}
            </p>
        </div>
      </div>
      <div class="card_back">
        <div class="card_map">
          <div class="map" id="${mapContainerId}">
          </div>
        </div>
      </div>
    </div>
  </article>
  `;
    // countryCard.innerHTML = htmlMarkup;
    htmlMarkup += countryCardMarkup;
  });
  countryCard.innerHTML = htmlMarkup;
  // Initializing maps for each returned country
  countries.forEach((data) => {
    const mapContainerId = `map_${data.cca3}`;
    const [latitude, longitude] = data.latlng;
    const map = L.map(mapContainerId).setView([latitude, longitude], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );
    L.marker([latitude, longitude]).addTo(map).bindPopup("Hello");
  });
};
//TODO Add if condition for bigger countries and their zoom level
//TODO Add list of all countries
//TODO Add sort by alphabet, continent, population
//TODO Fix card height
//TODO Adjust page with flex or grid and style it generally
