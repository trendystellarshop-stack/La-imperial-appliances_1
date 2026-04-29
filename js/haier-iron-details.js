document.addEventListener('DOMContentLoaded', function () {
    let cart = window.LaImperialCart ? window.LaImperialCart.loadCart() : [];
    const cartCount = document.getElementById('cartCount');
    const searchForm = document.querySelector('.header-search');
    const searchBar = document.getElementById('searchBar');
    const addToCartButton = document.querySelector('.add-to-cart');

    function updateCartCount() {
        if (!cartCount) {
            return;
        }

        cartCount.textContent = window.LaImperialCart ? window.LaImperialCart.getItemCount(cart) : 0;
    }

    function addToCart(productName, price) {
        cart = window.LaImperialCart ? window.LaImperialCart.addItem(cart, productName, price) : cart;
        updateCartCount();
        alert(productName + ' added to cart!');
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const searchTerm = searchBar ? searchBar.value.trim() : '';
            window.location.href = searchTerm ? 'index.html?search=' + encodeURIComponent(searchTerm) : 'index.html';
        });
    }

    if (addToCartButton) {
        addToCartButton.addEventListener('click', function () {
            addToCart(this.getAttribute('data-product'), this.getAttribute('data-price'));
        });
    }

    window.addEventListener('storage', function (event) {
        if (window.LaImperialCart && event.key === window.LaImperialCart.key) {
            cart = window.LaImperialCart.loadCart();
            updateCartCount();
        }
    });

    updateCartCount();
});
