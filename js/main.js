document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Theme Toggle Functionality
    // ==========================================
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const body = document.body;

    // Check local storage for saved theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
        updateIcon(currentTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = body.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
    }

    function updateIcon(theme) {
        if (!themeToggleBtn) return;
        const iconInfo = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggleBtn.innerHTML = iconInfo;
    }

    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Toggle icon between bars and times
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // ==========================================
    // 3. Active Link Highlight
    // ==========================================
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.endsWith(linkPath) || (currentPath === '/' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ==========================================
    // 4. Sticky Header Effect
    // ==========================================
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
                header.style.padding = '10px 0';
            } else {
                header.style.boxShadow = 'none';
                header.style.padding = '15px 0';
            }
        });
    }

    // ==========================================
    // 5. Form Validation & Handling
    // ==========================================
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // Check if validation failed in an inline handler first
            if (e.defaultPrevented) return;

            e.preventDefault();

            // Basic validation check
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = ''; // reset
                }
            });

            if (isValid) {
                // Simulate network request
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.innerText : 'Submit';
                if (submitBtn) {
                    submitBtn.innerText = 'Processing...';
                    submitBtn.disabled = true;
                }

                setTimeout(() => {
                    showToast('Success! request processed.', 'success');
                    form.reset();
                    if (submitBtn) {
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                    }

                    // Specific logic for Auth forms
                    if (form.closest('.auth-card') || form.closest('.auth-card-modern') || document.title.includes('Login') || document.title.includes('Sign Up')) {
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    }

                }, 1500);
            } else {
                showToast('Please fill in all required fields.', 'error');
            }
        });
    });

    // ==========================================
    // 6. Lightbox for Gallery & Images
    // ==========================================
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
        <button class="lightbox-close">&times;</button>
        <div class="lightbox-content">
            <img src="" alt="Lightbox Image">
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    const clickableImages = document.querySelectorAll('.gallery-item, .art-card .art-image, .journey-card');

    clickableImages.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', (e) => {
                // If the user clicked a link inside, ignore
                if (e.target.tagName === 'A' || e.target.closest('a')) return;

                const src = img.getAttribute('src');
                lightboxImg.src = src;
                lightbox.classList.add('active');
            });
        }
    });

    // Close Lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // ==========================================
    // 7. Toast Notification System
    // ==========================================
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';

        toast.innerHTML = `
            ${icon}
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);
        void toast.offsetWidth;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    window.showToast = showToast;

    // ==========================================
    // 8. Fix Dead Links & Smooth Scroll
    // ==========================================
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Allow real links (pages, email, phone, external)
            if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || (href.includes('.html') && href !== '#')) {
                return;
            }

            // Handle anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                if (targetId) {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80, // Offset for sticky header
                            behavior: 'smooth'
                        });
                        return;
                    }
                }
                // If pure hash or no target found
                showToast('Link placeholder.', 'success');
            }
        });
    });

    // ==========================================
    // 10. Back to Top Button
    // ==========================================
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 9. Gallery Filtering
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }



});
