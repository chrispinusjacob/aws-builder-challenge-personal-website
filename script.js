// Contact form handler - Sends form data to AWS Lambda
const LAMBDA_URL = 'https://msdx7a5sbfc35kdnqofj66cbc40hgniw.lambda-url.us-east-1.on.aws/'; // Replace with your Function URL

document.addEventListener('DOMContentLoaded', function() {
    // Contact form functionality
    const form = document.querySelector('.contact-form-container');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = form.querySelector('.contact-submit-btn');
            const messageDiv = document.getElementById('form-message');

            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            messageDiv.style.display = 'none';

            // Get form data
            const formData = {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value
            };

            try {
                const response = await fetch(LAMBDA_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showMessage('Message sent successfully! Thank you for reaching out.', 'success');
                    form.reset();
                } else {
                    showMessage('Failed to send message. Please try again.', 'error');
                }
            } catch (error) {
                showMessage('Network error. Please check your connection and try again.', 'error');
            }

            // Reset button
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        });
    }

    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (mobileToggle && navMenu) {
        // Toggle mobile menu
        function toggleMobileMenu() {
            const isActive = mobileToggle.classList.contains('active');
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (!isActive) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        }

        // Close mobile menu
        function closeMobileMenu() {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }

        mobileToggle.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Smooth Scrolling for Navigation Links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = getResponsiveHeaderHeight();
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu after clicking
                closeMobileMenu();
            });
        });
    }

    // Header scroll effect with responsive height detection
    const header = document.querySelector('.header');
    if (header) {
        function updateHeaderHeight() {
            const headerHeight = header.offsetHeight;
            document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        }
        
        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        });
    }

    // Responsive navigation link scrolling
    function getResponsiveHeaderHeight() {
        return window.innerWidth <= 575.98 ? 60 : window.innerWidth <= 767.98 ? 70 : 80;
    }
});

function showMessage(text, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';

    // Auto-hide after 10 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 10000);
}
