// Cart data structure
let cart = [];

// Menu items data
const menuItems = [
    { name: 'Veg Momos', price: 120 },
    { name: 'Paneer Momos', price: 150 },
    { name: 'Chicken Momos', price: 180 },
    { name: 'Kurkure Momos', price: 200 }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to menu items
    const menuItemsElements = document.querySelectorAll('.menu-item');
    menuItemsElements.forEach(item => {
        const image = item.querySelector('.menu-image');
        image.addEventListener('click', function() {
            const itemName = item.getAttribute('data-name');
            const itemPrice = parseInt(item.getAttribute('data-price'));
            addToCart(itemName, itemPrice);
        });
    });

    // Pay Now button event listener
    const payButton = document.getElementById('pay-now-btn');
    payButton.addEventListener('click', handlePayment);

    // Load cart from localStorage if available
    loadCartFromStorage();
    updateCartDisplay();
});

// Add item to cart
function addToCart(itemName, itemPrice) {
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: itemPrice,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartDisplay();
    
    // Show feedback animation
    showAddToCartFeedback(itemName);
}

// Remove item from cart
function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    saveCartToStorage();
    updateCartDisplay();
}

// Update quantity of an item
function updateQuantity(itemName, change) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemName);
        } else {
            saveCartToStorage();
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const payButton = document.getElementById('pay-now-btn');
    
    // Clear existing cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty. Click on any item to add it!</p>';
        payButton.disabled = true;
        cartTotalElement.textContent = '0';
    } else {
        // Display cart items
        cart.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Calculate and display total
        const total = calculateTotal();
        cartTotalElement.textContent = total;
        payButton.disabled = false;
    }
}

// Create cart item element
function createCartItemElement(item) {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';
    
    const itemTotal = item.price * item.quantity;
    
    cartItemDiv.innerHTML = `
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-details">₹${item.price} × ${item.quantity} = ₹${itemTotal}</div>
        </div>
        <div class="cart-item-actions">
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
        </div>
    `;
    
    return cartItemDiv;
}

// Calculate total amount
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Handle payment
function handlePayment() {
    const total = calculateTotal();
    
    if (total === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Show payment confirmation
    const confirmMessage = `Payment Confirmation\n\nTotal Amount: ₹${total}\n\nThank you for your order! Your momos will be ready soon.`;
    
    if (confirm(confirmMessage)) {
        // Clear cart after payment
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        
        alert('Payment successful! Your order has been placed. 🎉');
    }
}

// Show feedback when item is added to cart
function showAddToCartFeedback(itemName) {
    // Simple visual feedback - you can enhance this with animations
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (item.getAttribute('data-name') === itemName) {
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 200);
        }
    });
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('goMomosCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('goMomosCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

