// ---- PRODUCT DATA (discounted prices, images from assets/products1.jpg to products6.jpg) ----
const products = [
    {
        name: "1.5kVA Hybrid Inverter, 3.8kWh Battery & 1.4kWp Panels",
        discountedPrice: 1650000,
        img: "assets/products1.jpg",
        desc: "Complete entry‑level solar system ideal for small homes or offices. Includes a 1.5kVA hybrid inverter, 3.8kWh lithium‑ion battery, and 1.4kWp solar panels. Provides reliable backup and reduces electricity bills."
    },
    {
        name: "3.5kVA Hybrid Inverter, 5kWh Battery & 2.1kWp Panels",
        discountedPrice: 3380000,
        img: "assets/products2.jpg",
        desc: "Mid‑range solution for medium households. Features a 3.5kVA hybrid inverter, 5kWh lithium‑ion battery, and 2.1kWp solar panels. Powers lights, fans, TV, fridge, and more with ease."
    },
    {
        name: "5kVA Hybrid Inverter, 10kWh Battery & 4.4kWp Panels",
        discountedPrice: 4350000,
        img: "assets/products3.jpg",
        desc: "High‑performance package for larger homes. 5kVA hybrid inverter, 10kWh lithium‑ion battery, and 4.4kWp solar panels deliver whole‑home backup and significant energy savings."
    },
    {
        name: "10kVA Hybrid Inverter, 15kWh Battery & 8.8kWp Panels",
        discountedPrice: 7190000,
        img: "assets/products4.jpg",
        desc: "Heavy‑duty setup for spacious residences or small offices. 10kVA hybrid inverter, 15kWh lithium‑ion battery, and 8.8kWp solar panels offer full independence from the grid."
    },
    {
        name: "12kVA Hybrid Inverter, 20kWh Battery & 9.9kWp Panels",
        discountedPrice: 10260000,
        img: "assets/products5.jpg",
        desc: "Premium commercial‑grade system. 12kVA hybrid inverter, 20kWh lithium‑ion battery, and 9.9kWp solar panels support high energy demands and critical loads effortlessly."
    },
    {
        name: "20kVA Hybrid Inverter, 45kWh Battery & 19.2kWp Panels",
        discountedPrice: 16950000,
        img: "assets/products6.jpg",
        desc: "Ultimate solar solution for large commercial properties or estates. 20kVA hybrid inverter, 45kWh lithium‑ion battery, and 19.2kWp solar panels ensure maximum power autonomy."
    }
];

// Calculate original price (10% off means discounted = original * 0.9)
products.forEach(p => {
    p.originalPrice = Math.round(p.discountedPrice / 0.9);
});

const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let filteredProducts = [...products];
let searchTerm = '';
let sortOrder = 'default';

// ---- RENDER PRODUCTS ----
function renderProducts() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filteredProducts.slice(start, end);
    const grid = document.getElementById('productGrid');
    grid.innerHTML = pageItems.map(p => `
        <div class="product-card" data-aos="fade-up">
            <div class="product-image-wrapper">
                <img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy">
                <button class="wishlist-btn" aria-label="Add to wishlist">
                    <svg viewBox="0 0 24 24" class="heart-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
                <span class="discount-badge">10% OFF</span>
            </div>
            <div class="product-info">
                <h3 class="product-name">${p.name}</h3>
                <div class="product-price">
                    <span class="original-price">₦${p.originalPrice.toLocaleString()}</span>
                    <span class="discounted-price">₦${p.discountedPrice.toLocaleString()}</span>
                </div>
                <div class="product-description-toggle">
                    <span class="desc-text">Description</span>
                    <span class="desc-arrow">▼</span>
                </div>
                <div class="product-description"><p>${p.desc}</p></div>
            </div>
        </div>
    `).join('');

    // Reattach event listeners
    document.querySelectorAll('.product-description-toggle').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const card = this.closest('.product-card');
            const desc = card.querySelector('.product-description');
            this.classList.toggle('active');
            desc.classList.toggle('show');
        });
    });
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    AOS.refresh();

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

// ---- FILTER & SEARCH ----
function applyFilters() {
    let result = [...products];
    if (searchTerm) {
        result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (sortOrder === 'low') {
        result.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortOrder === 'high') {
        result.sort((a, b) => b.discountedPrice - a.discountedPrice);
    }
    filteredProducts = result;
    currentPage = 1;
    renderProducts();
}

// ---- SEARCH AUTOCOMPLETE ----
const searchInput = document.getElementById('searchInput');
const suggestionsList = document.getElementById('suggestionsList');

searchInput.addEventListener('input', function () {
    const query = this.value.trim();
    if (!query) {
        suggestionsList.style.display = 'none';
        searchTerm = '';
        applyFilters();
        return;
    }
    const matches = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    suggestionsList.innerHTML = matches.map(p => `<li>${p.name}</li>`).join('');
    suggestionsList.style.display = matches.length ? 'block' : 'none';
});

suggestionsList.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        searchInput.value = e.target.textContent;
        suggestionsList.style.display = 'none';
        searchTerm = e.target.textContent;
        applyFilters();
    }
});

