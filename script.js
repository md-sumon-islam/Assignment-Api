const countryContainer = document.getElementById('country-container');
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeButton = document.querySelector('.close-button');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  if (query.length > 2) {
    fetchCountry(query);
  }
});

async function fetchCountry(name) {
  const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
  const countries = await res.json();
  countryContainer.innerHTML = '';

  countries.forEach(async country => {
    const weatherData = await fetchWeather(country.capital?.[0]);

    const card = document.createElement('div');
    card.className = 'country-card';
    card.innerHTML = `
      <h3>${country.name.common}</h3>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Weather:</strong> ${weatherData.temp}°C, ${weatherData.desc}</p>
    `;
    
    // Add event listener properly instead of inline onclick
    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'More Details';
    detailsButton.addEventListener('click', () => showDetails(country));
    card.appendChild(detailsButton);
    
    countryContainer.appendChild(card);
  });
}

async function fetchWeather(city) {
  try {
    const apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Remember to replace with real API key
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const data = await res.json();
    return {
      temp: data.main.temp,
      desc: data.weather[0].description
    };
  } catch {
    return { temp: 'N/A', desc: 'Unavailable' };
  }
}

function showDetails(country) {
  modal.style.display = 'block';
  modalBody.innerHTML = `
    <h2>${country.name.common}</h2>
    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100">
    <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region || 'N/A'}</p>
    <p><strong>Subregion:</strong> ${country.subregion || 'N/A'}</p>
  `;
}

closeButton.onclick = () => (modal.style.display = 'none');
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };