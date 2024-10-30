let countryNames = [];
let countryData = [];
let currentPage = 1;
const pageSize = 20;

// Fetch all countries and store data
async function getCountryData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        countryNames = data.map(country => country.name.common);
        countryData = data;
        renderCountryCards();
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}
getCountryData();

// Render country cards for the current page
function renderCountryCards() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const countriesToShow = countryData.slice(start, end);
    
    const countryCardsContainer = document.getElementById('countryCards');
    countryCardsContainer.innerHTML = '';   
    countriesToShow.forEach(country => {
        const card = document.createElement('div');
        card.classList.add('country-card');
        card.innerHTML = `
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
            <h3>${country.name.common}</h3>
        `;
        card.addEventListener('click', () => displayCountryInfo(country));
        countryCardsContainer.appendChild(card);
    });

    updateShowMoreButton();
}

// Show more functionality
document.getElementById('showMoreBtn').addEventListener('click', () => {
    currentPage++;
    renderCountryCards(filteredData);
});

// Update show more button
function updateShowMoreButton() {
    const totalPages = Math.ceil(countryData.length / pageSize);
    document.getElementById('showMoreBtn').style.display = currentPage >= totalPages ? 'none' : 'block';
}

// Display country info
function displayCountryInfo(country) {
    const container = document.getElementById('countryInfoContainer');
    container.style.display = 'block';
    container.innerHTML = `
        <img src="${country.flags.svg}" alt="${country.name.common}">
        <h2>${country.name.common}</h2>
        <table border="1">
            <tr><th>Country Name:</th><td>${country.name.common}</td></tr>
            <tr><th>Area:</th><td>${country.area} km²</td></tr>
            <tr><th>Capital:</th><td>${country.capital ? country.capital[0] : 'N/A'}</td></tr>
            <tr><th>Region:</th><td>${country.region}</td></tr>
            <tr><th>Population:</th><td>${country.population}</td></tr>
            <tr><th>Currency:</th><td>${Object.values(country.currencies || {}).map(curr => `${curr.name} (${curr.symbol})`).join(', ')}</td></tr>
            <tr><th>Languages:</th><td>${Object.values(country.languages || {}).join(', ')}</td></tr>
        </table>`;
}

/// Autocomplete functionality and dynamic card update
document.getElementById('autocompleteInput').addEventListener('input', onInputChange);
let filteredData = countryData;

function onInputChange() {
    const value = document.getElementById('autocompleteInput').value.toLowerCase();
    filteredData = countryData.filter(country => country.name.common.toLowerCase().includes(value));

    currentPage = 1; // Reset to the first page for new filtered results
    renderCountryCards(filteredData);
    
    const filteredNames = filteredData.map(country => country.name.common).slice(0, 5);
    if (filteredNames.length) {
        displayAutocomplete(filteredNames);
        document.getElementById('autocompleteList').style.display = 'block';
    } else {
        document.getElementById('autocompleteList').style.display = 'none';
    }
}

function displayAutocomplete(list) {
    const autocompleteList = document.getElementById('autocompleteList');
    autocompleteList.innerHTML = '';
    list.forEach(country => {
        const li = document.createElement('li');
        li.textContent = country;
        li.addEventListener('click', () => {
            document.getElementById('autocompleteInput').value = country;
            fetchCountryInfo(country);
            autocompleteList.innerHTML = '';
            autocompleteList.style.display = 'none';
        });
        autocompleteList.appendChild(li);
    });

    const viewAllOption = document.createElement('li');
    viewAllOption.textContent = "View all";
    viewAllOption.style.fontWeight = 'bold';
    viewAllOption.addEventListener('click', () => {
        document.getElementById('autocompleteInput').value = '';
        renderCountryCards(countryData);
        autocompleteList.style.display = 'none';
    });
    autocompleteList.appendChild(viewAllOption);
}

// Hide autocomplete list on click outside
document.addEventListener('click', (e) => {
    const input = document.getElementById('autocompleteInput');
    const list = document.getElementById('autocompleteList');
    if (!input.contains(e.target) && !list.contains(e.target)) {
        list.style.display = 'none';
    }
});


// Fetch specific country info on search
function fetchCountryInfo(countryName) {
    const country = countryData.find(c => c.name.common === countryName);
    if (country) displayCountryInfo(country);
}

// Prevent form submit and search for specific country
document.getElementById('countryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const countryName = document.getElementById('autocompleteInput').value.trim();
    fetchCountryInfo(countryName);
});
