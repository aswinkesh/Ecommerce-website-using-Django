document.addEventListener("DOMContentLoaded", loadCart);

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const savedItemsContainer = document.getElementById("saved-items");
    const totalItems = document.getElementById("total-items");
    const totalPrice = document.getElementById("total-price");

    // Load Cart Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-image">
                <div class="item-info">
                    <p><strong>${item.name}</strong></p>
                    <p>₹${item.price}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                <button class="save-btn" onclick="saveForLater(${index})">Save for Later</button>
            </div>
        `).join("");
    }

    // Load Saved Items
    if (savedItems.length === 0) {
        savedItemsContainer.innerHTML = "<p>No items saved for later.</p>";
    } else {
        savedItemsContainer.innerHTML = savedItems.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-image">
                <div class="item-info">
                    <p><strong>${item.name}</strong></p>
                    <p>₹${item.price}</p>
                </div>
                <button class="restore-btn" onclick="restoreToCart(${index})">Move to Cart</button>
            </div>
        `).join("");
    }

    totalItems.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalPrice.textContent = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (!cart[index]) return;

    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart[index]) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function saveForLater(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];

    if (cart[index]) {
        savedItems.push(cart[index]);  // Move item to saved list
        cart.splice(index, 1);  // Remove from cart
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("savedItems", JSON.stringify(savedItems));
    loadCart();
}

function restoreToCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];

    if (savedItems[index]) {
        cart.push(savedItems[index]);  // Move back to cart
        savedItems.splice(index, 1);  // Remove from saved list
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("savedItems", JSON.stringify(savedItems));
    loadCart();
}

function clearCart() {
    localStorage.removeItem("cart");
    loadCart();
}

function checkout() {
    if (JSON.parse(localStorage.getItem("cart"))?.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    alert("Redirecting to checkout page...");
    window.location.href = "payment.html";
}