document.addEventListener('click', function (e) {
    if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.style.display = 'none';
    }
});

// ---- SORTING ----
document.getElementById('sortSelect').addEventListener('change', function () {
    sortOrder = this.value;
    applyFilters();
});

// ---- PAGINATION ----
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderProducts(); }
});
document.getElementById('nextBtn').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) { currentPage++; renderProducts(); }
});

// ---- SOLAR CALCULATOR (based on watts, with validation and dynamic WhatsApp) ----
document.getElementById('calcBtn').addEventListener('click', function () {
    // 1. Validate all required fields in the calculator form
    const calcForm = document.getElementById('calcForm');
    const requiredInputs = calcForm.querySelectorAll('input[required]');
    let allValid = true;
    requiredInputs.forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();   // show browser tooltip
            allValid = false;
            return;
        }
    });
    if (!allValid) return;            // stop if any required field is empty/invalid

    // 2. Read values
    const watts = parseFloat(document.getElementById('wattsInput').value);
    const billValue = document.getElementById('billInput').value || '0';
    const kwhValue = document.getElementById('kwhInput').value || '0';

    if (!watts || watts <= 0) {
        alert('Please enter a valid power requirement in watts.');
        return;
    }

    // 3. Build the shared WhatsApp message
    const message = `Hello, I'm interested in the PRODUCT_NAME recommended by your Web Agent. ` +
                    `My estimated power requirement is ${watts} watts, ` +
                    `my current monthly bill is ₦${Number(billValue).toLocaleString()}, ` +
                    `my monthly consumption is ${kwhValue} kWh.`;

    // 4. Recommendation logic
    let recIndex;
    if (watts <= 1000) recIndex = 0;                    // 1.5kVA
    else if (watts <= 2500) recIndex = 1;               // 3.5kVA
    else if (watts <= 4000) recIndex = 2;               // 5kVA
    else if (watts <= 8000) recIndex = 3;               // 10kVA
    else if (watts <= 12000) recIndex = 4;              // 12kVA
    else if (watts <= 18000) recIndex = 5;              // 20kVA
    else {
        // Above 18000W – talk to specialist only, but still include user data
        const customMessage = `Hello, I need a custom solar solution for over 18000W. ` +
                              `My estimated power requirement is ${watts} watts, ` +
                              `my current monthly bill is ₦${Number(billValue).toLocaleString()}, ` +
                              `my monthly consumption is ${kwhValue} kWh.`;
        const encodedCustom = encodeURIComponent(customMessage);
        document.getElementById('recommendationResult').style.display = 'block';
        document.getElementById('recommendationResult').innerHTML = `
            <h4>Your power requirement exceeds our standard packages.</h4>
            <p>Please contact our specialist for a custom solution.</p>
            <a href="https://wa.me/2347074489732?text=${encodedCustom}" target="_blank" class="whatsapp-btn">Talk to Specialist</a>
        `;
        return;
    }

    const recProduct = products[recIndex];
    // Replace placeholder PRODUCT_NAME with actual product name
    const personalizedMessage = message.replace('PRODUCT_NAME', recProduct.name);
    const encodedMessage = encodeURIComponent(personalizedMessage);

    const resultDiv = document.getElementById('recommendationResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <img src="${recProduct.img}" alt="${recProduct.name}" />
        <h4>${recProduct.name}</h4>
        <p><span class="original-price">₦${recProduct.originalPrice.toLocaleString()}</span> <span class="discounted-price">₦${recProduct.discountedPrice.toLocaleString()}</span></p>
        <p>${recProduct.desc}</p>
        <a href="#" class="buy-btn">Buy Now</a>
        <a href="https://wa.me/2347074489732?text=${encodedMessage}" target="_blank" class="whatsapp-btn">Talk to Specialist</a>
    `;
});

// ---- THEME TOGGLE (same logic as main page) ----
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === null) { body.classList.add('dark'); localStorage.setItem('theme','dark'); }
else if (savedTheme === 'dark') body.classList.add('dark');
else body.classList.remove('dark');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

// Mobile theme sync
const mobileToggle = document.getElementById('theme-toggle-mobile');
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => themeToggle.click());
    function updateMobileIcon() {
        const icon = mobileToggle.querySelector('.toggle-icon-mobile');
        if (icon) icon.src = body.classList.contains('dark') 
            ? 'https://img.icons8.com/ios/50/ffffff/sun--v1.png' 
            : 'https://img.icons8.com/ios/50/0d5f18/crescent-moon--v1.png';
    }
    window.addEventListener('load', updateMobileIcon);
    themeToggle.addEventListener('click', () => setTimeout(updateMobileIcon, 50));
}

// ---- MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');
if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('active');
        hamburger.classList.toggle('open');
    });
    document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            hamburger.classList.remove('open');
        });
    });
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navbar.contains(e.target)) {
            navbar.classList.remove('active');
            hamburger.classList.remove('open');
        }
    });
}

// ---- AOS INIT ----
AOS.init({ duration: 800, once: true });

// Initial render
renderProducts();