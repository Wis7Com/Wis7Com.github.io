document.addEventListener('DOMContentLoaded', () => {

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
        const scrollPosition = window.scrollY + 200; // Offset for header

        // Find which section we're currently in
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            // Check if scroll position is within this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        // Update active states
        navItems.forEach(a => {
            a.classList.remove('active');
            if (current && a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });

        // Edge case: If at very top of page, highlight Home
        if (window.scrollY < 100) {
            navItems.forEach(a => a.classList.remove('active'));
            const homeLink = document.querySelector('.nav-links a[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
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
    // --- HASHNODE BLOG FETCHING ---
    const fetchHashnodePosts = async () => {
        const container = document.getElementById('blog-posts-container');
        if (!container) return;

        const query = `
            query {
                publication(host: "justice-ai.hashnode.dev") {
                    pinnedPost {
                        title
                        brief
                        slug
                        coverImage {
                            url
                        }
                        publishedAt
                        url
                    }
                    posts(first: 5) {
                        edges {
                            node {
                                title
                                brief
                                slug
                                coverImage {
                                    url
                                }
                                publishedAt
                                url
                            }
                        }
                    }
                }
            }
        `;

        // Phase 2: AbortController for 10s timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            // Add timestamp to bust any CDN/proxy caching
            const url = `https://hashnode-proxy.jkhome.workers.dev?_t=${Date.now()}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query }),
                cache: 'no-store',
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            // Phase 1: HTTP status validation
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            // Phase 1: API response structure validation
            if (!data?.data?.publication) {
                throw new Error('Invalid API response structure');
            }

            const publication = data.data.publication;
            const pinnedPost = publication.pinnedPost;
            const latestPosts = publication.posts.edges.map(edge => edge.node);

            const displayPosts = [];

            // 1. Add Pinned Post if exists (Phase 2: immutable pattern)
            if (pinnedPost) {
                displayPosts.push({ ...pinnedPost, isPinned: true });
            }

            // 2. Add latest posts, avoiding duplicates
            for (const post of latestPosts) {
                if (displayPosts.length >= 3) break;

                const isDuplicate = displayPosts.some(p => p.url === post.url);
                if (!isDuplicate) {
                    displayPosts.push(post);
                }
            }

            if (displayPosts.length > 0) {
                // Phase 3: Build all HTML at once, single DOM update
                const articlesHTML = displayPosts.map(node => {
                    const date = new Date(node.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    const tagHTML = node.isPinned
                        ? '<span class="article-tag pinned">Pinned</span>'
                        : '<span class="article-tag">Blog</span>';

                    return `
                        <article class="article-card">
                            <div class="article-content">
                                <div class="article-meta">
                                    ${tagHTML}
                                    <span class="article-date">${date}</span>
                                </div>
                                <h3>${node.title}</h3>
                                <p>${node.brief}</p>
                                <a href="${node.url}" target="_blank" class="read-more">Read Article →</a>
                            </div>
                        </article>
                    `;
                }).join('');

                container.innerHTML = articlesHTML;

                // Re-observe new elements for animation
                const newCards = container.querySelectorAll('.article-card');
                newCards.forEach(card => observer.observe(card));

            } else {
                container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No posts found.</p>';
            }

        } catch (error) {
            clearTimeout(timeoutId);
            // Phase 4: Improved error messaging
            const errorType = error.name === 'AbortError' ? 'timeout' : 'fetch';
            console.error(`Blog ${errorType} error:`, error.message);
            container.innerHTML = `
                <p style="text-align: center; color: var(--text-secondary);">
                    Failed to load posts.
                    <a href="https://justice-ai.hashnode.dev/" target="_blank" style="color: var(--accent-1);">
                        Visit Blog
                    </a>
                </p>`;
        }
    };

    fetchHashnodePosts();
});
