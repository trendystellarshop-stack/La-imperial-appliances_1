(function () {
    const STORAGE_KEY = 'laImperialCart';
    const PAYMENT_METHOD_KEY = 'laImperialPaymentMethod';
    const CARDHOLDER_NAME_KEY = 'laImperialCardholderName';
    const CARD_NUMBER_KEY = 'laImperialCardNumber';
    const CARD_EXPIRY_KEY = 'laImperialCardExpiry';
    const WALLET_NUMBER_KEY = 'laImperialWalletNumber';

    function sanitizeCart(rawCart) {
        if (!Array.isArray(rawCart)) {
            return [];
        }

        return rawCart
            .filter(function (item) {
                return item && typeof item.name === 'string';
            })
            .map(function (item) {
                const price = Number(item.price);
                const quantity = Number(item.quantity);

                return {
                    name: item.name,
                    price: Number.isFinite(price) ? price : 0,
                    quantity: Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1
                };
            });
    }

    function loadCart() {
        try {
            return sanitizeCart(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
        } catch (error) {
            console.warn('Invalid cart data in localStorage:', error);
            return [];
        }
    }

    function saveCart(cart) {
        const sanitizedCart = sanitizeCart(cart);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedCart));
        return sanitizedCart;
    }

    function getItemCount(cart) {
        return sanitizeCart(cart).reduce(function (sum, item) {
            return sum + item.quantity;
        }, 0);
    }

    function addItem(cart, productName, price) {
        const nextCart = sanitizeCart(cart);
        const existingItem = nextCart.find(function (item) {
            return item.name === productName;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            nextCart.push({
                name: productName,
                price: Number(price) || 0,
                quantity: 1
            });
        }

        return saveCart(nextCart);
    }

    function removeItem(cart, index) {
        const nextCart = sanitizeCart(cart);
        nextCart.splice(index, 1);
        return saveCart(nextCart);
    }

    function updateItemQuantity(cart, index, quantity) {
        const nextCart = sanitizeCart(cart);

        if (!nextCart[index]) {
            return saveCart(nextCart);
        }

        if (quantity <= 0) {
            nextCart.splice(index, 1);
            return saveCart(nextCart);
        }

        nextCart[index].quantity = Math.floor(quantity);
        return saveCart(nextCart);
    }

    function clearCart() {
        return saveCart([]);
    }

    function savePaymentMethod(paymentMethod) {
        if (!paymentMethod) {
            localStorage.removeItem(PAYMENT_METHOD_KEY);
            return '';
        }

        localStorage.setItem(PAYMENT_METHOD_KEY, paymentMethod);
        return paymentMethod;
    }

    function loadPaymentMethod() {
        return localStorage.getItem(PAYMENT_METHOD_KEY) || '';
    }

    function clearPaymentMethod() {
        localStorage.removeItem(PAYMENT_METHOD_KEY);
    }

    function saveCardholderName(cardholderName) {
        if (!cardholderName) {
            localStorage.removeItem(CARDHOLDER_NAME_KEY);
            return '';
        }

        localStorage.setItem(CARDHOLDER_NAME_KEY, cardholderName);
        return cardholderName;
    }

    function loadCardholderName() {
        return localStorage.getItem(CARDHOLDER_NAME_KEY) || '';
    }

    function clearCardholderName() {
        localStorage.removeItem(CARDHOLDER_NAME_KEY);
    }

    function saveCardNumber(cardNumber) {
        if (!cardNumber) {
            localStorage.removeItem(CARD_NUMBER_KEY);
            return '';
        }

        localStorage.setItem(CARD_NUMBER_KEY, cardNumber);
        return cardNumber;
    }

    function loadCardNumber() {
        return localStorage.getItem(CARD_NUMBER_KEY) || '';
    }

    function clearCardNumber() {
        localStorage.removeItem(CARD_NUMBER_KEY);
    }

    function saveCardExpiry(cardExpiry) {
        if (!cardExpiry) {
            localStorage.removeItem(CARD_EXPIRY_KEY);
            return '';
        }

        localStorage.setItem(CARD_EXPIRY_KEY, cardExpiry);
        return cardExpiry;
    }

    function loadCardExpiry() {
        return localStorage.getItem(CARD_EXPIRY_KEY) || '';
    }

    function clearCardExpiry() {
        localStorage.removeItem(CARD_EXPIRY_KEY);
    }

    function saveWalletNumber(walletNumber) {
        if (!walletNumber) {
            localStorage.removeItem(WALLET_NUMBER_KEY);
            return '';
        }

        localStorage.setItem(WALLET_NUMBER_KEY, walletNumber);
        return walletNumber;
    }

    function loadWalletNumber() {
        return localStorage.getItem(WALLET_NUMBER_KEY) || '';
    }

    function clearWalletNumber() {
        localStorage.removeItem(WALLET_NUMBER_KEY);
    }

    window.LaImperialCart = {
        key: STORAGE_KEY,
        paymentMethodKey: PAYMENT_METHOD_KEY,
        cardholderNameKey: CARDHOLDER_NAME_KEY,
        cardNumberKey: CARD_NUMBER_KEY,
        cardExpiryKey: CARD_EXPIRY_KEY,
        walletNumberKey: WALLET_NUMBER_KEY,
        loadCart: loadCart,
        saveCart: saveCart,
        getItemCount: getItemCount,
        addItem: addItem,
        removeItem: removeItem,
        updateItemQuantity: updateItemQuantity,
        clearCart: clearCart,
        savePaymentMethod: savePaymentMethod,
        loadPaymentMethod: loadPaymentMethod,
        clearPaymentMethod: clearPaymentMethod,
        saveCardholderName: saveCardholderName,
        loadCardholderName: loadCardholderName,
        clearCardholderName: clearCardholderName,
        saveCardNumber: saveCardNumber,
        loadCardNumber: loadCardNumber,
        clearCardNumber: clearCardNumber,
        saveCardExpiry: saveCardExpiry,
        loadCardExpiry: loadCardExpiry,
        clearCardExpiry: clearCardExpiry,
        saveWalletNumber: saveWalletNumber,
        loadWalletNumber: loadWalletNumber,
        clearWalletNumber: clearWalletNumber
    };
}());
