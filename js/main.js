/* ===== COMPLETE main.js - FIXED FOR MOBILE ===== */

document.addEventListener('DOMContentLoaded', function () {

    // Check if it's a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Initialize AOS - ENABLED ON ALL DEVICES
    AOS.init({
        duration: isMobile ? 600 : 800,
        easing: 'ease-out',
        once: false,
        mirror: false,
        offset: isMobile ? 60 : 120,
        delay: isMobile ? 50 : 100,
        anchorPlacement: 'top-bottom',
        disable: false, // CHANGED FROM 'mobile' TO false - enables on all devices
        startEvent: 'DOMContentLoaded',
        throttleDelay: 99,
        debounceDelay: 50,
    });

    // Force refresh after everything loads
    window.addEventListener('load', function () {
        AOS.refresh();

        // Manual trigger for visible elements (fix for mobile)
        setTimeout(function () {
            document.querySelectorAll('[data-aos]').forEach(function (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 50) {
                    el.classList.add('aos-animate');
                }
            });
        }, 500);
    });

    // Refresh on scroll (important for mobile)
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            AOS.refresh();
            // Also manually check for elements in view
            document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(function (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 30) {
                    el.classList.add('aos-animate');
                }
            });
        }, 100);
    }, { passive: true });

    // Refresh on orientation change (mobile)
    window.addEventListener('orientationchange', function () {
        setTimeout(function () {
            AOS.refreshHard();
        }, 500);
    });

    // Touch events for mobile - trigger animations on touch
    document.addEventListener('touchstart', function () {
        setTimeout(function () {
            AOS.refresh();
        }, 100);
    }, { passive: true });

    // ===== DARK/LIGHT MODE TOGGLE =====
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === null) {
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else if (savedTheme === 'dark') {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
    }

    themeToggle.addEventListener('click', function () {
        body.classList.toggle('dark');
        localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');

        setTimeout(function () {
            AOS.refresh();
        }, 200);
    });
    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== IMAGE ERROR HANDLING =====
    document.querySelectorAll('.service-img').forEach(img => {
        img.addEventListener('error', function () {
            const wrapper = this.parentElement;
            wrapper.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:linear-gradient(135deg,#0b2b26,#0d5f18);border-radius:16px;font-size:3rem;">✈️</div>';
        });
    });

    // ===== HEADER SCROLL EFFECT =====
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    if (contactForm) {
        const submitBtn = contactForm.querySelector('.submit-btn');

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!submitBtn) return;

            // Show loading state
            submitBtn.classList.add('loading');
            const btnText = submitBtn.querySelector('.btn-text');
            if (btnText) btnText.textContent = 'Sending...';

            // Get form data
            const formData = new FormData(this);

            try {
                const response = await fetch('send-mail.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.status === 'success') {
                    // Show success message
                    contactForm.style.display = 'none';
                    if (formSuccess) formSuccess.classList.add('show');
                    if (formError) formError.classList.remove('show');

                    // Reset form
                    contactForm.reset();

                    // Hide success after 5 seconds and show form again
                    setTimeout(() => {
                        if (formSuccess) formSuccess.classList.remove('show');
                        contactForm.style.display = 'flex';
                    }, 5000);
                } else {
                    // Show error message
                    if (formError) formError.classList.add('show');
                    if (formSuccess) formSuccess.classList.remove('show');

                    setTimeout(() => {
                        if (formError) formError.classList.remove('show');
                    }, 5000);
                }
            } catch (error) {
                // Show error message
                if (formError) formError.classList.add('show');
                if (formSuccess) formSuccess.classList.remove('show');

                setTimeout(() => {
                    if (formError) formError.classList.remove('show');
                }, 5000);
            } finally {
                // Reset button state
                submitBtn.classList.remove('loading');
                if (btnText) btnText.textContent = 'Send Message';
            }
        });

        // Input validation
        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('invalid', function (e) {
                e.preventDefault();
                this.style.borderColor = '#c62828';
            });

            input.addEventListener('input', function () {
                this.style.borderColor = '#e0e0e0';
            });
        });
    }
});

// ===== PRELOADER FIX FOR IPHONE =====
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const preloaderVideo = document.getElementById('preloaderVideo');

    // Function to hide preloader
    function hidePreloader() {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            if (mainContent) {
                mainContent.style.display = 'block';
            }
            setTimeout(function () {
                if (preloader) preloader.style.display = 'none';
            }, 500);
        }
    }

    // Try to play video
    if (preloaderVideo) {
        const playPromise = preloaderVideo.play();

        if (playPromise !== undefined) {
            playPromise.then(function () {
                // Video is playing
                preloaderVideo.addEventListener('ended', hidePreloader);
            }).catch(function (error) {
                // Video failed (common on iPhone) - hide after timeout
                console.log('Video autoplay blocked, using fallback');
                setTimeout(hidePreloader, 3000);
            });
        }

        // Fallback: always hide after 5 seconds max
        setTimeout(hidePreloader, 5000);
    } else {
        // No video element
        setTimeout(hidePreloader, 3000);
    }
});

