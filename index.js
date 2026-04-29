document.addEventListener('DOMContentLoaded', function () {
    let cart = window.LaImperialCart ? window.LaImperialCart.loadCart() : [];
    let activeCategory = 'all';
    let activeSearchTerm = '';
    let activeProductId = '';
    let activeProductFilterLabel = '';
    const pageKey = (window.location.pathname.split('/').pop() || '').replace('.html', '').toLowerCase();

    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const sectionTitle = document.getElementById('productsSectionTitle');
    const searchForm = document.querySelector('.header-search');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const paymentOptions = Array.from(document.querySelectorAll('input[name="paymentMethod"]'));
    const cardPaymentFields = document.getElementById('cardPaymentFields');
    const walletPaymentFields = document.getElementById('walletPaymentFields');
    const paymentMessage = document.getElementById('paymentMessage');

    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (!cartCount) {
            return;
        }

        cartCount.textContent = window.LaImperialCart ? window.LaImperialCart.getItemCount(cart) : 0;
    }

    function addToCart(productName, price) {
        cart = window.LaImperialCart ? window.LaImperialCart.addItem(cart, productName, price) : cart;
        updateCartCount();
        updateCartDisplay();
        showToast(productName + ' added to cart!');
    }

    function removeFromCart(index) {
        cart = window.LaImperialCart ? window.LaImperialCart.removeItem(cart, index) : cart;
        updateCartCount();
        updateCartDisplay();
    }

    function updateQuantity(index, newQuantity) {
        if (newQuantity <= 0) {
            removeFromCart(index);
            return;
        }

        cart = window.LaImperialCart ? window.LaImperialCart.updateItemQuantity(cart, index, newQuantity) : cart;
        updateCartCount();
        updateCartDisplay();
    }

    function updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (!cartItems || !cartTotal || !checkoutBtn) {
            return;
        }

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
            cartTotal.classList.add('d-none');
            checkoutBtn.disabled = true;
            return;
        }

        let itemsHtml = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            itemsHtml += `
                <div class="cart-item">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">Rs.${item.price.toFixed(2)} each</small>
                    </div>
                    <div class="cart-item-controls">
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
            `;
        });

        cartItems.innerHTML = itemsHtml;
        document.getElementById('totalAmount').textContent = total.toFixed(2);
        cartTotal.classList.remove('d-none');
        checkoutBtn.disabled = false;
    }

    function showToast(message) {
        let toast = document.getElementById('cartToast');

        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cartToast';
            toast.className = 'toast align-items-center text-white bg-dark border-0 position-fixed';
            toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
            toast.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            `;
            document.body.appendChild(toast);
        } else {
            toast.querySelector('.toast-body').textContent = message;
        }

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    function setPaymentMessage(message, type) {
        if (!paymentMessage) {
            return;
        }

        paymentMessage.className = 'alert mt-3 mb-0 alert-' + type;
        paymentMessage.textContent = message;
    }

    function clearPaymentMessage() {
        if (!paymentMessage) {
            return;
        }

        paymentMessage.className = 'alert d-none mt-3 mb-0';
        paymentMessage.textContent = '';
    }

    function saveSelectedPaymentMethod() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (window.LaImperialCart && selectedMethod) {
            window.LaImperialCart.savePaymentMethod(selectedMethod.value);
        }
    }

    function saveCardholderName() {
        const cardName = document.getElementById('cardName');
        if (window.LaImperialCart && cardName) {
            window.LaImperialCart.saveCardholderName(cardName.value.trim());
        }
    }

    function saveCardNumber() {
        const cardNumber = document.getElementById('cardNumber');
        if (window.LaImperialCart && cardNumber) {
            window.LaImperialCart.saveCardNumber(cardNumber.value.trim());
        }
    }

    function saveCardExpiry() {
        const cardExpiry = document.getElementById('cardExpiry');
        if (window.LaImperialCart && cardExpiry) {
            window.LaImperialCart.saveCardExpiry(cardExpiry.value.trim());
        }
    }

    function saveWalletNumber() {
        const walletNumber = document.getElementById('walletNumber');
        if (window.LaImperialCart && walletNumber) {
            window.LaImperialCart.saveWalletNumber(walletNumber.value.trim());
        }
    }

    function restoreSelectedPaymentMethod() {
        if (!window.LaImperialCart) {
            return;
        }

        const savedPaymentMethod = window.LaImperialCart.loadPaymentMethod();
        if (!savedPaymentMethod) {
            return;
        }

        const savedOption = document.querySelector('input[name="paymentMethod"][value="' + savedPaymentMethod + '"]');
        if (savedOption) {
            savedOption.checked = true;
            togglePaymentFields();
        }
    }

    function restoreCardholderName() {
        if (!window.LaImperialCart) {
            return;
        }

        const cardName = document.getElementById('cardName');
        const savedCardholderName = window.LaImperialCart.loadCardholderName();

        if (cardName && savedCardholderName) {
            cardName.value = savedCardholderName;
        }
    }

    function restorePaymentFields() {
        if (!window.LaImperialCart) {
            return;
        }

        const cardNumber = document.getElementById('cardNumber');
        const cardExpiry = document.getElementById('cardExpiry');
        const walletNumber = document.getElementById('walletNumber');

        const savedCardNumber = window.LaImperialCart.loadCardNumber();
        const savedCardExpiry = window.LaImperialCart.loadCardExpiry();
        const savedWalletNumber = window.LaImperialCart.loadWalletNumber();

        if (cardNumber && savedCardNumber) {
            cardNumber.value = savedCardNumber;
        }

        if (cardExpiry && savedCardExpiry) {
            cardExpiry.value = savedCardExpiry;
        }

        if (walletNumber && savedWalletNumber) {
            walletNumber.value = savedWalletNumber;
        }
    }

    function togglePaymentFields() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
        const paymentType = selectedMethod ? selectedMethod.getAttribute('data-payment-type') : '';

        if (cardPaymentFields) {
            cardPaymentFields.classList.toggle('d-none', paymentType !== 'card');
        }

        if (walletPaymentFields) {
            walletPaymentFields.classList.toggle('d-none', paymentType !== 'wallet');
        }

        clearPaymentMessage();
    }

    function getProductCards() {
        return Array.from(document.querySelectorAll('.product-card[data-category]'));
    }

    function getPageFilterMatchers() {
        const filterSets = {
            haier: {
                refrigerators: ['french door refrigerator'],
                'washing-machines': ['washer dryer combo'],
                'air-conditioners': ['split air conditioner'],
                dishwashers: ['dishwasher'],
                microwaves: ['microwave oven'],
                irons: ['hsr-8063', 'iron'],
                'air-fryers': ['air fryer'],
                mixers: ['mixer and grinder'],
                'water-dispensers': ['water dispenser'],
                'robot-vacuums': ['robot vacuum']
            },
            dawlance: {
                refrigerators: ['sapphire inverter refrigerator'],
                microwaves: ['grilling microwave oven'],
                'air-conditioners': ['inverter split ac'],
                'washing-machines': ['front load washing machine'],
                vacuums: ['vacuum cleaner'],
                dispensers: ['dispenser'],
                mixers: ['blender'],
                'air-fryers': ['air fryer'],
                irons: ['iron'],
                'coffee-machines': ['coffee machine']
            },
            lg: {
                refrigerators: ['instaview refrigerator'],
                microwaves: ['grill microwave oven'],
                'air-conditioners': ['split air conditioner'],
                'washing-machines': ['washer dryer ai dd'],
                dishwashers: ['freestanding dishwasher'],
                dispensers: ['dispenser'],
                mixers: ['mixer grinder'],
                'air-fryers': ['air fryer'],
                vacuums: ['vacuum cleaner'],
                irons: ['iron']
            },
            panasonic: {
                refrigerators: ['french door refrigerator'],
                microwaves: ['convection microwave oven'],
                'air-conditioners': ['split air conditioner'],
                'washing-machines': ['front load washing machine'],
                dishwashers: ['dishwasher'],
                vacuums: ['vacuum cleaner'],
                dispensers: ['dispenser'],
                mixers: ['mixer grinder'],
                'air-fryers': ['air fryer'],
                irons: ['iron']
            }
        };

        return filterSets[pageKey] || {};
    }

    function cardMatchesProductFilter(card, filterKey) {
        if (!filterKey) {
            return true;
        }

        if (card.id === filterKey) {
            return true;
        }

        const titleNode = card.querySelector('.card-title');
        const title = titleNode ? titleNode.textContent.toLowerCase() : '';
        const description = (card.getAttribute('data-description') || '').toLowerCase();
        const matchers = getPageFilterMatchers()[filterKey] || [];

        return matchers.some(function (matcher) {
            return title.includes(matcher) || description.includes(matcher);
        });
    }

    function updateSectionTitle(visibleCount) {
        if (!sectionTitle) {
            return;
        }

        if (activeSearchTerm) {
            if (visibleCount === 0) {
                sectionTitle.textContent = 'No products found for "' + activeSearchTerm + '"';
            } else {
                sectionTitle.textContent = 'Search Results (' + visibleCount + ' found)';
            }
            return;
        }

        if (activeProductId) {
            const activeCard = document.getElementById(activeProductId);
            if (activeCard) {
                const activeTitle = activeCard.querySelector('.card-title');
                sectionTitle.textContent = activeTitle ? activeTitle.textContent : 'Selected Product';
                return;
            }
        }

        if (activeProductFilterLabel) {
            sectionTitle.textContent = activeProductFilterLabel;
            return;
        }

        if (activeCategory === 'all') {
            sectionTitle.textContent = 'Featured Brand Products';
            return;
        }

        const categoryNames = {
            haier: 'Haier Appliances',
            dawlance: 'Dawlance Appliances',
            lg: 'LG Appliances',
            panasonic: 'Panasonic Appliances'
        };

        sectionTitle.textContent = categoryNames[activeCategory] || 'Featured Brand Products';
    }

    function applyFilters() {
        const productCards = getProductCards();
        let visibleCount = 0;

        productCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const descriptionNode = card.querySelector('.card-text');
            const description = descriptionNode
                ? descriptionNode.textContent.toLowerCase()
                : (card.getAttribute('data-description') || '').toLowerCase();
            const category = card.getAttribute('data-category');
            const matchesCategory = activeCategory === 'all' || category === activeCategory;
            const matchesProduct = !activeProductId || card.id === activeProductId || cardMatchesProductFilter(card, activeProductId);
            const matchesSearch = !activeSearchTerm || title.includes(activeSearchTerm) || description.includes(activeSearchTerm);
            const shouldShow = matchesCategory && matchesProduct && matchesSearch;

            card.style.display = shouldShow ? '' : 'none';
            card.style.opacity = shouldShow ? '1' : '0';

            if (shouldShow) {
                visibleCount += 1;
            }
        });

        updateSectionTitle(visibleCount);
    }

    function setCategory(category) {
        activeProductId = '';
        activeProductFilterLabel = '';
        activeCategory = category;
        activeSearchTerm = '';

        if (searchBar) {
            searchBar.value = '';
        }

        if (categoryFilter) {
            categoryFilter.value = category;
        }
        applyFilters();
    }

    function setProductFocus(productId) {
        activeProductId = productId;
        activeProductFilterLabel = '';
        activeCategory = 'all';
        activeSearchTerm = '';

        if (searchBar) {
            searchBar.value = '';
        }

        applyFilters();
    }

    function setSearchTerm(searchTerm) {
        activeProductId = '';
        activeProductFilterLabel = '';
        activeSearchTerm = searchTerm.trim().toLowerCase();
        applyFilters();
    }

    function parseJsonList(value) {
        if (!value) {
            return [];
        }

        try {
            const parsedValue = JSON.parse(value);
            return Array.isArray(parsedValue) ? parsedValue : [];
        } catch (error) {
            console.warn('Invalid product metadata for quick view:', error);
            return [];
        }
    }

    function showProductDetails(productCard) {
        const title = productCard.querySelector('.card-title').textContent;
        const price = productCard.querySelector('.sale-price').textContent;
        const image = productCard.querySelector('.product-image').src;
        const description = productCard.getAttribute('data-description');
        const specs = parseJsonList(productCard.getAttribute('data-specs'));
        const features = parseJsonList(productCard.getAttribute('data-features'));

        document.getElementById('productTitle').textContent = title;
        document.getElementById('productPrice').textContent = price;
        document.getElementById('productImage').src = image;
        document.getElementById('productImage').alt = title;
        document.getElementById('productDescription').textContent = description;

        const specsList = document.getElementById('productSpecs');
        specsList.innerHTML = '';
        specs.forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            specsList.appendChild(li);
        });

        const featuresList = document.getElementById('productFeatures');
        featuresList.innerHTML = '';
        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });

        const addToCartFromModal = document.getElementById('addToCartFromModal');
        const addToCartButton = productCard.querySelector('.add-to-cart');
        addToCartFromModal.setAttribute('data-product', addToCartButton.getAttribute('data-product'));
        addToCartFromModal.setAttribute('data-price', addToCartButton.getAttribute('data-price'));

        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart')) {
            addToCart(e.target.getAttribute('data-product'), e.target.getAttribute('data-price'));
        }

        if (e.target.classList.contains('view-details')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                showProductDetails(productCard);
            }
        }

        const filterLink = e.target.closest('[data-filter-link]');
        if (filterLink) {
            e.preventDefault();
            const filterValue = filterLink.getAttribute('data-filter-link');
            const targetCard = filterValue && document.getElementById(filterValue);
            const filterLabel = filterLink.textContent.trim();

            if (filterValue === 'all') {
                setCategory('all');
            } else {
                setProductFocus(filterValue);
                activeProductFilterLabel = filterLabel;
            }

            const targetElement = targetCard || document.getElementById('products');
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    const addToCartFromModal = document.getElementById('addToCartFromModal');
    if (addToCartFromModal) {
        addToCartFromModal.addEventListener('click', function () {
            addToCart(this.getAttribute('data-product'), this.getAttribute('data-price'));
            const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
            if (modal) {
                modal.hide();
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');

            if (!selectedMethod) {
                setPaymentMessage('Please select an online payment method: Visa, Mastercard, or JazzCash.', 'warning');
                return;
            }

            const paymentType = selectedMethod.getAttribute('data-payment-type');
            if (paymentType === 'card') {
                const cardName = document.getElementById('cardName');
                const cardNumber = document.getElementById('cardNumber');
                const cardExpiry = document.getElementById('cardExpiry');
                const cardCvv = document.getElementById('cardCvv');

                if (!cardName.value.trim() || !cardNumber.value.trim() || !cardExpiry.value.trim() || !cardCvv.value.trim()) {
                    setPaymentMessage('Please fill in all card details before paying.', 'warning');
                    return;
                }
            }

            if (paymentType === 'wallet') {
                const walletNumber = document.getElementById('walletNumber');
                const walletPin = document.getElementById('walletPin');

                if (!walletNumber.value.trim() || !walletPin.value.trim()) {
                    setPaymentMessage('Please enter your JazzCash number and transaction PIN.', 'warning');
                    return;
                }
            }

            const totalAmount = document.getElementById('totalAmount').textContent;
            setPaymentMessage('Payment request prepared with ' + selectedMethod.value + '. Total amount: Rs.' + totalAmount, 'success');

            cart = window.LaImperialCart ? window.LaImperialCart.clearCart() : [];
            document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
                input.checked = false;
            });
            if (window.LaImperialCart) {
                window.LaImperialCart.clearPaymentMethod();
                window.LaImperialCart.clearCardholderName();
                window.LaImperialCart.clearCardNumber();
                window.LaImperialCart.clearCardExpiry();
                window.LaImperialCart.clearWalletNumber();
            }
            ['cardName', 'cardNumber', 'cardExpiry', 'cardCvv', 'walletNumber', 'walletPin'].forEach(function (fieldId) {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = '';
                }
            });
            updateCartCount();
            updateCartDisplay();
            togglePaymentFields();

            const cartModalElement = document.getElementById('cartModal');
            const cartModal = bootstrap.Modal.getInstance(cartModalElement);
            if (cartModal) {
                setTimeout(function () {
                    cartModal.hide();
                    clearPaymentMessage();
                }, 900);
            }
        });
    }

    paymentOptions.forEach(function (option) {
        option.addEventListener('change', togglePaymentFields);
        option.addEventListener('change', saveSelectedPaymentMethod);
    });

    const cardNameField = document.getElementById('cardName');
    if (cardNameField) {
        cardNameField.addEventListener('input', saveCardholderName);
    }

    const cardNumberField = document.getElementById('cardNumber');
    if (cardNumberField) {
        cardNumberField.addEventListener('input', saveCardNumber);
    }

    const cardExpiryField = document.getElementById('cardExpiry');
    if (cardExpiryField) {
        cardExpiryField.addEventListener('input', saveCardExpiry);
    }

    const walletNumberField = document.getElementById('walletNumber');
    if (walletNumberField) {
        walletNumberField.addEventListener('input', saveWalletNumber);
    }

    if (searchBar) {
        searchBar.addEventListener('input', function () {
            setSearchTerm(this.value);
        });
    }

    if (searchButton && searchBar) {
        searchButton.addEventListener('click', function () {
            setSearchTerm(searchBar.value);
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            setSearchTerm(searchBar ? searchBar.value : '');
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function () {
            setCategory(this.value);
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && searchBar) {
        searchBar.value = decodeURIComponent(searchParam);
        setSearchTerm(searchBar.value);
        setTimeout(() => {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        applyFilters();
    }

    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;

    window.addEventListener('storage', function (event) {
        if (window.LaImperialCart && event.key === window.LaImperialCart.key) {
            cart = window.LaImperialCart.loadCart();
            updateCartCount();
            updateCartDisplay();
        }
    });

    updateCartCount();
    updateCartDisplay();
    restoreSelectedPaymentMethod();
    restoreCardholderName();
    restorePaymentFields();
    togglePaymentFields();
});
 function toggleDropdown() {
    document.getElementById("dropdownMenu").classList.toggle("show");
  }

  function selectBrand(brand) {
    document.getElementById("selectedBrand").innerText = "Selected: " + brand;
    document.getElementById("dropdownMenu").classList.remove("show");
  }

  // Close dropdown if clicked outside
  window.onclick = function(event) {
    if (!event.target.matches('.dropdown-btn')) {
      let dropdown = document.getElementById("dropdownMenu");
      if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
    }
  }
