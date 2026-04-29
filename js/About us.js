document.addEventListener('DOMContentLoaded', function () {
    let cart = window.LaImperialCart ? window.LaImperialCart.loadCart() : [];
    const cartCount = document.getElementById('cartCount');
    const searchForm = document.querySelector('.header-search');
    const searchBar = document.getElementById('searchBar');

    function updateCartCount() {
        if (!cartCount) {
            return;
        }

        cartCount.textContent = window.LaImperialCart ? window.LaImperialCart.getItemCount(cart) : 0;
    }

    updateCartCount();

    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const searchTerm = searchBar ? searchBar.value.trim() : '';
            window.location.href = searchTerm ? 'index.html?search=' + encodeURIComponent(searchTerm) : 'index.html';
        });
    }

    const teamCards = document.querySelectorAll('.team-card');
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.15
    });

    teamCards.forEach(function (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(18px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    window.addEventListener('storage', function (event) {
        if (window.LaImperialCart && event.key === window.LaImperialCart.key) {
            cart = window.LaImperialCart.loadCart();
            updateCartCount();
        }
    });
});
