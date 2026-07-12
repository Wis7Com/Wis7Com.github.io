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
    // --- BLOGGER POST FETCHING ---
    const BLOGGER_FEED_URL = 'https://law7tech.blogspot.com/feeds/posts/default';

    const textFromHtml = (html) => {
        const document = new DOMParser().parseFromString(html || '', 'text/html');
        return (document.body.textContent || '').replace(/\s+/g, ' ').trim();
    };

    const truncateText = (text, maxLength = 180) => {
        if (text.length <= maxLength) return text;
        return `${text.slice(0, maxLength - 3).trimEnd()}...`;
    };

    const parseBloggerEntry = (entry) => {
        const alternateLink = entry.link?.find(link => link.rel === 'alternate');
        const url = new URL(alternateLink?.href || '', BLOGGER_FEED_URL);

        if (url.protocol !== 'https:' || url.hostname !== 'law7tech.blogspot.com') {
            throw new Error('Unexpected Blogger post URL');
        }

        return {
            title: entry.title?.$t?.trim(),
            brief: truncateText(textFromHtml(entry.summary?.$t || entry.content?.$t || '')),
            url: url.href,
            publishedAt: entry.published?.$t
        };
    };

    // Blogger's JSONP feed works on a static GitHub Pages site without a proxy.
    const loadBloggerFeed = () => new Promise((resolve, reject) => {
        const callbackName = `bloggerFeed_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const script = document.createElement('script');
        const timeoutId = setTimeout(() => finish(new Error('Blogger feed timed out')), 10000);

        const cleanup = () => {
            clearTimeout(timeoutId);
            script.remove();
            delete window[callbackName];
        };

        const finish = (error, data) => {
            cleanup();
            if (error) reject(error);
            else resolve(data);
        };

        window[callbackName] = data => finish(null, data);
        script.onerror = () => finish(new Error('Blogger feed failed to load'));
        script.src = `${BLOGGER_FEED_URL}?alt=json-in-script&max-results=3&callback=${encodeURIComponent(callbackName)}`;
        document.head.appendChild(script);
    });

    const createBlogCard = (post) => {
        const article = document.createElement('article');
        article.className = 'article-card';

        const content = document.createElement('div');
        content.className = 'article-content';

        const meta = document.createElement('div');
        meta.className = 'article-meta';

        const tag = document.createElement('span');
        tag.className = 'article-tag';
        tag.textContent = 'Blogger';

        const date = document.createElement('span');
        date.className = 'article-date';
        date.textContent = new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const title = document.createElement('h3');
        title.textContent = post.title;

        const brief = document.createElement('p');
        brief.textContent = post.brief;

        const link = document.createElement('a');
        link.className = 'read-more';
        link.href = post.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Read Article →';

        meta.append(tag, date);
        content.append(meta, title, brief, link);
        article.appendChild(content);
        return article;
    };

    const fetchBlogPosts = async () => {
        const container = document.getElementById('blog-posts-container');
        if (!container) return;

        try {
            const data = await loadBloggerFeed();
            const displayPosts = (data.feed?.entry || [])
                .map(parseBloggerEntry)
                .filter(post => post.title && post.brief && post.url && post.publishedAt)
                .slice(0, 3);

            if (displayPosts.length > 0) {
                const cards = displayPosts.map(createBlogCard);
                container.replaceChildren(...cards);
                cards.forEach(card => observer.observe(card));
            }
        } catch (error) {
            // Keep the server-rendered fallback cards visible if the feed is unavailable.
            console.error('Blogger feed error:', error.message);
        }
    };

    fetchBlogPosts();
});
