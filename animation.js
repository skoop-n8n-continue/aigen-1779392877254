const DEALS = [
    { day: "Tuesday", desc: "<strong>10% OFF</strong><br>Edibles" },
    { day: "Wednesday", desc: "<strong>10% OFF</strong><br>Carts" },
    { day: "Thursday", desc: "<strong>BOGO</strong><br>Pre-Rolls" }
];

let PRODUCTS = [];
let currentProductIndex = 0;

async function loadProducts() {
    try {
        const response = await fetch('./products.json');
        const data = await response.json();
        PRODUCTS = data.products || [];
    } catch (error) {
        console.error('Failed to load products.json:', error);
        PRODUCTS = [];
    }
    init();
}

function init() {
    renderDeals();
    startMasterTimeline();
}

function renderDeals() {
    const container = document.getElementById('deals-container');
    DEALS.forEach((deal, index) => {
        const dealEl = document.createElement('div');
        dealEl.className = 'deal-card';
        dealEl.id = `deal-${index}`;
        dealEl.innerHTML = `
            <div class="deal-day">${deal.day}</div>
            <div class="deal-desc">${deal.desc}</div>
        `;
        container.appendChild(dealEl);
    });
}

function renderProduct(index) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    if (PRODUCTS.length === 0) return null;

    const product = PRODUCTS[index];
    const productEl = document.createElement('div');
    productEl.className = 'product';
    productEl.innerHTML = `
        <div class="product-image-container">
            <img class="product-image" src="${product.image_url}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h2 class="product-name">${product.name}</h2>
            <div class="product-price">${product.price}</div>
        </div>
    `;
    container.appendChild(productEl);
    return productEl;
}

function startMasterTimeline() {
    // Initial Scene Setup
    gsap.set("#background", { scale: 1.1 });

    const masterTl = gsap.timeline();

    // Background ambient motion
    gsap.to("#background", {
        scale: 1,
        duration: 20,
        ease: "none",
        repeat: -1,
        yoyo: true
    });

    // Title Entrance
    const splitTitle = new SplitText("#main-title", { type: "words,chars" });
    masterTl.from(splitTitle.chars, {
        duration: 1,
        y: 100,
        opacity: 0,
        stagger: 0.05,
        ease: "back.out(1.7)"
    });

    // Deals Entrance
    masterTl.from(".deal-card", {
        duration: 1,
        x: -100,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=0.5");

    // Start cycling products if they exist
    if (PRODUCTS.length > 0) {
        masterTl.add(cycleProduct, "+=0.5");
    }
}

function cycleProduct() {
    const productEl = renderProduct(currentProductIndex);
    if (!productEl) return;

    const tl = gsap.timeline({
        onComplete: () => {
            currentProductIndex = (currentProductIndex + 1) % Math.max(PRODUCTS.length, 1);
            cycleProduct();
        }
    });

    const img = productEl.querySelector('.product-image');
    const info = productEl.querySelector('.product-info');

    // Entrance
    tl.to(productEl, { opacity: 1, duration: 0.1 });
    tl.from(img, {
        y: 100,
        rotation: 15,
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.5)"
    });
    tl.from(info, {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8");

    // Idle / Living Moment
    tl.to(img, {
        y: -15,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1
    });

    // Exit
    tl.to(img, {
        y: -100,
        opacity: 0,
        scale: 1.1,
        duration: 0.8,
        ease: "power2.in"
    });
    tl.to(info, {
        x: -50,
        opacity: 0,
        duration: 0.6,
        ease: "power2.in"
    }, "-=0.6");
}

window.addEventListener('DOMContentLoaded', loadProducts);