/* ===== HERO SLIDESHOW ===== */
document.addEventListener('DOMContentLoaded', function () {

    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 seconds per slide

    // Function to show a specific slide
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }

    // Function to show next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // Function to show previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    // Start automatic slideshow
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    // Stop automatic slideshow
    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Indicator click handlers
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function () {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            showSlide(slideIndex);

            // Reset the interval when manually changing slides
            stopSlideshow();
            startSlideshow();
        });
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const heroSection = document.querySelector('.hero');

    if (heroSection) {
        heroSection.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSection.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            nextSlide();
            stopSlideshow();
            startSlideshow();
        }

        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            prevSlide();
            stopSlideshow();
            startSlideshow();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        }
    });

    // Pause slideshow when page is not visible (save battery)
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    });

    // Start the slideshow
    startSlideshow();

    console.log('Hero slideshow initialized with ' + slides.length + ' slides');
});

/* ===== PRODUCTS SECTION ===== */
document.addEventListener('DOMContentLoaded', function () {

    // Wishlist toggle
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    // Description toggle
    const descToggles = document.querySelectorAll('.product-description-toggle');

    descToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const description = productCard.querySelector('.product-description');

            // Toggle active class
            this.classList.toggle('active');

            // Toggle description visibility
            if (this.classList.contains('active')) {
                description.classList.add('show');
            } else {
                description.classList.remove('show');
            }
        });
    });

});

/* ===== IMPACT COUNTER ANIMATION ===== */
const counters = document.querySelectorAll('.counter');
let counterStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted) {
            counterStarted = true;
            counters.forEach(counter => {
                const target = Number(counter.getAttribute('data-target'));
                let current = 0;
                const duration = 2500;
                const increment = target / (duration / 16);

                const updateCounter = () => {
                    current += increment;
                    if (current >= target) {
                        counter.innerText = target.toLocaleString();
                    } else {
                        counter.innerText = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    }
                };
                updateCounter();
            });
        }
    });
}, { threshold: 0.4 });

const impactSection = document.querySelector('.impact-section');
if (impactSection) {
    counterObserver.observe(impactSection);
}

// Hide swipe indicator after the user scrolls the impact container (mobile)
const impactContainer = document.querySelector('.impact-container');
const swipeIndicator = document.querySelector('.scroll-indicator');
if (impactContainer && swipeIndicator) {
    impactContainer.addEventListener('scroll', () => {
        swipeIndicator.style.opacity = '0';
        swipeIndicator.style.transition = 'opacity 0.3s';
        // Remove permanently after first scroll
        setTimeout(() => {
            swipeIndicator.style.display = 'none';
        }, 300);
    }, { once: true });
}

/* ===== MOBILE MENU TOGGLE ===== */
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');

if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('active');
        hamburger.classList.toggle('open');
    });

    // Close menu when a link is clicked
    const navLinks = navbar.querySelectorAll('.nav-link, .nav-btn');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            hamburger.classList.remove('open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navbar.contains(e.target)) {
            navbar.classList.remove('active');
            hamburger.classList.remove('open');
        }
    });
}

/* ===== MOBILE THEME TOGGLE (syncs with the desktop toggle) ===== */
const mobileThemeToggle = document.getElementById('theme-toggle-mobile');
const desktopThemeToggle = document.getElementById('theme-toggle');

if (mobileThemeToggle && desktopThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
        // Simulate a click on the desktop toggle – all your existing logic stays intact
        desktopThemeToggle.click();
        // Update the mobile icon based on new theme
        updateMobileToggleIcon();
    });

    // Function to update mobile toggle icon (same as desktop)
    function updateMobileToggleIcon() {
        const isDark = document.body.classList.contains('dark');
        const icon = mobileThemeToggle.querySelector('.toggle-icon-mobile');
        if (icon) {
            icon.src = isDark ? 'https://img.icons8.com/ios/50/ffffff/sun--v1.png' : 'https://img.icons8.com/ios/50/0d5f18/crescent-moon--v1.png';
        }
    }

    // Initial icon sync (call after theme initialization)
    // This runs after your existing theme JS has set the body class
    window.addEventListener('load', updateMobileToggleIcon);
    // Also update when the desktop toggle is clicked (using a MutationObserver or by piggybacking)
    // We'll just listen to the same event that your existing toggle dispatches (click)
    desktopThemeToggle.addEventListener('click', () => {
        setTimeout(updateMobileToggleIcon, 50); // wait for class change
    });
}
