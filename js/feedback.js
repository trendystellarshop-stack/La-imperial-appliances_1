document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'laImperialFeedbackDraft';
    const form = document.getElementById('feedbackForm');
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
        searchForm.addEventListener('submit', event => {
            event.preventDefault();
            const searchTerm = searchBar ? searchBar.value.trim() : '';
            window.location.href = searchTerm ? 'index.html?search=' + encodeURIComponent(searchTerm) : 'index.html';
        });
    }

    if (!form) return;

    const fields = {
        feedbackName: document.getElementById('feedbackName'),
        feedbackEmail: document.getElementById('feedbackEmail'),
        feedbackType: document.getElementById('feedbackType'),
        feedbackMessage: document.getElementById('feedbackMessage'),
    };

    function getRatingValue() {
        return document.querySelector('input[name="rating"]:checked')?.value || '';
    }

    function setRatingValue(rating) {
        if (!rating) return;
        const input = document.querySelector(`input[name="rating"][value="${rating}"]`);
        if (input) input.checked = true;
    }

    function saveDraft() {
        const draft = {
            feedbackName: fields.feedbackName?.value.trim() || '',
            feedbackEmail: fields.feedbackEmail?.value.trim() || '',
            feedbackType: fields.feedbackType?.value || '',
            feedbackMessage: fields.feedbackMessage?.value.trim() || '',
            rating: getRatingValue(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }

    function loadDraft() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        try {
            const draft = JSON.parse(raw);
            if (draft.feedbackName) fields.feedbackName.value = draft.feedbackName;
            if (draft.feedbackEmail) fields.feedbackEmail.value = draft.feedbackEmail;
            if (draft.feedbackType) fields.feedbackType.value = draft.feedbackType;
            if (draft.feedbackMessage) fields.feedbackMessage.value = draft.feedbackMessage;
            if (draft.rating) setRatingValue(draft.rating);
        } catch (ex) {
            console.warn('Invalid feedback draft in localStorage:', ex);
        }
    }

    function clearDraft() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function setEmailValidity(message) {
        if (fields.feedbackEmail) {
            fields.feedbackEmail.setCustomValidity(message || '');
        }
    }

    function setNameValidity(message) {
        if (fields.feedbackName) {
            fields.feedbackName.setCustomValidity(message || '');
        }
    }

    loadDraft();

    form.addEventListener('input', saveDraft);
    if (fields.feedbackName) {
        fields.feedbackName.addEventListener('input', () => {
            setNameValidity('');
        });
    }
    if (fields.feedbackEmail) {
        fields.feedbackEmail.addEventListener('input', () => {
            setEmailValidity('');
        });
    }

    form.addEventListener('submit', event => {
        event.preventDefault();

        const name = fields.feedbackName.value.trim();
        const email = fields.feedbackEmail.value.trim();
        const rating = getRatingValue();
        const type = fields.feedbackType.value;
        const message = fields.feedbackMessage.value.trim();
        const nameRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/;

        setNameValidity('');
        setEmailValidity('');

        if (!name || !email || !rating || !type || !message) {
            alert('Please fill in all required fields and select a rating.');
            return;
        }

        if (!nameRegex.test(name)) {
            setNameValidity('Please enter your full name with at least two words.');
            if (typeof fields.feedbackName.reportValidity === 'function') {
                fields.feedbackName.reportValidity();
            } else {
                alert('Please enter your full name with at least two words.');
            }
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailValidity('Please enter a valid email address.');
            if (typeof fields.feedbackEmail.reportValidity === 'function') {
                fields.feedbackEmail.reportValidity();
            } else {
                alert('Please enter a valid email address.');
            }
            return;
        }

        alert(`Thank you for your feedback, ${name}! Your ${rating}-star rating and comments have been submitted successfully.`);

        clearDraft();
        form.reset();
    });

    window.addEventListener('storage', event => {
        if (window.LaImperialCart && event.key === window.LaImperialCart.key) {
            cart = window.LaImperialCart.loadCart();
            updateCartCount();
        }
    });
});
