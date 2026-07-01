// 1. Jewelry Inventory Data with Professional Image Placeholders
const jewelryProducts = [
    { id: 101, name: "Celestial Diamond Ring", price: 499.00, img: "ring.jpg" },
    { id: 102, name: "Rose Quartz Heart Pendant", price: 185.00, img: "pendant.jpg" },
    { id: 103, name: "Luxe Gold Chain Bracelet", price: 295.00, img: "bracelet.jpg" },
    { id: 104, name: "Minimalist Pearl Studs", price: 120.00, img: "stud.jpg" }
];

// 2. State Variables
let globalCart = [];

// 3. Page Swapping System
function switchPage(pageId) {
    // Hide all view panels
    document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active-view'));
    // Un-highlight all nav anchors
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));

    // Highlight selected panel and element link
    document.getElementById(`page-home`).style.display = "none";
    document.getElementById(`page-about`).style.display = "none";
    document.getElementById(`page-contact`).style.display = "none";
    
    document.getElementById(`page-${pageId}`).style.display = "block";
    event.currentTarget.classList.add('active');
    
    // Automatically close cart sidebar when moving pages
    document.getElementById("cart-panel").classList.remove("open");
}

// 4. Initialize Store Showcase
function renderProducts() {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = "";
    
    jewelryProducts.forEach(item => {
        const itemCard = document.createElement("div");
        itemCard.className = "product-card";
        itemCard.innerHTML = `
            <img src="${item.img}" class="product-img" alt="${item.name}">
            <div class="product-info">
                <h3>${item.name}</h3>
                <p class="product-price">$${item.price.toFixed(2)}</p>
                <button class="add-btn" onclick="addItemToCart(${item.id})">Add To Cart</button>
            </div>
        `;
        grid.appendChild(itemCard);
    });
}

// 5. Open/Close Slide Panel
function toggleCart() {
    document.getElementById("cart-panel").classList.toggle("open");
}

// 6. State Mutation: Append or Increase Item
function addItemToCart(productId) {
    const foundJewelry = jewelryProducts.find(p => p.id === productId);
    const existingCartRecord = globalCart.find(c => c.id === productId);

    if (existingCartRecord) {
        existingCartRecord.quantity += 1;
    } else {
        globalCart.push({ ...foundJewelry, quantity: 1 });
    }
    
    updateGlobalCartStateUI();
}

// 7. State Mutation: Quantity Increments or Purging
function adjustQuantity(productId, alteration) {
    const record = globalCart.find(c => c.id === productId);
    if (!record) return;

    record.quantity += alteration;
    if (record.quantity <= 0) {
        globalCart = globalCart.filter(c => c.id !== productId);
    }
    updateGlobalCartStateUI();
}

// 8. Core State Synced Render Function
function updateGlobalCartStateUI() {
    const listContainer = document.getElementById("cart-items-list");
    listContainer.innerHTML = "";
    
    let absoluteCount = 0;
    let combinedTotalCost = 0;

    globalCart.forEach(item => {
        absoluteCount += item.quantity;
        combinedTotalCost += item.price * item.quantity;

        const cartRow = document.createElement("div");
        cartRow.className = "cart-item";
        cartRow.innerHTML = `
            <img src="${item.img}" class="cart-item-img">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p style="color:var(--primary-color)">$${(item.price * item.quantity).toFixed(2)}</p>
                <div class="qty-controls">
                    <button onclick="adjustQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="adjustQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
        listContainer.appendChild(cartRow);
    });

    // Update elements across layouts dynamically
    document.getElementById("cart-badge").textContent = absoluteCount;
    document.getElementById("cart-total-price").textContent = `$${combinedTotalCost.toFixed(2)}`;
}

// 9. Checkout & Modal Control Logic
function processPurchase() {
    if (globalCart.length === 0) {
        alert("Your shopping bag is completely empty!");
        return;
    }
    // Show success dialog
    document.getElementById("success-modal").style.display = "flex";
    toggleCart(); // Close sidebar drawer
}

function closeSuccessModal() {
    globalCart = []; // Clear user bag contents state completely
    updateGlobalCartStateUI();
    document.getElementById("success-modal").style.display = "none";
}

// Run engine initialization rules on browser launch
renderProducts();
