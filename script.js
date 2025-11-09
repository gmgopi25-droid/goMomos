// Cart data structure
let cart = [];

// Menu items data
const menuItems = [
    { name: 'Veg Momos', price: 120 },
    { name: 'Paneer Momos', price: 150 },
    { name: 'Chicken Momos', price: 180 },
    { name: 'Kurkure Momos', price: 200 }
];

// Ingredients data for each menu item
const ingredientsData = {
    'Veg Momos': [
        'All-purpose flour',
        'Cabbage',
        'Carrots',
        'Onions',
        'Green bell peppers',
        'Ginger',
        'Garlic',
        'Soy sauce',
        'Black pepper',
        'Salt',
        'Vegetable oil'
    ],
    'Paneer Momos': [
        'All-purpose flour',
        'Paneer (Cottage cheese)',
        'Cabbage',
        'Onions',
        'Capsicum',
        'Ginger',
        'Garlic',
        'Green chilies',
        'Garam masala',
        'Salt',
        'Butter'
    ],
    'Chicken Momos': [
        'All-purpose flour',
        'Chicken (minced)',
        'Cabbage',
        'Onions',
        'Ginger',
        'Garlic',
        'Soy sauce',
        'Black pepper',
        'Chili sauce',
        'Salt',
        'Vegetable oil'
    ],
    'Kurkure Momos': [
        'All-purpose flour',
        'Chicken/Veg filling',
        'Breadcrumbs',
        'Cornflour',
        'Egg',
        'Mixed spices',
        'Red chili powder',
        'Salt',
        'Oil for deep frying',
        'Spring onions',
        'Sesame seeds'
    ]
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Pay Now button event listener
    const payButton = document.getElementById('pay-now-btn');
    if (payButton) {
        payButton.addEventListener('click', handlePayment);
    }

    // Load cart from localStorage if available
    loadCartFromStorage();
    updateCartDisplay();
    updateMenuQuantities();
    updateCartCount();
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
    
    if (!cartItemsContainer) return;
    
    // Clear existing cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty. Add items to your cart!</p>';
        if (payButton) payButton.disabled = true;
        if (cartTotalElement) cartTotalElement.textContent = '0';
    } else {
        // Display cart items
        cart.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Calculate and display total
        const total = calculateTotal();
        if (cartTotalElement) cartTotalElement.textContent = total;
        if (payButton) payButton.disabled = false;
    }
    
    updateCartCount();
    updateMenuQuantities();
}

// Update menu item quantities display
function updateMenuQuantities() {
    cart.forEach(item => {
        const qtyDisplay = document.getElementById(`qty-${item.name}`);
        if (qtyDisplay) {
            qtyDisplay.textContent = item.quantity;
        }
        
        // Enable/disable minus button
        const menuItem = document.querySelector(`[data-name="${item.name}"]`);
        if (menuItem) {
            const minusBtn = menuItem.querySelector('.minus-btn');
            if (minusBtn) {
                minusBtn.disabled = item.quantity === 0;
            }
        }
    });
    
    // Reset quantities for items not in cart
    document.querySelectorAll('.menu-item').forEach(item => {
        const itemName = item.getAttribute('data-name');
        const cartItem = cart.find(c => c.name === itemName);
        const qtyDisplay = document.getElementById(`qty-${itemName}`);
        const minusBtn = item.querySelector('.minus-btn');
        
        if (!cartItem && qtyDisplay) {
            qtyDisplay.textContent = '0';
        }
        if (minusBtn) {
            minusBtn.disabled = !cartItem || cartItem.quantity === 0;
        }
    });
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Adjust quantity from menu item
function adjustMenuQuantity(itemName, change) {
    const menuItem = document.querySelector(`[data-name="${itemName}"]`);
    if (!menuItem) return;
    
    const itemPrice = parseInt(menuItem.getAttribute('data-price'));
    const existingItem = cart.find(item => item.name === itemName);
    
    if (change > 0) {
        // Adding item
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: itemName,
                price: itemPrice,
                quantity: 1
            });
        }
    } else if (change < 0) {
        // Removing item
        if (existingItem) {
            existingItem.quantity -= 1;
            if (existingItem.quantity <= 0) {
                cart = cart.filter(item => item.name !== itemName);
            }
        }
    }
    
    saveCartToStorage();
    updateCartDisplay();
}

// Toggle cart modal
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        if (cartModal.style.display === 'block') {
            closeCart();
        } else {
            openCart();
        }
    }
}

// Open cart modal
function openCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'block';
        updateCartDisplay();
    }
}

// Close cart modal
function closeCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
    const cartModal = document.getElementById('cart-modal');
    if (event.target === cartModal) {
        closeCart();
    }
});

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
        closeCart();
        
        alert('Payment successful! Your order has been placed. 🎉');
    }
}

// Show feedback when item is added to cart (removed - using quantity buttons instead)
function showAddToCartFeedback(itemName) {
    // Visual feedback can be added here if needed
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

// Show ingredients modal
function showIngredients(itemName) {
    const modal = document.getElementById('ingredients-modal');
    const modalTitle = document.getElementById('modal-title');
    const ingredientsList = document.getElementById('ingredients-list');
    
    // Set modal title
    modalTitle.textContent = `${itemName} - Ingredients`;
    
    // Clear previous ingredients
    ingredientsList.innerHTML = '';
    
    // Get ingredients for the item
    const ingredients = ingredientsData[itemName] || [];
    
    // Add ingredients to the list
    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });
    
    // Show modal
    modal.style.display = 'block';
}

// Close ingredients modal
function closeIngredientsModal() {
    const modal = document.getElementById('ingredients-modal');
    modal.style.display = 'none';
}

// Close modal when clicking outside the modal content
document.addEventListener('click', function(event) {
    const ingredientsModal = document.getElementById('ingredients-modal');
    if (event.target === ingredientsModal) {
        closeIngredientsModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const ingredientsModal = document.getElementById('ingredients-modal');
        const cartModal = document.getElementById('cart-modal');
        
        if (ingredientsModal && ingredientsModal.style.display === 'block') {
            closeIngredientsModal();
        } else if (cartModal && cartModal.style.display === 'block') {
            closeCart();
        }
    }
});

