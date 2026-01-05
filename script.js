document.addEventListener('DOMContentLoaded', () => {
    console.log('Personal Website Loaded');

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open');
        });
    }

    // Close mobile menu when clicking a link
    if (links) {
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
            });
        });
    }

    // Explore Button Smooth Scroll
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Apply observer to cards and sections
    const animatedElements = document.querySelectorAll('.article-card, .project-card, .section-title, .highlight-card, .about-block');
    animatedElements.forEach(el => observer.observe(el));

    // --- NEW: Scroll Spy for Active Navigation Link ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjustment for sticky header height (e.g., 100px)
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                if (current !== '') { // prevent highlighting 'Home' if no ID matches perfectly at top
                    a.classList.add('active');
                }
            }
        });

        // Edge case: If at top of page, highlight Home/first link if 'home' ID is set
        if (window.scrollY < 100) {
            // Provide a fallback or specific check if 'home' is the first section id
            const firstLink = document.querySelector('.nav-links a[href="#home"]');
            if (firstLink) firstLink.classList.add('active');
        }
    });

    // --- CAPTCHA LOGIC ---
    const emailTrigger = document.getElementById('email-trigger');
    const modal = document.getElementById('captcha-modal');
    const closeModal = document.getElementById('close-modal');
    const verifyBtn = document.getElementById('verify-btn');
    const captchaQ = document.getElementById('captcha-question');
    const captchaInput = document.getElementById('captcha-answer');
    const revealedEmail = document.getElementById('revealed-email');

    let correctAnswer = 0;

    if (emailTrigger && modal) {
        emailTrigger.addEventListener('click', () => {
            // Generate Random Math Question (e.g., 3 + 5)
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = num1 + num2;
            captchaQ.textContent = `${num1} + ${num2} = ?`;

            // Show Modal
            modal.classList.add('active');
            captchaInput.value = '';
            captchaInput.focus();
        });

        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close on clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        verifyBtn.addEventListener('click', () => {
            if (parseInt(captchaInput.value) === correctAnswer) {
                // Correct Answer
                modal.classList.remove('active');

                // Reveal Email
                // SECURITY: Email is Base64 encoded to prevent scraping from GitHub source.
                // To generate your own: Open browser console (F12) and run: btoa('your@email.com')
                // Default: 'anNjb3VydDEyM0BnbWFpbC5jb20=' -> 'jscourt123@gmail.com'
                const encodedEmail = 'anNjb3VydDEyM0BnbWFpbC5jb20=';
                const fullEmail = atob(encodedEmail);

                emailTrigger.style.display = 'none';
                revealedEmail.textContent = fullEmail;
                // revealedEmail.href = `mailto:${fullEmail}`; // Removed as it is now a span
                revealedEmail.style.display = 'block';
            } else {
                // Incorrect
                alert('Incorrect. Please try again.');
                captchaInput.value = '';
                captchaInput.focus();
            }
        });

        // Allow 'Enter' key to submit
        captchaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyBtn.click();
            }
        });
    }
});
