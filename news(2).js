// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');

mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileNav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const newsCards = document.querySelectorAll('.news-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        newsCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                if (card.getAttribute('data-prediction') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// Scroll animation for news cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Apply animation to news cards
newsCards.forEach(card => {
    observer.observe(card);
});

// Add loading animation
window.addEventListener('load', () => {
    // Add slight delay for better visual effect
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease';
    }, 100);
});

// Smooth scrolling for anchor links
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

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        // Reset hamburger icon
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Enhanced filter with animation
function applyFilterWithAnimation(filter) {
    newsCards.forEach((card, index) => {
        const shouldShow = filter === 'all' || card.getAttribute('data-prediction') === filter;
        
        if (shouldShow) {
            // Add delay for staggered animation
            setTimeout(() => {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            }, index * 100);
        } else {
            card.style.display = 'none';
        }
    });
}

// Add CSS animation for fadeInUp
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);