document.addEventListener('DOMContentLoaded', function () {
    let cart = window.LaImperialCart ? window.LaImperialCart.loadCart() : [];
    const cartCount = document.getElementById('cartCount');
    const searchForm = document.querySelector('.header-search');
    const searchBar = document.getElementById('searchBar');
    const contactForm = document.getElementById('contactForm');
    const storageKey = 'laImperialContactForm';

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

    if (!contactForm) {
        return;
    }

    const fieldIds = ['name', 'email', 'phone', 'subject', 'message'];
    const fields = {};

    fieldIds.forEach(function (fieldId) {
        fields[fieldId] = document.getElementById(fieldId);
    });

    function saveDraft() {
        const draft = {};
        fieldIds.forEach(function (fieldId) {
            const field = fields[fieldId];
            draft[fieldId] = field ? field.value.trim() : '';
        });
        localStorage.setItem(storageKey, JSON.stringify(draft));
    }

    function loadDraft() {
        const raw = localStorage.getItem(storageKey);
        if (!raw) {
            return;
        }

        try {
            const draft = JSON.parse(raw);
            fieldIds.forEach(function (fieldId) {
                const field = fields[fieldId];
                if (field && Object.prototype.hasOwnProperty.call(draft, fieldId)) {
                    field.value = draft[fieldId];
                }
            });
        } catch (error) {
            console.warn('Invalid contact form draft:', error);
        }
    }

    loadDraft();
    contactForm.addEventListener('input', saveDraft);
    contactForm.addEventListener('change', saveDraft);

    function clearDraft() {
        localStorage.removeItem(storageKey);
    }

    function trimValue(fieldId) {
        return fields[fieldId] ? fields[fieldId].value.trim() : '';
    }

    function setFieldValidity(fieldId, message) {
        const field = fields[fieldId];
        if (field) {
            field.setCustomValidity(message || '');
        }
    }

    Object.keys(fields).forEach(function (fieldId) {
        const field = fields[fieldId];
        if (!field) {
            return;
        }

        if (fieldId === 'name') {
            field.setAttribute('pattern', '[A-Za-z]+(?:\\s+[A-Za-z]+)+');
            field.setAttribute('title', 'Please enter your full name with at least two words.');
        }

        if (fieldId === 'phone') {
            field.setAttribute('pattern', '\\d{11}');
            field.setAttribute('maxlength', '11');
            field.setAttribute('inputmode', 'numeric');
            field.setAttribute('title', 'Phone number must contain exactly 11 digits.');
        }

        field.addEventListener('input', function () {
            setFieldValidity(fieldId, '');
        });
    });

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = trimValue('name');
        const email = trimValue('email');
        const phone = trimValue('phone');
        const subject = trimValue('subject');
        const message = trimValue('message');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/;
        const phoneRegex = /^\d{11}$/;

        Object.keys(fields).forEach(function (fieldId) {
            setFieldValidity(fieldId, '');
        });

        if (!name) {
            setFieldValidity('name', 'Please enter your name.');
        } else if (!nameRegex.test(name)) {
            setFieldValidity('name', 'Please enter your full name with at least two words.');
        }

        if (!email) {
            setFieldValidity('email', 'Please enter your email address.');
        } else if (!emailRegex.test(email)) {
            setFieldValidity('email', 'Please enter a valid email address.');
        }

        if (!phone) {
            setFieldValidity('phone', 'Please enter your  phone number.');
        } else if (!phoneRegex.test(phone)) {
            setFieldValidity('phone', 'Phone number must be exactly 11 digits.');
        }

        if (!subject) {
            setFieldValidity('subject', 'Please enter a subject.');
        }

        if (!message) {
            setFieldValidity('message', 'Please enter your message.');
        }

        const firstInvalidField = fieldIds.find(function (fieldId) {
            const field = fields[fieldId];
            return field && !field.checkValidity();
        });

        if (firstInvalidField) {
            const invalidField = fields[firstInvalidField];
            if (invalidField && typeof invalidField.reportValidity === 'function') {
                invalidField.reportValidity();
            } else {
                alert('Please fill in all required fields correctly.');
            }
            return;
        }

        alert('Thank you for your message! We will get back to you soon.');
        clearDraft();
        contactForm.reset();
    });

    window.addEventListener('storage', function (event) {
        if (window.LaImperialCart && event.key === window.LaImperialCart.key) {
            cart = window.LaImperialCart.loadCart();
            updateCartCount();
        }
    });
    
});
