document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://restcountries.com/v3.1/all";
  const countriesContainer = document.getElementById("countriesContainer");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  fetchCountries();

  let allCountries = [];

 async function fetchCountries() {
    try {
        countriesContainer.innerHTML = `<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        allCountries = await response.json();
        displayCountries(allCountries);
        initSearch();
    } catch (error) {
        countriesContainer.innerHTML = `<p class="text-danger">❌ No se pudieron cargar los países.</p>`;
        console.error(error);
    }
}

  function initResetButton() {
      const resetButton = document.getElementById("resetButton");
      if (!resetButton) {
          console.error("❌ No se encontró el botón Reset en el DOM.");
          return;
      }
      console.log("✅ Botón Reset detectado.");
      resetButton.disabled = true;
  }

  function enableResetButton() {
    const resetButton = document.getElementById("resetButton");
    if (!resetButton) {
        console.error("❌ No se puede habilitar Reset porque no existe en el DOM.");
        return;
    }
    console.log("✅ Habilitando botón Reset...");
    resetButton.disabled = false;
  }

  function resetFilters() {
    console.log("🔄 Reseteando búsqueda y filtros...");
    const searchInput = document.getElementById("searchInput");
    const regionFilter = document.getElementById("regionFilter");
    const resetButton = document.getElementById("resetButton");
    if (!searchInput || !regionFilter || !resetButton) {
        console.error("❌ Error: No se encontraron los elementos del input, select o botón Reset.");
        return;
    }
    console.log("✅ Limpiando campos...");
    searchInput.value = "";
    regionFilter.value = "";
    console.log("🔄 Restaurando la vista principal...");
    displayCountries(allCountries);
    console.log("🚫 Deshabilitando botón Reset...");
    resetButton.disabled = true;
  }

  function initFilters() {
      const regionFilter = document.getElementById("regionFilter");
      const resetButton = document.getElementById("resetButton");
      regionFilter.addEventListener("change", () => {
          console.log("Filtrando por región:", regionFilter.value);
          executeSearch();
      });
      resetButton.addEventListener("click", resetFilters);
  }

  function initSearch() {
      console.log("Inicializando búsqueda...");
      const searchInput = document.getElementById("searchInput");
      const searchButton = document.getElementById("searchButton");

      searchInput.addEventListener("input", handleInputChange);
      searchButton.addEventListener("click", () => {
          console.log("Botón de búsqueda clickeado!");
          executeSearch();
      });
  }

  function handleInputChange(event) {
      console.log("Texto en el input:", event.target.value);
  }

  function executeSearch() {
    console.log("🔍 Ejecutando búsqueda...");

    const searchInput = document.getElementById("searchInput");
    const regionFilter = document.getElementById("regionFilter");

    if (!searchInput || !regionFilter) {
        console.error("❌ No se encontraron elementos de búsqueda en el DOM.");
        return;
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedRegion = regionFilter.value;
    console.log("📝 Buscando:", searchTerm, "en región:", selectedRegion);

    let filteredCountries = allCountries;

    if (searchTerm !== "") {
        filteredCountries = filteredCountries.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
    }

    if (selectedRegion !== "") {
        filteredCountries = filteredCountries.filter(country =>
            country.region === selectedRegion
        );
    }

    console.log("🔍 Países encontrados:", filteredCountries);

    if (filteredCountries.length > 0) {
        displaySearchResults(filteredCountries);
        new bootstrap.Modal(document.getElementById("searchResultsModal")).show();
        enableResetButton(); // ✅ Habilitar botón Reset solo después de búsqueda
    } else {
        showNoResults();
    }
  } 

  document.getElementById("resetButton")?.addEventListener("click", () => {
    console.log("✅ Click en el botón Reset detectado!");
    resetFilters();
  });

  function displaySearchResults(countries) {
    const container = document.getElementById("searchResultsContainer");
    container.innerHTML = ""; 
    countries.forEach(country => {
        const row = document.createElement("div");
        row.classList.add("d-flex", "align-items-center", "border", "p-2", "mb-2");

        row.innerHTML = `
            <div style="flex: 45%; display: flex; justify-content: center;">
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" style="width: 180px; height: auto;">
            </div>
            <div style="flex: 55%;">
                <h6>${country.name.common}</h6>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                <p><strong>Población:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Lenguaje(s):</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
                <button class="btn btn-primary btn-more-info mt-2" data-bs-toggle="modal" data-bs-target="#countryModal">Más información</button>
            </div>
        `;

        container.appendChild(row);

        // Agregar evento al botón "Más información"
        const button = row.querySelector(".btn-more-info");
        button.addEventListener("click", () => {
            showModal(country);
        });
    });
}

  function showNoResults() {
      console.log("No se encontraron países con ese nombre.");
      countriesContainer.innerHTML = `
          <div class="text-center mt-4">
              <h4>No se encontraron resultados</h4>
              <p>Intenta con otro nombre de país.</p>
          </div>
      `;
  }

  function displayCountries(countries) {
    countriesContainer.innerHTML = ""; 

    countries.forEach(country => {
        const col = document.createElement("div");
        col.classList.add("col-md-4", "col-lg-3", "mb-4");

        const card = document.createElement("div");
        card.classList.add("card", "shadow-sm", "h-100");

        card.innerHTML = `
            <img src="${country.flags.svg}" class="card-img-top" alt="Flag of ${country.name.common}">
            <div class="card-body">
                <h5 class="card-title">${country.name.common}</h5>
                <p class="card-text"><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                <p class="card-text"><strong>Población:</strong> ${country.population.toLocaleString()}</p>
                <p class="card-text"><strong>Lenguaje(s):</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
                <button class="btn btn-primary btn-more-info" data-bs-toggle="modal" data-bs-target="#countryModal">Más información</button>
            </div>
          `;

          col.appendChild(card);
          countriesContainer.appendChild(col);

          const button = card.querySelector(".btn-more-info");
          button.addEventListener("click", () => {
              showModal(country);
          });
      });
  }

  function showModal(country) {
    console.log("Mostrando datos de:", country);

    modalTitle.textContent = "";
    modalBody.innerHTML = "";

    modalTitle.textContent = country.name.common;
    modalBody.innerHTML = `
        <p><strong>Nombre oficial:</strong> ${country.name.official || "N/A"}</p>
        <p><strong>Región:</strong> ${country.region || "N/A"}</p>
        <p><strong>Subregión:</strong> ${country.subregion || "N/A"}</p>
        <p><strong>Población:</strong> ${country.population?.toLocaleString() || "N/A"}</p>
        <p><strong>Área:</strong> ${country.area ? `${country.area.toLocaleString()} km²` : "N/A"}</p>
        <p><strong>Latitud / Longitud:</strong> ${country.latlng ? country.latlng.join(", ") : "N/A"}</p>
        <p><strong>Código de país (ISO 3166-1 alpha-3):</strong> ${country.cca3 || "N/A"}</p>
        <p><strong>Moneda(s):</strong> ${country.currencies ? Object.values(country.currencies).map(curr => `${curr.name} (${curr.symbol || "-"})`).join(", ") : "N/A"}</p>
        <p><strong>Zona horaria:</strong> ${country.timezones ? country.timezones.join(", ") : "N/A"}</p>
        <p><strong>Dominio de Internet:</strong> ${country.tld ? country.tld.join(", ") : "N/A"}</p>
        <p><strong>Conducción:</strong> ${country.car?.side ? `Por la ${country.car.side}` : "N/A"}</p>
        <hr>
        <img src="${country.coatOfArms?.svg || ''}" class="img-fluid" alt="Escudo de Armas" onerror="this.style.display='none'">
      `;
    }

  initDarkMode();
  function initDarkMode() {
    console.log("🔄 Inicializando Dark Mode...");
    const darkModeSwitch = document.getElementById("darkModeSwitch");

    if (!darkModeSwitch) {
        console.error("❌ No se encontró el switch de Dark Mode.");
        return;
    }
    console.log("✅ Switch de Dark Mode detectado.");
    darkModeSwitch.addEventListener("change", toggleDarkMode); // Agregar el evento de cambio
  }

  function toggleDarkMode() {
    console.log("🔄 Cambiando Dark Mode...");
    const body = document.body;
    const darkModeIcon = document.getElementById("darkModeIcon");

    // Alternar la clase dark-mode en el body
    body.classList.toggle("dark-mode");

    // Cambiar el icono de sol a luna o viceversa
    if (body.classList.contains("dark-mode")) {
        darkModeIcon.classList.replace("fa-sun", "fa-moon");
    } else {
        darkModeIcon.classList.replace("fa-moon", "fa-sun");
    }
  }

  initToggleView();
  function initToggleView() {
    const toggleButton = document.getElementById("toggleViewButton");

    if (!toggleButton) {
        console.error("❌ No se encontró el botón de alternar vista en el DOM.");
        return;
    }

    console.log("✅ Botón de alternar vista detectado.");
    
    toggleButton.addEventListener("click", toggleView);
  }

  let isGridView = true; // Vista inicial es Grid

 function toggleView() {
    console.log("🔄 Alternando vista...");
    isGridView = !isGridView;

    const container = document.getElementById("countriesContainer");
    const toggleButton = document.getElementById("toggleViewButton");

    if (isGridView) {
        console.log("✅ Cambiando a vista Grid");
        container.classList.remove("list-view");
        container.classList.add("grid-view");
        displayCountries(allCountries); // Mostrar en formato grid
        toggleButton.textContent = "Ver como Lista"; // Cambiar el texto del botón
    } else {
        console.log("✅ Cambiando a vista Lista");
        container.classList.remove("grid-view");
        container.classList.add("list-view");
        displaySearchResults(allCountries); // Mostrar en formato lista
        toggleButton.textContent = "Ver como Grid"; // Cambiar el texto del botón
    }
}

});
